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
lastVerified: 2026-10-25
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

## Free up space

Captures take room: the keyframes, depth frames, video and recordings of a session are only needed to reconstruct it
again. **Free up space** at the top of **Sessions** (also **Settings › Storage**) shows what the library takes, in
three parts: the capture files of reconstructed sessions, the sessions without a 3D view, and the 3D views.
**Free** deletes the capture files of every reconstructed session at once; their 3D views stay, so you can still
walk through them, share them on the Map explorer and send them to Mixer. Sessions without a 3D view are deleted
only if you turn on their switch, and then nothing of them stays. The confirmation lists what goes, with sizes:
the files are deleted for good, not moved to the recycle bin, so the space really comes back.

**Keep only the 3D view** in a session's detail does the same for one session. Afterwards the session shows
**3D view only** and can no longer be reconstructed; sound, parameters and tracking are gone too, so Mixer can't
import its performance. Sessions being recorded or reconstructed are never touched.

## Delete a session

The bin button in the detail deletes the session folder after you confirm. It cannot be undone.
