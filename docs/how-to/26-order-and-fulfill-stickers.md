---
title: Order and fulfill custom stickers
section: Commissions
order: 63
audience: public
stage: beta
id: orbiters.how-to.order-and-fulfill-stickers
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-23
---

# Order and fulfill custom stickers

This workflow is prepared for the next release. A creator must publish a sticker printing service before it can receive requests.

## Prepare your order

1. Open the sticker asset and choose a printing option: finished size, quantity, number of designs, thickness and finish. The price and remaining order capacity belong to that option.
2. Upload each design, including PNG artwork with a transparent background. Allocate the printed quantity across the required designs.
3. Set the white border width in millimeters. The preview follows the opaque outline and preserves the artwork's proportions.
4. Drag the unframed 3D preview to inspect the finish, or use arrow keys and zoom. Glossy, matte, broken-glass holographic, starry holographic and glitter finishes have approximate material previews.
5. Enter a delivery address to see available carrier estimates, then choose a service if one is offered. Check the creator's delivery terms, the printing total and any separate request fee. Shipping is arranged and paid directly with the creator; the quoted range is not a checkout charge.
6. Use **Send request** in the upper-right corner of **Make your stickers** after reviewing the terms.

The finished size includes the border along the artwork's longest dimension. Generated print PNGs target 300 DPI. A warning identifies artwork with insufficient source resolution; enlarging it cannot restore missing detail. The creator's print proof confirms the result before production.

The request keeps the original images, generated bordered images, quantities, chosen material and border width together. You do not need to email designs separately.

## Follow the request

Find it in your account's commissions area. If a request fee is enabled, complete its secure checkout. The fee is authorized first and captured when the creator accepts; it is separate from the printing price paid to the creator under their saved terms.

Before acceptance you can cancel. Declined or expired requests release any remaining authorization. Requests normally expire after three days; checkout expires earlier. If a payment result is still being checked, wait for the request to update rather than submitting another order.

Use the request's messages for details. After acceptance, inspect the creator's proof and either approve it or request changes. The creator records receipt of their payment before printing, then adds shipping or collection information. Confirm completion when the order arrives.

<audience include="creator, admin, dev">

## Offer printing

Choose **Creator → Assets → + Create → Stickers**. Save your seller information and terms, then define material, shipping, turnaround and printing choices. Each choice has its own price, order capacity, dimensions, finish, total sticker quantity and number of designs, up to 20. Leave capacity empty for unlimited availability.

For each printing choice, optionally use its **Sample sticker artwork** file field. This is separate from the AutoFill files. Published sample images appear in a 3D carousel between the asset banner and description, with the selected printing's finish and dimensions. Only samples attached to a published printing become public; draft images remain private.

When a published sticker asset has samples, **Sticker samples** is also available as a homepage widget. It shows one to three gently moving 3D samples according to widget size and links directly to the asset. Offscreen widgets stop rendering until visible again; reduced-motion settings keep the samples still.

Open **Creator → Preferences → Shipping** to save the sender address and typical packed parcel weight and dimensions. The sender address is private; it is sent to the configured carrier quote provider when a customer requests rates, but is not returned to the customer. Changing the origin or parcel invalidates outstanding quotes. A request with a selected carrier shows the customer's delivery address, service and saved cost range in **Creator → Requests**. Confirm actual postage with the customer before buying a label.

Carrier estimates require a live EasyPost production API key configured as `EASYPOST_API_KEY` on the backend. The application shows retail counter rates when returned, otherwise published list rates; it never uses the potentially discounted purchase rate as the displayed estimate. Each displayed range starts at that rate and adds a 15% upper buffer for the typical parcel. Test-mode rates, missing credentials, unavailable routes and carrier errors show an unavailable state rather than a made-up price. Quotes expire after 30 minutes and must match the customer's address and the current creator shipping profile.

**Total printed copies** is the complete order quantity, not copies per design.
For example, 50 copies can be shared across 5 **Different designs**. Every design
needs at least one copy, so 1 copy across 7 designs is invalid. The form identifies
this disagreement without changing either number. Incomplete choices can still be
saved in a private draft; publishing requires valid choices.

Review incoming orders in the sticker inbox under **Creator → Requests**. Download the print pack to receive original artwork, bordered PNGs, proofs and an order manifest. Existing orders retain their accepted configuration if you later change or delete the listing.

The website administrator controls sticker availability and the separate acceptance fee under **Admin → Features → Stickers**. Disabling the fee affects new requests; existing payment terms remain fixed.

</audience>

Related: [Set your seller terms](16-set-seller-terms.md), [Create, publish and measure an asset](24-create-and-measure-assets.md).

## Compare materials and check every design

When creating a printing choice, select a sample in the **Choose your finish**
grid. Glossy, matte, broken-glass holo, starry holo and glitter each have a 3D
preview. Drag or use arrow keys on one preview to rotate all the samples together;
zoom is shared too. **Reset views** restores the same starting angle. The samples
illustrate the material rather than guaranteeing the physical print's appearance.

When ordering, use the design thumbnails or previous/next controls to inspect each
uploaded design. Changing the selected design changes the bordered 3D preview.
The receipt separates printing choices, the printing total and any Orbiters request
fee; any chosen carrier range is shown separately. Shipping remains governed by the creator's delivery terms.

Creators can use **See as normal user** to send themselves a test order. Test
orders charge no fee, consume no printing capacity and cannot record real payment.
The creator can simulate the payment step to continue through production.
