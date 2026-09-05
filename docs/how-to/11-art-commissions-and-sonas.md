---
title: Art Commissions and Sonas
section: Website
order: 115
audience: public, user, creator, admin, dev
stage: beta
id: orbiters.website.art-commissions-and-sonas
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-05
relations: orbiters.website.knowledge-map, orbiters.website.public-profile
---

# Art Commissions and Sonas

Art commission assets let artists publish YCH (your character here) illustrations,
sticker packs, and other made-to-order artwork on the Assets page. Customers choose
priced options and share a saved character with the artist.

Art payments are arranged directly between customer and artist. Creating or
accepting an art request does **not** charge a card through Orbiters, create a
Stripe sale, or grant a downloadable asset license. This is separate from the
[manual ReFit request fee](10-request-refit-commission.md).

## Save a Character

1. Open **My Account → Sonas → New Sona**.
2. Enter the character's name and a description with useful reference notes.
3. Add up to eight JPEG, PNG, or WebP reference images. Each upload must be at
   most 10 MB and 25 megapixels. Images are optimized to WebP, up to 2048 pixels
   per side; animation and SVG are not supported.
4. Select **Save Sona**.

Sonas are private. Other users cannot browse your character library. Selecting a
Sona in a commission shares its name, description, and selected reference images
with that request's artist. Review the preview and confirm sharing before sending.

You can edit a Sona or remove it from the library. Requests keep the text and image
references submitted at the time: later edits or removal do not rewrite existing
briefs. Images remain retained while attached to a saved Sona, listing or submitted
request. Unreferenced uploads, including cancelled drafts, become eligible for
cleanup after 24 hours; failed storage cleanup is retried. Removing an image from
a Sona does not erase references already shared in a request. Accounts can save up
to 50 Sonas and retain up to 500 commission/reference images; reclaimed uploads free
quota instead of consuming a lifetime upload allowance.

## Request Artwork

1. Open **Assets → Art & YCH commissions** and select a listing.
2. Read the description, deliverables, turnaround expectations, and artist's terms.
3. Log in, choose one variant if offered, and select any optional extras.
4. Check the configured price. It is the base price plus the selected variant's
   additional price and all selected extras, in the listing's currency.
5. Choose a Sona. Add your request details and contact information for arranging
   payment and delivery.
6. Optionally add files or images under **Attachments** (eight files maximum,
   10 MB each). These are shared with the artist before acceptance and retained
   with the submitted request. Only upload files you have permission to share.
7. Confirm reference sharing and select **Send commission request**.

If the listing changes while you are configuring a request, submission is refused:
reload and review the new price. The server computes the price from the listing,
not from a customer-supplied total.

Requests appear in **My Account → My commissions** and in the account menu's
active commission list. Open a request to see its original configuration,
references, artist updates, and progress. Earlier notes and delivery links remain
in the request's activity history, even when the artist starts another revision.
Artists can post updates without changing the stage. Customers can cancel before acceptance.
After acceptance, coordinate changes with the artist using the contact details in
the request or their profile.

If a network interruption leaves the result uncertain, use **Retry submission**.
That button reuses the same submission instead of creating a second request.
Check **My commissions** before starting again from another page.

<audience include="creator, admin, dev">

## Publish a Commission Asset

1. Open **Creator → Commissions → New commission asset**.
2. Enter a name, description, deliverables, and terms. Include contact, payment,
   revision, and turnaround instructions.
3. Upload previews; the first image is the cover.
4. Set a base price and currency.
5. Add variants for mutually exclusive choices and options for independent extras.
   Each price is an **addition** to the base price, not a replacement.
6. Enable **Public on Assets** to publish. Keep it off to save a private draft.
7. Enable **Accept requests** when you are ready, then save.

For example, a USD 19 sticker can offer a single-sticker variant at +0 and a pack
variant at +28, making the pack USD 47. An optional complex-design extra at +13
makes that configured pack USD 60. A listing supports up to 20 variants and 20
options. Prices use two decimal places; a configured total cannot exceed 100,000
units of the chosen currency. Creators can save up to 100 commission listings.

Published listings appear in the Assets gallery and on your public profile.
Turning off **Accept requests** keeps the listing visible but pauses new requests.
Turning off **Public on Assets** removes it from public discovery. Existing
requests retain their original listing, terms, price, and preview references.

## Manage Requests

Open **Creator → Requests → Art commission requests**. Select a request to review
the customer's brief and shared Sona. Accept or decline it. Accepted work advances
through **Start work**, **Ready for review**, and **Mark completed**. Review can
return to **Make revisions**. Add an artist update with contact details or a
review/delivery link when changing status.

Progress indicates workflow stages, not time remaining or payment settlement.
Commission notifications follow the account's Payments and commissions preference.

## Ko-fi Listings

Ko-fi catalogue import is not available. Its [documented API](https://help.ko-fi.com/hc/en-us/articles/360004162298-Does-Ko-fi-have-an-API-or-webhook)
provides payment webhooks rather than a shop catalogue endpoint. Create a native listing using
your own artwork, description, and prices. Connecting a Ko-fi payment webhook does
not copy its shop products into Orbiters.

</audience>

<audience include="dev">

## Runtime and API

Listings are existing `Asset` rows with a `commissionListing` JSONB configuration,
not a separate catalogue. `Sona` stores owner-scoped characters;
`ArtCommissionRequest` stores immutable submission snapshots and workflow status.
Startup schema synchronization adds these fields/tables. Both fresh and repeated
initialization paths are covered by disposable PostgreSQL preflights.

- `/art-commissions/listings`: public published catalogue, paged in groups of 24;
  authenticated creator POST creates a listing.
- `/art-commissions/listings/mine`: authenticated creator's listings, including drafts.
- `/art-commissions/listings/:id`: public published/owner draft GET; owner PUT.
- `/sonas`: authenticated owner-scoped GET/POST; `/sonas/:id` supports PUT/DELETE.
- `/art-commissions/media/:kind`: authenticated single-image POST (`sona` or `listing`).
- `/art-commissions/media/:id`: access-checked image GET. All originals use private
  File storage. Publication grants access only to listing images, never Sona images.
- `/art-commissions/requests`: authenticated POST with a listing revision and
  idempotency key; the Sona must belong to the customer.
- `/art-commissions/requests/mine` and `/inbox`: customer and artist request lists.
- `/art-commissions/requests/:id`: participant-only GET and role-checked status PUT.

Private browser images use authenticated blob requests through the API with
`Cache-Control: private, no-store`; they do not require public R2 bucket CORS or
tokens in URLs. Request creation and status changes use database row locks.
Uploads reserve quota with a short database lock and become active only after
storage completes; remote storage operations do not hold database locks.
Art requests never enter ReFit's Stripe or expiry scheduler.

Both art and ReFit request forms use `/commission-attachments` for authenticated
multipart uploads (`file`). GET `/:id` returns metadata; GET `/:id/content` delivers
private bytes to eligible participants; DELETE `/:id` removes only an owner's
unreferenced upload. Submitted requests store validated `attachmentFileIds`.
Generic files download as binary attachments; JPEG/PNG/WebP images are decoded,
metadata-stripped and resized to at most 1600 pixels per side, then saved as JPEG
(opaque) or PNG (with transparency) for desktop editing compatibility. This applies
to request attachments, not the separate Sona/library image pipeline. SVG and animated
image previews are rejected. Attachment storage is limited to 500 files per account;
unused uploads become eligible for cleanup after 24 hours.

</audience>
