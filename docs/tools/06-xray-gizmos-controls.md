---
title: XRayGizmos controls and troubleshooting
section: Tools
order: 142
audience: public
stage: stable
id: orbiters.tools.xraygizmos-controls
domain: xraygizmos
type: reference
owner: orbiters-xraygizmos
lastVerified: 2026-09-07
relations: orbiters.tools.xraygizmos-get-started
---

# XRayGizmos controls and troubleshooting

Open **Tools > Orbiters > XRay Gizmos** for the full controls. For a first walkthrough, start with [Inspect an avatar with XRayGizmos](/documentation/orbiters.tools.xraygizmos-get-started).

## Choose a target

| Target | What it follows | Useful when |
| --- | --- | --- |
| Selected object | The current selection | Inspecting one object quickly |
| Pinned object | The object assigned in the window | Keeping a rig visible while selecting other objects |
| Whole scene | Skinned armatures across loaded scenes | Comparing rigs or finding a bone through an avatar |

Armatures come from usable skinned-mesh bone arrays. Multiple renderers sharing an armature do not produce duplicate skeletons. The window's **Meshes**, **Bones**, status, and **Visible** list help confirm which objects were resolved. Use **Select** beside a visible target to locate it.

## Overlay controls

| Control | Effect |
| --- | --- |
| Show XRay armatures | Displays skeleton overlays through the model |
| Shape, Thickness, Color | Adjusts bone appearance |
| Clickable scene bones | Highlights hovered bones and selects their source transforms |
| Show weight paint | Previews selected bone or root influence on skinned meshes |
| Weight alpha | Adjusts weight-preview transparency |
| Show mesh polygon edges | Displays mesh edges following bone and blendshape deformation |
| Edge opacity, Edge color | Adjusts edge contrast |
| Refresh | Rebuilds the overlays |
| Clear | Disables armature, weight, and edge overlays |

Weight visualization uses a blue, cyan, green, yellow, red ramp from low to high influence. It is read-only. Generated overlay objects are hidden, editor-only, and not saved into the scene.

## Scene-view toolbar

The **XRay Gizmos** Scene-view overlay provides **Bones**, **Weight paint**, **Mesh edges**, and **Extra** controls without keeping the full window open.

Turning on **Bones** from this toolbar enables **Whole scene** and clickable bones. Its dropdown lets you choose **Whole scene**, **Selected object**, **Disable**, or **Open XRay Gizmos Window**. Turn Bones off to disable both armature display and bone picking.

**Extra** controls gizmos registered by other installed tools. Its dropdown can enable or disable entries individually or together. **No extra gizmos registered** simply means no tool has supplied an entry.

XRayGizmos can discover ReFit debug labels from available snapshots. ReFit is optional; enabling XRayGizmos does not create a ReFit run or a debug snapshot.

## When something is missing

| Symptom | Check |
| --- | --- |
| No skeleton appears | Work in Scene view, enable armatures, and select a rigged root with usable `SkinnedMeshRenderer` bones. A static mesh alone has no skinned armature to show. |
| Pinned view is empty | Assign the intended root in the Object field. |
| Too many rigs appear | Change Whole scene to Selected object or Pinned object. |
| Clicking bones does nothing | Enable Clickable scene bones. |
| Weight colors cover more than one bone's influence | Select a single bone instead of an armature or renderer root. |
| No weights appear for a bone | Check that a loaded skinned mesh actually has positive weight assigned to it. |
| Mesh edges are missing | Enable their toggle and select a skinned mesh or a bone/root that resolves to one. |
| The overlay is hard to read | Adjust thickness, color, or opacity; disable overlays you are not currently using. |
| The result looks stale after editing the scene | Use Refresh and check the resolved target list again. |

The overlay is a diagnostic view. A visible skeleton or weight gradient does not by itself prove that a rig, ReFit result, or exported avatar is correct.
