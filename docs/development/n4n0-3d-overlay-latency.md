---
title: N4N0 3D capture overlay timing
section: Development
order: 96
audience: dev, creator
stage: alpha
id: orbiters.development.n4n0-3d-overlay-latency
domain: desktop
type: explanation
owner: orbiters-engineering
lastVerified: 2026-10-30
---

# N4N0 3D capture overlay timing

The 0.3.4-dev.2 development update changes how N4N0 schedules and presents its SteamVR 3D capture pictures.
It preserves the reconstruction and the Light, Balanced and Sharp image settings. It does not require a new
N4N0 avatar upload. The earlier [menu input and placement recovery](n4n0-menu-input-reliability.md) has its own
desktop and avatar release requirements.

Enable **Settings > About > Development environment** in Orbiters - N4N0, then install the offered update.
The app version for this work is **0.3.4-dev.2**; the release is on
[GitHub's development release page](https://github.com/Orbiters-cc/Orbiters-N4N0/releases/tag/desktop-v0.3.4-dev.2).

## Why a correct picture can feel delayed

SteamVR presents the capture on world-locked stereo quads. It can keep their orientation aligned as the headset
turns, but the picture's parallax still corresponds to the eye position used to render it. A real head turn also
moves the eyes about the head and neck. Increasing reconstruction quality cannot repair a stale eye position.

The former background-work governor could repeatedly delay rendering while the scene was late, including the
first cube. Completed renders also waited for the next input-loop turn. The update uses a separate policy for
displayed captures, services completed pictures during short waits and after painting the menu, and predicts a
bounded part of the picture's display lifetime during stable motion.

## Rendering and contention policy

- Light, Balanced and Sharp retain their nominal 20, 30 and 45 updates per second. Actual rendering can be slower
  when expensive, when there is little motion, or when the scene is late.
- Only one render job is in flight. New late scene frames overlapping that work can slow the next admission once
  per job. Healthy elapsed time gradually restores the normal interval. Overlap is a heuristic, not proof of cause.
- Persistent scene lateness no longer prevents every update. Affordable jobs retain a 250 ms overload interval;
  expensive ordinary updates can need longer to respect the 40% render-wall-time limit. This limit uses the wide
  update cost and includes CPU and GPU waits. Full cube replacements remain non-preemptible; this is not a guarantee
  of 40% aggregate GPU occupancy or of unchanged VRChat frame timing.
- Both eyes keep their calibrated projection but share render-buffer dimensions, avoiding repeated allocation for
  slightly different eye sizes. The renderer still uses each eye's own view.
- Stops remove the extra lifetime prediction and request a settling picture. Quiet views avoid continuous work;
  stale faces outside the view are refreshed only while still and without overload.

The policy can do more work than the previous indefinite hold beside a struggling VRChat scene. It makes no
special exception when the capture hides VRChat or when **See VRChat** is enabled.

## Evidence and limits

The investigation included Valve documentation, overlay implementations, renderer papers, local GPU experiments
and an independent Claude Opus 5.5 review. Two independent baseline/implementation comparisons produced identical
capture images for equal eye dimensions; shared D3D12/D3D11 texture contents matched, and reported process GPU
memory stayed at 515 MB on the RTX 4080 fixture. Unequal-eye resampling changed one measured PSNR by 0.03 dB.

Timing experiments used real Windows clocks and offscreen GPU work. Prediction comparisons used synthetic motion.
SteamVR and VRChat were stopped, so these results do not establish motion-to-photon latency, streaming-headset
behaviour or the frame cost in a live VRChat world. Full cube replacements can still cause a spike while walking.
Near-budget synthetic GPU tests still missed about 7–9% of game deadlines with the overlay, versus 1–3% for the
game alone, while the overlay backed down to about four updates per second. The update improves progress under
contention but does not make capture rendering free on an already busy GPU.
The app repository's
[investigation, measurements and review decisions](https://github.com/Orbiters-cc/Orbiters-N4N0/blob/main/docs/overlay-latency-results-2026-10-30.md)
records the evidence and acceptance limits.

## Local diagnostics and headset check

While a capture is displayed, the overlay collects bounded ten-second timing summaries. A background writer saves
them in `%LOCALAPPDATA%/Orbiters/logs/overlay-worlds.jsonl`, with one rotated previous file at roughly 1 MiB each.
These local logs include headset model/driver, refresh rate, projection properties, render wall time, completed-picture
publication delay, input-turn timing, prediction horizon and overload levels. This change does not upload the logs.

After updating, compare gentle sideways movement, head turns, sudden stops and walking across cube boundaries.
Repeat with the menu open and with each quality setting, then in a busy VRChat world. These scenarios distinguish
ordinary publication delay from cube rebuilds and GPU contention. Pair any subjective lag report with the headset
connection/refresh settings and these logs; the logs themselves do not measure photons or prove when SteamVR latched
a submitted texture.
