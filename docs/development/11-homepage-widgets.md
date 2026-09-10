---
title: Homepage Widgets
section: Development
order: 211
audience: dev
stage: alpha
id: orbiters.development.homepage-widgets
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-09-10
---

# Homepage Widgets

The alpha homepage lives in `frontend/src/components/home`. `HomePage` keys the
tree by account ID and token version so a session change discards private content,
pending reads, undo history and layout state. Existing API authorization remains
responsible for every widget's content.

## Layout contract

`widgetRegistry` defines the twelve types, dimensions, singleton rules and content
sources. `homeLayout` packs rectangles against occupied grid cells. It chooses the
earliest fitting pinned widget at each cursor position before considering feed
widgets. Reading order uses each widget's top-left cell. Empty cells are never
persisted; imperfect tiling is allowed when needed to preserve the pinned prefix.

Columns use `floor((containerWidth + 16) / 216)`, with at least one column. Their
widths stretch equally. Rows stay 200 pixels high with 16-pixel gaps, inside fixed
24-pixel page gutters. Spans clamp to the available column count.

The saved value is an ordered list, independent of viewport width. Appending feed
pages reuses earlier placements when the pin order, sizes, column count and existing
feed prefix are unchanged. Content bodies outside the viewport margin unmount, while
their measured grid footprints remain. Pinned bodies stay mounted.

`feedCandidates` shuffles discovery candidates using one random seed per page mount. Event slots are filled in ascending start-time/ID order; their identical dimensions preserve this order during packing. Later pages append without reshuffling existing non-event slots. Event edits reconcile only event slots. Started events leave discovery on the next 30-second clock tick; focus refreshes their source.

`appendCandidates` limits the accumulated discovery feed to three documentation
cards, deduplicating before counting. Further source pages and refreshes cannot
increase that total or reorder earlier feed cards. Once the cap is reached, feed
scrolling stops requesting document pages; the catalog can still load more.
Explicit user pins remain
independent of this discovery limit.

Widget surfaces, edit overlays, drag visuals and catalog previews use
`corner-shape: squircle` inside an `@supports` rule. Their border radius doubles
(24 to 48 pixels for widgets, 18 to 36 for previews). Other browsers retain their
ordinary radius. The glass dock keeps its lens geometry unchanged.

Viewport reflow updates widget geometry without springs or layout projection, including column-count changes. Editing and release animations remain separate from browser resizing.

Motion is imported from `motion/react`. Shared spring presets drive layout
projection, the toolbar/catalog shared element, category selection, drag pickup,
feedback and press states. Pointer movement positions the drag preview directly;
it does not wait for a spring to catch up. `MotionConfig` and reduced-motion hooks
remove spatial transitions when requested by the system.

In customization, the entire pinned widget receives drag input, except its
explicit buttons. The lower-corner resize grip appears as a translucent rounded
arc straddling the corner and protruding slightly beyond the widget, with a 56-pixel hit target. The handle has no hover or press zoom. It sits 10 pixels outward; its painted arc extends about 2 pixels past the straight edges. The arc has a flat white tint and backdrop blur, without gradients, outlines or internal glass effects. `useWidgetResize` captures the
pointer; `widgetResize` chooses the nearest registered shape in grid
units, merging equivalent dimensions on narrow screens. Pointer movement stretches the preview. Blur follows the normalized distance to the two nearest legal shapes: zero at a valid dimension, rising continuously to 90% of the 18-pixel maximum (16.2 pixels) at the boundary where layouts crossfade. During the gesture it follows the pointer directly; release eases any remaining blur away. Variant contents crossfade while neighbors
preview the packed result. Beyond a legal minimum or maximum, each axis uses an exponential resistance curve with up to 64 pixels of visual leeway. That overshoot is never persisted; release springs back to the nearest legal rectangle, even if its size has not changed. Left-edge resizing retains the opposite edge.

Gallery variants keep the same mounted image, disable the detail-window shared layout during editing, and stretch a fixed copy of the starting crop. They do not remount or start a second layout animation at size boundaries.

Release commits one size change; Escape, pointer
cancellation, window blur or viewport resizing restores the original. Undo and
the keyboard size button remain available. Reduced motion removes stretching,
blur and spring movement. At the right edge the grip moves to the lower-left
corner so widening does not require dragging outside the viewport. Grips are
hidden when the available columns leave no distinct physical size choices.

## Catalog and glass frame

`WidgetDock` keeps one mounted frame and SVG filter while animating its actual
width and height with a spring. It expands to at most 620 × 440 pixels on desktop
and 520 pixels high on narrow screens, with viewport margins. Catalog and toolbar
content crossfade through a 10-pixel blur; reduced motion disables blur, scale and
the spring. Hidden content is inert and excluded from the accessibility tree.
The catalog is non-modal: there is no backdrop blur, scroll lock or focus trap.
Each explicit **Add widget** opening starts on Highlights, a scrollable preview
gallery with direct dragging and access to the existing type/content/size picker.
Cancelling a catalog drag restores the selection instead of resetting it.

Dragging a catalog preview collapses the panel. `useWidgetDrag` previews insertion
among pins, appends before the feed, and restores the catalog after an invalid or
cancelled drop. `placeCatalogWidget` shares insertion logic between preview and
commit. Identity remains `type:entityId` regardless of size, so resizing replaces
a descriptor without creating another copy.

`LiquidGlassFilter` applies an SVG displacement filter directly to the frame's
CSS `backdrop-filter`, following the [CSS/SVG glass construction](https://kube.io/blog/liquid-glass-css-svg/).
The browser supplies the live page pixels, including scrolling and changing
content. There are no page snapshots, cloned content, WebGL contexts or JavaScript
refresh loops. The frame has one uniform translucent tint and rounded clipping.
The backdrop filter belongs to the frame itself so a clipped child does not lose
access to the page behind it.

`glassRefraction` derives inward ray displacement from a convex squircle surface
and Snell's law. Eight small images describe only the lens: four corners and four
straight edge strips. An unattached 2D canvas encodes those mathematical pixels;
it never draws page content. Red and green encode displacement, blue encodes the
specular rim. Mathematical masks use asynchronous PNG encoding and readback-friendly
canvas storage so encoding does not block the opening spring. The previous lens
stays visible until the new maps are ready; obsolete results are discarded.
The SVG filter combines
the tiles, corrects neutral red/green to
exactly 0.5, displaces the backdrop, and blends the highlight. Its displacement
scale is twice the maximum ray distance because SVG multiplies the channel's
offset from 0.5 by that scale.

A `ResizeObserver` updates the filter bounds and tile positions during the spring.
Straight edge strips stretch to fit; lens pixels regenerate only when the rounded
corner radius or lens/lighting settings change. The observer and SVG definitions
disappear when editing ends. SVG backdrop refraction currently requires Chromium. Other browsers retain
a plain backdrop blur with the same tint color and opacity. `glassSupport` gates SVG rendering to Chromium with accepted backdrop-filter syntax; unsupported engines skip lens generation and do not receive a URL filter that could invalidate their blur. The decorative rim overlay is omitted in that fallback.

### Tune the glass in development

Open **Customize → Add widget → Customize glass**. The editor is available in a
development frontend build or when the configured backend URL identifies the dev
environment, matching the homepage's dev-environment convention. Production uses
the defaults and never reads development overrides from browser storage.

The **Lens**, **Light** and **Surface** groups expose refractive index, depth,
surface height and curve, edge width, displacement strength, light direction,
ambient/directional highlights, highlight focus/width/inset, blur, saturation,
tint opacity, rim sheen, shadow opacity and both corner radii. Sliders update live;
numeric entries apply on blur or Enter. Edge width cannot exceed the current
corner radius. Zero strength or refractive index 1 disables displacement.

Changes apply to the catalog and toolbar and persist only in this browser under
`orbiters:dev:homepage-glass`; they are not account preferences. **Compare defaults**
temporarily displays the shipped settings without replacing your values. Editing
a control ends comparison. **Preview toolbar** collapses the catalog so you can
inspect the smaller lens; reopening Add widget starts on Highlights. **Reset** restores
the defaults. **Copy settings** exports every value as JSON, with selectable text
available if clipboard access is denied. Send that JSON to the developer to apply
the chosen values in `glassSettings`; copying does not change shared defaults.

Stored and edited values are restricted to the declared numeric ranges. Lens
images regenerate only for lens or lighting changes; blur, tint, saturation and
strength do not regenerate them. The geometry observer remeasures corner changes.
The approved defaults are refractive index 2.5, depth 80, surface height 7.5,
edge width 40 (clamped to radius), surface curve 2.4, strength 3, light direction
183 degrees, ambient 0.37, directional highlight 0.27, focus 3, highlight width 8,
inset 0, blur 4.3, saturation 1.25, tint 0.78, rim 1, shadow 1, catalog radius 28
and toolbar radius 32. The drop shadow uses a separate noninteractive sibling so
the lens's rounded clipping does not cut it off.

## Gallery expansion

`GalleryWidget` shares a Framer Motion layout ID between its image surface and a HeroUI modal, following the age-verification animation/runtime pattern. A spring expands and returns the surface, with a separately animated backdrop, inset close control and focus restoration. Existing `GalleryImage` keeps signed-source refresh and access handling; the modal uses its refreshed full URL. The preview is viewport bounded and reports image-load failures. `GalleryImageDetails` is shared with the gallery page: author, posted date, reactions, attachment position and reporting controls remain consistent. Its content scrolls when details or the report form exceed the available height. Reduced motion removes spatial expansion.

## Inline age verification

`AgeWidget` and `AgeVerificationDialog` share a layout identity scoped to the
originating card. The dialog expands from that card with a slightly bouncy spring,
keeping its grid footprint intact, and collapses back on dismissal. It retains
HeroUI focus trapping, Escape/outside dismissal and focus restoration. Its animated
backdrop fades over 220 milliseconds. The explicit top-right close button sits
12 pixels inward, has a 44-pixel target and stays above the animated page content.
Animated children use the same `framer-motion` runtime as HeroUI so exit completion removes
the modal overlay. `VerificationStage` crossfades pages with directional sliding
and blur; a measured height spring follows the incoming page and subsequent
linking status changes. Reduced motion disables geometry projection, blur and bounce.
`VrchatMemberLink` renders directly
inside the selected method, reusing the existing authenticated linking endpoints.
No frontend action creates age evidence or clears review holds. Discord connection
state comes from `/auth/connections`; staff verification remains a Discord review.
Successful updates dispatch `orbiters:connections-changed` to refresh Home.

Homepage dirty checks compare canonical widget descriptors, preserving pin order
while ignoring JSON property order. Repeated saves of unchanged layouts are skipped.
Saving has no in-flow homepage status message; failures retain the existing retry UI.

## Account preferences API

Both endpoints require the existing JWT session and return `Cache-Control:
private, no-store` and `Vary: Authorization`.

| Endpoint | Behavior |
| --- | --- |
| `GET /users/me/homepage` | Returns `{ pins, revision }`; `pins: null, revision: 0` means no saved customization |
| `PUT /users/me/homepage` | Accepts `{ pins, revision }`; returns the saved pins and incremented revision |

An explicit `pins: []` is a saved empty collection. Entries have a known `type` and,
for content widgets, a canonical string `entityId`. The API rejects unknown types,
duplicate identities, invalid IDs and lists longer than 64. Entries may include
an optional `size` from the type's whitelist: gallery supports `1x1`, `2x1`, `1x2`,
`2x2`, `3x1` and `3x2`; creator and commissions support `2x1` and `1x1`. Sona supports `2x2`, `1x1`, `1x2` and `2x1`; both blog types support `3x2`, `2x1` and `2x2`. Coming events is a `2x2` singleton; coming event is a `2x1` content widget with a canonical lowercase UUID. Other types have a fixed size. Invalid variants are rejected. Preferences store only these
references and size choices; client-supplied image URLs and arbitrary fields are
discarded.

`UserHomepage` has one row per user, with JSONB pins and an integer revision.
Saving locks the owner row within a transaction, including the first save. A
revision mismatch returns **409** without changing the layout. The user must reload
the saved version before editing again. Other save failures preserve local edits.

The new table syncs after User without altering existing user columns. Account
exports include homepage preferences; account closure removes them. Account merge
preserves an existing destination layout, including an intentional empty list,
and advances its revision so stale clients cannot overwrite it.

## Content sources

The homepage composes existing blog, creator, asset, Sona, age-verification,
commission and board APIs. Gallery, documentation and upcoming-event reads paginate; failed
sources expose retries independently. Reads are aborted on unmount and bounded by
timeouts. Signed URLs and private content are not stored in layout preferences.

`GET /galleries/asset-images` contributes an independently paginated asset-gallery source. The homepage merges its placement identities into the gallery catalog and shuffled feed. Listing visibility, active placements, attachment eligibility and source hiding are checked; commission listings that redirect to a different detail page without this gallery are excluded. No Discord request is made while listing.

Asset-image responses include `assetId` and their existing signed-source refresh endpoint. **Open gallery** links to `/assets/:id#gallery`. `AssetGallerySection` scrolls after the asset loads, re-aligns as the gallery or preceding preview images finish loading, and stops repositioning after user input.

`GET /galleries/images/:placementId` resolves a pinned image beyond the current
feed page, including asset placements. Asset placements recheck listing and source visibility; ordinary galleries apply gallery visibility, attachment eligibility, source visibility
and current-user access before returning the same display shape as the gallery
feed. Unavailable or inaccessible placements return **404**.

`GET /knowledge?sort=updated` returns visible documents with a recorded Git change
date, newest first. It preserves audience, source and release-stage restrictions.
The index obtains dates with one bounded Git history read per metadata refresh;
`lastVerified` is not a publication date. Missing repository history produces no
dated recommendations. A specific pinned document resolves through the existing
`GET /knowledge/:id` visibility checks.

`GET /community-events/upcoming?limit=24&offset=0` returns `{ items, nextOffset }` in ascending `data.startsAt`, then UUID order. `GET /community-events/upcoming/:id` resolves a pinned event beyond the current page. Both read routes precede organizer authentication and expose only published events with `groupAccessType: public` and a future start. Drafts, cancelled events, members/plus audiences and past starts are excluded on both paths. Responses contain only ID, title, description, start/end and category, with no management destinations, delivery state or credentials. Reads use the database only, never provider APIs. There are no schema or worker changes.

## Validation

Frontend tests cover the supplied resizing examples, mixed-size packing,
non-overlap, the pinned prefix, stable feed append, stationary-hold cancellation,
explicit empty layouts, undo, reference-only saves and revision conflicts.
Resize tests check supported shapes, mobile width aliases, preview-only movement,
release at the last pointer position, cancellation and pointer identity. Feed
tests check the three-document limit across repeated pages.
Headless browser checks use intercepted local fixtures for desktop/mobile layout,
catalog transitions, pointer interaction, saving and reload. They also check card
content alignment, round corner pins, the SVG definitions surviving expansion,
direct catalog dragging and persisted compact variants. Lens unit tests verify
finite symmetric displacement, neutral interiors and bounded tile geometry.
Browser pixel checks compare refraction against zero displacement, change a live
checkerboard backdrop without regenerating maps, and check rounded clipping.

Backend tests cover preference validation, ownership, concurrent revision writes,
gallery visibility and documentation dates. The opt-in `homepageDatabase` test
requires a new disposable PostgreSQL database named `homepage_fixture` on loopback.
It runs fresh installs twice, a populated previous-schema upgrade twice, and a
further boot with saved layouts. It verifies user-row preservation and private
layout removal through the real account-closure service.

Database preflight boots disable external startup and exit after synchronization.
They are separate from the HTTP startup regression, which executes the real
`server.js` routing with database and provider fixtures and checks `/healthz`, JWT
authentication, preference reads and writes on loopback ports above 4200.
