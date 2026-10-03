---
title: Add a drawing pen with My Avatar
section: Tools
order: 194
audience: creator, dev
stage: alpha
id: orbiters.tools.myavatar-drawing-pen
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-03
---

# Add a drawing pen with My Avatar

The local working version adds **Drawing pen** immediately below **Parameters**.
It requires a humanoid scene avatar with a VRChat Avatar Descriptor and VRCFury
installed. Install it outside Play Mode by pressing **Add drawing pen**.
Adding it again returns the existing pen instead of creating another one.

## Use the pen

1. In VRChat, open **Drawing pen > Enable pen**. The pen appears in front of you.
2. Grab its grip using VRChat's PhysBone interaction. With your own hand near the
   pen, a fist starts drawing and opening that hand stops drawing. Either hand works.
3. Guests draw while grabbing the pen. Your avatar cannot read their fist gesture,
   so their drawing does not depend on your gesture.
4. Release it to leave the pen fixed in the world.
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

Press **Remove pen** in My Avatar to remove the prop and its VRCFury integration.
Unity Undo restores it. Generated materials, controller and menu assets remain
under `Assets/Orbiters/DrawingPen` (or a numbered folder) so Undo and existing
references remain usable. The avatar's authored controllers and menus are not
rewritten; VRCFury merges the pen when building.

<audience include="dev">

## Implementation and verification

Toolkit's `DrawingPenInstaller` owns construction and the native Animator state
machines. My Avatar owns only the card and immediate busy feedback. The shared
VRCFury writer attaches the controller, submenu and two unsaved synced bool
parameters through VRCFury's public API. Gesture and PhysBone parameters do not
consume expression parameter slots.

The generated prop uses one PhysBone chain, two self-hand contact receivers,
VRChat parent constraints, three small mesh renderers and one TrailRenderer.
The visible model is outside the stretchable chain. Freeze-to-world captures a
released pen; the grab base relocates only while the visible pen is frozen, so
stretching the chain does not stretch the model. The editor installation marker
implements `IEditorOnly`; uploaded avatars use native components and animation.

Unity validation covers generated-controller states for both owner hands, guest
grabbing, release, clear, and disable; the two-bit parameter budget; an actual
VRCFury build; background card screenshots; and removal followed by Undo.
Play Mode checks confirmed the released position stays fixed when the parent
moves and disabling removes existing trail points. These checks simulate the
Animator inputs; they do not establish VRChat network synchronization or remote
PhysBone tracking. A two-client VRChat test remains required before release.

</audience>
