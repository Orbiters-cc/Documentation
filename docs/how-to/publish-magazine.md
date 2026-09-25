---
title: Publish a Monthly Orbiters magazine
section: Creator Tools
order: 65
audience: creator, admin, dev
stage: beta
id: orbiters.how-to.publish-magazine
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-25
---

# Publish a Monthly Orbiters magazine

This workflow requires the matching magazine website release and permission to
write blog posts. A magazine contains ordered image spreads: each wide image can
already contain its two facing pages.

1. Open **Blog → Create Blog Post**, or choose Blog from the homepage post composer.
2. Set **Post type** to **Magazine** and enter a title.
3. Upload each spread. Use **Earlier**, **Later** and **Remove** to arrange it.
   **Replace image** changes a spread without losing its caption or position.
4. Add captions and, where useful, a text transcript in the optional description.
5. Add an optional thumbnail and keywords. Without a separate thumbnail, the first
   spread becomes the cover.
6. Enable **Published** when ready and save. A saved draft remains visible only to
   its author and administrators until published.

Use PNG, JPEG, WebP, AVIF or GIF images, up to 10 MB each and 60 spreads per post.
New spread uploads retain their full pixel resolution (up to 64 megapixels),
with a separate small preview. Images previously uploaded through the thumbnail
uploader were downsized; replace those with the original files for sharp zoom.
Images must be active, public uploads belonging to you or the original author.
Article posts still require written content; magazines may contain images alone.

Readers can drag across a spread, use the Previous/Next buttons, or focus the
reader and use the arrow keys. The zoom slider enlarges the image for reading;
**Fit spread** restores page turning. Reduced-motion preferences remove spatial
page-turn animations. The same reader appears in wider desktop homepage blog previews. Magazine widgets
give the first spread most of their space and preserve its full composition.

<audience include="dev">

`blog_posts.type` is `article` or `magazine`; `spreads` stores ordered objects with
`fileId` and `caption`. Existing rows default to articles with no spreads. The
write API validates public file ownership and image MIME types. GET requests use
verified optional authentication for draft visibility and logged-in view counts.

</audience>

Direct links to the editor wait for your signed-in session and feature access
to load.

Blog thumbnails and magazine spreads accept decoded PNG, JPEG, WebP, AVIF or GIF
images, up to the upload size limit and 64 megapixels. Orbiters rewrites their
pixels and removes embedded metadata. SVG and damaged files are rejected rather
than published unchanged. Magazine spreads retain full resolution; thumbnails
are optimized for cards.
