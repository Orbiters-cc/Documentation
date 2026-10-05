---
title: Pose, physics and parameters with My Avatar
section: Tools
order: 192
audience: public, creator, dev
stage: stable
id: orbiters.tools.myavatar-posing-physics
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-09-28
---

# Pose, physics and parameters with My Avatar

Below the thumbnail, the My Avatar component has more parts: **Posing** and one
card each for **Hair**, **Tail** and **Toes** (and **Parameters** before My Avatar
0.9.1). A bottom toolbar opens
**Settings** (production or development server; production is the default) and, when
MCB is installed, the **Blendshape Links** tool. This page describes My Avatar 0.4.0 with
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
- **Clothing** (beta) keeps clothing and accessories that are not merged yet in the
  avatar's pose. It follows each accessory as it will be attached at build: VRCFury
  Armature Links, the links My Avatar creates for accessories and clothes, and rigid
  props that follow one bone. Each clothing bone keeps its rest offset from its avatar
  bone, so the result matches what the build produces. The list under the switches
  shows each accessory and how many of its bones matched the avatar; click one to
  select its armature. The preview is temporary: switching Clothing off puts the
  accessories back where they were.

Pose edits remain normal Unity edits: one Undo reverts the avatar and the mirrored
or following bones together.

## Hair, tail and toes

My Avatar finds the hair, tail and toe PhysBones by name, such as `Hair_Front`,
`Ponytail`, `Tail1`, `Toe_L` or toe beans, from the bone a PhysBone starts at or the
object holding it. Each part has its own card; the cards flow into as many columns
as the Inspector is wide.

- **Grab**: who can grab it in VRChat: **Nobody**, **Only me** or **Everyone**, each an
  icon button.
- **Pose**: who can leave it in a new pose after grabbing it. It cannot be wider
  than **Grab**; choosing a narrower **Grab** narrows **Pose** too.
- **Stretch**: a slider for how much longer it gets when pulled, from off to three
  times its length.

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

VRCFury 1.1334.0 controls compression during its build. The older **Compress
parameters** switch adds or removes a deprecated component and does not control
that behavior. Use VRCFury's global compression settings and check the completed
build for actual parameter use.

My Avatar 0.5.1 with Toolkit 0.2.6 replaces that switch with the actual compression
status and labels counts **before compression**. Independent Full Controllers no
longer merge their local parameter names in the estimate. Ignored PhysBone branches
remain eligible for discovery, and clothing offsets follow scale changes. See
[Unity package safety and avatar workflow fixes](unity-package-safety-fixes.md).

### Avatar budget

My Avatar 0.9.1 removes the section. XRay Gizmos 0.2.8 shows the avatar budget in a
panel over the Scene view instead: parameters as built, including what VRCFury's
compression leaves, and the bones, PhysBones and contacts that set the PC performance
rank. See [XRayGizmos controls](/documentation/orbiters.tools.xraygizmos-controls).
