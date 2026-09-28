---
title: Create a VRChat thumbnail with My Avatar
section: Tools
order: 191
audience: public, creator, dev
stage: beta
id: orbiters.tools.myavatar-thumbnail
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-09-28
---

# Create a VRChat thumbnail with My Avatar

The **Thumbnail** section of the My Avatar component makes the 4:3 image VRChat
shows for your avatar. It uses the Orbiters photoshoot, the same one MCB uses for
custom base media. This page describes My Avatar 0.5.1 with Orbiters Toolkit 0.2.6.

## See it where it will appear

The thumbnail is shown on a copy of VRChat's in-game avatar card, at the same size
and with the same crop, between faint neighbouring cards. The card shows:

- the wide strip of your 4:3 image that the game shows;
- the PC badge, and the Android badge when the build target is Android;
- a warning badge when the SDK rates the avatar Poor or Very Poor for the current
  build target;
- the avatar name on up to two lines, and your VRChat name once the VRChat SDK is
  signed in. The editor font stands in for VRChat's.

## Make the thumbnail

1. Press **Create thumbnail** (or **Edit thumbnail**). The card switches to the live
   camera and a **LIVE** tag appears.
2. Under **Pose**, **Light**, **Background** and **Expression**, pick a pose, a light
   preset, a background image or a plain colour, and face blendshapes. The colour
   background has a picker with a hue bar, curated colours, a hex field and
   **Reset**.
3. Frame the avatar right on the card: drag to move it, scroll to zoom and
   Shift-drag to turn it. Double-click resets the framing. **Portrait**, **Half
   body** and **Full body** frame the head, the torso or the whole avatar in any
   pose and stay fitted when you change pose or turn. The **Turn** dial goes all the
   way round and **Zoom** reaches 20×; both snap at their rest value, step with the
   arrow keys and reset on double-click.
4. Press **Capture**. The image is saved at once as
   `Assets/Orbiters/MyAvatar/Thumbnails/<avatar> <id>/<avatar> thumbnail.png` and
   the card flashes. The studio stays live, so you can capture again; a new capture
   uses a distinct filename so Undo and Redo preserve the previous pixels. **Browse** uses an image file instead and closes the studio.
5. Press **Done** to close the studio. The card then shows the saved thumbnail.

Light presets include studio looks, **High Key**, **Low Key**, and the dark
**Cinematic Rim** and **Neon Night**. Each preset sets its own ambient light on the
photoshoot's copy of the avatar, so the result does not depend on your scene's
lighting and your scene is not changed.

## Use it in the VRChat SDK

Whenever the VRChat SDK builder shows this avatar, My Avatar fills in the thumbnail
through the SDK's own thumbnail selection, as if you had chosen the file with
**Select Image**. **Open in VRChat SDK** opens the SDK panel on this avatar. The SDK
treats the new image as a pending change: review it, then upload or discard as
usual. A thumbnail you choose in the SDK afterwards is left alone. Nothing is
uploaded automatically.

## Troubleshooting

- **Create thumbnail says to add an Animator:** posing needs an Animator with a
  humanoid avatar on the avatar.
- **An accessory floats away from the body:** objects driven by constraints to a
  target outside the avatar's bones (for example a prop placed "anywhere") stay
  where that target is.
- **The photoshoot opens slowly:** the first preview copies the avatar into a
  hidden scene. Later changes reuse that copy; framing updates take a few
  milliseconds, and a new pose or expression measures the posed meshes again.

Orbiters Toolkit 0.2.6 refreshes its clone when source meshes,
material assignments or object visibility change. Saving a thumbnail checks source
state even if the photoshoot was already open. Camera and framing changes still
reuse an unchanged clone. See [Unity package safety and avatar workflow fixes](unity-package-safety-fixes.md).
