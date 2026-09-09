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
lastVerified: 2026-09-09
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
pages reuses earlier placements when the pin order, column count and existing feed
prefix are unchanged. Content bodies outside the viewport margin unmount, while
their measured grid footprints remain. Pinned bodies stay mounted.

Motion is imported from `motion/react`. Shared spring presets drive layout
projection, the toolbar/catalog shared element, category selection, drag pickup,
feedback and press states. Pointer movement positions the drag preview directly;
it does not wait for a spring to catch up. `MotionConfig` and reduced-motion hooks
remove spatial transitions when requested by the system.

## Account preferences API

Both endpoints require the existing JWT session and return `Cache-Control:
private, no-store` and `Vary: Authorization`.

| Endpoint | Behavior |
| --- | --- |
| `GET /users/me/homepage` | Returns `{ pins, revision }`; `pins: null, revision: 0` means no saved customization |
| `PUT /users/me/homepage` | Accepts `{ pins, revision }`; returns the saved pins and incremented revision |

An explicit `pins: []` is a saved empty collection. Entries have a known `type` and,
for content widgets, a canonical string `entityId`. The API rejects unknown types,
duplicate identities, invalid IDs and lists longer than 64. It persists only these
references. Client-supplied image URLs and arbitrary fields are discarded.

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
catalog transitions, pointer interaction, saving and reload.

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
