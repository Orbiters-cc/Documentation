---
title: Request a Manual ReFit Commission
section: Creator Tools
order: 46
audience: user, creator, admin, dev
stage: stable
id: orbiters.how-to.request-refit-commission
domain: refit
type: how-to
owner: orbiters-product
lastVerified: 2026-09-04
relations: orbiters.tools.refit-operating-contract, orbiters.how-to.connect-store-integrations
---

# Request a Manual ReFit Commission

Use the manual commission flow when an automatic ReFit result needs artist work.

## Send a Request

1. Finish a ReFit in Unity.
2. Under **The ReFit doesn't look right?**, select one or more available creators.
3. Select **Next**. Orbiters opens the commission draft in the browser.
4. Put the creators in preference order.
5. Keep the default two-day response time or set a different limit for each creator.
6. Optionally enable **Ask everyone at once and take the first creator who accepts**.
7. Review the receipt, then select **Next** to continue to Stripe. The asset,
   source avatar, target avatar, and blendshape context comes directly from ReFit.
8. Authorize the EUR 2 Orbiters request fee.

The card authorization is captured only when a creator accepts. Cancelling the
request or reaching the deadline without an acceptance releases the authorization.
Card authorization windows are temporary, so the complete request window cannot
exceed six days and may be shortened to the card network's actual capture deadline.

The creator's own commission price is not charged by this request. Arrange that
price and payment directly with the creator after acceptance.

<audience include="creator, admin, dev">

On development deployments only, the Creator **Commissions** tab includes **Create
a ReFit request**. It creates a dummy request addressed to the signed-in creator,
opens the real payment checkout, and returns to the normal request status page. Use
it to test the website workflow before a Unity handoff is available. The button and
its backend endpoint are unavailable on production deployments.

</audience>

## What Happens Next

In preference-order mode, Orbiters asks one creator at a time. Declining or reaching
that creator's response deadline activates the next creator. In first-acceptance
mode, every selected creator receives the request at once and the first acceptance
wins atomically.

Before acceptance, creators see that a ReFit commission is available and its
response deadline, but not the client identity or technical asset context. Acceptance
captures the EUR 2 request fee, reveals the ReFit context and the client's existing
Orbiters profile to the accepting creator, and cancels the remaining offers.

The client receives an Orbiters notification, a push notification when enabled, and
a Discord direct message when Orbiters can reach the linked Discord account. The
acceptance page links to the creator's public profile and contact links.

## Track Your Commissions

Open **My Account > My commissions** to see every active request and accepted job.
Completed, cancelled, expired, and failed requests remain in **Past commissions**.
The avatar account menu also lists all active commissions above notifications, with
the asset name, creator avatar/name, and a progress bar. Select an entry to open its
status page. **My Account** and **Log out** stay above the scrollable lists; the
notification preview retains its own link to the full inbox.

Progress represents workflow milestones, not elapsed time or a delivery estimate:
payment authorization, waiting for a creator, acceptance, work in progress, review,
and completion. After acceptance, the original commission Board column or delivery
status determines progress, with the proposal status used when there is no recognized
Board stage. **Active / In progress**, **Review / In review**, and
**Done / Completed / Delivered** advance the bar. Paused or deferred work stays in
the active list; rejected or cancelled work moves to history. Unrecognized custom
stages stay at the accepted milestone instead of guessing completion.

Lists refresh every 30 seconds while displayed and when the browser regains focus.
The account tab also has a **Refresh** button. The payment panel distinguishes an
authorization hold from **Paid** after the creator accepts and the fee is captured.

<audience include="admin, dev">

## Platform Payment Revenue

The designated website administrator and users with admin or owner rank see Stripe
platform payments in **Creator > Revenues**. Ordinary creators only see their own
store revenue; the platform's Stripe income is not included for them.

The chart and totals include all captured charges from the configured global Stripe
account in the selected date range, including existing ReFit EUR 2 fees and other
Stripe payments. Revenue is captured gross less refunds, before processing fees, and
is grouped by the original charge date. Refunds adjust that original payment rather
than creating a new entry on the refund date. Authorization holds and failed charges
are excluded. Currencies are kept separate; choose EUR to inspect ReFit fees.

Sandbox credentials display **Sandbox (test money)**. Only the account and test/live
mode selected by the deployment's global credential are included. Data is fetched
from Stripe when loading or refreshing Revenues, without requiring a webhook replay
or adding duplicate local fee records. If Stripe is unavailable, an explicit warning
says that totals currently exclude Stripe while store history remains available.

</audience>

## Creator Setup

1. Open **Creator > Commissions**.
2. Enable **Accept ReFit commissions**.
3. Enter a typical minimum and maximum price shown to users.
4. Optionally choose the Board and column where accepted work should appear.
5. Save the settings.
6. Open **Creator > Requests** to accept or decline active offers.

If no default Board destination is configured, choose a Board and column while
accepting. Orbiters creates a private proposal there after the payment capture. If
payment capture fails, the details remain private and the request is closed as a
payment failure.

Creators do not connect a payment account for this workflow. Orbiters processes the
EUR 2 website request fee through the administrator's platform payment account.
The creator's own commission price and payment remain a direct arrangement with the
client. If platform payments are unavailable, the Commissions tab disables new
listings and shows a generic payment-setup notice.

<audience include="dev">

The Unity handoff expires after ten minutes and stores only a SHA-256 token hash.
Creator offers and request acceptance use row locks. The selected Board placement is
persisted before Stripe capture so a retry or scheduler recovery can finish proposal
creation without charging twice.

</audience>
