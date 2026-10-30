---
title: N4N0 menu input and placement recovery
section: Development
order: 95
audience: dev, creator
stage: alpha
id: orbiters.development.n4n0-menu-input-reliability
domain: desktop
type: reference
owner: orbiters-engineering
lastVerified: 2026-10-30
---

# N4N0 menu input and placement recovery

The October 2026 reliability fix has two parts: Orbiters - N4N0 on the PC reconstructs pointers and handles presses;
the N4N0 gallery item on the avatar controls grabbing and recentering. Updating only the desktop does not replace
the animator already uploaded to VRChat.

The desktop fix is in **0.3.4-dev.1**, published to the development feed and as a
[GitHub pre-release](https://github.com/Orbiters-cc/Orbiters-N4N0/releases/tag/desktop-v0.3.4-dev.1).
The matching avatar fix is **N4N0 1.0.19** in the development gallery. With Development environment enabled in
My Avatar, refresh the gallery and choose **Update** on N4N0, then build and upload the avatar again. In the
desktop app, enable Development environment under Settings > About and install the offered update. Neither
development release changes the avatar that is already running in VRChat until its new upload is selected.

## Input recovery

The desktop solves the four contact surface distances directly for the sender position and radius. The previous
iterative solver could reject valid hand positions beside the screen. Sender-radius and residual limits still
reject inconsistent readings. Tests cover 300 combinations of hand position and screen target, alongside touch
depth and gaze checks.

A trigger pull during an incomplete contact reading waits up to the existing 100 ms loss grace for a valid aim.
Release, a longer loss, or recovery outside the page cancels it. This avoids swallowing a click during a short
tracking gap without activating a button from a stale pointer position.

Releasing the trigger while still hovering clears the held press. Closing the menu clears its input session.
Holding through a submenu change or reopening cannot click through another page: release before pressing again.

## Placement recovery

The place constraint previously rebaked its offset when both taking the handle and arriving at the recenter target.
Preserving an offset is correct for a pickup, but on arrival it can retain the old place. The glide then hands the
screen back to that old position. Offset rebaking is now enabled only for hand carrying; arrival uses the target's
zero offset. This follows the SDK's [rebake-on-unfreeze semantics](https://creators.vrchat.com/common-components/constraints/#rebake-offsets-when-unfrozen).

The avatar completes a recenter and then waits for 200 ms of stable visibility before another look-away can arm
recentring. Once armed, the existing 400 ms look-away delay and 500 ms glide still apply. Short visibility pulses
after arrival cannot repeatedly restart the glide. Releasing the handle leaves the screen where it was dropped;
closing the menu clears its grip even when the hand gesture has not relaxed yet.

## Validation boundary

Desktop tests cover pointer motion, short tracking gaps, cancellation, submenu/back navigation, music timeline
dragging, and close/reopen. Unity tests evaluate generated animator states with the SDK constraint solver;
parameter-driver Set operations are simulated on state entry. The pre-fix regression restarted recentering nine
times in six seconds with a one-frame visibility pulse every 600 ms.

Both the original placement test and the combined grab/release/recenter/intermittent-view/close-while-grabbed
regression pass with the corrected constraint. The desktop suites pass 228 tests; four live-service tests are
intentionally skipped.

After installing both development updates and uploading the avatar, verify in VRChat with both hands: touch and
point through several submenus, move around the screen, grab and release, close while grabbing, and look away and
back. Repeat at both screen-size limits. The centred screen should stay still, sustained look-away should recenter,
and a held press must not activate the next page. Automated editor tests do not establish controller or headset
behavior in the live client.
