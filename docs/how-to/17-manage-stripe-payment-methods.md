---
title: Choose Stripe Payment Methods
section: Administration
order: 62
audience: admin, dev
stage: beta
id: orbiters.how-to.stripe-payment-methods
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-08
---

# Choose Stripe Payment Methods

Open **Admin → Stripe** to choose payment methods for the Orbiters request fee.
Creator payments are still arranged separately; artists do not need Stripe Connect.

## Check the account, then choose

1. Check the **account ID** and **Test / sandbox** or **Live payments** badge.
   The page uses the deployment's active Stripe credentials, including environment
   overrides. **Manage credentials** opens API Keys without displaying secrets here.
2. Search for a payment method, such as **PayPal**, and switch it on or off.
   Unavailable methods explain what to complete in Stripe. Use **Activation &
   eligibility in Stripe**, then **Refresh from Stripe** after completing setup.
3. Review your unsaved changes and select **Save to Stripe**. Nothing is changed
   while you are merely browsing or toggling the draft switches.
4. Start a **new commission request** to check the updated payment screen.
   Existing checkout links can retain their original options.

**Scope matters:** this edits the Stripe account's **default payment-method
configuration**, not a separate Orbiters-only copy. Other integrations using that
same default configuration are affected too. Sandbox and live preferences are
separate. See Stripe's [payment-method configurations](https://docs.stripe.com/api/payment_method_configurations).

## Enabled does not mean visible to every customer

Stripe selects eligible methods using the amount, currency, customer and payment
flow. ReFit requires **manual capture**: the fee is authorised first and captured
only when an artist accepts. A method can be enabled on the account but absent
from this checkout if it does not support that flow.

- **PayPal:** activation must be complete on the same Stripe account and mode.
  The former card-only checkout restriction is removed for new requests.
- **Apple Pay / Google Pay:** require Cards and a compatible device/card setup.
- **Affirm / Afterpay:** excluded from ReFit because they can collect an initial
  instalment during authorisation, before artist acceptance. Their account
  preferences are shown but cannot be edited here.
- Keep **Cards or PayPal** enabled as an available EUR request-fee payment method.

Stripe documents [manual capture and method-specific limitations](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)
and [PayPal activation and availability](https://docs.stripe.com/payments/paypal).

## If saving fails

Your unsaved choices remain visible. **Reload saved settings (discard edits)**
reads Stripe's actual state, useful when a network failure leaves the save outcome
uncertain. If the configuration changed after you loaded it, refresh and review
before saving again. Restricted Stripe keys need permission to read and update
payment-method configurations and read the account.

Orbiters saves changes to one configuration in sequence, even when two
administrators save at once. The later save must use the refreshed settings;
it cannot rely on another method remaining enabled in an older snapshot.
You can switch a method off and back on again: each save is a new operation.
Changes made directly in Stripe or by another integration still require a refresh.

Only administrators can read or change these settings. No payment is created,
captured or refunded by this page.
