---
title: License Resolution
section: Explanation
order: 81
audience: creator, admin, dev
stage: stable
---

# License Resolution

License resolution turns a pasted store key into an Orbiters asset access record.

## Why It Is Budgeted

Orbiters supports many creators and many store accounts. A single redemption attempt cannot safely call every connected store. The resolver uses local data first, then provider hints, then a fixed live request budget.

## Flow

1. Hash the typed license and search mirrored `StoreSales`.
2. If a sale matches, confirm it with that integration.
3. Sort active integrations by provider key format and redemption popularity.
4. Probe providers until the key matches or the request budget is exhausted.
5. If the budget is exhausted, ask the user to pick a creator and retry within that creator's integrations.

## Success

When resolution succeeds, Orbiters creates or updates a user asset, records the store integration, and may count provider use when supported.

## Failure

Resolution can fail because:

- the key is invalid,
- the provider API rejected credentials,
- the product is not linked to an asset,
- the key belongs to an unsupported provider,
- too many stores remain untried and the user has not chosen a creator.

<audience include="dev">

The hard live request budget is defined in `licenseResolutionService`. Keep provider probes deterministic in tests and stub remote clients.

</audience>

