---
title: Website icons and shared-link previews
section: Reference
order: 205
audience: admin, dev
stage: beta
id: orbiters.website.link-previews
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-09-23
---

# Website icons and shared-link previews

The favicon uses the navbar mark. SVG, a 32-pixel PNG and an Apple touch icon are
provided. The default share image contains the Orbiters name, its mark and
**Community hub**.

Every website route family has a title, description and share image. Public asset,
published blog-post and public profile links can use that record's text and image.
Private or unavailable records use the generic page preview. Account and staff
pages never expose the signed-in account's data in previews.

The server inserts Open Graph and Twitter card metadata into the initial HTML so
Discord and Telegram can read it without running JavaScript. Client navigation
updates the same metadata. Canonical links omit login codes, tokens and arbitrary
query parameters; recognized workspace tab names may be retained. Private areas
request `noindex, nofollow`.

## Running the frontend

Use a supported Node version. After `npm run build` in `frontend`, run `npm run
serve`. The production Docker image runs the same Node server. A generic static
file server will only serve the default HTML metadata, so it does not provide
record-specific previews. `npm start` also injects route metadata through the
development middleware.

The client metadata component is `frontend/src/metadata/PageMetadata.jsx` and
the route description data is `frontend/src/metadata/routeDescriptions.json`.
Keep the component import's `.jsx` extension explicit: on a Windows bind mount,
an extensionless import can resolve to a stale JSON path and prevent the
development frontend from compiling.

| Setting | Purpose |
| --- | --- |
| `PORT` | Frontend listener, default 3000 in its container; use an unused alternative locally |
| `HOST` | Listener address, default `0.0.0.0` |
| `FRONTEND_URL` | Public origin for canonical links, default `https://orbiters.cc` |
| `REACT_APP_BACKEND_URL` | Browser API base and default preview API destination |
| `SHARE_API_URL` | Optional server-only API origin for preview lookup |

The public API endpoints are `GET /link-preview/assets/:id`,
`GET /link-preview/blog/:id` and `GET /link-preview/user/:id`. They perform
anonymous, visibility-filtered reads and never require a scraper login. The
frontend limits lookup time to 1.5 seconds and retains the generic preview when
the API is unavailable. Shared messaging services can retain their own cached
previews after a page changes.

Route descriptions live in `frontend/src/metadata/routeDescriptions.json`.
`frontend/scripts/build-brand-assets.cjs` regenerates icon and share-image assets
from the existing navbar SVG; its image renderer uses the backend Sharp dependency.
