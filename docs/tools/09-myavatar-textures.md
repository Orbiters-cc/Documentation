---
title: Change avatar textures with My Avatar
section: Tools
order: 190
audience: public, creator, dev
stage: stable
id: orbiters.tools.myavatar-textures
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-09-28
---

# Change avatar textures with My Avatar

My Avatar is a component on your avatar root. It imports texture sets, matches
them to the avatar's materials and keeps unresolved choices in the Inspector.
Your settings and last material snapshot are saved with the scene.

This page describes texture matching in My Avatar 0.2.0 and later: locked-shader
support, name matching that works with any naming convention, the morphing drop
field and optional Unit Git. For thumbnails, see
[Create a VRChat thumbnail with My Avatar](10-myavatar-thumbnail.md); for posing,
hair/tail/toe physics and parameters, see
[Pose, physics and parameters with My Avatar](11-myavatar-posing-and-physics.md).

<alpha>

To add clothing and props, see
[Add accessories and clothes with My Avatar](12-myavatar-accessories.md).

</alpha>

## Install and apply a texture set

1. Install **My Avatar** through the Orbiters VPM listing. It needs Orbiters
   Toolkit and the VRChat avatar SDK on Unity 2022.3. Unit Git 0.1.3 or newer is optional.
2. Select your avatar root in an open scene and add **Orbiters > My Avatar** from
   Add Component. The GameObject menu has the same command.
3. Drop your PNG, JPG or TGA images into the dashed field. You can drop several
   files together or select a folder. A folder includes its immediate images. The
   field turns into a progress bar, then shows the result with **Undo** and **Save**.
   You can drop another set on it at any time.
4. Clear matches apply immediately, usually within a second for textures already
   in the project. A texture that still needs a slot appears as one row below the
   field: **Use on …** accepts the suggestion and **Choose slot…** picks another;
   either applies right away.
5. When two colour images point at one slot and exactly one is mostly black with
   bright details, it goes to the material's emission slot; for example an eye
   emission image named like a second BaseColor. If textures remain unmatched and
   AI is available, Orbiters checks them in the background and applies confident
   answers when they arrive.
6. Slots you choose by hand are remembered for that file on that avatar and reused
   on the next drop. Automatic matches are recomputed each time, so a wrong guess
   never becomes permanent.

### How matching works

- Every visible 2D texture slot of every material below the component is considered,
  including locked/optimized shaders such as Poiyomi's. A locked shader only keeps
  the features that were enabled when it was locked; when a texture's set belongs on
  a material that lacks the slot (for example emission), My Avatar says so. Enable
  the feature, unlocking the shader if needed, and drop again.
- File names are split into words and compared with the name of the texture now in
  each slot, the material and mesh names, and the material's other textures. Role
  words such as BaseColor, Normal, `_N` or Emissive decide the kind of slot. Words
  shared by many materials (a base or author name) count little, and words shared by
  most dropped files (an export prefix) are ignored, so any naming convention works.
- Visible objects come first; disabled variants and particle or trail materials rank
  last. Primary slots are preferred over detail, matcap and rim layers.
- Files of one set follow the material their siblings matched. Materials of one mesh
  that share the same UV layout, such as colour variants of the same hair strands,
  receive the set together. A texture also replaces the old one wherever the old one
  was used in the same kind of slot.

Each drop supports up to 48 files, 256 MB per file and
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
row, buttons and inline warning cards. An account is optional for My Avatar:
you can apply clear local matches without an account or network connection.

## Undo and save

**Undo** restores the previous renderer material assignments, then becomes
**Redo**. Redo restores the saved result without importing
textures or repeating AI matching. Both actions preserve the saved snapshot. It works
after a scene reload when the component and scene were saved. Each drop is one
operation: AI matches that arrive later and slots you choose extend it, so
Undo returns to the materials from before the drop. A new drop replaces this
persistent snapshot. Unity's regular Undo also records the changes, with background
AI matches as their own step.
If renderer assignments were changed separately since the apply, My Avatar asks
you to resolve those edits before restoring its snapshot.

**Save** saves the avatar scene and the generated assets. When Unit Git is installed
it also commits `texture change` in the Unity project's Git repository, once the
repository is initialized in Unit Git. The commit includes this scene's current changes, generated files, reused texture assets and their Unity
metadata. Other project paths and staged changes are excluded. If a required
generated file is ignored by Git, fix the ignore rule and try again. Save does
not push. Undo after saving creates another local change; it does not rewrite
your Git history.

Imported files remain after Undo or cancellation to preserve valid references.
Custom shaders may need a feature toggle or unlocking before a texture is visible.
My Avatar does not change shaders or UVs, convert roughness to smoothness, or pack
separate images into combined texture channels.

## Quick optimization

After a drop that placed images, the result offers **Quick optimization**. It caps the
avatar's textures at 512 px and sets PC compression: BC1 for opaque colour, BC7 for
textures with alpha and BC5 for normal maps, without crunch compression and with mipmap
streaming. A texture that another avatar in the scene also uses is duplicated first, so
that avatar keeps its textures; other textures are changed in place. Undo restores the
previous import settings, even after restarting Unity.

When it is done, My Avatar suggests d4rkAvatarOptimizer for the rest of the avatar. If
it is installed, **Add to avatar** adds it to the avatar root.

## Orbiters account and automatic AI assistance

To connect, click **Login with Discord** or **Login with Telegram** at the top of
the component. Your browser opens on that login; Orbiters then asks you to confirm
the connection once and shows a four-letter code, the same one Unity shows while it
waits. Only confirm when you just clicked Login in Unity. The link works once and
expires after ten minutes. The account is shared with the other Orbiters tools;
Logout clears it for all of them.

The robot in the top-right corner of the drop field shows AI assistance: crossed out
while you are not connected or AI is off. Once connected, click it to turn AI
assistance on or off; hover it for what that means. It is the same setting as
**AI-assisted features** in your Orbiters website account settings, and the backend
enforces it.

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

My Avatar 0.5.1 cancels pending AI answers when AI is turned off or the
Inspector closes, serializes preference writes, keeps same-named textures from
different sources separate, and treats unchanged saves as successful. See
[Unit Git history and My Avatar texture fixes](unity-history-and-texture-fixes.md).
