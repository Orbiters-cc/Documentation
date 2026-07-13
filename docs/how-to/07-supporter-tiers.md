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
lastVerified: 2026-07-13
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

## Synchronize Patreon

1. Open **Creator > Integrations** and connect Patreon with OAuth or a creator
   access token.
2. Open **Creator > Supporters**.
3. Select **Sync Patreon**.
4. Review the number of active members, matched Orbiters accounts, ambiguous email
   matches, and enabled statuses.
5. Keep Orbiters-only benefits such as discounts and Discord granting roles on the
   synchronized tier, then test one matched supporter account.

Orbiters links a Patreon tier to an existing unsynchronized tier with the same name
when possible. Otherwise it creates a tier. Patreon remains authoritative for the
tier title, description, published order, amount, and active membership. Orbiters
remains authoritative for asset access, discount percentage, and Discord role
configuration.

Members match an Orbiters account by normalized account email or a previously
known store email. Orbiters skips missing and ambiguous matches instead of granting
access to the wrong account. Patreon member webhooks schedule the same
reconciliation, while the manual button remains available for recovery and audit.

## Scope Limits

Supporter-tier access grants public access only. It does not grant beta or alpha access.

<audience include="dev">

`accessPolicyService.findTierAccess` checks active `SupporterStatus` rows for tiers linked through `AssetTierAccess`, then returns public access when the requested scope is `public`. Discord-derived, manual, and Patreon-derived statuses have separate types so one synchronization source cannot disable another.

</audience>
