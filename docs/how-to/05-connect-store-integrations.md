---
title: Connect Store Integrations
section: Creator Tools
order: 41
audience: creator, admin, dev
stage: stable
id: orbiters.how-to.connect-store-integrations
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-07-14
---

# Connect Store Integrations

Store integrations let creators connect outside stores to Orbiters. Orbiters can import products, verify license keys, mirror sales, and receive sale or license events where the provider supports it.

## Supported Providers

- **Gumroad**: OAuth or access-token connection, product sync, license verification,
  sale webhooks, and sales backfill.
- **Jinxxy**: Creator API key connection, product sync, license lookup, license
  backfill, and webhook support when available.
- **Payhip**: license verification through creator-provided product secret keys.
- **Lemon Squeezy**: product sync, license validation, webhook signing, and order
  revenue backfill.
- **Patreon**: OAuth or access-token connection, membership webhooks, and supporter
  tier/member synchronization.
- **Ko-fi**: official webhook ingestion for donations, memberships, commissions,
  and shop orders, including shop-item direct-link codes.
- **PayPal**: REST application connection and positive balance-affecting transaction
  history for the Revenues tab.

## Connect A Store

1. Open **Creator**.
2. Open **Integrations**.
3. Choose the store provider.
4. Choose **Connect** when OAuth is available, or enter provider credentials when
   you prefer a manual token or the provider has no account authorization flow.
5. Save the integration.
6. Run a sync if the first sync does not start automatically.
7. Link imported products to Orbiters assets.

## Provider Credentials

### Gumroad

Use a Gumroad access token. Orbiters can import products and register sale webhooks.
When the administrator has configured the Gumroad OAuth application, **Connect
Gumroad** grants the same creator-owned access without manually copying the token.

### Jinxxy

Use a Jinxxy Creator API key with `orders_read`. Orbiters uses paid Orders and their
`payout_total` values for revenue history. Enter a webhook signing secret if Jinxxy
provides one for your account.

### Payhip

Payhip license checks are product-secret based. Enter product data as JSON:

```json
[
  {
    "productKey": "example-product",
    "productSecretKey": "example-secret",
    "name": "Avatar Pack",
    "url": "https://payhip.com/b/example"
  }
]
```

### Lemon Squeezy

Use a Lemon Squeezy API key. Store ID and webhook signing secret are optional. If no store ID is entered, Orbiters uses the first store returned by Lemon Squeezy.

### Patreon

Use **Connect Patreon** when the administrator has configured the Patreon OAuth
application. The authorization requests identity, campaign, member email, and
campaign-webhook permissions. A creator access token remains available as a manual
alternative: choose **Use API key instead** and enter the creator access token plus
the optional refresh token shown in Patreon Clients & API Keys. Those account tokens
do not belong in the administrator's global Patreon OAuth application credential.
After connection, open **Creator > Supporters** and select **Sync Patreon** to
reconcile published tiers and active members. Orbiters resolves the singular
`campaign` resource returned by Patreon API v2 and never substitutes the user ID for
a missing campaign ID.

### Ko-fi

Copy the Orbiters webhook URL into Ko-fi's official webhook settings and save the
Ko-fi verification token in the integration. Orbiters reads the official payload,
including `shop_items[].direct_link_code`. Ko-fi does not provide an OAuth account
connection or a supported historical-sales listing API. For older history, export
the payment-history CSV from Ko-fi's **Payments & Orders** area, then open **Creator
> Revenues** and choose **Import Ko-fi CSV**. Orbiters reconciles matching CSV and
webhook transactions instead of counting both, skips failed or pending rows, and
does not retain the uploaded CSV. Imports are limited to 5 MB. Orbiters does not
send creator or customer data to third-party Ko-fi scraping or cache services.
The current Ko-fi `Transaction_All.csv` export is recognized through its
`DateTime (UTC)`, `Received`, `Currency`, `TransactionType`, `TransactionId`, and
`BuyerEmail` headers.

### PayPal

1. Open [PayPal Apps & Credentials](https://developer.paypal.com/dashboard/applications/live)
   and select **Live** for real revenue or **Sandbox** while testing.
2. Create a REST application for Orbiters. PayPal may require the live account to
   request or enable Transaction Search before live reporting is available.
3. Copy the client ID and secret, then open **Creator > Integrations**, choose
   **PayPal**, select the matching environment, and validate the connection.
4. Open **Creator > Revenues** and choose **Sync PayPal**. Orbiters pages through
   PayPal Transaction Search in windows accepted by the API and stores only
   normalized incoming, balance-affecting transactions.

The client secret belongs to the creator account and is encrypted through the same
API-key storage used by other manual integrations. Orbiters does not present this as
a generic OAuth button: PayPal's third-party seller onboarding is a separate partner
capability and is not required for a creator to read their own REST application data.

## Refresh Revenue History

Open **Creator > Revenues**. Use the provider sync buttons to refresh historical
sales for Gumroad, Jinxxy, Lemon Squeezy, and PayPal. A manual sync performs a full-history
reconciliation so older rows gain missing amount and date data; scheduled background
sync remains incremental. Patreon relies on signed webhooks. Ko-fi combines verified
webhooks with the optional historical CSV import described above. The graph keeps
currencies separate, stacks revenue by original provider, and reports legacy sale
rows whose amount is unknown.

Use **Deduplicate PayPal transfers** when shop or Ko-fi payments also appear in
PayPal. Orbiters matches one payment to at most one PayPal row using exact amount and
currency, a 15-minute window, and matching buyer email when both providers supply
one. It keeps the original shop or Ko-fi source for attribution and excludes the
matching PayPal pass-through from totals. The toggle is reversible and the UI shows
how many likely duplicates were found.

Choose a 30-day, 90-day, one-year, or five-year preset, or enter exact start and end
dates. The chart automatically uses daily, weekly, or monthly buckets appropriate
for the selected range. Provider areas are cumulative. Use **Curve smoothing** to
apply a trailing 3-, 7-, 14-, or 30-bucket moving average when a noisy history is
hard to read. Smoothing is visual only and does not change the revenue total.

When forecasting a Board, **Gain continuity** projects USD store revenue from the
last 180 days and adds it to the forecast for the selected ideas. The chart keeps
the two forecast areas separate and stacked, and labels the summary as the combined
forecast. Turning continuity on never removes the selected-idea projection.

## Integration Status

- `ACTIVE`: usable by sync, redemption, and webhook flows.
- `NEEDS_KEY`: no active creator credential resolved, or the provider rejected credentials.
- `ERROR`: the integration hit an error that needs attention or background retry.
- `DISABLED`: not used by runtime flows.

<audience include="dev">

Integrations store no foreign key to API key rows. Credentials are resolved at call time through `apiCredentialService` by `(type, ownerId)`. Key rotation should not break an integration; missing keys move the integration to `NEEDS_KEY`.

</audience>
