---
title: Turn a purchase into Orbiters access
section: How To
order: 30
audience: public, user
stage: stable
id: orbiters.how-to.redeem-license-key
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-06
---

# Turn a purchase into Orbiters access

Have the license key from your store receipt ready. Redeeming it attaches the supported purchase to the Orbiters account you are currently using.

## Redeem the key

1. Sign in to the account that should receive access.
2. Open the asset page and enter the key exactly as the store supplied it.
3. Submit once and read the result.
4. If Orbiters asks for the creator, choose the seller and retry.


## Know what success gives you

The asset appears as owned. Public versions become available; beta and alpha versions still need the corresponding access scope. A configured Discord role is delivered separately, so website access can succeed before the role appears.

| What you see | Next step |
| --- | --- |
| Creator selection requested | Choose the creator who sold the item |
| Key not resolved | Check the copied key, seller and supported store |
| Asset unlocked, Discord role missing | Check your Discord connection and server membership |
| A beta version remains locked | Check your granted scope |

## Why the creator question exists

Orbiters searches connected stores under a limited request budget. A creator hint directs that search to the right integrations. It is not a second purchase or a request for your store password.

Matched refunds, chargebacks or disabled-license events can withdraw access later. Role removal also checks whether another enabled asset still grants that role.

<audience include="dev">

Access decisions belong in `accessPolicyService.canUserAccessAsset`. Keep enabled-state, scope and supporter-tier rules centralized when adding a route. See [license resolution](/documentation/orbiters.explanation.license-resolution) for the provider lookup boundary.

</audience>

## Make an ambiguous result easier to solve

A buyer pastes a valid key while looking at the wrong creator's asset. Repeating the same paste supplies no new information. Matching the receipt's seller and product does.

When requesting help, describe the boundary: “The key was accepted, but the public download remains unavailable” is different from “The provider could not validate the key.” Keep the original wording of the result and the relevant asset link. A full key belongs in a private support exchange, not a public screenshot.

For Gumroad purchases, the provider's [license-key help](https://gumroad.com/help/article/76-license-keys) explains its own key feature. Other stores have different purchase and key formats; an order ID is not a universal substitute.
