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
lastVerified: 2026-09-26
---

# Change avatar textures with My Avatar

My Avatar is a component on your avatar root. It imports texture sets, matches
them to the avatar's materials and keeps unresolved choices in the Inspector.
Your settings and last material snapshot are saved with the scene.

## Install and apply a texture set

1. Install **My Avatar** through the Orbiters VPM listing. Its dependencies are
   Orbiters Toolkit, Unit Git and the VRChat avatar SDK, on Unity 2022.3.
2. Select your avatar root in an open scene and add **Orbiters > My Avatar** from
   Add Component. The GameObject menu has the same command.
3. Drop your PNG, JPG or TGA images into the dashed input. You can drop several
   files together or select a folder. A folder includes its immediate images.
4. Clear matches apply automatically. The Inspector lists files that still need
   attention. Choose a material slot, then **Apply selected matches**.
5. Choose between competing variations yourself, such as two eye colors. My
   Avatar keeps them unassigned until you make that choice.

The tool considers the current shader's visible 2D texture slots, current texture
names and material names. Each drop supports up to 48 files, 256 MB per file and
1 GB in total. It copies imports and creates material copies under
`Assets/Orbiters/MyAvatar/`; source images and source materials remain unchanged.

My Avatar and MCB use the same Toolkit Inspector shell, background glow, account
row, buttons and inline warning cards. Magic Sync is optional for My Avatar:
you can apply clear local matches without an account or network connection.

## Undo and save

**Undo last apply** restores the previous renderer material assignments. It works
after a scene reload when the component and scene were saved. A subsequent apply
replaces this persistent snapshot. Unity's regular Undo also records the changes.
If renderer assignments were changed separately since the apply, My Avatar asks
you to resolve those edits before restoring its snapshot.

**Save · Unit Git** saves the avatar scene and commits `texture change` in the
Unity project's Git repository. Initialize the repository in Unit Git first.
The commit includes this scene's current changes, generated files and their Unity
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
ignored, and conflicting alternatives remain for your choice. Provider or
connection errors appear inline and local matching remains available.
