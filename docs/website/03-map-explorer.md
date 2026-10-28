---
title: Explore VRChat worlds on the Map explorer
section: Website
order: 103
audience: public, user, creator, mod, admin, dev
stage: alpha
id: orbiters.website.map-explorer
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-10-20
relations: orbiters.tools.desktop-worlds, orbiters.tools.desktop-sessions, orbiters.website.knowledge-map
---

# Explore VRChat worlds on the Map explorer

The **Map explorer** (`/maps`, **Maps** in the navigation bar) searches VRChat worlds and shows the ones members
captured: a 3D preview you can walk around in, and the pictures members took there.

**Release status:** the Map explorer is not released yet.

## Find a world

- Before you search, **Captured by members** lists the worlds with a 3D preview or pictures, the latest first. A **3D**
  badge marks worlds that open in 3D; the picture count shows how many pictures members added.
- Type in the search field to search VRChat's public worlds; results update as you type, and the search stays in the
  page address so you can share it. Paste a world's link from vrchat.com (or its `wrld_…` ID) to open that world
  directly.
- When VRChat's search is unavailable, the page says so and searches the worlds Orbiters already knows instead.

## Explore a world

Click a card: its picture grows into the world's page.

- **3D preview:** the world streams in around the camera the capture starts on, then outward. Drag to look around, right-drag to
  move, and scroll to zoom once you clicked into it (the page keeps scrolling otherwise); the arrow keys work while the
  view has focus. The full-screen button fills the screen. When several members shared a preview, **3D previews**
  switches between them. A browser that cannot draw it (no WebGL 2) keeps the world's picture and says so.
- **About:** the world's author, player count, visits and favorites on VRChat, its author's tags and description.
- **Open in VRChat** opens the world's page on vrchat.com.
- **Pictures:** members' pictures of the world. Click one to see it large; the arrows, a swipe or ←/→ go through them.

A world with no preview yet explains how to capture it.

## Add a world

Previews and pictures come from Orbiters - N4N0, from the worlds you visited: see
[Share your visited worlds from Orbiters - N4N0](../tools/23-orbiters-desktop-visited-worlds.md). Everything shared is
public. Only public VRChat worlds are listed.

## Report a preview or picture

**Report a problem** under a world's 3D preview sends it to the moderators, like other reports on Orbiters, who can
take down any preview or picture.

<audience include="dev">
## API

Routes in `backend/src/routes/mapsRouter.js` (services in `backend/src/services/maps/`):

- `GET /maps/featured?page=` and `GET /maps/search?q=&page=` (24 worlds a page; `source: "orbiters"` when the index
  answered instead of VRChat), `GET /maps/worlds/:worldId?page=` (previews, 48 pictures a page, `pictureCount`).
- Signed in (website session or an Orbiters editor credential): `GET /maps/mine`,
  `POST /maps/worlds/:worldId/previews` (`.splat` of at most 24 MB and 1,000 splats or more, with VRChat's splat trees
  `vrchatPc`, `vrchatQuest` and `vrchatCoarse`, OrbitersContracts `Docs/splat-tree.md`; the whole upload stays under
  Cloudflare's 100 MB),
  `POST /maps/worlds/:worldId/pictures` (at most 12, 25 MB each, re-encoded to WebP with a 640-pixel thumbnail,
  deduplicated per member by the original's SHA-256), `DELETE /maps/previews/:id` and `DELETE /maps/pictures/:id`.
- VRChat worlds (N4N0 - 3D picture viewer): every shown preview with splat trees holds one of 1,024 slots, freed when it
  is replaced or removed. `GET /maps/vrchat/previews` lists them (slot, key, world name, uploader, splat counts, start
  view, sky). A slot's files are also published at fixed keys of the public bucket
  (`public/vrchat/slots/<slot>/pc|quest|coarse|sky.jpg`, cached a minute), which worlds download from storage
  directly, since VRChat's loaders follow no redirect.
- A preview's files (web `.splat`, splat trees, sky maps) are kept in R2 only, never on the server's disk.
- World details are VRChat's public details, cached 24 hours (`MapWorlds`); VRChat search runs through the shared
  service account. The website draws previews with GaussianSplats3D (MIT) on three.js.
</audience>
