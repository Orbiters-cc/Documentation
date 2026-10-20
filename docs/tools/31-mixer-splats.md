---
title: Show Orbiters splats in Unity with Mixer
section: Tools
order: 231
audience: public, creator, dev
stage: alpha
id: orbiters.tools.mixer-splats
domain: mixer
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-20
relations: orbiters.tools.desktop-sessions, orbiters.tools.mixer-performance
---

# Show Orbiters splats in Unity with Mixer

A world that Orbiters desktop reconstructed as Gaussian splats can be shown in your Unity scene, where it was captured,
so you can build, light or film against it. Mixer draws the splats in the Scene and Game views of the editor; they are
left out of builds.

**Release status:** Mixer 0.1.0 is not released yet. Reconstruction is described in
[Reconstruct and view sessions in Orbiters desktop](21-orbiters-desktop-sessions.md).

## Bring splats into the scene

Either way works:

- **From Orbiters desktop:** open a reconstructed session and press **Send to Mixer**. The Unity editor running Mixer
  (the most recently opened one, when several are open) imports it.
- **From Unity:** **Tools › Orbiters › Mixer › Import Splats…** and pick a session's `reconstruction/splats.ply`.

Mixer copies the splats to `Assets/Orbiters/Splats/<session>.splats`, adds an EditorOnly **Splat Renderer** object to the
open scene, selects it and frames it. Move the object to offset the splats.

## Requirements

- The built-in render pipeline and a GPU with compute shaders: the renderer sorts the splats for each camera on the GPU
  and draws them before the transparent pass, behind scene geometry where it is in front.
- For **Send to Mixer**, the project must be open in Unity with Mixer loaded. Each editor keeps an inbox for Orbiters
  desktop under `%LOCALAPPDATA%/Orbiters/Mixer/inbox/<process id>/`.
