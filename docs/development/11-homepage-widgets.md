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

`widgetRegistry` defines the ten types, dimensions, singleton rules and content
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

Motion is imported from `motion/react`. Shared spring presets drive layout
projection, the toolbar/catalog shared element, category selection, drag pickup,
feedback and press states. Pointer movement positions the drag preview directly;
it does not wait for a spring to catch up. `MotionConfig` and reduced-motion hooks
remove spatial transitions when requested by the system.

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
specular rim. The SVG filter combines the tiles, corrects neutral red/green to
exactly 0.5, displaces the backdrop, and blends the highlight. Its displacement
scale is twice the maximum ray distance because SVG multiplies the channel's
offset from 0.5 by that scale.

A `ResizeObserver` updates the filter bounds and tile positions during the spring.
Straight edge strips stretch to fit; lens pixels regenerate only when the rounded
corner radius or lens/lighting settings change. The observer and SVG definitions
disappear when editing ends. SVG backdrop refraction currently requires Chromium. Other browsers retain
the translucent frame, rim and controls without the refractive lens.

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

## Inline age verification

`AgeVerificationDialog` uses the existing HeroUI modal semantics with spring
entry and a finite blur/fade exit. It retains focus trapping, Escape dismissal,
focus restoration and reduced-motion support. Its animated children use the same
`framer-motion` runtime as HeroUI so exit completion removes the modal overlay.
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
`2x2`, `3x1` and `3x2`; creator and commissions support `2x1` and `1x1`. Other types
have a fixed size. Invalid variants are rejected. Preferences store only these
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
commission and board APIs. Gallery and documentation reads paginate; failed
sources expose retries independently. Reads are aborted on unmount and bounded by
timeouts. Signed URLs and private content are not stored in layout preferences.

`GET /galleries/images/:placementId` resolves a pinned image beyond the current
feed page. It applies gallery visibility, attachment eligibility, source visibility
and current-user access before returning the same display shape as the gallery
feed. Unavailable or inaccessible placements return **404**.

`GET /knowledge?sort=updated` returns visible documents with a recorded Git change
date, newest first. It preserves audience, source and release-stage restrictions.
The index obtains dates with one bounded Git history read per metadata refresh;
`lastVerified` is not a publication date. Missing repository history produces no
dated recommendations. A specific pinned document resolves through the existing
`GET /knowledge/:id` visibility checks.

## Validation

Frontend tests cover the supplied resizing examples, mixed-size packing,
non-overlap, the pinned prefix, stable feed append, stationary-hold cancellation,
explicit empty layouts, undo, reference-only saves and revision conflicts.
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
