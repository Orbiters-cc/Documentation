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
lastVerified: 2026-09-02
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

ReFit commission requests use Stripe Checkout on the Orbiters platform account with
manual capture. The EUR 2 request fee is received by the website administrator; a
creator does not connect a Stripe account and Orbiters does not collect the
creator's separate commission price.

Configure Stripe from **Admin > API Keys** by adding a global **Stripe platform**
credential for the current environment. Enter the publishable key, secret key, and
the Account webhook signing secret. The setup panel displays the exact webhook URL;
for production it is `https://api.orbiters.cc/stripe/webhook`. Configure these
Account events:

- `checkout.session.completed`
- `payment_intent.amount_capturable_updated`
- `payment_intent.canceled`
- `payment_intent.payment_failed`

`STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`
environment variables remain deployment overrides. Database credentials are
encrypted and selected by Orbiters environment. `FRONTEND_URL` controls where
Checkout returns after authorization.

The secret key alone enables Stripe API calls, but commission listings and new
requests stay disabled until the webhook signing secret is also present. This keeps
the request queue from accepting payments that it cannot reconcile.

If a paid draft remains in **Waiting for payment authorization**, confirm the
Checkout event arrived and the PaymentIntent reached `requires_capture`. If a
request remains in **Creator acceptance is being finalized**, check Stripe capture
status and the persisted Board destination. The commission scheduler retries stale
acceptances idempotently; network failures do not cancel the request, while a card
decline or non-capturable authorization does.

<audience include="dev">

Webhook routes preserve the raw request body for signature validation. Provider modules own signature validation and webhook parsing. Do not validate signatures in route code unless the provider module delegates that exact concern.

</audience>
