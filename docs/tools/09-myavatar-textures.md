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

The import reuse, Redo, suggested-target, remembered-slot and background AI
behavior below requires My Avatar 0.1.0 or later.

## Install and apply a texture set

1. Install **My Avatar** through the Orbiters VPM listing. Its dependencies are
   Orbiters Toolkit, Unit Git and the VRChat avatar SDK, on Unity 2022.3.
2. Select your avatar root in an open scene and add **Orbiters > My Avatar** from
   Add Component. The GameObject menu has the same command.
3. Drop your PNG, JPG or TGA images into the dashed input. You can drop several
   files together or select a folder. A folder includes its immediate images.
4. Clear matches apply immediately, usually within a second for textures already
   in the project. The Inspector lists files that still need attention. Choose a
   material slot, then **Apply selected matches**.
5. When two colour images point at one slot and exactly one is mostly black with
   bright details, it goes to the material's emission slot; for example an eye
   emission image named like a second BaseColor. If textures remain unmatched and
   AI is available, Orbiters checks them in the background and applies confident
   answers when they arrive. Remaining uncertain matches offer **Use this on …**
   or a manual slot choice.
6. Dropping the same texture set on the same avatar again reuses the slots you
   applied before, including choices you made manually.

The tool considers the current shader's visible 2D texture slots, current texture
names across each material and material names. Primary slots take precedence over
detail layers for ordinary color and normal maps. Each drop supports up to 48 files, 256 MB per file and
1 GB in total. Existing project textures are reused. A persistent cache checks only
the external files you drop, using their path, file size and modification timestamps;
unchanged files are not copied again. New files are copied in parallel without
content hashing; the tool never scans the project texture library. New texture copies
are cached under `Assets/Orbiters/MyAvatar/Textures/`, so repeated drops reuse them.
A normal map with incompatible import settings gets a correctly configured copy;
source settings stay unchanged. Material copies stay under `Assets/Orbiters/MyAvatar/`.

File discovery and copying run in the background. Unity still performs new asset
imports on its main thread, in one batch. Import settings are written before the
first import, so each new image is imported once. Existing reusable images are not
reimported. Image statistics for matching use tiny GPU readbacks that take a few
milliseconds for a whole set.

My Avatar and MCB use the same Toolkit Inspector shell, background glow, account
row, buttons and inline warning cards. Magic Sync is optional for My Avatar:
you can apply clear local matches without an account or network connection.

## Undo and save

**Undo last apply** restores the previous renderer material assignments, then
becomes **Redo last apply**. Redo restores the saved result without importing
textures or repeating AI matching. Both actions preserve the saved snapshot. It works
after a scene reload when the component and scene were saved. Each drop is one
operation: AI matches that arrive later and **Apply selected matches** extend it, so
Undo returns to the materials from before the drop. A new drop replaces this
persistent snapshot. Unity's regular Undo also records the changes, with background
AI matches as their own step.
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
The backend enforces this preference.

AI is only asked about textures local matching could not place, after the local
matches are already applied. The request contains those textures' filenames,
dimensions and pixel statistics measured in Unity (grayscale, normal-color, black
and bright coverage, mean brightness), plus the material names, current texture
names and shader slots that are still free. No image data and no computer paths
are uploaded. The configured Orbiters AI provider processes
that context. Orbiters retains request status and usage, but excludes source
context and model output from AI history; provider processing follows that
provider's configured data policy.

The model can only suggest IDs from the supplied textures and free slots, so it
cannot displace local matches or slots remembered from an earlier apply.
Assignments below 90% confidence are ignored. An answer is discarded if you drop
again, change a slot, or use Undo/Redo while it is pending. Unresolved alternatives
remain for your choice. Provider or connection errors appear inline and the local
matches stay applied.
