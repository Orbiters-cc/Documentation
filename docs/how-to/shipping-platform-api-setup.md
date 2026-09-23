---
title: Connect shipping estimates for France and Europe
section: How-to
order: 265
audience: admin, creator, dev
stage: beta
id: orbiters.shipping.platform-api-setup
domain: website
type: how-to
owner: orbiters-platform
lastVerified: 2026-09-23
---

# Connect shipping estimates for France and Europe

Start with Sendcloud if you want a dashboard-generated key pair for European
shipping. Easyship is another token-based option, but its live Rates API can incur
per-call charges. Neither setup requires building a UPS or FedEx OAuth application.
Provider verification, enabled carriers and supported origins still determine
which quotes an account can return.

These integrations show **platform shipping estimates**. They are prices for the
connected account, not public carrier tariffs. A creator must confirm they can
book that platform price before agreeing delivery costs with the customer.

| Option | Credentials | Cost and access considerations |
| --- | --- | --- |
| Sendcloud | Public and Secret API keys | Free account/API access is listed in its plans. Activate carriers and complete account setup; billing or verification can still be required. Quotes may exclude VAT and later surcharges. |
| Easyship | Production token with `public.rate:read` | Token creation is self-service. Rates is an advanced endpoint: its Free plan uses pay-as-you-go API billing. Check the account's current allocation and fees before connecting. |

## Sendcloud: create the key pair

1. Create a Sendcloud account for your actual origin country. Add a sender address
   and enable the carriers you want to compare.
2. Open **Settings > Integrations**, find **Sendcloud API**, then choose **Connect**.
3. Name the integration **Orbiters**, save it, and copy the **Public** and **Secret**
   keys. Keep the secret private.
4. In **Admin > API Keys**, add **Sendcloud platform shipping estimates**. Paste the
   values into `SENDCLOUD_PUBLIC_KEY` and `SENDCLOUD_SECRET_KEY`, and save globally
   for the website environment.

Follow the [official key setup guide](https://support.sendcloud.com/hc/en-us/articles/360024967012-Sendcloud-API-documentation-and-Quick-Start-Guide)
if dashboard wording changes. Check [Sendcloud pricing](https://www.sendcloud.com/pricing/)
for your region. Orbiters requests home-delivery options only; it does not select
pickup points, create shipments or purchase labels.

## Easyship: create a production token

1. Create an Easyship account for your actual origin country.
2. Open **APIs & Webhooks > Create API Connection** (or **Add API Connection**), name
   it **Orbiters**, and connect.
3. Select the **2024-09** API and enable the advanced **`public.rate:read`** scope.
4. Check **Subscription > API usage** and current pricing before enabling live use.
   A free signup does not mean free rate requests.
5. Copy the **Production** token beginning `prod_`. In **Admin > API Keys**, add
   **Easyship platform shipping estimates**, paste it into `EASYSHIP_API_TOKEN`,
   and save globally for this environment. Sandbox tokens beginning `sand_` cannot
   generate customer estimates.

Use the [official authentication guide](https://developers.easyship.com/reference/authentication)
and [API billing explanation](https://support.easyship.com/hc/en-us/articles/34766246620562-API-Usage-Billing).
Orbiters requests postage estimates with explicit metric dimensions, no customs
value invented, and tax/duty calculation disabled. Responses include the provider's
total quoted fees; import taxes/duties and later adjustments remain outside the estimate.

## Check the customer experience

Save a real shipping origin and typical parcel under **Creator > Preferences >
Shipping**. Enter a delivery address on a sticker request and choose **Get delivery
estimates**. Editing the address clears the old quote; another click recalculates.
This avoids repeated provider requests while the customer is typing.

Public carrier estimates and platform estimates appear in separate sections.
Different platform accounts, services and currencies are never blended. The
platform name and booking/VAT caveats remain on the receipt and saved request.
Selection does not buy postage or add delivery to the printing total.

If one provider fails, successful results remain available. If there are no rates,
check the account's origin coverage, enabled carriers, address/state fields,
production key and billing permissions. Missing rates are never treated as free
shipping. Existing EasyPost, UPS and FedEx connections remain usable independently.

See [API keys and credentials](../reference/04-api-keys-and-credentials.md) for
environment scopes and [Order and fulfill stickers](26-order-and-fulfill-stickers.md)
for quote expiry and customer request handling.
