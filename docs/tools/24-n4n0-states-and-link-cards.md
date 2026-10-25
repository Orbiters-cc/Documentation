---
title: Save avatar states and drop link cards with N4N0
section: Tools
order: 214
audience: public, creator, dev
stage: alpha
id: orbiters.tools.n4n0-states-cards
domain: desktop
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-25
relations: orbiters.tools.desktop
---

# Save avatar states and drop link cards with N4N0

N4N0, the companion on your avatar, is driven by Orbiters - N4N0 on your PC. Its menu opens in front of you, projected
by N4N0 like its speech, and follows you loosely as N4N0 does. Two of its features are described here: **States**, which
remember how your avatar is set up and bring it back, and **link cards**, which put a link in the world for the people
around you.

**Release status:** Orbiters - N4N0 and the N4N0 version with these features are not released yet.

## Before you start

- Orbiters - N4N0 running, OSC on in VRChat (**Action Menu › Options › OSC › Enabled**), an avatar with N4N0.
- The menu: N4N0 › **Menu** in your Action Menu, the window's **Home**, or the SteamVR overlay.

## Save and apply a state

A state is every avatar parameter that OSC can change, as it is right now: your toggles, outfits, colours and sliders.

1. Set your avatar up the way you want it.
2. Open **States** (a card on Home) and choose **Save**. In the window you can name it; from the menu in VRChat it is
   saved as "State 1", "State 2"… and you can rename it later in the window.
3. **Apply** puts every saved value back at once, even the ones that seem unchanged.

Each state has two switches, both off at first:

- **Include GoGoLoco pose:** the saved pose (GoGoLoco's parameters) comes back too.
- **Include avatar size:** your eye height comes back too, unless the world forbids scaling.

States belong to an avatar: the page shows the ones of the avatar you wear. N4N0's own settings and the capture
kit's record toggle are never saved, and a parameter the avatar no longer has is skipped and reported.

## Default state

**Set as default** marks one state per avatar. It is applied a few seconds after you switch to that avatar and after
you join a world, once VRChat has restored its own values. Choose it again to remove the mark.

## Drop a link card

1. Search YouTube from N4N0's menu and choose **Copy link** on a result: the link is in your PC's clipboard.
2. **Drop** appears beside it. Choose it: the card appears in front of you with the video's picture, its title, the
   link and **Grab to copy link**, and stays where you dropped it for 15 seconds while a bar counts down.
3. Anyone around you who also runs Orbiters - N4N0 with N4N0 on their avatar can put a hand on the card: the link is
   copied to their PC's clipboard. Everyone else sees the card and can read the link.

Opening the menu again takes the card away. To know which card someone grabbed, Orbiters keeps the newest link dropped
in your VRChat instance for 20 seconds, filed under a code that only people in that instance can work out; it never
learns which world or instance it is.

<audience include="dev">

States live in `avatar-states.json` beside the desktop's settings. Values are read from VRChat's OSCQuery `/avatar`
tree (writable nodes only) and sent back in bundles; `/avatar/eyeheight` carries the size. Link cards use the screen's
page 15 and freeze through `N4N0/Screen/Drop` (owner) and text pointer 253 (everyone else); hands report
`N4N0/Card/TouchL` and `TouchR`; the server endpoints are `POST /orb/drops` and `GET /orb/drops/latest`. Contract:
Orbiters-N4N0 contracts, `Docs/orb.md` (Saved states, Link card).

</audience>
