---
title: Capture VRChat worlds with Orbiters desktop
section: Tools
order: 210
audience: public, creator, dev
stage: alpha
id: orbiters.tools.desktop
domain: desktop
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-20
relations: orbiters.tools.desktop-sessions, orbiters.tools.desktop-performance, orbiters.tools.mixer-performance, orbiters.tools.mixer-splats
---

# Capture VRChat worlds with Orbiters desktop

**Orbiters desktop** records what VRChat's camera sees together with the exact camera pose of every frame, so a world
can be rebuilt as Gaussian splats and brought into Unity with Mixer. It also records what your avatar did (face,
voice, body) for Mixer's performance import. It never asks for your VRChat login: it reads VRChat's local log, talks
to VRChat over OSC and receives the camera through Spout, all on your own PC.

**Release status:** Orbiters desktop is not released yet; it runs from a source build of the `OrbitersDesktop`
repository on Windows.

## Get started

1. Start **Orbiters desktop**. It lives in the system tray: closing the window keeps recording and the SteamVR
   overlay running, and the tray icon opens the window again. **Quit** in the tray menu stops it.
2. In VRChat, turn OSC on: **Action Menu › Options › OSC › Enabled**. Orbiters desktop announces itself to VRChat
   (OSCQuery) and VRChat starts sending your avatar parameters to it within a few seconds; the sidebar's
   **Action Menu** status says **OSC ready** with the port.
3. Install the **capture kit** on your avatar with Mixer (see
   [Bake a VRChat performance with Mixer](30-mixer-performance.md)) and upload the avatar. The kit draws the camera
   pose into each frame and adds **Orbiters › Record** to your Action Menu.
4. Read and confirm the capture notice the first time: record only places and people that agree to it.

## Record a world

Start a recording either way:

- **From the app:** press the record button on the **Capture** page.
- **From VRChat:** toggle **Orbiters › Record** in your Action Menu (the `OrbitersRecord` parameter; change the name
  in **Settings › VRChat and OSC › Record parameter**).

When a recording starts from the app, Orbiters desktop prepares VRChat for you and puts everything back afterwards:

- It opens VRChat's camera in **Stream** mode with **Spout Stream** on (`/usercamera/Mode`, `/usercamera/Streaming`),
  because VRChat sends its camera over Spout only in that mode. Turn this off in
  **Settings › VRChat and OSC › Stream camera** if you set the camera yourself.
- It switches your avatar's `OrbitersRecord` and `OrbitersDepthFrames` toggles on. When VRChat reloads your avatar
  (every new world does), it switches them on again instead of stopping.

Each world gets its own session while you record (**Settings › Capture › New session on world change**). Stop with the
record button or the Action Menu toggle; the session appears in **Sessions**.

The **Capture** page shows what each source is doing: **VRChat** (in a world, which one), **Spout source** (the
sender and its size), **Action Menu** (the record toggle Orbiters listens to) and **Storage**. While recording, the
counters show frames, keyframes, depth frames, frames whose pose strip decoded, the frame rate and the bytes written.

- **Record** is the mode available today. **Live + refine** and **Live only** are marked **Soon**.
- **Lossless**, **High** and **Compact** set how much space the colour frames take; keyframes are always lossless.
- **Test pattern** records a generated scene without VRChat, to check the whole chain.

## What a session contains

A session is a folder in **Settings › Storage › Sessions folder** (`Documents/Orbiters/Sessions` by default):

- **Frames** with the pose strip decoded per frame, **keyframes** (a lossless frame after the camera moves
  **Keyframe distance**, turns **Keyframe turn** or after **Keyframe interval**) and **depth frames** (exact metric
  depth drawn by the capture kit every few frames).
- **Performance streams** when they are on: avatar parameters, your voice, VRChat's sound, SteamVR tracking and the
  capture kit's skeleton. See [Record your performance with Orbiters desktop](22-orbiters-desktop-performance.md).
- After a reconstruction, the splats in `reconstruction/`. See
  [Reconstruct and view sessions in Orbiters desktop](21-orbiters-desktop-sessions.md).

VRChat's camera sender has no frame counter, so Orbiters desktop keeps each picture once: a frame counts when its
picture changed (about 85 per second in VR).

## Settings

- **Capture:** keyframe distance, turn and interval; a new session on each world change; the **Spout sender** (empty
  picks VRChat's Stream camera).
- **Storage:** library usage, **Storage limit** (recording stops when the library reaches it; 0 means no limit),
  **Sessions folder** and **Raw captures folder** (where Mixer's capture simulator writes).
- **VRChat and OSC:** **Action Menu control**, **Record parameter**, **Stream camera**, and whether VRChat's log was
  found.
- **Performance:** which streams are recorded, **Test microphone** and the T-pose calibration state.
- **Interface:** **SteamVR dashboard tab**, **Reduce motion** (calmer transitions, still background) and
  **Capture notice**.

## Troubleshooting

- **No frames arrive:** VRChat streams its camera only in **Stream** mode with **Spout Stream** on. Leave
  **Stream camera** on, or open the camera that way yourself.
- **Frames arrive but no pose decodes:** the capture kit draws only while `OrbitersRecord` is on and only on the
  uploaded avatar that carries it. Check **Orbiters › Record** in your Action Menu.
- **The record toggle does nothing:** VRChat's OSC is off, or VRChat has not found Orbiters desktop yet. Turn OSC on,
  then restart Orbiters desktop; VRChat's log (`%LOCALAPPDATA%Low/VRChat/VRChat/output_log_*.txt`) lists
  `Found new OSC Service: Orbiters-desktop-…` when it found it.

<audience include="dev">

## How VRChat finds Orbiters desktop

VRChat sends OSC (parameters, head and wrist poses) only to services it discovered over mDNS, and its discovery
library reads a service only from a query answer that carries the PTR record as an answer and the SRV and A records as
additional records; it ignores RFC 6762 announcements and queries only when it starts. Orbiters desktop therefore:

- announces its OSC and OSCQuery services with the address of the default route (one address: VRChat makes one client
  per address it finds), and listens on every interface while taking packets from this machine only;
- asks for `_oscjson._tcp.local` from port 5353 itself, 3.5 s after registering and again 3.5 s later, so that its
  own mDNS responder multicasts an answer a running VRChat reads. The two asks stay more than a second away from the
  responder's announcements because it sends a record at most once a second, and an answer without the A record is
  dropped by VRChat (`no SRV Records found in not parse answer`).

`cargo test -p orbiters-core --test vrchat_live -- --ignored --nocapture` starts a second, advertised service for
30 s and prints what a running VRChat sends it.

</audience>
