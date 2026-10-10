---
title: Build an asset people can actually use
section: Creator Tools
order: 40
audience: creator, admin, dev
stage: stable
id: orbiters.how-to.configure-creator-assets
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-28
---

# Build an asset people can actually use

Imagine you have just released **Moon Jacket**. Mika buys it, Sol tests the new sleeves, and Ren tries your experimental cut. They all open the same asset page. They should not all receive the same files.

That is the useful part of asset configuration: connecting **what you made**, **where it is sold**, and **which release each person can use**.

## Meet the three pieces

| Piece | In our fictional jacket release | The question it answers |
| --- | --- | --- |
| Asset | Moon Jacket: name, creator, images and description | What is this? |
| Store product link | The jacket's product in your connected shop | Which purchase unlocks it? |
| Version | Public 1.0, beta 1.1, alpha 1.2 | Which files should this person receive? |

A public purchase URL takes someone to the shop. A **product ID** connects a provider's product to the asset. A nice purchase button does not, by itself, establish that mapping.

## Try the release before you publish it

In this example, change the person at the top. Then end their access. You can see why “I bought it” and “I can use this beta” are different claims.

```orbiters
{"kind":"release-access"}
```

Public scope includes public releases. Beta adds beta releases. Alpha includes all three. A linked active supporter tier grants public access; individual download types can still require owned access.

> **Studio note · Invite deliberately**
>
> Giving a tester alpha scope is a direct access decision. It does not prove that they purchased the asset. Use your store links for purchase recognition and scope grants for the people you intend to invite.

## Put the real asset together

1. Open **Creator**, choose the asset, and make its name and description recognizable to a buyer comparing it with their receipt.
2. Connect the right provider under **Integrations**, then link the imported store product to this asset. Copy its product identity from the provider; do not guess it from the URL.
3. Review version files, scope and, for compatible Unity assets, avatar-base metadata. Keep a public release available when your existing customers should retain it.
4. Add clear media. Show the item people are choosing, not just a decorative banner.
5. Save and inspect the asset page. Confirm the purchase destination and the releases available to the account you are testing with.

If a purchase is recognized but access still looks wrong, investigate the product mapping and scope before asking the buyer to purchase again. [Connect store integrations](/documentation/orbiters.how-to.connect-store-integrations) explains where those links come from.

## Let anyone claim it for free

**Configuration → Access → Free claims** lets anyone signed in take a free license from the asset page. For a custom
base, its **Install** button becomes **Claim and install**: it adds the license (source *Claim*) and opens the
installation steps. A claim is a regular license: MCB lists the asset, downloads work, and the asset's Discord role is
granted like after a purchase.

If the asset has a price on a connected store (or on Orbiters), the switch still works, but a warning names those
stores: buyers there pay for what others can now take for free. Turning claims off stops new claims; licenses already
claimed stay. A license you or a store withdrew (a refund, a revoked key) is not revived by claiming.

<beta>
Use **Configuration → Access → Discord role access** for scoped, reversible rules
per Public/Beta/Alpha scope. See [Configure Discord access to an asset](discord-asset-access.md).

Configure Discord role-to-asset mappings per server in **Creator → Assets →
Discord role assets**. See [Grant assets through Discord roles](manage-discord-role-assets.md).

The next creator-tools release adds private drafts, assisted image imports,
product previews, Hide/Delete controls and asset metrics. See
[Create, publish and measure an asset](24-create-and-measure-assets.md).

### Find your way around the asset settings

Open an asset's settings at `/assets/<id>/config`. The header shows the thumbnail,
name, asset type and state chips (**Published** or **Not published**, **Visible** or
**Hidden**, **Old format**). Its actions are **Publish** for an unpublished asset,
**Edit asset page** (**Convert to current format** for an old-format asset),
**View public page** in a new tab, a copy-link button and, for
Gumroad products, **Refresh from Gumroad**.

The tabs are **Page**, **Access**, **Stores**, **Versions** (avatar assets only)
and **Performance**. **Page** holds what customers see, in this order:

1. **Thumbnail and banner**. Drop an image on a tile or click it to upload.
   **Thumbnail** is the square image used by asset cards, search and MCB: PNG, JPEG
   or WebP up to 10 MB, saved as a centered 512 × 512 crop. Its tile marks the band
   an asset card keeps. **Page banner** is the wide image at the top of the asset
   page, shown whole; 16:10 fills the frame. It accepts up to 20 MB and can be removed.
   Avatar assets also have an **MCB banner**, used only by MCB in Unity. A warning
   under a tile flags an image too small to stay sharp.
2. **What customers see** previews the asset card, the asset page on a desktop and on
   a phone. Pointing at or focusing a tile highlights where that image appears.
3. **Showcase gallery**: Discord rooms whose new images appear on the asset page,
   the gallery layout, **Image managers** (Discord roles that can hide images), and
   the scan for earlier images. Choose **Set up showcase**, add a room, then
   **Save**. Saving new rooms starts scanning their earlier images automatically.
   Leaving with unsaved showcase changes asks for confirmation.
4. **Visibility**, **Avatar base** (avatar assets) and the **Danger zone** for deletion.

Orbiters prepares every **MCB banner** for MCB: it crops the image to 1600 × 900,
blurs the lower third and fades it to dark grey so the author row MCB shows over
it stays readable. Upload the plain image; one that already has this effect is
blurred twice. A custom base published with **Edit asset page** also uses its page
banner as MCB banner, unless its MCB banner was uploaded from MCB in Unity or with
the **MCB banner** tile.

<alpha>

Accessories, clothing, and the products, textures and other assets that can join My Avatar's gallery also have a
**My Avatar** tab, to publish them to that gallery without Unity: see
[Publish clothes and accessories to the My Avatar gallery](publish-to-myavatar-gallery.md#publish-from-the-website).

</alpha>

Older links ending in `?tab=showcase` open the **Page** tab at the showcase gallery.
**Performance** shows the placement and store-click numbers described in
[Create, publish and measure an asset](24-create-and-measure-assets.md).

The next release adds a graph and guided editor for uploaded avatar versions.
See [Edit releases in the version workspace](22-edit-asset-versions.md) for parent
links, per-version drafts, customization, dependencies and file actions.
</beta>

```orbiters
{"kind":"challenge","title":"Mika owns the jacket. The beta is locked.","question":"Mika has public access. You published version 1.1 as beta. What explains the locked release?","options":[{"label":"The key needs to be redeemed again","correct":false,"explanation":"Redemption already established public access. Repeating it does not turn a public grant into beta access. Check the intended release scope."},{"label":"The release needs a different scope","correct":true,"explanation":"Exactly: public ownership and beta access are separate. Invite Mika to beta only if that is your intention, or direct them to the public release."}]}
```

## Give the asset somewhere to live

A creator gallery can collect images from a Discord room owned through your creator Discord integration. Open **Creator → Galleries**, choose its name, visibility and layout, and select the source room. **Crawl Past Images** imports earlier images; interrupted crawls can resume from their saved cursor.

**Flush Images** removes website placements and orphaned mirrored records for that gallery. The original Discord messages and attachments remain. That distinction is useful when cleaning a website gallery without erasing a community conversation.

## Let access reach your community

An asset's Discord role can follow supported access grants and revocations through the background queue. Website access can be ready before the Discord role arrives. If it never arrives, check the [role hierarchy example](/documentation/orbiters.how-to.configure-discord-integrations) before changing the buyer's license.

<audience include="dev">

**Implementation boundary.** Discord writes belong in `OutboxJob`/`outboxService`. Purchase, redemption, webhook and synchronization paths enqueue role operations; they should not introduce inline Discord mutations. `accessPolicyService` owns release-scope expansion and the linked supporter-tier check.

</audience>

For room selection, public/private visibility, history imports and troubleshooting, see [Gallery: connect a Discord room and import pictures](17-set-up-gallery.md). The guide also distinguishes Gallery rooms from an asset showcase.
