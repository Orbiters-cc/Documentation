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
lastVerified: 2026-10-20
---

# Supporter Tiers

A supporter joins your community for a month. You want them to try selected public releases while their membership is active. That is a different promise from selling them a permanent copy.


Supporter tiers let creators grant public asset access while a user's tier status is active.

## When To Use Supporter Tiers

Use supporter tiers when access should follow a membership-style relationship instead of a permanent store license redemption.

Good use cases:

- public versions available to current supporters,
- time-limited community perks,
- creator-managed rewards across several assets.

Avoid supporter tiers when a user should permanently own an asset after purchase. Use store redemption for that.

## The Supporters tab

Open **Creator > Audience > Supporters**. The top of the tab shows your totals
(supporters, tiers, assets unlocked, and monthly pledges for Patreon or Fourthwall
tiers, otherwise linked Discord roles) and one pill per supporter source: Discord,
Patreon, Ko-fi and Fourthwall. A dimmed pill is not connected; select any pill to
manage it in **Connections**.

Below, the tier list sits beside the editor of the selected tier. The list shows tiers
in the order supporters see them. To reorder, drag a tier by its handle, or focus the
handle and use the up and down arrow keys.

With no tier yet, the tab offers **Create your first tier**, and **Import from Patreon**
when Patreon is connected.

## Configure Tier Access

1. Select **Add tier**, or select an existing tier in the list.
2. Type the tier name in the editor title and add a description.
3. Choose the **Asset discount**: **None**, 10, 25 or 50%, or type a custom percentage.
4. Under **Discord roles that grant this tier**, search your server roles and pick
   one or more. Remove a role with the cross on its chip.
5. Check the preview, **What supporters of this tier get**, which follows your edits:
   name, price, description, discount, Discord roles and unlocked assets.
6. Select **Save changes** in the floating save bar. It saves every edited tier and
   the new order at once; **Discard** reverts them. A tier without a name cannot be
   saved.
7. To unlock an asset for a tier, open the asset's **Access** tab and choose
   **Add a supporter tier**. The tier editor then lists it under **Assets this tier
   unlocks**, next to the members who hold the tier.
8. Test the asset page with a user in the tier.

Deleting a tier (trash button next to its name) removes the tier and its discount.
Supporters keep their Discord roles.

## Synchronize Patreon

1. Open **Creator > Connections** and connect Patreon with OAuth or a creator
   access token.
2. Open **Creator > Audience > Supporters**. The Patreon pill shows as connected.
3. Select **Sync Patreon** (or **Import from Patreon** when you have no tier yet).
   The button appears only while Patreon is connected. Unsaved tier edits are
   discarded first, after a confirmation.
4. Review the number of Patreon members matched to your tiers.
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

## The reward you meant to offer

Imagine your “Studio visitors” tier includes Moon Jacket. Linking the asset gives active, matched supporters public access. It does not silently add them to your beta test group. Name the benefit accordingly: “public releases while your membership is active” is clearer than “full access.”

Keep permanent purchases separate. A supporter who also owns the item can have another valid access source; membership ending is not proof that every kind of access should disappear.

## Scope Limits

Supporter-tier access grants public access only. It does not grant beta or alpha access.

<audience include="dev">

`accessPolicyService.findTierAccess` checks active `SupporterStatus` rows for tiers linked through `AssetTierAccess`, then returns public access when the requested scope is `public`. Discord-derived, manual, and Patreon-derived statuses have separate types so one synchronization source cannot disable another.

</audience>