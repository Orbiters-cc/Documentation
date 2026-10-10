---
title: Store Provider Reference
section: Reference
order: 72
audience: creator, admin, dev
stage: stable
id: orbiters.reference.store-providers
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-10-09
---

# Store Provider Reference

Store providers normalize external store behavior into one Orbiters integration model.

## Providers

| Provider | Connection | Product sync | License check | Historical revenue | Webhooks |
|---|---|---:|---:|---:|---:|
| Gumroad | OAuth or access token | yes | yes | yes | yes |
| Jinxxy | Creator API key | yes | yes | partial amounts | account-dependent |
| Payhip | Product secrets JSON | manual JSON | yes | no | limited |
| Lemon Squeezy | API key | yes | yes | yes, from orders | yes |
| Patreon | OAuth or access token | membership tiers | no | webhook history | yes |
| Ko-fi | verification token | shop event metadata | no | webhook history | yes |
| PayPal | REST app client ID and secret | no | no | Transaction Search | no |
| Booth | public shop URL | linked items, public item JSON | order number + order date | order CSV import | no |

Historical revenue stores normalized minor-unit amounts plus the original currency.
Never sum unlike currencies. A mirrored sale without a provider-confirmed amount is
an unknown amount, not zero revenue. Gumroad, Jinxxy, and Lemon Squeezy expose a
manual backfill action; PayPal uses the same action for positive balance-affecting
transactions. The Jinxxy API does not provide a dependable amount for all license
records, so its coverage can remain partial.

PayPal can be the payment rail behind another provider. Optional revenue
deduplication uses one-to-one matches on exact amount and currency within 15 minutes.
When both rows contain buyer email, the emails must match. Orbiters retains the
original provider row for source attribution and removes only the matched PayPal
pass-through from calculated totals.

## Booth

Booth (pixiv) has no seller API, no webhooks and no license keys. Orbiters never asks
for a Booth password or session cookie and never reads the seller management site.

- **Connection**: the public shop address, `https://<shop>.booth.pm`. The subdomain is
  the shop identity; items of other shops are refused.
- **Items**: `https://<shop>.booth.pm/items/<id>`, `https://booth.pm/<lang>/items/<id>`
  or the bare item id. Orbiters reads the public `https://booth.pm/ja/items/<id>.json`
  for name, description, pictures, variations and the lowest purchasable yen price
  (JPY has no minor unit). Reads go through one queue (one request every 1.5 s), a
  10-minute cache and a 10-second timeout; a background sync skips items read in the
  last day, a manual **Sync** reads every linked item again. Booth cannot list a
  shop, so items are added one by one.
- **Sales**: the creator uploads a Booth CSV. Both downloads are recognized: the
  Orders CSV (宛名印刷用, one row per order, items in the
  `商品ID / 数量 / 商品名` cell, one line per item; also the unshipped-orders variant
  with `フォーマット番号`) and the Sales CSV (売上管理, one row per variation,
  order-level cells on each order's first row, at most 31 days per download). UTF-8
  with BOM and Shift_JIS files re-saved by Excel are both read; English seller
  headers (`Order number`, `Item ID / Quantity / Item name`) are accepted as well.
- **Statuses**: 支払済み and 発送済み are paid, 支払待ち is unpaid, キャンセル is a
  cancellation. Without a status column the payment time decides.

| Stored per order item | Source column |
|---|---|
| Sale id `<order number>:<item id>` | 注文番号, 商品ID |
| Sale time (Japan time converted to UTC) and Japan-time order date | 注文日時 |
| Payment time, payment method, raw status | 支払い日時, お支払方法, 注文状況 |
| Buyer code (pseudonymous) | ユーザー識別コード |
| Quantity, item name, variations | 数量 / 商品名, バリエーション名 |
| Amount in JPY | Sales CSV 小計; Orders CSV 合計金額 on the order's first item |

Names, addresses and phone numbers in the file are never read, and the file is not
kept. Imports are idempotent: a re-import updates known rows and adds new orders, a
Sales CSV refines item amounts that a later Orders CSV never overwrites, and an
order that becomes キャンセル disables the Booth access it granted and queues the
Discord role removal. A cancellation stays final.

**Redemption** needs the order number and the Japan-time order date held by the
imported row. Unknown numbers and wrong dates get the same answer, so a valid number
is never confirmed without its date. The first account to redeem an order claims
every row of it; redeeming again from that account is harmless and adds items the
creator linked since. Assets the buyer already has through another source keep that
source. Five failed pairs lock an account for an hour (twenty per network address).

## Product Links

`AssetStoreLinks` connect an Orbiters asset to a provider product ID for a specific store integration. They are the canonical mapping for redemption and purchase links.

## License Resolution Order

Orbiters tries to resolve a license key in this order:

1. Local mirrored sale lookup by license hash.
2. Targeted confirmation against the matched integration.
3. Provider format routing when the key format is recognizable.
4. Popularity-ordered live probing under a fixed request budget.
5. Creator hint prompt when too many integrations remain untried.

Booth never takes part in license resolution: it has no keys. Its orders are
redeemed through `POST /booth/redeem` instead.

## Credential Rotation

Creators can rotate API keys without recreating integrations. Integrations resolve the active key by provider type and owner at runtime.

<audience include="dev">

Providers live under `backend/src/services/store/providers`. Each provider exposes normalized methods for account lookup, product sync, sale backfill, license probing, use counting when supported, webhook registration, signature validation, and webhook parsing.

Booth endpoints: `POST /creator/integrations/stores/:id/booth-csv` (multipart `file`,
10 MB), `POST /creator/integrations/stores/:id/booth-items` (`{ url, assetId? }`),
and `POST /booth/redeem` (`{ orderNumber, orderDate, assetId? }`; `assetId` scopes the
lookup to that asset's creator and enables the "not imported yet" answer). Parsing
lives in `boothCsv.js` and `boothCsvSales.js`, the item reader in `boothClient.js`,
redemption in `boothRedemptionService.js`. The order claim is
`StoreSale.metadata.redeemedByUserId` on every row of the order, written under a row
lock. Integration coverage is `StoreIntegration.metadata.salesImport`.

</audience>
