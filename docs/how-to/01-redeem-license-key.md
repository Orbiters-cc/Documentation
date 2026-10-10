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
lastVerified: 2026-10-09
---

# Turn a purchase into Orbiters access

Have the license key from your store receipt ready. Redeeming it attaches the supported purchase to the Orbiters account you are currently using.

## Redeem the key

1. Sign in to the account that should receive access.
2. Open the asset page and enter the key exactly as the store supplied it.
3. Submit once and read the result.
4. If Orbiters asks for the creator, choose the seller and retry.


## Redeem a Booth order

Booth (booth.pm) sends no license key. Use the order instead:

1. Open your [Booth order history](https://accounts.booth.pm/orders) and note the
   **order number** (注文番号) and **order date** (注文日時) of the purchase. Booth shows
   dates in Japan time; enter the date exactly as Booth shows it.
2. On the asset page choose **Bought it on Booth? Add your order**, or open **Assets**,
   choose **Add license key** and switch to **Booth order**.
3. Enter both values and choose **Add asset**. Every item of that order the creator
   sells on Orbiters is added.

The creator imports their Booth orders by hand, so a purchase made after their last
import cannot be redeemed yet; the result names the last imported day when you
redeem from the asset page. An order belongs to the first Orbiters account that
redeems it, an unpaid order waits until Booth shows it as paid, and a cancelled order
is refused. Five order number and date pairs that match no imported order lock
Booth redemption on your account for an hour.

## Know what success gives you

The asset appears as owned. Public versions become available; beta and alpha versions still need the corresponding access scope. A configured Discord role is delivered separately, so website access can succeed before the role appears.

| What you see | Next step |
| --- | --- |
| Creator selection requested | Choose the creator who sold the item |
| Key not resolved | Check the copied key, seller and supported store |
| Booth order not found | Check the order number and Japan-time date, or wait for the creator's next import |
| Booth order already redeemed | The order is bound to another Orbiters account; contact the creator |
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

For Gumroad purchases, the provider's [license-key help](https://gumroad.com/help/article/76-license-keys) explains its own key feature. Other stores have different purchase and key formats; an order ID is not a universal substitute. Booth is the exception described above: its order number counts only together with the order date, and only for orders the creator has imported.
