---
title: Create a VRChat thumbnail with My Avatar
section: Tools
order: 191
audience: public, creator, dev
stage: stable
id: orbiters.tools.myavatar-thumbnail
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-07
---

# Create a VRChat thumbnail with My Avatar

The **Thumbnail** section of the My Avatar component makes the 4:3 image VRChat
shows for your avatar. It uses the Orbiters photoshoot, the same one MCB uses for
custom base media. This page describes My Avatar 0.8.2 with Orbiters Toolkit 0.3.7.

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
   Shift-drag to turn and tilt it. Double-click resets the framing. **Portrait**,
   **Half body** and **Full body** frame the head, the torso or the whole avatar in
   any pose. Drag the sphere to turn the avatar (sideways) and tilt it toward or away
   from the camera (up and down); its dot shows where the avatar faces. It snaps
   facing the camera, steps with the arrow keys and double-click faces the camera
   again. The avatar turns around whichever of its hips, chest and head is nearest
   the middle of the view, and the camera stays still, so what you framed stays in
   place. **Zoom** reaches 20×.
   **Look at the camera** makes the avatar look straight at the camera. The **Look**
   dial splits that turn between the head and the eyes: at **Head** only the head and
   neck turn (the eyes stay as posed), at **Eyes** only the eyes turn (the head stays
   as posed), and in between each takes its share. Eyes skinned partly to the head
   turn further than the look so they still meet the camera, up to about 75° on
   their bone, beyond which the skinning would squash the eyeball. Eyes are the avatar's humanoid eye bones,
   else the eyes set in the VRChat Avatar Descriptor's **Eye Look**.
4. Press **Capture**. The image is saved at once as
   `Assets/Orbiters/MyAvatar/Thumbnails/<avatar> <id>/<avatar> thumbnail.png` and
   the card flashes. The studio stays live, so you can capture again; a new capture
   uses a distinct filename so Undo and Redo preserve the previous pixels. **Browse** uses an image file instead and closes the studio.
5. Press **Done** to close the studio. The card then shows the saved thumbnail.

Light presets include studio looks, **High Key**, **Low Key**, and the dark
**Cinematic Rim** and **Neon Night**. Each preset sets its own ambient light on the
photoshoot's copy of the avatar, so the result does not depend on your scene's
lighting and your scene is not changed.

<alpha>

## Effects, your own backgrounds and the environment light

These come with My Avatar 0.9.4 and Orbiters Toolkit 0.3.16, not released yet.

- **Effects** (the last style tab): turn on as many as you like, each with its own strength. **Bloom** (bright parts
  glow), **Comic halftone** (flat colours in 2 to 12 tones with ink outlines; **Dots** adds a print screen of ink dots,
  larger in the shade, whose size you choose), **Ambient occlusion** (soft shadows in folds and creases), **Depth of
  field** (sharp at the avatar's view position from its VRChat Avatar Descriptor, blurred before and behind it),
  **Chromatic aberration**, **Grain**, **Lens distortion** and **Vignette** (darker edges, or brighter ones below
  zero). Bloom, ambient occlusion, depth of field and chromatic aberration go up to 300%.
- **Your own backgrounds**: on the **Background** tab, the **+** swatch adds a PNG or JPEG picture; you can also drop
  pictures on the backgrounds. They are copied to a folder of your own, so every project offers them; hover one to
  remove it. Background pictures are cropped to the frame, never stretched.
- **Environment light**: on the **Light** tab, a slider sets the environment light from 0 to 300% of the preset's.
- The **Framing** card folds under its header; it is open at first and stays as you leave it.

## Create a ref sheet

**Create ref sheet**, under **Open in VRChat SDK** and **Edit thumbnail**, opens the photoshoot's second mode: the
avatar from the front, the back and the side, side by side at one scale on a 1920×1080 sheet, each view named above it
in italic grey on a dark background. It uses the same pose, light, expression and effects (except the vignette, lens
distortion and chromatic aberration, which would cut across the views).

- **Side view** faces left or right. Drag the sheet up or down, scroll to zoom every view together, and double-click
  or **Fit** to see the whole body in each view again. The background colour is on the **Background** tab.
- **Capture** saves the sheet as `<avatar> ref sheet.png` beside the thumbnails and shows it in the Project window.
- **Edit thumbnail** switches back to the thumbnail; **Done** closes the ref sheet.

</alpha>

## Use it in the VRChat SDK

Whenever the VRChat SDK builder shows this avatar, My Avatar fills in the thumbnail
through the SDK's own thumbnail selection, as if you had chosen the file with
**Select Image**. **Open in VRChat SDK** opens the SDK panel on this avatar. The SDK
treats the new image as a pending change: review it, then upload or discard as
usual. A thumbnail you choose in the SDK afterwards is left alone. Nothing is
uploaded automatically.

Toolkit 0.3.7 releases pointer capture when a framing drag, dial or colour drag is cancelled, loses capture, or its preview surface is removed. Closing or rebuilding the studio during a drag should leave other editor controls usable.

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

<alpha>

The local working version compares a saved thumbnail with VRChat before offering
it to the SDK. It compares the SDK's cropped 800×600 upload image, so reopening
the panel or reloading Unity does not queue the same image again. New images
remain available, and a thumbnail selected directly in the SDK is left alone.
If the comparison fails, My Avatar leaves the SDK thumbnail unchanged and logs a
message; you can still choose **Select New Thumbnail** yourself.

An SDK error saying **This file was already uploaded** can refer to the thumbnail.
The SDK updates the thumbnail before the avatar bundle, so this failure can leave
the in-game avatar on its previous outfit and rig even though the scene and local
build are newer. Confirm the error's stack trace contains `UpdateAvatarImage`
before treating it as a thumbnail issue. A successful local build does not mean
that the avatar was published; retry **Build & Publish** after the duplicate image
is no longer pending. Keep the existing blueprint ID.

The local working version can capture avatars containing the drawing pen's ink,
line renderers, or mesh renderers whose mesh filter is missing. These components
no longer interrupt the live preview or Capture with a missing MeshFilter error.
You do not need to add a MeshFilter to a trail or remove the pen to take a thumbnail.
Framing continues to use the avatar's visible surfaces, excluding trails, lines
and particles from the framing bounds.

</alpha>
