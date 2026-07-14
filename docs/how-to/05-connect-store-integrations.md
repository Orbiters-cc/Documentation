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
lastVerified: 2026-07-13
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

## Refresh Revenue History

Open **Creator > Revenues**. Use the provider sync buttons to refresh historical
sales for Gumroad, Jinxxy, and Lemon Squeezy. A manual sync performs a full-history
reconciliation so older rows gain missing amount and date data; scheduled background
sync remains incremental. Patreon relies on signed webhooks. Ko-fi combines verified
webhooks with the optional historical CSV import described above. The graph keeps
currencies separate and reports legacy sale rows whose amount is unknown.

## Integration Status

- `ACTIVE`: usable by sync, redemption, and webhook flows.
- `NEEDS_KEY`: no active creator credential resolved, or the provider rejected credentials.
- `ERROR`: the integration hit an error that needs attention or background retry.
- `DISABLED`: not used by runtime flows.

<audience include="dev">

Integrations store no foreign key to API key rows. Credentials are resolved at call time through `apiCredentialService` by `(type, ownerId)`. Key rotation should not break an integration; missing keys move the integration to `NEEDS_KEY`.

</audience>
