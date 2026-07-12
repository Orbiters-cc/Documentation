---
title: Supporter Tiers
section: Creator Tools
order: 43
audience: creator, admin, dev
stage: stable
id: orbiters.how-to.supporter-tiers
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-07-12
---

# Supporter Tiers

Supporter tiers let creators grant public asset access while a user's tier status is active.

## When To Use Supporter Tiers

Use supporter tiers when access should follow a membership-style relationship instead of a permanent store license redemption.

Good use cases:

- public versions available to current supporters,
- time-limited community perks,
- creator-managed rewards across several assets.

Avoid supporter tiers when a user should permanently own an asset after purchase. Use store redemption for that.

## Configure Tier Access

1. Open the creator supporter-tier tools.
2. Create or update tiers.
3. Link assets to the tiers that should grant public access.
4. Confirm that affected users have active supporter statuses.
5. Test the asset page with a user in the tier.

## Scope Limits

Supporter-tier access grants public access only. It does not grant beta or alpha access.

<audience include="dev">

`accessPolicyService.findTierAccess` checks active `SupporterStatus` rows for tiers linked through `AssetTierAccess`, then returns public access when the requested scope is `public`.

</audience>
