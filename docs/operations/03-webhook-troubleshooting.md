---
title: Webhook Troubleshooting
section: Operations
order: 52
audience: creator, admin, dev
stage: stable
id: orbiters.operations.webhook-troubleshooting
domain: operations
type: runbook
owner: orbiters-operations
lastVerified: 2026-07-14
---

# Webhook Troubleshooting

Store webhooks keep Orbiters close to the provider's sale and license state. They are especially important for refunds, revocations, chargebacks, and sale mirrors.

## First Checks

1. Confirm the store integration is active.
2. Confirm the provider supports webhooks for the account.
3. Confirm the integration has a webhook secret.
4. Confirm recent provider events appear in Orbiters.
5. Confirm the related product is linked to an Orbiters asset.

## Matching Revocations

Orbiters disables access only when a revocation can be safely matched. A provider event is easier to match when it contains:

- an external sale ID,
- a product ID,
- a license key or short key,
- enough metadata to connect to a mirrored sale.

If a refund happened in the provider but access did not change in Orbiters, check whether the event included a matchable key or sale ID.

## Duplicate Events

Duplicate processed webhook events are ignored. Failed events can be retried by sending the same provider event again.

## Provider-Specific Notes

Gumroad and Lemon Squeezy use signed webhook flows. Jinxxy support depends on account features. Payhip license verification is supported through product secret keys; webhook behavior is limited by provider capabilities.

## Stripe ReFit Commissions

ReFit commission requests use Stripe Checkout with manual capture. The webhook URL
is `https://api.orbiters.cc/stripe/webhook`. Configure these events:

- `checkout.session.completed`
- `payment_intent.amount_capturable_updated`
- `payment_intent.canceled`
- `payment_intent.payment_failed`
- `account.updated`

Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in the backend environment. Set
`FRONTEND_URL` to the website origin so Checkout and Stripe Connect return to the
correct deployment.

If a paid draft remains in **Waiting for payment authorization**, confirm the
Checkout event arrived and the PaymentIntent reached `requires_capture`. If a
request remains in **Creator acceptance is being finalized**, check Stripe capture
status and the persisted Board destination. The commission scheduler retries stale
acceptances idempotently; network failures do not cancel the request, while a card
decline or non-capturable authorization does.

<audience include="dev">

Webhook routes preserve the raw request body for signature validation. Provider modules own signature validation and webhook parsing. Do not validate signatures in route code unless the provider module delegates that exact concern.

</audience>
