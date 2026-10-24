---
title: Bake a VRChat performance with Mixer
section: Tools
order: 230
audience: public, creator, dev
stage: alpha
id: orbiters.tools.mixer-performance
domain: mixer
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-20
relations: orbiters.tools.desktop-performance, orbiters.tools.desktop, orbiters.tools.mixer-splats
---

# Bake a VRChat performance with Mixer

Mixer's **Performance** window turns a session recorded by Orbiters - N4N0 into an animation clip for the avatar you
wore: the face, gestures and toggles your avatar's own animator showed, lip sync from your voice, your body, where the
joystick moved you, and the voice and VRChat's sound lined up with it. It also installs the **capture kit**, which lets
Orbiters - N4N0 record exact camera poses and your exact pose.

**Release status:** Mixer 0.1.0 is not released yet. Recording is described in
[Record your performance with Orbiters - N4N0](22-orbiters-desktop-performance.md).

## Install the capture kit

The capture kit is a small hidden mesh with an Orbiters shader. While you record, it draws the camera's pose and,
every few frames, exact depth into the frames VRChat's camera streams, plus your avatar's final bone rotations. Without
it, Orbiters - N4N0 still records parameters, audio and SteamVR tracking, but frames carry no pose.

1. Add VRCFury to the project: the kit's Action Menu toggles are merged by VRCFury.
2. Open **Tools › Orbiters › Mixer Performance** and pick your avatar in **Avatar**.
3. Under **Capture kit**, press **Install the capture kit** and choose where it is **Drawn**:
   - **Near you:** when the camera sees you or is within 2 m (the default, keeps the avatar's performance rank);
   - **Everywhere:** always, but VRChat ranks the bounds Very Poor.
4. Upload the avatar. Your Action Menu now has **Orbiters › Record** (`OrbitersRecord`, also starts and stops Orbiters
   desktop's recording) and the depth frames toggle (`OrbitersDepthFrames`). Neither is synced to other players.

**Remove** takes the kit off the avatar; **Install again** refreshes it after an update.

## Bake a clip

1. Pick a session in **Session**. Chips tell what it holds: **Face**, **Voice**, **Sound**, and **Body · exact** (the
   capture kit), **Body · VRChat** (VRChat's head and hand poses), **Body** (SteamVR with a calibration) or
   **Body · no T-pose**. **Choose a folder…** reads sessions from elsewhere.
2. Pick the avatar the performance was recorded with in **Avatar**.
3. Choose what to bake:
   - **Face and toggles:** everything the avatar's animator showed, run through a copy of its VRChat playable layers.
   - **Lip sync:** the visemes VRChat showed from your voice.
   - **Body:** see below.
   - **Joystick movement:** where VRChat moved you, estimated from its velocity parameters.
   - **Audio:** your voice and VRChat's sound as audio clips, cut to the clip.
   - **Timeline:** a Timeline with the clip and the audio, ready to play.
   - **As seen by:** **Others** or **You**, because some avatar logic runs only for the wearer.
   - **Frame rate:** 30 or 60 samples per second.
4. Press **Bake**. The clip, audio and Timeline go to `Assets/Orbiters/Mixer/Performances/<session>/`, and the result
   lists where the body came from and anything that needs your attention.

## Where the body comes from

Mixer uses the best source the session has:

1. **The capture kit's skeleton:** your body exactly as VRChat showed it, bone by bone.
2. **SteamVR tracking with a T-pose calibration:** for other games. Each tracker is bound to the nearest bone at the
   calibration, the play space is scaled so your eye height becomes the avatar's, and an IK solver poses the avatar.
3. **VRChat's head and hand poses:** no calibration needed. Mixer sizes the play space from your usual standing eye
   height in the session, faces the avatar the way you looked when the clip starts, puts the view on your headset and
   the hands on your wrists, and solves the rest with IK (the hips follow the head, the feet keep the animation).

Without any of them, the body follows the avatar's animation only.

## Troubleshooting

- **No T-pose calibration in this session:** the session has SteamVR tracking but neither a calibration nor VRChat's
  poses. Calibrate in Orbiters' SteamVR tab before recording in another game.
- **The headset stayed below 1.1 m:** you sat or crouched the whole session, so the avatar is sized from that height.
- **Too little hand movement to tell how VRChat's wrist pose sits on the hand:** the hands barely moved; their rotation
  may be off.
- **The capture kit in this session was on another avatar:** the recorded pose may not fit this armature; pick the
  avatar you wore.
