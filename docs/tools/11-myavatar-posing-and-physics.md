---
title: Pose, physics and parameters with My Avatar
section: Tools
order: 192
audience: public, creator, dev
stage: beta
id: orbiters.tools.myavatar-posing-physics
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-09-27
---

# Pose, physics and parameters with My Avatar

Below the thumbnail, the My Avatar component has three more sections: **Posing**,
**Hair, tail & toes** and **Parameters**. This page describes My Avatar 0.4.0 with
Orbiters Toolkit 0.2.5 and XRay Gizmos 0.2.1.

## Posing

Three switches help while posing the avatar in the Scene view. Hover one for a short
explanation.

- **Bones** draws the avatar's bones through XRay Gizmos. Click a bone to select it,
  then rotate it with the Rotate tool (E).
- **Symmetry** mirrors each rotation or move of a left or right bone onto the other
  side. It stays on while nothing can be mirrored and starts as soon as you select a
  bone or an avatar. See [XRay Gizmos controls](06-xray-gizmos-controls.md) for the
  details it shares with **Mirror**.
- **Clothing** keeps clothing and accessories that are not merged yet in the avatar's
  pose. These have their own armature under the avatar and are merged at build by
  VRCFury Armature Link or a similar tool. Each clothing bone keeps its rest offset
  from the matching avatar bone, so the result matches what the build produces. The
  list under the switches shows each accessory and how many of its bones matched the
  avatar; click one to select its armature.

Pose edits remain normal Unity edits: one Undo reverts the avatar and the mirrored
or following bones together.

## Hair, tail & toes

My Avatar finds the hair, tail and toe PhysBones by name, such as `Hair_Front`,
`Ponytail`, `Tail1`, `Toe_L` or toe beans, from the bone a PhysBone starts at or the
object holding it. Each part has a card:

- **Grab**: who can grab it in VRChat, **Nobody**, **Only me** or **Everyone**.
- **Pose**: who can leave it in a new pose after grabbing it. It cannot be wider
  than **Grab**; choosing a narrower **Grab** narrows **Pose** too.
- **Stretch**: how much longer it gets when pulled, from off to three times its
  length. Drag the ruler; double-click turns it off.

VRChat has no friends-only choice, so it is not offered. A choice applies to every
PhysBone of that part and can be undone. When the PhysBones of a part differ, no
choice is highlighted until you pick one.

Chains of the avatar's own armature that are named like one of these parts but have
no PhysBone are listed with **Add physics**. It adds one PhysBone per chain on
`PhysBones/Hair`, `PhysBones/Tail` or `PhysBones/Toes` under the avatar root, with
motion settings suited to the part and the part's current grab, pose and stretch
settings. Humanoid bones, accessories placed on a bone and chains already driven by a
PhysBone are never offered.

## Parameters

VRChat syncs at most 256 bits of avatar parameters. **Parameters** estimates what
the avatar will use once VRCFury has built it, without building: the avatar's own
expression parameters, what VRCFury toggles, sliders and full controllers add, and
what is left. The count updates as you edit the hierarchy; the refresh icon counts
again.

**Compress parameters** adds or removes VRCFury's Parameter Compressor on the avatar.
The line under it shows how many bits it saves, or would save. Without VRCFury the
switch is unavailable and only the avatar's own expression parameters are counted.
