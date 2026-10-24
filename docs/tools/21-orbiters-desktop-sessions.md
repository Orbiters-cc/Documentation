---
title: Reconstruct and view sessions in Orbiters - N4N0
section: Tools
order: 211
audience: public, creator, dev
stage: alpha
id: orbiters.tools.desktop-sessions
domain: desktop
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-20
relations: orbiters.tools.desktop, orbiters.tools.desktop-worlds, orbiters.tools.mixer-splats
---

# Reconstruct and view sessions in Orbiters - N4N0

Every recording ends up in **Sessions**: one card per world, with its preview, length, frame, keyframe and depth frame
counts and size. From a session you rebuild the world as Gaussian splats on your GPU, walk through it in 3D and send
it to Unity. Recording itself is described in [Capture VRChat worlds with Orbiters - N4N0](20-orbiters-desktop.md).

**Release status:** Orbiters - N4N0 is not released yet.

## Find a session

- **Search worlds** filters the library by world name or folder.
- **Import raw capture** replays a raw capture written by Mixer's capture simulator into a new session, through the
  same decoder as a live recording.
- The folder button opens the sessions folder; **Settings › Storage** changes it.

Click a card to open its detail. It shows the duration, frames (and how many decoded a pose), keyframes, depth frames,
the camera path seen from above, and when and how the session was captured.

## Reconstruct the world

1. Open the session and press **Reconstruct**. The card shows **Reconstructing** with its progress; the rest of the app
   stays usable.
2. Wait for it to finish. A typical short session takes two to three minutes on a recent GPU. **Stop reconstruction**
   cancels it.
3. The detail then shows the number of splats and their quality in dB, measured on views kept out of the training.
   **Reconstruct again** starts over, for example after changing the session.

Reconstruction trains Gaussian splats from the keyframes, their exact camera poses and depth frames on your GPU
(through wgpu, so NVIDIA, AMD and Intel GPUs all work). Only one runs at a time, and never during a recording. Distant
scenery such as the sky stays on a far shell instead of taking most of the splats.

The result lands in the session folder:

- `reconstruction/splats.ply`: the splats in the standard 3D Gaussian Splatting PLY format;
- `reconstruction/report.json`: settings, timings and quality;
- held-out renders next to the frames they were compared with.

## Walk through it in 3D

Press **View in 3D** on a reconstructed session. The view opens on the camera of the preview picture.

- Drag to orbit, right-drag to pan, scroll to zoom.
- **W A S D** move, **Q E** go down and up.
- **Recorded view** and the arrows step through the cameras the session was recorded from; double-click jumps back to
  the recorded view.
- Escape or the close button leaves the view.

## Share it on the Map explorer

A reconstructed session can be shown in 3D on the Orbiters website's Map explorer, from **Visited worlds**: see
[Share your visited worlds from Orbiters - N4N0](23-orbiters-desktop-visited-worlds.md).

## Send it to Unity

**Send to Mixer** copies the splats into the Unity project open with Mixer and shows them where the world was
captured; see [Show Orbiters splats in Unity with Mixer](31-mixer-splats.md). The button asks you to reconstruct first
when the session has no splats yet, and to open the project with Mixer when no Unity editor runs it.

## Delete a session

The bin button in the detail deletes the session folder after you confirm. It cannot be undone.
