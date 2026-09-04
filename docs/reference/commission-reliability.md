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
lastVerified: 2026-09-04
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
detail displays the latest 50 entries. Customers do not receive internal proposal
links or the creator's Board permissions.

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

Startup sync adds the new string-based state fields and tables. The one-time
`2026-09-05-commission-reliability` migration preserves existing payment/delivery
states, indexes existing image references and retains current art notes as activity.
`ApplicationMigrations` records completion; normal runtime does not maintain an old
schema compatibility path. Unused pre-migration authenticated handoffs have no
authentication version and must be replaced with new links.

Before deploying, run unit tests and boot the backend twice with
`EXIT_AFTER_DATABASE_INIT=true`, `FAIL_FAST=true` and `PORT=4200` against a disposable
database. The opt-in `commissionReliabilityDatabase.test.js` checks real PostgreSQL
locking, handoff revocation/replay, delivery history, media retention and ledger
deduplication. It refuses to run unless explicitly pointed at the fixture database.
No verification requires a live charge or access to a creator's Stripe account.
