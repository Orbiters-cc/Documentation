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
lastVerified: 2026-07-12
relations: orbiters.tools.refit-operating-contract
---

# XRay Gizmos Operating Contract

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
