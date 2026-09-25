---
title: Configure creator-growth integrations
section: Operations
order: 130
audience: admin, dev
stage: beta
id: orbiters.operations.creator-growth-integrations
domain: website
type: runbook
owner: orbiters-platform
lastVerified: 2026-09-25
---

# Configure creator-growth integrations

The creator-growth implementation has local fixture validation. This page does not establish that it has been deployed or that provider applications are approved. Configure and verify each environment independently.

## Applications and limits

| Feature | Configuration | Required setup |
| --- | --- | --- |
| AI asset importer and promotion classifier | Global Gemini, DeepSeek or Z.ai credentials; **Admin → AI** routing and image limits | Longest image edge 256–4096 px, default 1280; 1–12 images, default 8. Proportional downscaling preserves aspect ratio and never enlarges smaller images. |
| Twitch | `TWITCH_APP` | Client ID/secret, registered HTTPS website `/creator?tab=streams` callback, public API `/creator-streams/twitch/webhook`, random printable ASCII webhook secret (10–100 characters accepted; 32–100 recommended, punctuation supported). |
| X | `X_PUBLISH_APP` | `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI` pointing to the HTTPS website `/creator?tab=posts`. Enable OAuth 2.0 with tweet read/write, user read, media write and offline access. Provider account access and usage costs apply. |
| TikTok | `TIKTOK_PUBLISH_APP` | Same three field names; `CLIENT_ID` is TikTok's client key. Register the website `/creator?tab=posts` callback. Enable `user.info.basic` and `video.publish`. Verify the public API media URL domain for pull-from-URL photo delivery. Public Direct Post requires the provider's approval. |
| Bluesky | Creator app-password connection | Currently supports Bluesky-hosted personal data servers. No shared application credential is required. |
| Telegram | Existing deployment bot and creator identity | Bot must be an administrator with posting permission in the selected channel. |
| Gumroad | Existing creator store integration | Publishing permissions for product creation/update; vendor product and payout setup still apply. |
| Sticker fees | Existing operational Stripe setup; **Admin → Features → Stickers** | Optional manual-capture request fee. Default disabled; currency EUR, USD or GBP. |

Set `PUBLIC_API_URL` to the public HTTPS API origin for Gumroad thumbnails and TikTok photo delivery. Set the website's existing `FRONTEND_URL` or `FRONT_URL` for Discord offers. Callbacks must match the provider registration exactly. Secrets belong in the encrypted credential settings, never public documentation or asset fields.

Provider references: [Twitch EventSub](https://dev.twitch.tv/docs/eventsub/), [X OAuth authorization code flow](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code), [TikTok photo posting](https://developers.tiktok.com/doc/content-posting-api-reference-photo-post), [TikTok required sharing experience](https://developers.tiktok.com/doc/content-sharing-guidelines).

## Enable community assistance

See [Configure AI models, prompts and usage](14-ai-models-and-prompts.md) for default
models, per-feature overrides, metering and initiating-user history.

Open **Community → Self promotion** as its owner or administrator. Choose a connected Discord server and room, eligible promotion categories, optional wording and the per-person cooldown. Enable the feature after explaining it to the community: eligible post text and images go to the configured AI provider.

Use **Preview offer type** to inspect each category's example wording and button
in the Discord-style public/ephemeral previews. **Generate preview** runs an example
post through the same configured AI feature as the bot, without posting to Discord.
It counts toward AI usage and records the initiating administrator. Examples are
illustrative; real responses depend on the source post and configured prompt.

The bot needs access to message content and attachments, room visibility, message sending and history. The invitation is public, updates every two seconds and is deleted after ten seconds. A button interaction acknowledges privately before database work; the original author alone can claim its offer. Expired invitations still leave ordinary Creator tools available.

Prompt cleanup retries after interruptions. A lost send response is not permission to post another invitation. Source snapshots expire after a day; claimed assets use the private draft's media references.

## Delivery and retention

Posting and publishing use durable outbox jobs with separate provider results. An uncertain create/send must be reconciled before retrying. Completed independent destinations remain completed. Gumroad updates stop when synchronized fields changed at the vendor; downloads and checkout fields are never replaced.

For Gumroad, a paused publication can remain `uncertain` with `enabled: false`.
Keep the recovery message until a verified product link resolves that uncertainty.
`vendorPublishing.test.js` covers lost creation responses followed by repeated
pause/resume attempts, invalid then corrected asset details, and successful
recovery by linking the existing product.
Before each Gumroad write, the worker rechecks creator access, asset ownership,
connection availability and owner/moderator visibility. Write admission shares
the asset row lock with hiding and moderation decisions. Database locks are
released before provider requests; an admitted request may finish, and its receipt
is saved before any subsequent step. Hiding during preparation prevents creation;
hiding during creation stops later updates, thumbnail upload and publication.
Interrupted creations without a receipt retain `uncertain` recovery requirements.

`bugScanConcurrencyDatabase.test.js` verifies the visibility fences and community
role pool admission using real PostgreSQL transactions and minimal model fixtures.
Enable it with `RUN_BUGSCAN_DB_TESTS=true` and `BUGSCAN_TEST_PG_PORT` pointing to a
disposable loopback PostgreSQL instance on port 50000–65535. The fixture connection
uses database/user `scan_fixture` and password `scan-fixture-only`, creates a new
random database, and never reuses application data. Remove the disposable instance
after testing. Provider requests, audit storage and notifications are fixtures;
this check does not establish production startup or provider acceptance.

`creatorDraftEditing.test.js` checks that publishing page edits preserves existing
installation settings while new general assets keep their creation defaults.

AI copies are bounded by decoded pixels, file size, image count and resized payload size. Source text and images are not retained in ordinary AI interaction content for these imports. Private drafts and selected public media have separate access rules. Unreferenced creator uploads are eligible for cleanup after a day; active drafts, published media, retained orders and social posts protect their references.

Visit receipts expire after one day, opted-in journeys after 90 days, and aggregate metrics after 395 days. Aggregate events omit user/session identifiers. Personal journeys require the explicit personalization preference; withdrawing it deletes the account's stored journeys. Creator statistics expose totals, not visitor identities. Terminal social history expires after 180 days; uncertain deliveries remain available for resolution.

## Validate before release

The next release includes recommendation visibility checks for both the requested
asset and every candidate: a current product or published commission is required.
The creator-facing old-format warning provides a manual path through the current
asset editor; there is no compatibility fallback that exposes private metadata.

`communityStartup.test.js` exercises the real Discord client manager, role-listener
initializer and outbox dispatcher, including disabled startup, repeated starts,
scheduled work and HTTP `/healthz`. Provider clients, database operations and
unrelated startup services are local fixtures. `bugScanConcurrencyDatabase.test.js`
adds competing custom-bot saves and transactional closure snapshots in disposable
PostgreSQL. No production database or external role is changed by these checks.

`src/scripts/adminDiscordModalQa.cjs` exercises Admin → Users → View Info with
local HTTP and WebSocket fixtures. It checks close-button hit testing, repeated
closure during refresh, Escape/outside dismissal, focus restoration, mobile
layout and reduced motion. Build with a local `REACT_APP_BACKEND_URL` first.

Run backend tests with a fixture environment that cannot connect to developer or production databases. The creator-tools startup regression uses the real initializer and HTTP `/healthz` wiring with provider side effects stubbed. Database initialization alone is a separate check.

`creatorToolsUpgrade.test.js` is opt-in with `CREATOR_TOOLS_UPGRADE_TEST=true`. It requires a disposable PostgreSQL service on loopback with a port above 50000 and database `creator_tools_fixture`; it creates and drops random databases. It exercises fresh and populated upgrades twice, preserves existing rows, and verifies asset deletion keeps order snapshots while removing access references.

The browser checks use local builds and provider fixtures. A live release must separately verify application credentials, OAuth redirects, webhook delivery and authorized test posts. Do not interpret fixture results as confirmation that external services accepted a production post.


## Creator editor regression checks

`creatorPersonalization.test.js` covers malformed and empty link URLs returning
validation errors instead of uncaught URL exceptions. Public appearance reads also
handle invalid stored links without crashing.

`creatorExtractionSafety.test.js` verifies that AutoFill cannot change commission
publication, acceptance or announcement destinations. Unsupported commission
suggestions leave other valid fields usable.

`commissionAnnouncements.test.js` covers creator-upload previews, general asset
announcements, duplicate-send protection, hidden/moderated listings and disabled
creator accounts. After provider permission verification, send admission locks and
rechecks the account, asset and destination in the database transaction. Provider
calls happen after the transaction; an already admitted request can still finish.
These tests use deterministic model and provider fixtures, not live account posts.
