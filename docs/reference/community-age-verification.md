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
`AgeDiscordObservation` and `VrchatServiceState` records. Startup creates missing
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

VRChat observations are refreshed after one day and expire after thirty days.
Discord observations are refreshed after six hours and expire after one day.
Refresh failures preserve evidence until its normal expiry, never grant new
approval, and do not classify a member as a minor.

The scheduler runs once per minute, processing up to twenty Discord memberships
and five VRChat profiles per batch. It retries failed Discord checks after an
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
do not reliably restrict them. At most 1,000 notifications are scanned; staff
must clear older notifications if this limit is reached. Profile responses are
cached for five minutes.

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
| `/age-verification/vrchat-service` | Login, challenge verification, health, paginated friends and disconnect | Admin or owner |

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
24 sanitized profiles and a `hasMore` flag. It shares service-account pacing and
backoff. It exposes no locations, credentials or friendship mutation operations.
The logo asset is from [Simple Icons](https://simpleicons.org/?q=vrchat).

## Validation

The normal backend suite includes policy, transport and HTTP permission tests;
the frontend suite exercises member linking and moderator controls.

Database tests are opt-in and require an explicitly isolated disposable
PostgreSQL instance on localhost. Set `ENV_COMMON=true`, use database
`age_fixture`, and supply only that instance's connection values. Do not reuse a
developer or production database.

- `AGE_VERIFICATION_TEST_DATABASE=true`: run
  `node --test test/ageVerificationDatabase.test.js` after a fixture backend boot.
- `AGE_VERIFICATION_UPGRADE_TEST_DATABASE=true`: run
  `node --test test/ageVerificationUpgrade.test.js`. This creates and removes
  uniquely named fixture databases, testing fresh and populated installations
  with two backend boots each on port 4208.

Backend boots use `FAIL_FAST=true`, `EXIT_AFTER_DATABASE_INIT=true` and
`SKIP_EXTERNAL_STARTUP=true`. Provider interactions in automated tests are
stubbed; configuring a real service account and exercising email/TOTP and an
incoming friend request remains a deployment acceptance step.
