---
title: Set Your Seller Information and Commission Terms
section: Creator Tools
order: 61
audience: creator, admin, dev
stage: beta
id: orbiters.how-to.seller-terms
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-08
---

# Set Your Seller Information and Commission Terms

Configure seller details and terms before a customer submits a versioned agreement.


Open your commission tools and expand **Seller information** before publishing
an art listing or enabling ReFit requests. Complete the inline setup once; later
changes create a new version for future requests.

Declare whether you act as a non-professional seller, an individual professional
or a professional entity. Professional sellers provide public legal identity,
contact, address and registration details. Non-professional sellers' private
contact details are not included in the public seller summary.

## Quick setup

1. Confirm your seller status and search for your country by name. A new draft
   uses your Orbiters display name; enter your actual legal name if selling professionally.
   Country, business contact and registration details are not guessed or copied from private tax data.
2. Choose delivery, revision, licence and payment presets. New drafts already
   contain editable starting terms. Licence choices cover personal use, personal
   use with monetised streaming, and non-exclusive commercial use.
3. Open **Read or customise wording** to review each clause, or choose **Custom
   wording**. Selecting a preset replaces only that field; saved custom terms
   are never automatically replaced. These are starting points, not legal advice.
4. Confirm the reviewed information, accept the current seller terms and save.
   Editing a field clears the confirmation so you can review the final wording.

The payment presets describe money paid **directly to you**; choosing PayPal here
does not enable PayPal in the separate Orbiters Stripe checkout.

<audience include="admin,dev">

**PayPal missing from Stripe Checkout?** The current ReFit integration explicitly
requests `payment_method_types: ['card']`. Enabling PayPal in the Stripe Dashboard
does not override that list. Supporting it requires a checkout integration change
and payment-lifecycle tests, not a second artist API key. Stripe documents
[PayPal availability and activation](https://docs.stripe.com/payments/paypal) and
[separate authorisation and capture](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method).
Check the same Stripe account and test/live environment used by Orbiters. Existing
checkout sessions retain the payment-method configuration they were created with.

</audience>

Describe the work and total price accurately in each listing or quote. Professional
status is a factual declaration; low sales volume alone does not determine it.

## What Customers See

The request form presents the seller status, terms and platform responsibilities
before submission. Customers explicitly accept the displayed version. If seller
information changes during drafting, the server asks the customer to review it again.
The saved request retains its original contract snapshot when you edit a listing later.
Download the confirmation from the commission page for your records.

In the ReFit selection list, each artist has **Contract & seller details** directly
under their name, price and waiting limit. Expand it to review the full agreement.
The yellow receipt explains the Orbiters service and separate artist payment together.

Creator payments go directly to you. Orbiters does not receive or pay out that money.
The separate ReFit fee pays for the Orbiters request service and is captured only
when a creator accepts. Mark external payments received only after receipt.

## Cancellation, Early Work and Disputes

A custom commission does not automatically remove statutory consumer rights.
Explain the rules applicable to the work you sell. The ReFit request flow records
an express request to begin the platform service immediately while preserving
statutory rights; it does not apply a blanket withdrawal waiver to your own work.
Changes to an accepted agreement need the customer's agreement.

Use the commission report action for a dispute. Creator-payment refunds are handled
by the creator and payment provider. Orbiters can review and refund its own captured
request fee separately. Account closure and public hiding preserve the other
participant's commission record.

## Conditional Tax and Age Requirements

If the operator enables applicable seller reporting, **Private seller tax details**
appears in seller setup. Supply accurate identity and tax-residence details there,
not in public listing fields. Staff review is separate from public seller status.
Changes invalidate the previous review.

An approved operator age policy may also require verified 18+ status before new
buying or selling activity. Follow the existing verification control in your account
when prompted. Neither tax collection nor a new commerce age rule is enabled solely
by saving seller terms.
