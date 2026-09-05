---
title: Community age verification reference
section: Development
order: 147
audience: dev, admin
stage: beta
id: orbiters.development.age-verification
domain: website
type: reference
owner: orbiters-docs
lastVerified: 2026-09-05
---

# Community age verification reference

The first phase records eligibility. It does not assign VRChat group roles,
restrict instances, issue bans or change SFW content rules.

## Data and decisions

Separate Sequelize tables hold `AgeStatus`, `AgeEvidence`, `AgeAudit`,
`VrchatConnection`, `VrchatLinkSession`, `VrchatFriendClaim`, `AgeDiscordPolicy`,
`AgeDiscordObservation`, `VrchatServiceState`, `CommunityLeadership`,
`VrchatFriendAcceptance` and `VrchatAnnouncement` records. Startup creates missing
tables without altering existing user columns or inferring age from old roles.
Subsequent schema changes to these tables require explicit migrations.

`AgeEvidence` is unique by user, source and source key. Manual and Furality
decisions are staff-managed. VRChat requires the literal `18+` value from
`ageVerificationStatus`; `ageVerified`, `verified` and hidden values do not qualify.
Discord requires a trusted mapped role and a current, complete member snapshot.

The decision is `review_required` when a review hold exists, otherwise `verified`
when any active, unexpired evidence exists, otherwise `unverified`. Reads
recalculate the persisted summary. A background job also processes expiration.
Consumers must use the decision service to account for expiry, rather than
reading the stored summary alone.

VRChat observations refresh only through explicit actions and expire after thirty days.
Discord observations are refreshed after six hours and expire after one day.
Refresh failures preserve evidence until its normal expiry, never grant new
approval, and do not classify a member as a minor.

The scheduler runs once per minute, processing up to twenty Discord memberships.
It does not poll VRChat profiles. It retries failed Discord checks after an
hour. Live member updates and full membership synchronization also feed the
verification observer. A missing bot can use the member's existing authorized
Discord OAuth connection. No user token is requested through the age UI.

## Concurrency and service access

User locks serialize decisions. Database uniqueness and an advisory lock protect
VRChat association and reassignment. Claims consume their notification ID and
their linking session in the same transaction. Expired linking sessions and
consumed-notification records are removed after one day.

Service-account operations share a database lock, encrypted cookie jar and
request pacing. Requests use a fixed HTTPS origin, ten-second timeout, no
redirects, and a bounded response size. Rate limits honor Retry-After with a
minimum one-minute pause. Exceptions do not return provider credentials or raw
HTTP configuration.

The provider integration uses the community-documented VRChat API. Confirm its
current behavior before changing endpoints or response handling. Pending friend
requests are filtered locally by type and creation time because upstream filters
do not reliably restrict them. Starting a linking session or explicitly refreshing
requests retrieves one page of at most 100 notifications. Pipeline events add new
requests to the saved list. Profile reads occur during explicit linking, staff
association or profile refresh actions; candidate browsing uses saved names and
pictures where available.

## HTTP surfaces

All endpoints use the normal backend base URL without an additional `/api`
prefix. Responses require authentication and use `Cache-Control: private,
no-store`.

| Prefix | Purpose | Permission |
| --- | --- | --- |
| `/age-verification/me` | Status, linking session, candidates, claim, refresh, unlink | Current human member |
| `/age-verification/admin/users` | Search, status/history, manual evidence and review hold | Moderator, admin or owner |
| `/age-verification/admin/users/:id/connection` | Associate, reassign or unlink a VRChat account | Admin or owner |
| `/age-verification/admin/servers` | Directory, searchable history, policy preview/save, server and member refresh | Admin or owner |
| `/age-verification/vrchat-service` | Shared account login, health, friends, groups and announcements | Admin or owner |
| `/vrchat-community/capabilities` | Current user's Community Leader status | Current member |
| `/vrchat-community/leaders/:id` | Read or change Community Leader access | Admin or owner |
| `/vrchat-community/account` | Own community login, health, friends, groups and announcements | Community Leader |

The configured primary administrator retains access. Developer rank alone does
not confer age-management or service-account permissions. Staff reasons are
limited to 500 characters. History responses contain the latest 100 actions.

## Discord synchronization and display

`POST /users/me/sync-discord-info` and the staff equivalent refresh profile,
memberships and role assignments. Responses include `discordSync` with server
and role-refresh counts, a partial-result flag and a display message. A profile
refresh can succeed while membership access is unavailable.

The complete OAuth guild list is paginated before reconciling departures. Login
profile snapshots are non-authoritative for departures. Role synchronization
repairs missing guild IDs and reuses existing user associations.

`POST /age-verification/admin/servers/:guildId/sync` refreshes the bot-accessible
role catalog and the requesting administrator's membership. The per-member
refresh updates general membership and role records as well as age observations.
Bot access is preferred; authorized OAuth membership data provides role IDs when
bot access is unavailable. Membership history responses include avatar metadata.

`GET /age-verification/vrchat-service/friends?page=0&offline=false` returns up to
24 saved sanitized profiles and a `hasMore` flag. It makes no provider request,
including when a snapshot is absent. It exposes no locations or credentials.
The logo asset is from [Simple Icons](https://simpleicons.org/?q=vrchat).

## Live linking and community accounts

`GET /age-verification/me/link-events?token=...` is an authenticated SSE stream
bound to the member's unexpired linking session and the Orbiters service account.
Only invalidation signals reach the browser; cookies and raw notifications do
not. A signal reloads eligible candidates from saved state, never from VRChat.
Streams close on expiry or disconnect, with a two-stream limit per user and
surface. The browser reconnects automatically and falls back to reading saved
state every 30 seconds while disconnected. **Refresh requests from VRChat** is
the separate explicit provider action.

A successful claim atomically creates a durable friend-acceptance job. The worker
checks that the association and service account still match, then accepts the
request. Existing friendship counts as success. Unlinked claims are cancelled;
temporary failures retry with backoff up to one hour. The minute scheduler takes
up to five pending jobs per batch. No member credentials are involved.

Community account keys are assigned by the server as `user:<Orbiters ID>`.
The global Orbiters account uses `service`. Leadership is checked on every
community request and again inside the account transaction. Each scope has its
own encrypted state, transaction lock and request pacing. The User deletion hook
removes the owner's community session. Leadership changes are audited.

Both management prefixes expose `/groups`, `/group`, `/group/members` and
`/group/posts`. Members and posts use zero-based pages of 24. Selecting a group
requires current membership; posting rechecks membership and announcement
permissions. Announcements use VRChat's posts endpoint, preserving history.
Submissions include the selected group ID and a UUID request ID. A durable receipt
prevents retries after an uncertain provider result from duplicating a post.

## Saved snapshots and persistent pipeline

All management GET routes read saved state only, including cache misses, stale
snapshots, tab changes and pagination. Each resource exposes a distinct POST
refresh route: `/friends/refresh`, `/groups/refresh`, `/group/refresh`,
`/group/members/refresh` and `/group/posts/refresh`. Preserve the existing query
parameters for page and friend presence. A directory refresh retrieves one page,
without separately fetching group details. Selecting a group and publishing a
new announcement explicitly recheck the permissions needed for that action.
Confirmed or uncertain duplicate announcement submissions do not repeat REST calls.

Snapshots live inside the existing encrypted `VrchatServiceState.data` object,
isolated by account and group/page. No schema migration is needed. They survive
backend restarts. Stored metadata includes `loaded`, `syncedAt`, `updatedAt`,
`stale` and `partial`; absent snapshots must not be displayed as empty rosters.
Refreshes within ten seconds reuse the prior response under the account lock.
Failures retain saved data and mark it stale. Storage is bounded to 160 entries
and approximately 2 MiB per account, with oldest entries evicted first.

The backend maintains a VRChat pipeline connection for each configured, eligible
account independently of browser tabs. It reuses the encrypted auth cookie and
never calls REST to initialize or reconnect the socket. A database lease assigns
each scope to a worker, renewed by a local-only 30-second maintenance pass and
expiring after 90 seconds. Revoked leaders cannot access or persist further
updates. Cookie replacement, logout and deleted accounts close the old stream.
Reconnects back off to two minutes with jitter; recognized authentication failures
require an explicit reconnect instead of repeated login attempts.

Profile and friend events patch the saved display fields and presence. Incoming
friend requests populate the linking list directly. Group membership, role and
announcement events invalidate affected snapshots when their payload is not
complete enough to update them. Socket gaps also mark saved data stale; they
never start background REST reconciliation. VRChat does not provide a complete,
replayable roster or post-history stream. A live connection does not certify
that an entire member list or announcement history is current.

Authenticated `/events` streams on each management prefix read local snapshot
revisions every two seconds, allowing browsers to observe updates from whichever
worker owns the upstream socket. These local reads never invoke VRChat. Initial
page loads do not open extra upstream sockets.

Reference implementations reviewed: [VRCX pipeline handling](https://github.com/vrcx-team/VRCX/blob/master/src/services/websocket.js),
[VRCNext pipeline handling](https://github.com/shinyflvre/VRCNext/blob/main/Services/VRChatAPI/VRChatWebSocketService.cs)
and [VRCNext modal cache](https://github.com/shinyflvre/VRCNext/blob/main/Services/Helpers/ModalCacheHelper.cs).
Orbiters uses explicit refresh instead of their automatic REST follow-up patterns.

## Validation

The normal backend suite includes policy, transport and HTTP permission tests;
the frontend suite exercises member linking and moderator controls.

Database tests are opt-in and require an explicitly isolated disposable
PostgreSQL instance on localhost. Set `ENV_COMMON=true`, use database
`age_fixture`, and supply only that instance's connection values. Do not reuse a
developer or production database.

- `AGE_VERIFICATION_TEST_DATABASE=true`: run
  `node --test --test-concurrency=1 test/ageVerificationDatabase.test.js test/vrchatCommunityDatabase.test.js`
  after a fixture backend boot.
- `AGE_VERIFICATION_UPGRADE_TEST_DATABASE=true`: run
  `node --test test/ageVerificationUpgrade.test.js`. This creates and removes
  uniquely named fixture databases, testing fresh and populated installations
  with two backend boots each on port 4208.

Backend boots use `FAIL_FAST=true`, `EXIT_AFTER_DATABASE_INIT=true` and
`SKIP_EXTERNAL_STARTUP=true`. Provider interactions in automated tests are
stubbed; configuring a real service account and exercising email/TOTP and an
incoming friend request remains a deployment acceptance step.
