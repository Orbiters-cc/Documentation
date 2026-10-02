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
lastVerified: 2026-10-01
---

# Website icons and shared-link previews

The favicon uses the navbar mark. SVG, a 32-pixel PNG and an Apple touch icon are
provided.

## What a shared link shows

The frontend server writes Open Graph and Twitter card tags into the initial HTML,
because Discord, Telegram, X, Slack and WhatsApp read it without running
JavaScript. Every page gets a title, description, canonical URL, site name, type,
a 1200 × 630 image with its size and alternative text, and `twitter:card`
`summary_large_image`. Client navigation applies the same tags.

| Page | Preview | Shown only when |
| --- | --- | --- |
| Asset, commission listing | Name, creator, price, product picture | The listing is published and not hidden or restricted |
| Profile | Name, creator status, asset count, avatar on the banner | The account exists and is not restricted |
| Event plan or invite | Title (invite: step and parent event), community, time in the organizer's zone, banner | Open to everyone, published or planning, not 18+, organizer active |
| Gallery (`/gallery?tab=gallery-N`) | Name, curator, picture count, newest visible picture | The gallery is public and not members-only |
| Community page (`/community/<slug>`) | Name, members, upcoming events, description | The public page is visible |
| Proposal, board, issue, research report | Title, board and status or repository, author, summary | The same anonymous rules as the page; unlisted entries work through their direct link |
| Blog post | Title, author, date, cover | Published |
| Documentation page | Title, section, first paragraph | Readable by visitors at the stable stage |
| VPM repository | Name, author, package count, banner | Owner active; only visible packages are counted |
| Tools, listings, legal and other pages | The page's own card from `routeDescriptions.json` | Always |

Account, staff, creator workspace, sign-in, editing, configuration and private
request pages use generic text and `/share/orbiters.png`, never fetch record data
and request `noindex, nofollow`. Event plans, invites and the unlisted ReFit page
preview normally but are not indexed. Canonical links omit login codes, tokens and
other query parameters, keeping only identifying ones (`tab`, `board`).

Link-preview crawlers receive the page accent as `theme-color`, which Discord uses
for the embed's side bar (violet for assets and profiles, blue for events and
communities, pink for galleries, green for boards, amber for blog posts).

## Preview cards

`GET /link-preview/:kind/:id` returns the anonymous preview data and the card URL
`/link-preview/:kind/:id/card.jpg?v=<hash>`. Kinds are `assets`, `user`, `blog`,
`proposals`, `boards`, `issues`, `research`, `events` (with `?step=`),
`galleries`, `communities`, `documentation` and `vpm`. Cards are rendered with the
backend's Sharp and the bundled Inter font (`backend/src/services/linkPreview/assets`,
SIL Open Font License), so they look the same on every host. Emoji are left out
of the picture.

The hash covers everything drawn on the card, so a new title, price, time or
picture produces a new image URL and chat apps fetch it again. A versioned URL is
cached for a year; an outdated one is answered with the current card and a
five-minute cache. Rendered cards are stored in `LINK_PREVIEW_CACHE_DIR` (default:
the system temporary folder), older versions of the same page are removed, and at
most two cards render at a time.

Pictures come only from public files, media that is already public on the page,
or HTTPS images on public hosts (private network addresses are refused). Discord
gallery links expire, so gallery pictures are read on the server and never handed
to crawlers. A missing picture only removes it from the card.

Route-level cards live in `frontend/public/share/pages`. Regenerate them after
editing `routeDescriptions.json`:

```sh
cd frontend
node scripts/build-share-cards.cjs
```

## Browser colours (Safari)

The UI is black in both system colour schemes. `index.html` declares black
`theme-color` for light and dark, `color-scheme: dark`, a black
`apple-mobile-web-app-status-bar-style`, and paints `html` and `body` black before
any script runs. Safari 26 and later tint the tab bar and toolbar from the page
background, earlier versions from `theme-color`; both stay black.
`frontend/src/metadata/themeColor.js` keeps `theme-color` equal to the rendered
background when the theme or background changes.

## Running the frontend

After `npm run build` in `frontend`, run `npm run serve`. The production Docker
image runs the same Node server. A generic static file server only serves the
default HTML metadata. `npm start` injects the same tags through the development
middleware, which reloads the metadata modules on every request; restart it once
after changing `frontend/server/devMetadata.cjs` itself.

| Setting | Purpose |
| --- | --- |
| `PORT` | Frontend listener, default 3000 in its container; use an unused alternative locally |
| `HOST` | Listener address, default `0.0.0.0` |
| `FRONTEND_URL` | Public origin for canonical links, default `https://orbiters.cc` |
| `REACT_APP_BACKEND_URL` | Public API origin, used for card image URLs and as the default lookup destination |
| `SHARE_API_URL` | Optional server-only API origin for preview lookup |
| `LINK_PREVIEW_CACHE_DIR` | Backend folder for rendered cards |

The frontend limits the lookup to 1.5 seconds and keeps the route preview when the
API is unavailable. Chat apps can keep their own cached preview after a page
changes until they fetch the link again.

The client metadata component is `frontend/src/metadata/PageMetadata.jsx`; route
rules are in `previewRoutes.js` and the tag list in `shareTags.js`. Keep the
component import's `.jsx` extension explicit: on a Windows bind mount, an
extensionless import can resolve to a stale JSON path and prevent the development
frontend from compiling. `frontend/scripts/build-brand-assets.cjs` regenerates the
icons and the generic share image from the navbar SVG.
