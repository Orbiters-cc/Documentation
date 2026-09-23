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
3. Set the white border width in millimeters. The main gallery replaces the sample with your uploaded artwork, follows the opaque outline and preserves the artwork's proportions. Selecting another uploaded design updates that same preview; removing it restores the sample.
4. Drag the unframed 3D preview to inspect the finish, or use arrow keys. Scrolling over the preview scrolls the page. Glossy, matte, broken-glass holographic, starry holographic and glitter finishes have approximate material previews.
5. Enter a delivery address and choose **Get delivery estimates**, then select a service if one is offered. Platform prices are separate from public carrier prices; confirm that the creator can book the selected platform price. Check the creator's delivery terms, the printing total and any separate request fee. Shipping is arranged and paid directly with the creator; the quoted range is not a checkout charge.
6. Use **Send request** in the upper-right corner of **Make your stickers** after reviewing the terms.

The finished size includes the border along the artwork's longest dimension. Generated print PNGs target 300 DPI. A warning identifies artwork with insufficient source resolution; enlarging it cannot restore missing detail. The creator's print proof confirms the result before production.

The request keeps the original images, generated bordered images, quantities, chosen material and border width together. You do not need to email designs separately.

## Follow the request

Find it in your account's commissions area. If a request fee is enabled, complete its secure checkout. The fee is authorized first and captured when the creator accepts; it is separate from the printing price paid to the creator under their saved terms.

Before acceptance you can cancel. Declined or expired requests release any remaining authorization. Requests normally expire after three days; checkout expires earlier. If a payment result is still being checked, wait for the request to update rather than submitting another order.

Use the request's messages for details. After acceptance, inspect the creator's proof and either approve it or request changes. The creator records receipt of their payment before printing, then adds shipping or collection information. Confirm completion when the order arrives.

<audience include="creator, admin, dev">

## Offer printing

Choose **Creator â†’ Assets â†’ + Create â†’ Stickers**. Save your seller information and terms, then define material, shipping, turnaround and printing choices. Each choice has its own price, order capacity, dimensions, finish, total sticker quantity and number of designs, up to 20. Leave capacity empty for unlimited availability.

For each printing choice, optionally use its **Sample sticker artwork** file field. This is separate from the AutoFill files. The uploaded image replaces the default artwork in the finish previews while editing. After **Verify and post** or **Publish changes**, published samples appear in a 3D carousel between the asset banner and description, with the selected printing's finish and dimensions. Only samples attached to a published printing become public; draft images remain private.

Every published sticker asset with valid printing choices has finish previews. Without uploaded sample artwork, the standard illustrative artwork shows the configured finish and size; it is labelled as illustrative. Private draft uploads are never used as public previews.

For these assets, **Sticker samples** is also available as a homepage widget. It shows the artist name, asset name and one to three gently floating samples according to widget size, with a lightweight version of the creator background. It links directly to the asset. Dragging tilts the material with increasing resistance; the back cannot be exposed. Scrolling never zooms the sticker. Stationary previews do not continuously redraw; textures are capped to the displayed size and public artwork decoding is shared. Offscreen widgets stop rendering until visible again; reduced-motion settings keep the samples still.

Open **Creator â†’ Preferences â†’ Shipping** to save the sender address and typical packed parcel weight and dimensions. The sender address is private; it is sent to the configured carrier quote providers when a customer requests rates, but is not returned to the customer. Changing the origin or parcel invalidates outstanding quotes. A request with a selected carrier shows the customer's delivery address, service and saved cost range in **Creator â†’ Requests**. Confirm actual postage with the customer before buying a label.

Carrier estimates can use **EasyPost shipping**, **UPS published shipping rates**, and **FedEx list shipping rates**. An administrator connects any combination in **Admin → API Keys** with production rating credentials saved globally for the website environment. Each provider runs independently: a failed provider does not discard another provider's estimates. See [API keys and credentials](../reference/04-api-keys-and-credentials.md) for setup.

Choose **Get delivery estimates** after entering the address. Changing the address clears the old quote; click again to refresh. Public carrier estimates use EasyPost retail/list prices, UPS published Shop prices and FedEx LIST prices. Discounted purchase and negotiated account prices are excluded from this public group. Matching carrier services in the same currency combine into a rounded range with source names; for example, EUR 3.24 and EUR 6.11 become approximately EUR 3–7. Different currencies and services stay separate. A single source retains a 15% upper allowance, with outward rounding. These are estimates for the creator's typical parcel, not guaranteed postage or customs totals.

**Sendcloud** and **Easyship** can supply a separate **Platform shipping estimates** section. These are connected-account prices; the creator must confirm they can book them. They are never blended with public carrier prices or another platform account. Platform names and tax/surcharge caveats remain on the receipt and saved request. See [Connect shipping estimates for France and Europe](shipping-platform-api-setup.md) for key setup and API usage costs.

Test-mode EasyPost rates, missing credentials, unavailable routes and provider errors do not produce made-up prices. Quotes expire after 30 minutes and must match the customer, asset, delivery address and current creator shipping profile. Add a state or province code where required by the carrier. Delivery details are shared with configured carriers for rating; the sender address is not returned to customers. No label is purchased.

**Total printed copies** is the complete order quantity, not copies per design.
For example, 50 copies can be shared across 5 **Different designs**. Every design
needs at least one copy, so 1 copy across 7 designs is invalid. The form identifies
this disagreement without changing either number. Incomplete choices can still be
saved in a private draft; publishing requires valid choices.

Review incoming orders in the sticker inbox under **Creator â†’ Requests**. Download the print pack to receive original artwork, bordered PNGs, proofs and an order manifest. Existing orders retain their accepted configuration if you later change or delete the listing.

The website administrator controls sticker availability and the separate acceptance fee under **Admin â†’ Features â†’ Stickers**. Disabling the fee affects new requests; existing payment terms remain fixed.

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
The yellow receipt separates the printing subtotal, selected delivery range and
any Orbiters request fee. **Estimated total** adds the selected shipping range to
printing. If the currencies differ, both amounts remain separate without an
assumed conversion. Until you choose shipping, the total is labelled printing
only. The request fee remains separate; the creator confirms final delivery costs.

Creators can use **See as normal user** to send themselves a test order. Test
orders charge no fee, consume no printing capacity and cannot record real payment.
The creator can simulate the payment step to continue through production.

## Preview the artwork and printing

The sticker asset page places the large 3D finish showcase and product photos next
to the printing choices. One carousel contains every 3D finish followed by the
creator's photos in their configured order. Use previous/next or thumbnails to
switch; photos are ordinary images. Uploaded customer artwork takes the first
slide and replaces its matching sample. The asset banner fills its header card
from edge to edge. The description appears below the showcase. Printing
cards represent finishes. Choose a finish, then a size, copies per design and
number of designs from the creator's options. For example, 200 copies of each of
7 designs totals 1,400 stickers. The receipt updates immediately using the creator's
editable pricing rule; changing options preserves uploaded designs that still fit
the selected count. The selected size also controls the uploaded artwork preview.
Fixed printing offers continue to show their creator-defined package details.

Sticker previews use a small idle tilt, never a full spin. Dragging resists rotation
near the viewing limits, which keep the printed front visible. Arrow keys tilt,
and Home resets the view. Wheel scrolling always scrolls the page; zoom is disabled. Reduced-motion preferences disable idle
movement. Artwork without a creator-supplied sample remains marked as illustrative.
