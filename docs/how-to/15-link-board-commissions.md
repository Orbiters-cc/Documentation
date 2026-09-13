---
title: Edit Board Cards and Link Existing Commissions
section: Creator Tools
order: 50
audience: creator, admin, dev
stage: alpha
id: orbiters.how-to.link-board-commissions
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-13
---

# Edit Board Cards and Link Existing Commissions

Use an existing proposal, Trello card, Notion task or GitHub project issue to track artwork
already agreed with a client. You need an Orbiters commission asset of your own
and an Orbiters account for each client.

## Edit a card without leaving the board

Click a card in your homepage board widget or full board. It expands from its
position into a detail window and returns to that card when closed. **Open full
element** opens the full proposal or issue page, with the same editing controls.

Click the title or description to edit. Use the formatting toolbar for headings,
emphasis and lists. Drop or paste PNG, JPEG or WebP images into the text where
they belong. Each image can be at most 10 MB and 25 megapixels. Orbiters optimizes
it to a single PNG or JPEG up to 1600 pixels per side, and retains it under
**Images attached to this card**. Removing an image from the text leaves the
attachment available.

Select **Save changes**, or press **Ctrl/⌘ + Enter**. You can cancel text edits;
uploaded attachments remain attached. Leaving with unsaved edits asks you to
save or discard them. An external edit conflict keeps your draft instead of
overwriting the newer card.

Trello editing uses the connected account owner's authorization and updates the
card title and description. Saved inline images are also attached as image links
to that Trello card. GitHub editing updates the issue title and body using the
board repository's configured write credential; linking a GitHub identity alone
does not grant repository write access.

Notion tasks use the connected creator's workspace authorization. See
[Connect Notion task boards](16-connect-notion.md) for database imports, status columns,
advanced blocks and optional Files-property attachments.

Images embedded in these providers are hosted by Orbiters under unguessable
links that the external service can display. Anyone who receives such an image
link can open it. The GitHub issue body contains those image links; GitHub does
not receive a separate binary upload through its issue API. Share only the
references intended for that card's readers.

## Associate a commission asset and clients

1. Select **Link commission asset** under **Track as a commission**. You must own
   the card or its board and be allowed to edit it.
2. Choose one of your commission assets. Its existing variants, optional extras
   and sliders become available, including assets currently closed to new requests.
3. Under **Clients**, search by name, exact email address, or GitHub/Telegram
   handle. Select each matching account; repeat for additional clients. Email
   addresses are not displayed in the results. Clients without an Orbiters
   account need to create one before they can be selected.
4. Set the requested variant and options. Use **Add a special request** for an
   extra revision, unusual deliverable or other agreement. Enter zero for a free
   extra. The configured price updates as you change the options.
5. Choose the current **Commission progress**. Enter the **Agreed price** in the
   asset's currency. If payment has arrived, select **Payment received** and its
   receipt date. This recorded price can differ from the configured quote.
6. Select **Save commission**.

All selected clients see one shared commission in **My commissions** and the
homepage progress widgets. They can see the brief, progress, selected options,
recorded payment and the other participants. The record does not borrow a
client's private Sona or imply that they accepted new website terms.

Use **Edit commission** to update an imported agreement or **Open commission &
updates** for the normal delivery controls. Changing the progress here updates
the client-facing record. Moving a card between board columns only organizes
your board; it does not change the delivery stage.

Saving again updates the same commission. A card already associated with a
native website request keeps that request and its original terms; manage it
through its commission page. Cards already tracking ReFit work cannot be
reassigned to an art commission.

## Prices and received payments

This workflow records an existing agreement; it never charges a client or
creates a downloadable asset license. Only record payments not already imported
from a connected shop, to avoid counting the same revenue twice.

To correct a received amount, uncheck **Payment received**, save, then enter the
correct amount and mark it received again. A stale-record error means the
commission or payment changed in another view: reopen the card before saving.

See [Art Commissions and Sonas](/documentation/orbiters.website.art-commissions-and-sonas)
for creating assets and configuring price sliders, or
[Your Commission Workspace](/documentation/orbiters.how-to.manage-commission-workspace)
for delivery and revenue tracking.
