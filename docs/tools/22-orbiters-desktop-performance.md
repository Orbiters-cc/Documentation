---
title: Record your performance with Orbiters - N4N0
section: Tools
order: 212
audience: public, creator, dev
stage: alpha
id: orbiters.tools.desktop-performance
domain: desktop
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-20
relations: orbiters.tools.desktop, orbiters.tools.mixer-performance
---

# Record your performance with Orbiters - N4N0

Besides the world, a session can keep what your avatar did: its parameters and face tracking, your voice, VRChat's
sound and your body. Mixer turns that into an animation clip for the same avatar in Unity, see
[Bake a VRChat performance with Mixer](30-mixer-performance.md). Everything is recorded on one clock with the frames, so
the voice, the face and the camera stay in sync.

**Release status:** Orbiters - N4N0 is not released yet.

## Choose what is recorded

The **Performance** card on the **Capture** page has a switch per stream; changes apply to the next recording.

- **Face & avatar:** every avatar parameter VRChat sends over OSC (gestures, toggles, face tracking, visemes), plus the
  values it had when the recording started.
- **Your voice:** your microphone (**Settings › Performance › Your voice** picks it), for the visemes and the audio in
  Mixer.
- **VRChat sound:** only VRChat's own audio (the world and other players), not your other apps.
- **Body tracking:** the headset, controllers and trackers from SteamVR (**Tracking rate** sets the samples per
  second). With the capture kit on your avatar, the body is also recorded exactly as VRChat showed it.

**Test microphone** in **Settings › Performance** plays your microphone back with a level meter; **Stop test** ends it.

## In VRChat, no calibration is needed

VRChat sends the headset and wrist poses it uses to the apps it found over OSC, and Mixer sizes and places your body from
them. The **Performance** card says so while VRChat runs. A T-pose calibration is only needed for other games, such as
ChilloutVR or Resonite, where Mixer has only the SteamVR devices to go on.

## Use Orbiters in SteamVR

While SteamVR runs, Orbiters - N4N0 adds an **Orbiters** tab to the SteamVR dashboard (turn it off in
**Settings › Interface › SteamVR dashboard tab**). It has the recorder, the performance switches and the T-pose
calibration, so you can record without leaving VR. A short sound plays when the tab appears and when you press its
buttons.

To calibrate for another game:

1. Press **Calibrate** in the tab, then close the dashboard. A mirror and two hand targets appear in front of you.
2. When the countdown ends, stand straight with your arms out and your hands on the targets, and hold still.
3. The tab shows your eye height and arm span. Calibrate in the game at the same moment so both match.

T-poses you make while recording are also kept, so a later calibration in the game can be matched too.

<audience include="dev">

## Files

The streams follow the `performance.md` contract of OrbitersContracts, all on the session's clock:

- `parameters.bin` and `parameters.json`: every OSC value VRChat sent (multi-argument messages are kept one value per
  argument, named `<address>[<index>]`, for example `/tracking/vrsystem/head/pose[3]`);
- `audio/*.wav` and `audio.json`: microphone and VRChat process loopback with their sync points;
- `tracking.bin` and `tracking.json`: SteamVR device poses in Unity conventions;
- `calibration.json`: overlay calibrations and T-poses caught while recording;
- `skeleton.bin`: the capture kit's skeleton band decoded from the colour frames.

</audience>
