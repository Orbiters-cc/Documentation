---
title: Add the drawing pen from the My Avatar gallery
section: Tools
order: 194
audience: creator, dev
stage: alpha
id: orbiters.tools.myavatar-drawing-pen
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-05
---

# Add the drawing pen from the My Avatar gallery

The drawing pen is a free accessory in the
[My Avatar asset gallery](14-myavatar-asset-gallery.md). Open **Asset gallery**, find
**Drawing pen** and choose **Add**. It needs a humanoid scene avatar with a VRChat Avatar
Descriptor and VRCFury, which the gallery offers to install. It is for PC avatars:
its ink uses a shader Quest avatars do not allow.

**Release status:** local development implementation (My Avatar 0.9.0, Orbiters
Toolkit 0.3.12). Earlier local versions added the pen from a **Drawing pen** section
of My Avatar; that section is gone. Pens already on an avatar keep working.

When it is added, the pen fits itself to the avatar: it waits in front of the chest
and is held at either wrist.

## Use the pen

1. In VRChat, open **Drawing pen > Enable pen**. The pen appears in front of you.
2. Grab its grip using VRChat's PhysBone interaction. The pen then follows your
   wrist independently of that grab signal. Squeeze your fist, or put your thumb up
   with the index down, to draw; relax the squeeze or point the index to stop ink
   without dropping the pen. Either hand works. Pens added before Orbiters Toolkit
   0.3.13 draw on the fist only until added again.
3. Guests draw while grabbing the pen. Your avatar cannot read their fist gesture,
   so their drawing does not depend on your gesture.
4. Fully open your hand, or choose **Drop pen**, to leave it fixed in the world. Guests release their normal grab to drop it.
5. Use **Clear drawing** to erase the ink while keeping the pen available. Turning
   **Enable pen** off hides the model and erases its stored trail points.

Other people must be allowed to interact with your avatar. This is an avatar
PhysBone prop, not a world pickup: world pickup ownership and desktop pickup
controls do not apply. See VRChat's [PhysBones documentation](https://creators.vrchat.com/common-components/physbones/).

Ink is a native world-space trail with 2 mm vertex spacing, rounded corners and
caps, and a 6 mm default width. It retains strokes for up to three hours unless
cleared first. Avatar reloads and world changes clear it; late joiners do not receive
a replay of earlier strokes. VRChat's particle/line safety settings can hide it.
Mobile behavior and real two-player grabbing have not yet been validated.

## Remove or undo

**Remove** on the pen in **Clothes and accessories** takes it off the avatar; Unity
Undo restores it. Its imported files stay until you run Cleanup. The avatar's authored
controllers and menus are not rewritten; VRCFury merges the pen when building.

<audience include="dev">

## Implementation and verification

Toolkit's `DrawingPenInstaller.CreatePrefab` builds the avatar-independent prefab
and its native Animator state machines; `Bind` fits a placed pen to an avatar (spawn
point from the chest, wrist sources for the hold constraint). Bind runs through
`AttachmentHooks.Prepare`, which My Avatar calls on every placed accessory before
analysing it, so a dropped prefab is fitted the same way. The gallery asset attaches
with the `configured` mode: its own VRCFury setup does the rest. The shared
VRCFury writer attaches the controller, submenu and five unsaved synced bool
parameters through VRCFury's public API. Gesture and PhysBone parameters do not
consume expression parameter slots.

The generated prop uses one PhysBone chain, two self-hand contact receivers,
VRChat parent constraints, three small mesh renderers and one TrailRenderer.
The visible model is outside the stretchable chain and pivots at the grip, 5 cm behind the ink tip. Owner pickups latch the left or right hand with local-only SDK parameter drivers and synchronize those two hold flags. The pen follows that wrist directly, with its PhysBone disabled during the owner hold. A fully squeezed fist cannot drop it when native PhysBone input ends. Ink starts above 35% fist weight and stops below 20%, avoiding pressure flicker. Fully opening the holding hand or using **Drop pen** releases the latch. Freeze-to-world captures a
released pen; the grab base relocates only while the visible pen is frozen, so
stretching the chain does not stretch the model. The editor installation marker
implements `IEditorOnly`; uploaded avatars use native components and animation.

Unity validation covers generated-controller states for both owner hands, guest
grabbing, release, clear, and disable; the five-bit parameter budget; an actual
isolated pen VRCFury merge; and removal followed by Undo. The original card was checked with background screenshots. The updated help text could not be captured on 4 October because the Inspector was an inactive tab; no selection or window focus was changed.
Play Mode checks confirmed the released position stays fixed when the parent
moves and disabling removes existing trail points. These checks simulate the
Animator inputs; they do not establish VRChat network synchronization or remote
PhysBone tracking. The owner reported grip/input issues on Quest / Oculus Touch controllers in the previously published pen. The local correction adds wrist-following, pressure hysteresis and explicit release. Its three focused Unity tests passed, including both hands, full squeeze after grab-signal loss, remote hold flags, 0.7/1.4 scale grip movement, guest ink and clear/disable. A rendered close-up of the closed fist was inspected and the grip position adjusted; another in-client test on those controllers is still required. A two-client VRChat test remains required for guest interaction and synchronization.

</audience>
