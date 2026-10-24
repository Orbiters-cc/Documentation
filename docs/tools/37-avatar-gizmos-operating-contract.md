---
title: Avatar Gizmos Operating Contract
section: Tools
order: 237
audience: creator, dev
stage: stable
id: orbiters.tools.xray-gizmos-operating-contract
domain: mixer
type: reference
owner: orbiters-engineering
lastVerified: 2026-10-24
relations: orbiters.tools.refit-operating-contract
---

# Avatar Gizmos Operating Contract

For the public workflow, start with [Inspect an avatar with Avatar Gizmos](/documentation/orbiters.tools.xraygizmos-get-started) and [controls and troubleshooting](/documentation/orbiters.tools.xraygizmos-controls).

Avatar Gizmos render editor-only armature, bone-weight, and mesh-edge overlays in the
Unity Scene view. They are part of Orbiters Toolkit (formerly the XRay Gizmos package), which comes with every
Orbiters tool, Mixer included. Open the window from `Tools > Orbiters > Avatar Gizmos`.

- Display the active selection, a pinned object, or all skinned armatures in loaded
  scenes.
- Bone picking selects the source hierarchy transform, never the hidden gizmo
  object.
- Weight mode colors cloned editor-only skinned meshes and can resolve a selected
  bone or armature root across loaded scenes.
- Edge mode follows current blendshape deformation and bone weights without
  modifying source meshes.
- ReFit debug labels are discovered through snapshot naming and editor preference;
  Avatar Gizmos have no dependency on ReFit.

Generated objects must stay hidden, editor-only, and unsaved. Armature identity is
derived from usable `SkinnedMeshRenderer` bone arrays, and multiple renderers that
resolve to the same armature are displayed once.

<alpha>

## Leaf-helper refresh

The local fix refreshes affected armature gizmos when a non-deforming tail helper
is added, moved, or removed. The visible leaf endpoint, picking region, and hover
highlight follow the updated helper without toggling the gizmos off and on. Ordinary
avatar movement and bone rotation use skinning without rebuilding the gizmo mesh.
Helpers remain outside the renderer's deforming bone list.

`Orbiters.Toolkit.Editor.Tests.XRay.XRayGeometryTests.RunOrThrow()` checks these
transitions in a temporary preview scene and compares baked vertices with picking
endpoints. This fix is local and has not been released.

## Multi-frame blendshape edges

The local edge-overlay fix follows Unity's blendshape evaluation when a shape has
multiple frames, including weights above the final frame and zero weights when
frames start below zero. These cases previously placed edges away from the
rendered surface. Single-frame shapes keep their existing scaling behavior.

`Orbiters.Toolkit.Editor.Tests.XRay.XRayBlendShapeTests.RunOrThrow()` compares the
overlay calculation with Unity's baked mesh in a temporary preview scene. This
fix is local and has not been released.

</alpha>


<audience include="dev">

## Releases

Avatar Gizmos ship in Orbiters Toolkit releases (`Orbiters-cc/Toolkit`); see
[Unity package releases](../development/unity-package-releases.md). The Toolkit's manifest lists
`orbiters.xraygizmos` under `legacyPackages`, so Creator Companion replaces the former package with it.

</audience>


<alpha>

## Mesh-edge skinning refresh

The local skinning refresh fix keeps mesh edges aligned when a renderer's bone
list or root bone changes without replacing its mesh. Explicit refresh and the
periodic editor check synchronize the overlay's bindings and skin quality.
Ordinary bone movement continues through skinning; these updates preserve the
existing edge mesh. Toggling edge mode is no longer needed after retargeting.
This fix is not yet included in a published package release.

</alpha>

<alpha>

## Shared mirror posing service

A Mirror toggle sits in the Scene-view toolbar and the window. Avatar Gizmos resolve
the selected avatar and present status; matching,
reference frames, reflected rotation/translation and Undo handling live in
`Orbiters.Toolkit.Editor.Posing.MirrorPoseService`. Both live in the Toolkit's
editor assembly, `Orbiters.Toolkit.Editor`.

The service watches explicit Undo transform modifications on one enabled rig.
It does not continuously drive scene bones. Humanoid mappings precede unambiguous
mirrored hierarchy paths. It uses mesh bind frames, or an enable-time relative
reference for pairs missing complete bind data. Both-side edits take precedence
over mirroring. Rotation and movement are supported; scale and animation recording
are excluded. See [controls and troubleshooting](/documentation/orbiters.tools.xraygizmos-controls)
for usage and boundaries.

</alpha>