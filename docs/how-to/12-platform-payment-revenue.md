---
title: Understand Platform Payment Revenue
section: Creator Tools
order: 48
audience: admin, dev
stage: stable
id: orbiters.how-to.platform-payment-revenue
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-05
---

# Platform Payment Revenue

The designated website administrator and users with admin or owner rank see Stripe
platform payments in **Creator > Revenues**. Ordinary creators only see their own
store revenue and their own recorded external commission payments; the platform's
Stripe income is not included for them. See
[recording commission payments](/documentation/orbiters.how-to.manage-commission-workspace#record-your-price-and-payment).

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
