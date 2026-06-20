---
title: Redeem a License Key
section: How To
order: 30
audience: public, user
stage: stable
---

# Redeem a License Key

License redemption links an outside store purchase to your Orbiters account.

## Redeem

1. Log in with Discord.
2. Open the asset page.
3. Enter the license key exactly as provided by the store.
4. Submit the form.
5. If prompted, pick the creator who sold the asset.

## Why Orbiters Might Ask For The Creator

Orbiters keeps one license input field, even though creators can connect their own stores. To avoid sending too many requests to outside providers, Orbiters searches under a fixed request budget. When too many creator stores remain untried, the website asks for a creator hint and retries the search in that creator's integrations.

## Access After Redemption

After a successful redemption:

- the asset appears as owned by your account,
- the provider and store integration are recorded,
- public downloads or install tools become available,
- alpha or beta access appears only if the owner granted that scope,
- related Discord role changes are queued when configured.

## Refunds And Revocations

If a connected store sends a refund, chargeback, or license-disabled event that Orbiters can match to your redeemed license, the user asset is disabled. If the asset granted a Discord role, Orbiters queues a role removal.

<audience include="dev">

The access decision is centralized in `accessPolicyService.canUserAccessAsset`. Do not duplicate redemption, enabled-state, scope, and supporter-tier checks inside individual routes.

</audience>

