---
title: View and make 3D captures in the N4N0 world
section: Tools
order: 215
audience: public, creator, dev
stage: alpha
id: orbiters.tools.n4n0-world
domain: desktop
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-29
relations: orbiters.tools.desktop, orbiters.tools.desktop-worlds
---

# View and make 3D captures in the N4N0 world

The viewer world lists 3D captures made with Orbiters - N4N0. Pick a capture to show it to everyone in the instance.
Search by world, author or the member who made the capture. **Refresh** asks Orbiters for an updated list.

This is an alpha feature in the local world project. The world has not been built or uploaded as part of this update.

## Captures shared with you

**Shared with you** appears when the listing contains captures addressed to your current VRChat display name.
Its arrows browse your shared captures separately from the public list. Search applies to both lists.
Opening a shared capture shows it to everyone in the instance, including people it was not addressed to.

**Not loaded right now** means the capture has no downloadable slot. Its card stays dimmed and cannot be opened.
Refresh later after Orbiters - N4N0 has requested that capture again. The desktop presence service controls when
shared entries appear; the world cannot sign in to your Orbiters account.

## Make your own capture

Choose **I want to capture** in the viewer menu, then **Add N4N0 to my avatar**.

1. Select and copy the download-page link, then open it on your PC. The world provides a selectable URL field; it
   cannot write your clipboard.
2. In the desktop app's **Capture** tab, click **Add to my avatar** and follow the instructions.
3. Capture in game.
4. In **Visited worlds**, click **Share**.

**Use this capture avatar** is disabled with **Coming soon** until a public capture avatar has been configured.
Once configured, choosing it switches only your avatar and opens the shorter capture tutorial. Every tutorial has
a **Back** button.

<audience include="dev">

The link is currently `https://orbiters.cc/n4n0`, the agreed fallback. The frontend source has no public N4N0
download page route yet; download-file endpoints are not used as a substitute. Providing that public page remains
an integration requirement before this tutorial is released.

Set `CaptureAvatarId` at the top of `Assets/N4N0Viewer/Editor/ViewerSceneBuilder.cs`, then run **N4N0 › Build Viewer
Scene**. The builder writes it only into the pedestal's `blueprintId`; menu availability reads that field.
The button calls `SetAvatarUse(Networking.LocalPlayer)`. The chosen avatar must be available to the player.

The listing contract is `GET /maps/vrchat/previews`. Missing `shared` means public; `shared: true` requires an exact
display-name match in `for` for local navigation. Hidden entries remain in the catalog so an instance's synced
slot and key resolve for every player. Other-capture navigation applies the same local visibility checks. A null
slot stays in the catalog as unavailable and never starts a file or thumbnail request. Display-name filtering is
local navigation, not authenticated file access.

Run **N4N0 › Validate Listing Contract** to check public defaults, recipient matching, null slots, malformed fields
and remote-selection lookup without network calls.

## Separate PC and Quest display settings

My World adds **Orbiters › My World › Platform variant** to scene objects. Choose PC, Android (Quest), or iOS in
the component. Its Inspector lists the scene's variants. My World applies their active states when the editor's
build target changes and before world builds, including inactive objects, and removes the authoring marker from
processed builds. A parent can still keep a matching variant inactive.
Queued refreshes run on editor updates, including while Unity stays in the background; an Inspector repaint is not required.

The generated viewer has **Display settings - PC** and **Display settings - Quest**, each containing
`SplatDisplaySettings` with the pre-existing rendering, quality-ladder and auto-quality values. The viewer uses the
active settings object. Tune each independently; rebuilding the viewer preserves both. An iOS viewer build needs
its own settings object and reference; this world update supplies PC and Quest variants only.

EasyQuestSwitch also installed in this project swaps selected properties between PC and Quest through a scene
registry. My World's component selects whole objects, includes iOS and enforces the rule before builds. Use either
tool to control a particular object's active state, so two tools cannot fight over the same object.

Editor checks cover platform selection without changing the editor build target. They do not replace PC/Quest
client, avatar-switching, clipboard, or multi-client networking verification.

</audience>
