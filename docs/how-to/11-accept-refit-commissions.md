---
title: Accept ReFit Commissions
section: Creator Tools
order: 47
audience: creator, admin, dev
stage: stable
id: orbiters.how-to.accept-refit-commissions
domain: refit
type: how-to
owner: orbiters-product
lastVerified: 2026-09-05
---

# Accept ReFit Commissions

Offer manual fitting work and keep accepted requests on your private Board.

## Set up once

1. Open **Creator → Commissions** and enable **Accept ReFit commissions**.
2. Enter your typical minimum and maximum prices.
3. Optionally choose a default Board and column for accepted work.
4. Save your settings.

> **No Stripe account needed.** Orbiters handles its €2 request fee.
> Arrange your own commission price and payment directly with the client.
> If platform payments are unavailable, new listings are disabled until an
> administrator finishes setup.

## Accept an offer

Open **Creator → Requests** to accept or decline an active offer.
If no Board destination is configured, choose one while accepting.

Before acceptance you see the offer, response deadline, avatar previews and any
other shared attachments. Review these under **Attachments** to assess the work.
After acceptance, the previews remain available, the client's profile and ReFit
details become available, and other offers close. Downloaded files are user-provided;
check them before opening them.

## Keep the client updated

Use **Start / resume work**, **Ready for review**, and **Mark completed** on the
commission page. Add notes or delivery links without changing the stage when useful.
Participants can see the latest 50 updates.

Your private Board is for organizing work. Moving cards between Board columns
does not change the client's progress.

### If Board placement fails

Accepted work is placed on your Board after the request fee is captured.
Placement retries separately from payment.

If the destination was removed, open the request, enter a replacement **Board ID**
and **column key**, then select **Retry Board placement**. This does not charge
the request fee again.

## Test on a development deployment

**Creator → Commissions → Create a ReFit request** creates a dummy request for the
signed-in creator and opens a Stripe test checkout. This lets you test the website
before the Unity handoff is available.

The shortcut exists only when the server is configured for development, and
requires test-mode payment keys. The browser hostname does not enable it.

See the [customer request guide](/documentation/orbiters.how-to.request-refit-commission).

<audience include="admin, dev">

For platform income, see [Understand platform payment revenue](/documentation/orbiters.how-to.platform-payment-revenue).

</audience>
