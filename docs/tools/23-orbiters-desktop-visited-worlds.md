---
title: Share your visited worlds from Orbiters - N4N0
section: Tools
order: 213
audience: public, creator, dev
stage: alpha
id: orbiters.tools.desktop-worlds
domain: desktop
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-20
relations: orbiters.tools.desktop, orbiters.tools.desktop-sessions, orbiters.website.map-explorer
---

# Share your visited worlds from Orbiters - N4N0

**Visited worlds** lists the VRChat worlds you went to, with the pictures you took in each and the sessions you
recorded there. From a world you choose pictures and a 3D capture to show on the
[Map explorer](../website/03-map-explorer.md) of the Orbiters website.

**Release status:** Orbiters - N4N0 and the Map explorer are not released yet.

## Where the worlds come from

Everything is read on your PC; Orbiters - N4N0 never asks for your VRChat login.

- **Visits:** VRChat writes each world you join in its log, and deletes old logs after a while. Orbiters - N4N0 keeps
  what it reads there (world, name and time of each visit) while it runs in the tray, so the list keeps growing after
  VRChat removed its logs. Visits from before you first started Orbiters - N4N0 are only known from VRChat's remaining
  logs.
- **Pictures:** VRChat writes the world into every picture it saves (in `Pictures/VRChat`, or the folder set in
  VRChat's `picture_output_folder`). Each picture is read once; later visits only read new ones.
- **Captures:** the sessions recorded in the world (see
  [Capture VRChat worlds with Orbiters - N4N0](20-orbiters-desktop.md)).

The newest worlds come first. A card shows your latest picture of the world (or a session's preview, or VRChat's own
picture), how many pictures and captures it has, **3D** when a capture is reconstructed, and **On Orbiters** once you
shared something there. **Search worlds** filters by name; the pictures button opens VRChat's pictures folder.

## Open a world

Click a card: its picture grows into the world's page. It shows the world's author and player count from VRChat's
public page, your visits, pictures and captures, and links to **View on VRChat** and to the world's page on the
**Map explorer**. **Visited worlds** at the top (or Escape) goes back.

## Share pictures

1. Under **Pictures**, hover a picture and click its circle, or use **Select all new**. Once one is selected, clicking
   any picture selects it; clicking a picture otherwise shows it large, with the arrows (or ←/→) going through the
   others and **Select** adding it.
2. Read the bar at the bottom: shared pictures are public on the Map explorer, with every avatar and person in them.
   Pick only pictures the people in them would agree to.
3. Press **Share on Orbiters**. The bar shows the upload's progress; the pictures then carry **Shared**.

Pictures are sent as they are, twelve at a time, at most 25 MB each. Orbiters keeps a copy of at most 2560 pixels
across without the file's metadata (VRChat's picture metadata names the account that took it). A picture you already
shared is recognised and not sent twice, even from another folder. Uploads keep going when you close the window.

## Share a world in 3D

Under **3D preview**, each session recorded in the world shows its state:

- **Reconstruct** rebuilds a session as Gaussian splats on your GPU (the same as in Sessions).
- **Share in 3D** sends a reconstructed session as the world's 3D preview. Orbiters - N4N0 first prepares a web
  version of it (at most 600,000 splats, about 19 MB, the most visible ones kept). The website opens it on the same
  camera as **View in 3D**, and the world streams in around that camera first. It also prepares the versions the
  N4N0 - 3D picture viewer VRChat world loads: the splats as a tree of boxes whose far parts are drawn with fewer,
  merged splats (tuned on your GPU to look like the full ones), for PC (about 32 MB at most), Quest (about 16 MB) and a
  small first view shown while the full one downloads.
- **Replace 3D preview** appears once you shared one: each member keeps one preview per world, and a new one replaces
  yours.

Everything in the capture becomes public, avatars and people included. Share captures of your own worlds, or of places
and people that agree to it.

## Sign in

Sharing uses your Orbiters account. Orbiters - N4N0 uses the sign-in of the Orbiters Unity tools (MCB, My Avatar):
signed in there, you are signed in here, and signing out in either signs out both. Without one, the bar offers to sign
in with Discord or Telegram in your browser, as the Unity tools do; **Settings › Orbiters account** shows the account.

Orbiters lists public VRChat worlds only: sharing is turned off for a private world, or one removed from VRChat.

<audience include="dev">
## How it works

- The tray service keeps the visits in `visited-worlds.json` in the app's config folder (`%APPDATA%/Orbiters/Desktop`),
  reading every `output_log_*.txt` incrementally every 10 seconds (`orbiters_core::visited::History`). A join reads
  `Entering Room: <name>`, `Joining wrld_…`, then `Joining or Creating Room: <name>`.
- Pictures: the PNG `iTXt` chunk `XML:com.adobe.xmp` (`vrc:WorldID`, `vrc:WorldDisplayName`, `xmp:CreateDate`), read
  by seeking past the image data; cached in `cache/screenshots.json` with each file's SHA-256 once needed. Thumbnails
  (480 px, QOI) are cached in `cache/thumbs`.
- World details come from `GET /maps/worlds/:worldId` (public), cached three days; `GET /maps/mine` (in the tray
  service, which holds the credential) gives the hashes of the pictures already shared.
- Uploads: `POST /maps/worlds/:worldId/pictures` (field `pictures`, metadata `{"takenAt": [...]}`) and
  `POST /maps/worlds/:worldId/previews` (field `splat`, metadata `{"view": {"position", "target"}, "quality",
  "capturedAt"}`), multipart with a Content-Length. The `.splat` layout is 32 bytes per splat, right-handed (Unity's Z
  negated), from `orbiters_reconstruct::web::splat_file`.
</audience>
