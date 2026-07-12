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
lastVerified: 2026-07-12
---

# Store Provider Reference

Store providers normalize external store behavior into one Orbiters integration model.

## Providers

| Provider | Main credential | Product sync | License check | Webhooks |
|---|---|---:|---:|---:|
| Gumroad | Access token | yes | yes | yes |
| Jinxxy | Creator API key | yes | yes | account-dependent |
| Payhip | Product secrets JSON | manual JSON | yes | limited |
| Lemon Squeezy | API key | yes | yes | yes |

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
