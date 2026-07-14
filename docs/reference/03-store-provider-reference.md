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
lastVerified: 2026-07-14
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

## Product Links

`AssetStoreLinks` connect an Orbiters asset to a provider product ID for a specific store integration. They are the canonical mapping for redemption and purchase links.

## License Resolution Order

Orbiters tries to resolve a license key in this order:

1. Local mirrored sale lookup by license hash.
2. Targeted confirmation against the matched integration.
3. Provider format routing when the key format is recognizable.
4. Popularity-ordered live probing under a fixed request budget.
5. Creator hint prompt when too many integrations remain untried.

## Credential Rotation

Creators can rotate API keys without recreating integrations. Integrations resolve the active key by provider type and owner at runtime.

<audience include="dev">

Providers live under `backend/src/services/store/providers`. Each provider exposes normalized methods for account lookup, product sync, sale backfill, license probing, use counting when supported, webhook registration, signature validation, and webhook parsing.

</audience>
