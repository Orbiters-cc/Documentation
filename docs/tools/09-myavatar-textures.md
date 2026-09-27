---
title: Change avatar textures with My Avatar
section: Tools
order: 190
audience: public, creator, dev
stage: beta
id: orbiters.tools.myavatar-textures
domain: general
type: how-to
owner: orbiters-engineering
lastVerified: 2026-09-27
---

# Change avatar textures with My Avatar

My Avatar is a component on your avatar root. It imports texture sets, matches
them to the avatar's materials and keeps unresolved choices in the Inspector.
Your settings and last material snapshot are saved with the scene.

The import reuse, Redo and suggested-target controls below are part of the next
package update after 0.0.1; they are not present in the original 0.0.1 release.

## Install and apply a texture set

1. Install **My Avatar** through the Orbiters VPM listing. Its dependencies are
   Orbiters Toolkit, Unit Git and the VRChat avatar SDK, on Unity 2022.3.
2. Select your avatar root in an open scene and add **Orbiters > My Avatar** from
   Add Component. The GameObject menu has the same command.
3. Drop your PNG, JPG or TGA images into the dashed input. You can drop several
   files together or select a folder. A folder includes its immediate images.
4. Clear matches apply automatically. The Inspector lists files that still need
   attention. Choose a material slot, then **Apply selected matches**.
5. If filenames point multiple images at one slot, connected AI inspects the
   previews before treating them as alternatives. For example, an eye image with
   mostly black pixels may be emission while another BaseColor image is albedo.
   Remaining uncertain matches offer **Use this on …** or a manual slot choice.

The tool considers the current shader's visible 2D texture slots, current texture
names across each material and material names. Primary slots take precedence over
detail layers for ordinary color and normal maps. Each drop supports up to 48 files, 256 MB per file and
1 GB in total. Existing project textures are reused. A persistent cache checks only
the external files you drop, using file size and modification timestamps. Unchanged
files skip hashing and copying. New files are copied and hashed in one background
pass; the tool never scans or hashes the project texture library. New texture copies
are cached under `Assets/Orbiters/MyAvatar/Textures/`, so repeated drops reuse them.
A normal map with incompatible import settings gets a correctly configured copy;
source settings stay unchanged. Material copies stay under `Assets/Orbiters/MyAvatar/`.

File discovery, hashing and copying run in the background. Preview readback uses
asynchronous GPU requests on supported devices. Unity still performs new asset
imports on its main thread, in batches; adjusting new texture settings can require
a second batch. Existing reusable images are not reimported.

My Avatar and MCB use the same Toolkit Inspector shell, background glow, account
row, buttons and inline warning cards. Magic Sync is optional for My Avatar:
you can apply clear local matches without an account or network connection.

## Undo and save

**Undo last apply** restores the previous renderer material assignments, then
becomes **Redo last apply**. Redo restores the saved result without importing
textures or repeating AI matching. Both actions preserve the saved snapshot. It works
after a scene reload when the component and scene were saved. A subsequent apply
replaces this persistent snapshot. Unity's regular Undo also records the changes.
If renderer assignments were changed separately since the apply, My Avatar asks
you to resolve those edits before restoring its snapshot.

**Save · Unit Git** saves the avatar scene and commits `texture change` in the
Unity project's Git repository. Initialize the repository in Unit Git first.
The commit includes this scene's current changes, generated files, reused texture assets and their Unity
metadata. Other project paths and staged changes are excluded. If a required
generated file is ignored by Git, fix the ignore rule and try again. Save does
not push. Undo after saving creates another local change; it does not rewrite
your Git history.

Imported files remain after Undo or cancellation to preserve valid references.
Custom shaders may need a feature toggle or unlocking before a texture is visible.
My Avatar does not change shaders or UVs, convert roughness to smoothness, or pack
separate images into combined texture channels.

## Orbiters account and automatic AI assistance

The account row shares MCB's saved account. Magic Sync connects it; Logout clears
that shared account. AI assistance is automatic while connected and enabled in
your **Orbiters website account settings**. There is no separate switch in Unity.
My Avatar checks this preference before preparing a request; the backend also
enforces it.

The request contains filenames, relative imported paths, dimensions, size,
grayscale and normal-color measurements, material names, current texture names,
shader slots and a small preview contact sheet. It does not upload full-size
images or absolute computer paths. The configured Orbiters AI provider processes
that context. Orbiters retains request status and usage, but excludes source
context and model output from AI history; provider processing follows that
provider's configured data policy.

The model can only suggest IDs from the supplied texture set and available slots.
Existing local matches are preserved, assignments below 90% confidence are
ignored. Filename roles are hints: visual evidence can distinguish color from
emission despite misleading names. The backend measures black coverage and
brightness in each preview, excluding tile padding. Black pixels alone are not
enough to prove emission. Unresolved alternatives remain for your choice. Provider or
connection errors appear inline and local matching remains available.
