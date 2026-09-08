---
title: XRay Gizmos Operating Contract
section: Tools
order: 140
audience: creator, dev
stage: stable
id: orbiters.tools.xray-gizmos-operating-contract
domain: xraygizmos
type: reference
owner: orbiters-xraygizmos
lastVerified: 2026-09-08
relations: orbiters.tools.refit-operating-contract
---

# XRay Gizmos Operating Contract

For the public workflow, start with [Inspect an avatar with XRayGizmos](/documentation/orbiters.tools.xraygizmos-get-started) and [controls and troubleshooting](/documentation/orbiters.tools.xraygizmos-controls).

XRay Gizmos renders editor-only armature, bone-weight, and mesh-edge overlays in the
Unity Scene view. Open it from `Tools > Orbiters > XRay Gizmos`.

- Display the active selection, a pinned object, or all skinned armatures in loaded
  scenes.
- Bone picking selects the source hierarchy transform, never the hidden gizmo
  object.
- Weight mode colors cloned editor-only skinned meshes and can resolve a selected
  bone or armature root across loaded scenes.
- Edge mode follows current blendshape deformation and bone weights without
  modifying source meshes.
- ReFit debug labels are discovered through snapshot naming and editor preference;
  XRay Gizmos has no package dependency on ReFit.

Generated objects must stay hidden, editor-only, and unsaved. Armature identity is
derived from usable `SkinnedMeshRenderer` bone arrays, and multiple renderers that
resolve to the same armature are displayed once.

<alpha>

## Leaf-helper refresh

The local fix refreshes affected armature gizmos when a non-deforming tail helper
is added, moved, or removed. The visible leaf endpoint, picking region, and hover
highlight follow the updated helper without toggling XRay off and on. Ordinary
avatar movement and bone rotation use skinning without rebuilding the gizmo mesh.
Helpers remain outside the renderer's deforming bone list.

`Orbiters.XRayGizmos.Editor.Tests.XRayGeometryTests.RunOrThrow()` checks these
transitions in a temporary preview scene and compares baked vertices with picking
endpoints. This fix is local and has not been released.

</alpha>
