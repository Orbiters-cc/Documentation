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
lastVerified: 2026-09-28
---

# Create, publish and measure an asset

This guide covers the creator tools prepared for the next release. Availability depends on the deployed website version.

The search field at the top of Creator finds accessible sections and settings by name or related terms. Choose a result to open and highlight its target without activating the setting. Creator Preferences includes Shipping for sticker parcel origins and dimensions.

## Visibility and announcements

**Commissions → New commission asset** opens the shared private draft editor with
the Commission template selected, including AutoFill, source files and draft saving.
The Commission template offers **Public on Assets** and **Accept requests**.
Public visibility and accepting requests are independent: you can keep a public
form visible while requests are closed. AutoFill preserves both choices.

Every template includes **Announce your commission**, including General, Custom
base and Stickers. Choose destinations before publishing. Commission announcements
require **Public on Assets**; other templates announce their published asset page.
Saving a private draft never posts an announcement. Each selected channel has an optional **Message for…** field. Leave it empty for the generated announcement; a custom message keeps the public listing link and required discussion notice. Provider length limits are checked before queueing. Save changes before using **Post again**; editing a message does not rewrite an already sent post.

Connect Discord or Telegram channels, or an X/Bluesky publishing account. Each
selected channel receives one announcement per asset, with its public page link,
price when provided, and selected public preview images. AutoFill source files
are never announcement attachments. X and Bluesky can include up to four images;
replies stay on those services. Discord/Telegram discussion synchronization applies
to commission listings. Hidden or moderated listings and unavailable creator
accounts are checked again before queued announcements are admitted for sending.

Seller information must be saved before publishing a public commission. The save
action explains missing country selection or seller-term confirmation. Editing
seller details requires confirming the reviewed information again.

## Start with what you have

1. Open **Creator → Assets → + Create**, **Creator → Overview → Latest assets → Create**, or, with creator access, **Assets → Create** beside **Add license key**. These open the same asset editor.
2. Under **Create an asset**, choose one of the four types: **General**, **Custom base**, **Commission** or **Stickers**. To start from an asset you own, first pick it in the optional **Copy from an existing asset** field.
3. Fill the form yourself, or use **AutoFill**: paste your post, notes or public store links into **Ideas and source text**, then add only the images you want analyzed with **Add AI source files**.
4. Select **Send to LLM and auto-fill**. The source text and resized images selected there go to the administrator's configured AI provider. The separate **Media library** holds asset images and GLB previews without sending them to AutoFill; you can explicitly select **Use in AutoFill** on an existing image. A draft accepts up to 20 files of 20 MB each.
5. Supported details are applied to the private draft automatically. Newly filled fields are purple until you edit them, and the AutoFill panel shows what was added and any warnings. Review the result before publishing; sticker setup defaults are identified separately from extracted facts.
6. Use the dedicated **Thumbnail** and **Banner** fields or the Media library to choose public media. Use **Product photos → Add product photos** to upload up to eight images at once. Move them earlier/later to set their page order, or remove them from the gallery without deleting the library files. Choose a GLB preview in the Media library. Only the selected media becomes public.
7. **Save draft** keeps incomplete work private. **Verify and post** checks the fields required by the chosen template and opens the published page.

**Back to asset types** saves the current private draft before returning to the
template chooser. Choose another type to start a separate draft; your previous
work remains in the draft list. This button is available when creating an asset,
not when editing an already published asset.

Save and publish actions float at the bottom of the editor and stay visible while
you scroll. Editing an existing asset uses **Publish changes**. If publishing is
rejected, the action bar shows the issue; **Show issue** moves focus to its full
message. Your draft remains available for correction.

For stickers, AutoFill creates one variant per finish: Glossy, Matte, Broken Glass
Holo and Starry Holo are four variants. Size, copies **per design**, and design count
are shared selectable options. Seven designs at 200 copies means 1,400 stickers.
The editor lets you change the lists and the shared pricing once, then edit each
finish's artwork, thickness, availability and surcharge independently.

With only a price range, AutoFill fits an editable price curve to it: the smallest
basic order matches the minimum (€20 in the example) and the largest order matches
the maximum (€630). Holographic and glitter finishes get a +25% surcharge; glossy
and matte have none. If no valid curve fits the range, the listing keeps the
**Two prices** method instead. Review the curve and surcharges before publishing.
No price evidence means blank prices, not a free offer. These are draft
assumptions, not extracted exact prices. See
[Price the shared options](26-order-and-fulfill-stickers.md#price-the-shared-options)
for the pricing methods.

For a draft already containing separate combinations, **Group by finish and enable
size & quantity options** opens a confirmation. Choose **Cancel grouping** to keep
the original choices, or **Group printing choices** to apply the change. Grouping reduces it to finish variants, takes the option lists from those
rows and starts the **Curve** pricing method from their prices. Review order limits and samples after grouping;
existing requests keep their original snapshots. Save and publish when ready.
Finish previews load only when their editor is opened.

Missing sticker setup uses a 3 mm maximum border, 0.2 mm preview/parcel thickness,
made-to-order availability, and wording that production time will be confirmed
before printing when no saved estimate is available. Missing size/quantity/design count/finish use
50 mm, 50 copies, one design and glossy. Material defaults to vinyl. Supplied
values take priority, and AutoFill lists the defaults it used. A submitted image
can supply the thumbnail when one has not been selected. Missing prices, seller
details and terms are still required; AutoFill never invents them.

**Seller information → Production / completion time** describes the time to make
or complete the order, excluding shipping transit time for physical items. New
sticker drafts prefill **Production time** from your saved seller estimate. Saving
seller information within an empty sticker form fills that estimate without
replacing a production time you already entered.

**Shipping and delivery** is optional and hidden on a new blank form. Turn on
**Shipping details** to add terms; turning it off clears the text. Shipping details supplied by an existing listing or your AutoFill sources
remain editable. Carrier estimates and customer delivery-address requirements
are independent of this optional listing text.

AutoFill shows live server stages: waiting for a worker, preparing images, reading sources, waiting for the AI response, and checking/applying fields. Expand or collapse the activity list; the clock shows elapsed time, not a completion percentage. A connection interruption is shown separately from a failed job. Edits you make while it runs take priority over suggestions.

Each submission consumes its selected sources: the notes and AutoFill image selection
clear after the request is queued, while uploaded files remain in your media library.
Later requests send only newly entered notes or explicitly selected images, without
including existing asset fields or automatically reusing the gallery.

While the model streams its output, the connected activity steps show received output
tokens. A `~` marks an estimate from streamed text; the provider's reported count
replaces it when available. This is activity feedback, not a completion percentage.
Open **Request & response details** to inspect the submitted text, image selection,
instructions, output format and returned answer, including partial answers and failure
reasons. These records are available to you and authorized AI administrators. Older
redacted responses cannot be recovered. AutoFill makes up to three attempts within one
submission. DeepSeek output truncation is retried at once with a larger output
budget. A provider or connection failure, a rate limit, a response that ended early
or one that did not match the required format is retried after a short pause; a
format retry reminds the model of the required format. Unsupported images, AI being
turned off or a missing provider key are not retried. Progress shows
**Retrying (attempt 2 of 3)…** with the reason, and token totals include every
attempt; each attempt remains visible in request history. Retries stop when the
draft is published or a newer AutoFill replaces the request. If every attempt fails,
the error says how many were made; add the sources you want and submit again.

Minor text-format mistakes do not reject otherwise valid AutoFill results. Unknown
text returned as `null` stays blank, and lists of text lines are joined. Ambiguous
numbers or objects in text fields are left blank with a review warning; AutoFill
does not guess duration units. Prices, measurements, image IDs and choice values
still require their correct types. Request details preserve the original response.

You can keep up to 100 active drafts. Publishing a commission or sticker service also requires saved seller details and terms. A custom base needs an original avatar base. AutoFill can interpret an unqualified `$` price as USD unless the source indicates another dollar currency; it does not invent absent prices, rights or links. For commissions, a simple-to-complex price range becomes a slider when the source supports one, while independent upgrades stay separate options. Variant and option amounts add to the base price.

In **Account → Overview → AI-assisted features**, you can turn off AI requests for your account. AutoFill is then hidden, and missing MCB version titles or release notes must be entered manually. You can turn AI back on later; queued requests check the preference again before calling a provider.

Published product pages and their shop buttons are visible without signing in.
Signing in refreshes your ownership on the same page; signing out restores the
visitor view. Viewing a product does not grant access to its purchased files.

Open an asset's settings and choose **Edit asset page** in the header to change its page using the same editor. Changes remain private until published. If another window or a provider sync changed the asset in the meantime, the editor asks you to reopen from the current version before overwriting it.

Publishing page edits preserves an existing texture or accessory's installation
method and original avatar base. A custom-base draft still lets you explicitly
choose its original base. New general assets, including copies, start without an
installation method or original-base association.

The settings **Page** tab also has direct **Thumbnail** and **Page banner** controls. Banner upload,
replacement and removal apply immediately to the asset page. The avatar-specific
**MCB Banner** is a separate image for the MCB tooling.

<beta>
The next application release preserves a usable MCB banner preview after
**Refresh from Gumroad**.

Assets that Orbiters creates for you (store sync, the MCB custom-base wizard,
Discord role assets, admin tools) and assets converted from the old format start
as **Not published**. They are not listed on Assets, in recommendations or link
previews, and signed-out visitors cannot open them; you and people with access
still can. Orbiters sends you a notification when such assets are created: open
it to go to the asset (or your Creator assets filtered to **Not published**) and
choose **Publish** to make it public. **Publish** is also available in the asset's
settings header, on Creator asset cards and in the owner toolbar on the asset page.
Old-format assets are converted once, during the release, and keep their names,
descriptions, media, installation settings and access. Assets you had already
published yourself stay published; only listings that earlier pre-release code
published automatically become **Not published**. A one-time repair restores
assets published through the asset editor that the first version of this migration
had unpublished. **Edit asset page** still
lets you review the full product details before publishing.
</beta>

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

In the settings **Page** tab, turn off **Visible to visitors** under **Visibility** to keep the asset in the database while removing public access to its page and media. Turning it back on makes it visible again, subject to moderation restrictions.

**Delete** requires entering the asset name. It removes the asset and its access references. Existing commission and sticker order snapshots remain available to their participants. Later vendor or Discord-role synchronization can recreate a deleted asset; use Hide when you want it to remain suppressed while keeping the integration.

## Understand the numbers

The creator's asset cards show recent impressions, visits and clicks. Open the settings **Performance** tab for the selected period's totals and a breakdown by placement, including the homepage, assets catalog and recommendation cards. Outbound store clicks are shown separately by provider.

An impression requires at least half the card to be visible for one second while the browser tab is visible. Creator self-views do not count. Repeated visits can count more than once: these are event totals, not unique people.

A click on **Get on Gumroad** or **Get on Jinxxy** is an outbound click. Provider-reported sales are shown separately and are not claimed as purchases caused by that click.

**You might also like** combines other visible assets from the same creator with assets visited or used in the same opted-in sessions. Behavioral suggestions need at least five distinct contributing accounts. Hidden assets and unpublished commissions are excluded.

Visitors control aggregate measurement and personalized recommendations in their privacy settings. Creators receive totals rather than visitor identities.

<beta>
The next release waits for a signed-in visitor's saved measurement preference
before sending any events. If that preference cannot load, tracking stays off.
Temporary delivery failures retry the same event IDs in order, within a bounded
in-memory queue. Opting out or changing accounts clears pending events. Measurement
is best effort: closing the page or exhausting retries can still lose events.
</beta>

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

## Open or share the public asset

The asset settings header provides **View public page** in a new tab and a
**Copy asset link** button. Copying uses the current site's public asset URL;
it does not include editor or customer-preview parameters. These actions do not
publish a draft or change who can access the asset.
