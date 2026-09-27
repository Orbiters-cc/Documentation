---
title: Stripe integration review, September 2026
section: Development
order: 95
audience: dev
stage: alpha
id: orbiters.development.stripe-review-2026-09
domain: website
type: decision
owner: orbiters-product
lastVerified: 2026-09-27
---

# Stripe integration review, September 2026

This is a source review, not a payment-flow change or a live Stripe audit.
It compares Orbiters with [Theo's Stripe recommendations](https://github.com/t3dotgg/stripe-recommendations)
and [Stripe's webhook guidance](https://docs.stripe.com/webhooks).
The suggested improvements below have not been implemented by this review.

## What already fits

Orbiters uses Checkout payment mode with manual capture for ReFit and sticker
request fees. It does not implement its own Stripe subscription billing through
these services. Creator payments remain separate.

The guide's central idea, fetching current provider state instead of applying
out-of-order webhook snapshots, already exists. ReFit's
`commissionWebhookService.js` calls `commissionPaymentRecoveryService.reconcilePayment`.
The authenticated return-page refresh uses that same reconciler. Sticker webhook
events enqueue payment jobs; `stickerPayments.reconcile` fetches Checkout and the
PaymentIntent. The sticker page requests a recheck when opened and polls its record.

Checkout, capture, cancellation and refunds use operation-specific idempotency keys.
Request records are persisted before provider operations, and account/mode checks
guard recovery. The webhook verifies Stripe signatures against the raw request body.
Neither flow treats a success query parameter alone as proof of payment.

## Recommended next work

### 1. Queue ReFit webhook processing durably

`backend/src/services/commissions/commissionWebhookService.js` awaits the reconciler
inside `POST /stripe/webhook`. That can fetch several Stripe resources and invoke
creator notifications through queue activation before acknowledging delivery.
This increases timeout exposure when Stripe or Discord is slow.

Follow the existing sticker pattern: verify and correlate the event, persist a
reconciliation job transactionally, then acknowledge. Use an event-scoped key so
later legitimate events can enqueue fresh work while duplicate deliveries collapse.
Keep the current-state reconciler shared with return-page refresh and recovery.
Test duplicate delivery, reordered events, failed enqueue, slow providers and worker
retry. Never acknowledge an event before the durable enqueue succeeds.

### 2. Validate ReFit payment correlation before state changes

`commissionCheckoutService.ensureCheckout` persists the returned session/payment
reference, and `commissionPaymentRecoveryService.reconcilePayment` branches on the
retrieved intent's status without comparing its amount, currency, client metadata
and request metadata with the stored request. The account/mode guard alone does
not prove those fields match. Sticker payments already have a `validateIntent`
check covering those values.

Add equivalent ReFit checks before authorizing, capturing or releasing a payment,
including consistency with an existing intent reference and live/test mode. Treat
this as defensive validation against miscorrelation or operator changes, not a
demonstrated unauthorized-payment exploit. Test each mismatch with local fixtures
and assert no state transition or payment mutation occurs.

### 3. Separate signature errors from processing failures

`backend/src/routes/stripeRouter.js` currently catches verification and processing
errors together, returns `error.statusCode || 400`, and echoes `error.message`.
Use a generic 400 for invalid signatures/payloads and a generic 5xx for transient
internal failures, keeping detailed diagnostics server-side. Both are non-2xx;
the current 400 does not mean Stripe stops retrying. The improvement is clearer
operations and less error-detail disclosure. Test each response class.

## Recommendations that need a product reason first

Persistent Stripe Customer IDs could improve repeat-customer support and future
billing features. Current checkouts use `customer_email`, with payment identity
bound to the stored commission request and PaymentIntent. Adding a Customer table
and migration solely to imitate a subscription example is not required for that
one-off workflow. If added, creation needs account/mode scoping and concurrency-safe
idempotency; it must not use email as the authorization boundary.

The guide's one-subscription limit does not apply to these request fees. Its Cash
App Pay advice is anecdotal; review actual eligible payment methods and your own
dispute data before changing payment availability. Keep PostgreSQL as the durable
workflow store; this review does not identify a need for Redis.

## Scope and evidence limits

Reviewed the checkout, webhook, payment recovery, acceptance, queue activation,
sticker payment and return-page code in the local checkout. No Stripe dashboard
settings, production webhook deliveries, provider credentials or real payments
were inspected or changed. Existing local unit tests use provider fixtures; they
are not proof of live payment delivery or populated-database concurrency behavior.
