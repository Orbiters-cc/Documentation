---
title: Commission Reliability
section: Developer Reference
order: 160
audience: admin, dev
stage: stable
id: orbiters.reference.commission-reliability
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-09-05
---

# Commission Reliability

## Payment and Delivery Boundaries

ReFit commission status, payment state and delivery stage are separate. Artist/YCH
requests do not create Stripe charges. A private creator Board is an integration,
not the customer's permission boundary or the source of delivery progress.

Payment states include `checkout_pending`, `awaiting_payment`, `authorized`,
`capture_pending`, `captured`, `release_pending` and `released`. A cancelled request
does not prove release. Captures performed outside the acceptance workflow are
flagged for administrator review; Orbiters does not automatically refund them.

Requests persist their submission UUID, payload fingerprint, Stripe account/mode,
immutable Checkout parameters and fixed expiry. Database saves survive unknown
Stripe outcomes. A retry with a changed payload and the same UUID is rejected.
After the Checkout creation window ends, recovery searches for the original
session instead of creating another one after Stripe's idempotency retention ends.

Acceptance and cancellation recheck state under row locks. Webhooks reconcile the
current PaymentIntent: a failed card attempt is not a terminal commission failure.
The response deadline is bounded by the expanded charge's
`payment_method_details.card.capture_before`, with a one-hour capture margin.

## Recovery Jobs

The existing outbox handles `commission.checkout`, `commission.reconcile`,
`commission.capture`, `commission.release` and `commission.placement`. Enqueueing
participates in the same database transaction as the requested state change.
Provider calls execute outside database transactions and use stable idempotency
keys. Transient commission-job failures retry with bounded backoff; stale claimed
jobs recover through the outbox's existing lease recovery.

The maintenance scheduler revisits awaiting payments, releases and Board placement.
Outbox `lastError`, request `failureReason`, and `placementError` expose failed
operations. Restore the original Stripe account/mode before retrying payments bound
to it. A creator can repair a missing Board destination from the commission page.

## Images and Activity

`CommissionMediaReferences` links uploaded files to listings, Sonas and immutable
art requests. Attaching locks the file; cleanup rechecks references under the same
lock and marks an unreferenced file inactive before touching storage. A failed
cleanup leaves its database record for retry. Cleanup only removes local paths
inside the commission-upload directory and the remote objects recorded on the file.

`CommissionActivity` preserves stage changes and participant updates. The request
detail displays the latest 50 entries. A customer may view a task linked to their
own commission, but this does not grant editing or the creator's Board permissions.

## Workspace Payment Records and Announcements

`CommissionPaymentRecord` has one named unique target key. Linked proposals
resolve to the art/ReFit request before reading or writing: the two pages cannot
create independent payment records. Writes lock the canonical target and check a
version. Only the artist writes; participants may read. Only records with a receipt
date enter the artist's revenue history. No Stripe mutation is performed.

Listing save and selected channel jobs share a transaction. Announcement uniqueness
is `(assetId, channelId)`. The worker rechecks publication, ownership and provider
permissions. It records a dispatch claim before sending and persists the external
message ID afterward. An uncertain result requires human confirmation before
retrying; a Discord discussion retry uses the saved message instead of reposting.

External asset discussion uses a separate provenance-aware table rather than
inventing local accounts or assigning unmatched comments to the creator. A named
`(provider, externalKey)` index deduplicates webhook delivery; timestamp guards
reject old edits and deletion tombstones prevent resurrection. Filters apply
before pagination. Telegram webhook authentication uses a constant-time secret
comparison. Discord events use the existing designated-client routing.

Trello upload retries first list existing attachments and reuse stable file-ID
markers. Downloads require Board membership plus proposal visibility, keep tokens
out of URLs, bound redirects and bytes, and send private/no-store responses.

New tables and the Telegram Bot API-key enum value are covered by opt-in
`commissionManagementUpgrade.test.js` disposable PostgreSQL tests: fresh and
populated/partially applied schemas, each booted twice. Never run upgrade fixtures
against a development or production database.

## List and Revenue Queries

`GET /commissions/mine?scope=active` and `scope=history` return 20 lightweight
summaries plus `nextCursor`. Pass that cursor for the next page. Queries are scoped
to the authenticated client and never return request snapshots or private briefs.
The frontend shares queries between the account and menu and isolates caches by
user and token version. Creator inboxes are paginated separately.

Stripe balance transactions are synchronized into `StripeRevenueEntries`, scoped
by account and mode. Each bounded synchronization pass advances both recent data
and the durable history-backfill cursor; a database lease prevents concurrent
workers from advancing the same cursor. Transaction IDs deduplicate repeated pages.
Payment/refund/reversal/adjustment amounts retain their signs and event dates;
fees are stored separately, and payouts/transfers are excluded from revenue.
Dashboard amounts use hundredths of a currency, including fractional hundredths
when necessary, rather than assuming every provider uses cents.

## Deployment and Validation

Use explicit server `ORBITERS_ENV=dev` or `prod`. Browser hostnames cannot enable
development tools, and the dummy ReFit request requires Stripe test-mode keys.

Before startup sync, a transactional schema migration adds `nextPaymentCheckAt`
to existing commission tables, fills only missing timestamps with the current time,
and enforces its required value and database default. Existing scheduled timestamps
and commission rows are preserved, including when retrying a partially applied upgrade.
Startup sync adds the other new string-based state fields and tables. The one-time
`2026-09-05-commission-reliability` migration preserves existing payment/delivery
states, indexes existing image references and retains current art notes as activity.
`ApplicationMigrations` records completion; normal runtime does not maintain an old
schema compatibility path. Unused pre-migration authenticated handoffs have no
authentication version and must be replaced with new links.

Before deploying, run unit tests and boot the backend twice with
`EXIT_AFTER_DATABASE_INIT=true`, `FAIL_FAST=true` and `PORT=4200` against a disposable
database. Also test upgrading a populated previous schema and a partially applied
nullable timestamp column; two empty-database boots do not validate existing data.
`commissionPaymentCheckSchemaDatabase.test.js` performs these startup regressions
when `COMMISSION_SCHEMA_TEST_DATABASE=true`. It requires `ENV_COMMON=true`, a loopback
PostgreSQL connection, and an empty disposable database named `commission_schema_fixture`.
It never resets an existing deployment database.
The opt-in `commissionReliabilityDatabase.test.js` checks real PostgreSQL
locking, handoff revocation/replay, delivery history, media retention and ledger
deduplication. It refuses to run unless explicitly pointed at the fixture database.
No verification requires a live charge or access to a creator's Stripe account.

## Worker ownership and operator attention

Each outbox claim now has a UUID owner token and a renewable five-minute expiry. Success and failure require the same unexpired claim. Stale recovery increments an interrupted-attempt counter; repeated interruption becomes actionable instead of silently starting over forever.

Commission operations and fee refunds retain reconciliation after the normal retry budget. They set an attention flag while continuing. Admins see IDs, types, attempt counts and schedules in **Admin → Background jobs**, without raw payloads or provider errors. Successful completion clears the flag. See [Recover background jobs](/documentation/orbiters.operations.background-jobs).

## Identity at Checkout creation

The locked client account determines whether the user may submit. The Stripe account determines the payment account ID and mode recorded on the request. These are distinct objects. A regression fixture deliberately uses a numeric client ID and `acct_fixture` to prevent variable shadowing from saving the wrong identity.

## Derived next actions

`commissionNextAction` computes a viewer-specific cue from existing request, offer and delivery states. It does not persist another status or infer that an external artist payment occurred. Only active unexpired candidates may receive an offer-response cue; private delivery cues belong to participants.

The client list's `attention` scope filters in SQL before cursor pagination. Creator lists label their filters as applying to loaded requests or the current page. Board cards receive participant cues after item-visibility filtering. A review cue for the client links to the existing request and does not grant a new state transition.
