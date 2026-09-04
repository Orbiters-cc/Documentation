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
request or reaching the deadline without an acceptance queues an authorization release.
The payment panel shows **Release pending** until the payment provider confirms it.
If checkout preparation is interrupted, the request stays saved: open its status page
and use **Continue to payment** when checkout is ready. Retrying the same submission
does not create another commission.
Card authorization windows are temporary, so the complete request window cannot
exceed six days and may be shortened to the card network's actual capture deadline.

The creator's own commission price is not charged by this request. Arrange that
price and payment directly with the creator after acceptance.

<audience include="creator, admin, dev">

On development deployments only, the Creator **Commissions** tab includes **Create
a ReFit request**. It creates a dummy request addressed to the signed-in creator,
opens a Stripe **test-mode** checkout, and returns to the normal request status page. Use
it to test the website workflow before a Unity handoff is available. The button and
its backend endpoint are unavailable on production deployments. Live payment keys
cannot be used for this development shortcut. The server's deployment configuration,
not the browser hostname, controls availability.

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
The avatar account menu previews active commissions above notifications, with
the asset name, creator avatar/name, and a progress bar. Select an entry to open its
status page. **My Account** and **Log out** stay above the scrollable lists; the
notification preview retains its own link to the full inbox.

Progress represents workflow milestones, not elapsed time or a delivery estimate:
payment authorization, waiting for a creator, acceptance, work in progress, review,
and completion. After acceptance, the creator updates the delivery stage on the
commission page: **Start / resume work**, **Ready for review**, and **Mark completed**.
Board column names no longer change the customer's progress. Creators can post
notes without changing stage; the latest 50 updates, including earlier review and
delivery links, remain visible to the participants.

The account and menu share one active-list query. Lists load 20 entries at a time;
use **Load more** in the account tab to see additional work or history. The first
page refreshes every 30 seconds while visible and when the browser regains focus.
After loading additional pages, use **Refresh** to return to a fresh first page.
Commission names use the ReFit icon.
The detail page shows a non-clickable progress bar with the current workflow state;
the linked commission cards are used only in lists and the account menu. The payment panel distinguishes an
authorization hold from **Paid** after the creator accepts and the fee is captured.

<audience include="admin, dev">

## Platform Payment Revenue

The designated website administrator and users with admin or owner rank see Stripe
platform payments in **Creator > Revenues**. Ordinary creators only see their own
store revenue; the platform's Stripe income is not included for them.

The chart uses a synchronized platform payment ledger, including ReFit EUR 2 fees
and other Stripe payments. It includes payment, refund and dispute-adjustment
transactions before processing fees, grouped by each balance transaction's date
and settlement currency. Refunds and reversals have their own dates and signs;
payouts and account transfers are excluded. This is not a bank-payout statement.

Sandbox credentials display **Sandbox (test money)**. Only the account and test/live
mode selected by the deployment's global credential are included. History fills in
incrementally; a warning labels totals as partial until backfill finishes. Refresh
to see new entries and the last synchronization time. If synchronization fails,
previously synchronized entries remain visible with a warning. Amounts are normalized
for each currency, including zero-decimal currencies, before conversion.

### All Currencies Estimate

The revenue currency selector starts on **All (estimate)**, using your saved default
currency from **Account > Overview > Account Information** (EUR initially). It
converts each historical bucket and provider series using the latest available
reference rates, not historical payment-date rates. The USD-based forecast is also
converted to the same display currency. Individual currency options still show the
original amounts without conversion.

Rates come from [Frankfurter](https://frankfurter.dev/), which publishes daily
central-bank reference rates. The chart shows the publication date; this is an
estimate before conversion fees, not a live bank quote or accounting exchange rate.
The backend fetches a public EUR-based rate table without sending account details
or revenue amounts. It caches successful fetches for one hour and, on a provider
outage, may use a clearly labelled cached snapshot for at most seven days. If a
needed rate is missing or no usable snapshot exists, the combined estimate is
unavailable instead of showing a misleading partial total. Exact individual-currency
views remain available.

</audience>

## Creator Setup

1. Open **Creator > Commissions**.
2. Enable **Accept ReFit commissions**.
3. Enter a typical minimum and maximum price shown to users.
4. Optionally choose the Board and column where accepted work should appear.
5. Save the settings.
6. Open **Creator > Requests** to accept or decline active offers.

If no default Board destination is configured, choose a Board and column while
accepting. Orbiters creates a private proposal there after payment capture. Customers
use the participant-facing commission page, not the creator's private Board. Board
placement retries independently of payment capture. If a destination was removed,
the accepting creator can enter a replacement Board ID and column key on the request
page and select **Retry Board placement**. No second capture is made.

Creators do not connect a payment account for this workflow. Orbiters processes the
EUR 2 website request fee through the administrator's platform payment account.
The creator's own commission price and payment remain a direct arrangement with the
client. If platform payments are unavailable, the Commissions tab disables new
listings and shows a generic payment-setup notice.

<audience include="dev">

The Unity handoff expires after ten minutes and stores only a SHA-256 token hash.
Authenticated handoffs are bound to the issuing session's token version, so revocation
invalidates unused links. An account mismatch is rejected without switching the
browser's signed-in account. Unauthenticated handoffs transfer only a draft and
require the browser user to sign in.

Payment work is durably queued with the same transaction as the commission state
change. See [Commission Reliability](../reference/commission-reliability.md) for
states, recovery jobs, schema migration and deployment checks.

</audience>
