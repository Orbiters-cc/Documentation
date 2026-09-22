---
title: Create, publish and measure an asset
section: Creator Tools
order: 61
audience: creator, admin, dev
stage: beta
id: orbiters.how-to.create-and-measure-assets
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-20
---

# Create, publish and measure an asset

This guide covers the creator tools prepared for the next release. Availability depends on the deployed website version.

## Start with what you have

1. Open **Creator → Assets → + Create**.
2. Choose **General**, **Custom base**, **Commission**, or **Stickers**. **Copy from** reuses an asset you own as a starting point.
3. Fill the form and choose a currency from the dropdown, or paste your post, notes and public store links into **Drop your ideas here**, under **AutoFill**. Add PNG, JPEG, WebP images or an embedded GLB preview, up to 20 MB each and 20 files per draft.
4. Select **Send to LLM and auto-fill**. Text and resized images are sent to the administrator's configured AI provider. GLB files are previews, not AI image inputs.
5. Check the suggestions and warnings. **Use this** applies one field; **Undo** restores its previous value. Unknown information stays blank or missing. Conflicting measurements appear as warnings.
6. Use the dedicated **Thumbnail** and **Banner** fields to upload an image or select one already added to the draft. Select gallery images and a 3D preview below AutoFill. Only the selected media becomes public.
7. **Save draft** keeps incomplete work private. **Verify and post** checks the fields required by the chosen template and opens the published page.

You can keep up to 100 active drafts. Publishing a commission or sticker service also requires saved seller details and terms. A custom base needs an original avatar base. The editor does not invent prices, currency or licensing terms.

Published product pages and their shop buttons are visible without signing in.
Signing in refreshes your ownership on the same page; signing out restores the
visitor view. Viewing a product does not grant access to its purchased files.

Open an asset's **General** settings and choose **Edit asset page** to change its page using the same editor. Changes remain private until published. If another window or a provider sync changed the asset in the meantime, the editor asks you to reopen from the current version before overwriting it.

Publishing page edits preserves an existing texture or accessory's installation
method and original avatar base. A custom-base draft still lets you explicitly
choose its original base. New general assets, including copies, start without an
installation method or original-base association.

**General** also has direct thumbnail and **Page banner** controls. Banner upload,
replacement and removal apply immediately to the asset page. The avatar-specific
**MCB Banner** is a separate image for the MCB tooling.

## Publish to a connected shop

In **General → Publish to connected stores**, select a supported store, inspect the synchronized fields, and confirm the review checkbox. Gumroad supports fixed-price digital product pages: name, description, summary, price, currency, tags and thumbnail. The product price must use EUR, USD or GBP.

Leave publication unchecked to create a Gumroad draft first. Complete the shop's files, checkout and payout requirements, then enable publication when ready. Orbiters does not replace vendor download files or checkout settings. Configurable commissions and physical sticker orders stay on Orbiters.

You can link an existing vendor product ID. Enable automatic updates to apply later Orbiters page changes. If someone edited the same fields directly on Gumroad, synchronization stops with a conflict for you to resolve. If creation cannot be confirmed, check the shop and link the product ID shown there; Orbiters will not create another product automatically.

**Pause sync** stops future work but keeps an uncertain creation result and its
recovery message. Before resuming, link the existing Gumroad product ID so Orbiters
can verify it. Pausing does not turn an uncertain creation into a fresh attempt.

Hiding an asset or applying a moderation restriction stops subsequent shop writes,
including publication after draft creation. A request already admitted for delivery
may finish; its product ID is retained so resuming updates that product. Hiding an
Orbiters page does not unpublish an existing Gumroad product. Restore visibility
and resume synchronization when appropriate; unresolved creations still require
linking the existing product ID.

Jinxxy, Payhip and Lemon Squeezy continue to support their existing import and purchase features. Their connections are shown without a publishing action when no supported public write API is available.

Every connection shows its provider icon/name and the connected account name.
**Import connection** identifies stores whose product pages cannot currently be
published through Orbiters; this does not mean the account connection is broken.

## Hide or remove a stale asset

Open **General** and use **Hide** to keep the asset in the database while removing public access to its page and media. **Show asset** makes it visible again, subject to moderation restrictions.

**Delete** requires entering the asset name. It removes the asset and its access references. Existing commission and sticker order snapshots remain available to their participants. Later vendor or Discord-role synchronization can recreate a deleted asset; use Hide when you want it to remain suppressed while keeping the integration.

## Understand the numbers

The creator's asset cards show recent impressions, visits and clicks. Open **General** for the selected period's totals and a breakdown by placement, including the homepage, assets catalog and recommendation cards. Outbound store clicks are shown separately by provider.

An impression requires at least half the card to be visible for one second while the browser tab is visible. Creator self-views do not count. Repeated visits can count more than once: these are event totals, not unique people.

A click on **Get on Gumroad** or **Get on Jinxxy** is an outbound click. Provider-reported sales are shown separately and are not claimed as purchases caused by that click.

**You might also like** combines other visible assets from the same creator with assets visited or used in the same opted-in sessions. Behavioral suggestions need at least five distinct contributing accounts. Hidden assets and unpublished commissions are excluded.

Visitors control aggregate measurement and personalized recommendations in their privacy settings. Creators receive totals rather than visitor identities.

Related: [Connect store integrations](05-connect-store-integrations.md), [Publish posts and stream announcements](25-publish-posts-and-streams.md), [Order and fulfill stickers](26-order-and-fulfill-stickers.md).

## Bring in a store product

In **Store links**, select a vendor icon. A connected Gumroad, Jinxxy or Lemon
Squeezy account can show its available catalog; Payhip shows products configured
in the connection. The list omits products already linked to your assets or
matched by name. Search or load more products, then select one to fill missing
name, description, summary and thumbnail details. Existing writing and uploaded
thumbnails are preserved. Missing prices, currency and other facts remain missing.
Commission templates still require an uploaded listing image.

Inspect the imported information and complete its public HTTPS product link if
missing. Saving keeps the draft private. Publishing attaches the product's store
reference to the asset so later synchronization can identify it. If it was added
elsewhere before publication, open that existing asset instead.

A connection without a catalog, a disconnected store, or a failed lookup still
allows a manual public link. **Website** is available for other destinations.
Removing a link from the draft does not disconnect your store account.

## Walk through your own commission

On your own asset page, select **See as normal user**. For art commissions and
stickers, this enables a clearly marked test request so you can exercise both sides
of the process. Switch between customer and creator views on the request.

Tests never create a real payment or payment record, authorize a request fee, or
reserve sticker capacity. They do not send commission notifications or create a
board proposal. Quotes, uploaded references and the request workflow are retained
for inspection. This option only works for the listing's owner; it does not waive
payment on another creator's commission. Return to creator view when finished.
