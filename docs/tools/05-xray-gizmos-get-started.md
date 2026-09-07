---
title: Inspect an avatar with XRayGizmos
section: Tools
order: 141
audience: public
stage: stable
id: orbiters.tools.xraygizmos-get-started
domain: xraygizmos
type: tutorial
owner: orbiters-xraygizmos
lastVerified: 2026-09-07
relations: orbiters.tools.xraygizmos-controls
---

# Inspect an avatar with XRayGizmos

XRayGizmos helps you see an avatar's skeleton through its mesh, inspect which bones influence a surface, and follow mesh edges as the avatar deforms. Everything appears in Unity's **Scene view**. The overlays are editor-only and leave the source meshes unchanged.

## Before you start

Use a Unity 2022.3 project with the **XRay Gizmos** package installed. Open a scene containing a rigged model with a `SkinnedMeshRenderer`. The package does not require MCB, ReFit, or the VRChat SDK.

This guide starts with the package already installed. If **Tools > Orbiters > XRay Gizmos** is missing, check that Unity has finished compiling and that the package appears in the project's Package Manager. Resolve compiler errors in the Console before continuing.

## See the skeleton through the avatar

1. Select the avatar's root object in the Hierarchy.
2. Open **Tools > Orbiters > XRay Gizmos**.
3. Choose **Selected object** and enable **Show XRay armatures**.
4. Adjust **Thickness** and **Color** until the bones are easy to read against your scene.
5. Enable **Clickable scene bones**. Hover a bone in the Scene view to highlight it in white, then click it to select the actual bone in the Hierarchy.

For a stable inspection target while selecting other objects, choose **Pinned object** and assign the avatar root to the **Object** field. Use **Whole scene** when you need to compare several rigs in loaded scenes.

## Find what a bone influences

Enable **Show weight paint**, then select a bone. XRayGizmos finds skinned meshes influenced by that bone and colors them with a blue-to-red weight ramp: blue means little influence, red means strong influence. Adjust **Weight alpha** to see more or less of the underlying surface.

For example, select an elbow bone while investigating an unexpected sleeve deformation. Check whether the colored influence reaches the area that bends incorrectly. Selecting an armature or renderer root shows combined influence under that root; select an individual bone again when you need to isolate its contribution.

Despite the control's name, this is a **weight preview**. It does not paint or change skin weights. Make the actual correction in your mesh or rig authoring workflow.

## Inspect the surface as it moves

Enable **Show mesh polygon edges**. Select a skinned mesh, or a bone/root that resolves to one. The edge overlay follows the current bone pose and blendshape deformation, making it useful for checking where a surface stretches or folds.

Tune **Edge opacity** and **Edge color** if the lines obscure the model. Weight and edge overlays can be used together.

## Finish the inspection

Use **Clear** to turn off the armature, weight, and edge overlays. It does not delete the avatar or modify its mesh. Use **Refresh** if the visible result needs rebuilding after scene changes.

Continue with the [controls and troubleshooting reference](/documentation/orbiters.tools.xraygizmos-controls) for toolbar shortcuts and missing-overlay checks.

## Development showcases

These posts show the tool's development alongside ReFit work. They are useful context; follow the current controls above when using the package.

- [Early gizmos for ReFit debugging, June 16, 2026](https://x.com/black_orbit_2/status/2066856283915862450).
- [Adding label support, June 18, 2026](https://x.com/black_orbit_2/status/2067591841122271443).
- [ReFit displacement exploration, June 22, 2026](https://x.com/black_orbit_2/status/2069158366203543661).
