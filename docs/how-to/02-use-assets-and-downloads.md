---
title: Find the version that belongs in your project
section: How To
order: 31
audience: public, user
stage: stable
id: orbiters.how-to.assets-and-downloads
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-10-01
---

# Find the version that belongs in your project

You have the receipt. The asset is in your account. Then a tempting new version appears with a beta label—and its download is locked.

That can be a perfectly healthy account. **Access to the asset and access to a release channel are separate.** Start with the public version unless the creator has invited you to test another one.

## Find an asset on the Assets page

**Assets → Discover** shows creators first, then one grid with every published
listing: avatars, accessories, textures, products, stickers, and art or YCH
commissions. Search, the type chips and **Newest / A–Z** apply to the whole grid;
choose **Stickers** to see only sticker listings. Sticker cards carry a
**Stickers** badge and show the starting price, or the full price range when the
creator chose it, matching the sticker page. Signed-in members also see other
assets they can get in the same grid. **Library** lists what you own with the same
search, type filter and sort.

<audience include="dev">

The grid reads `GET /creator-tools/catalog?kind=all&type=&q=&sort=newest|name&offset=`
(24 per page). `type=COMMISSION` or `YCH` returns published commission listings;
other types return published products only. Product cards get `priceSummary`
(`currency`, `minCents`, `maxCents`, `display: fixed | from | range`; sticker
bounds come from `stickerSelection.priceBounds`) instead of the product
configuration. Signed-in extras from `/assets/available` merge into the paged
order client-side without moving cards already shown.

</audience>

## Read the page like a receipt

Match the **asset name and creator** to what you bought. Then look for the access state and the version you want. The page may also offer purchase links, license redemption, supporter access, creator media and MCB or Unity installation.

A visible product page tells you what the item is. An available download or install action tells you what your current account can use.

```orbiters
{"kind":"release-access"}
```

The people and releases above are fictional. The scope relationship is real: public → public; beta → beta and public; alpha → all three. Supporter access to a linked asset is public-only and does not automatically unlock downloads that require owned access.

## A locked download is a clue

| What you notice | The next useful check |
| --- | --- |
| Your account looks empty after signing in | Confirm you used the provider connected to the account that redeemed the purchase. |
| You have a key but no asset access | Follow [license redemption](/documentation/orbiters.how-to.redeem-license-key). |
| Public works; beta or alpha does not | Check whether the creator granted that scope. |
| Access used to work | Check for a disabled access record or a change in supporter eligibility. |
| Supporter access works on the page, but a file is unavailable | That download may require owned access. |

> **A useful support message**
>
> “I can use the public release of Moon Jacket, but version 1.1 beta is locked. I am signed in with the account that redeemed it.”
>
> That gives the creator a concrete boundary to check. “Downloads are broken” does not. Include the real asset and version names; keep the full license key out of public comments.

## Comment on an asset

The **Comments** section at the bottom of an asset page holds one top-level comment
per member, up to 2,000 characters. If you already commented, edit that comment
instead of posting another. The asset's creator does not post a top-level comment
on their own asset.

Any signed-in member who can open the asset can **Reply** under a comment, the
creator included; replies go one level deep and are labeled **Creator** when the
creator writes them. The author of a comment gets a notification when someone else
replies. You can edit or delete your own comments and replies; a deleted one is
hidden and can be shown again from **Account > Privacy & data**. The creator and
staff can remove any comment or reply with a reason the author receives and can
contest; a creator's removal hides it until staff confirm or restore it.

<audience include="dev">

Comments are the asset's review interactions; a reply is a `COMMENT` interaction with
`toComment` set to its review, as the MCB package already stores them
(`backend/src/services/assets/assetReviewReplies.js`). Routes:
`POST /assets/:id/interactions/reviews/:reviewId/replies`,
`PUT` and `DELETE /assets/:id/interactions/replies/:replyId` (author only; `DELETE`
hides the reply), and `POST /assets/:id/interactions/reviews/:replyId/removal` for a
creator or staff removal. Replies never count against the one-comment rule.

</audience>

## Take the release into Unity

For compatible assets, follow the [MCB and Unity guide](/documentation/orbiters.how-to.mcb-and-unity-tools). The tool uses the same account access, so reinstalling Unity is rarely the first useful response to a scope restriction.

For VRChat project setup, keep the [official SDK setup guide](https://creators.vrchat.com/sdk/) nearby. It explains how Creator Companion prepares Unity and the SDK; Orbiters supplies compatible asset access and versions.

## Stay for the gallery

The Gallery starts with **All**, followed by your private galleries and the public galleries available to you. Open an image to inspect its author, date and reactions, or change the sorting to find recent work and community favorites.

A gallery owner can hide an image on the website without changing its Discord original. Temporary partial reaction fetches preserve the last complete counts and retry later, so a momentary Discord problem need not empty the gallery's reaction history.
