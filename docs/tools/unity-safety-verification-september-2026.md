---
title: Unity safety verification follow-up
section: Tools
order: 199
audience: creator, dev
stage: alpha
id: orbiters.tools.unity-safety-verification-september-2026
domain: mcb
type: explanation
owner: orbiters-engineering
lastVerified: 2026-09-29
---

# Unity safety verification follow-up

These changes are local and unreleased. Package and server working trees have not
been published. They extend the September safety audit fixes after checking the
actual code paths and stressing their failure cases.

## Attachments and animation

[My Avatar attachments](12-myavatar-accessories.md#builds-without-vrcfury) use
build-time hierarchy and animation-path changes without adding a constraint per
linked bone. Authoring animation assets remain untouched. Blendshape links require
distinct matching channels, retain null material keys, and preserve intermediate
activation values instead of changing a linear transition to a smoothstep.

## Version changes and downloads

[MCB](01-mcb-operating-contract.md#code-import-invariant) checks current creator
trust immediately before importing code. The authenticated model-trust endpoint
does not stream a download or update download accounting. Deploy that endpoint
before releasing the corresponding MCB client; unknown trust still requires consent.

Version mutations run synchronously after asynchronous preparation. Saved-custom
installation restores the previous version if copying or importing the custom FBX
fails. Native renderer assignments require exact paths; a same-named mesh is not
enough to identify a renderer after a hierarchy change.

## Texture and import state

Accessory recovery retains pending work through repeated script reloads. The
shared native import queue prevents two packages with the same basename from
mistaking one another's completion event for their own. An in-progress native
import keeps its queue slot until Unity really completes or fails it. Completion
matching accepts Unity's full-path callbacks and preserves dotted package names.

Texture matching creates an owned copy when an existing image has incompatible
normal-map, linear-data or color import settings. Repeated optimization restores
the original material in reverse application order. Scoped changes split a
generated material again if another avatar begins sharing it.

## XRay blendshape overlays

With legacy blendshape clamping enabled, XRay follows the native renderer for
negative, zero and out-of-range weights, including single-frame and multi-frame
shapes. The verification compares 77 combinations against Unity BakeMesh. The
editor retained native clamping after the project flag was temporarily disabled,
so unclamped-mode parity remains unverified in this session. The original project
setting was restored.

## Package editing and verification boundaries

UPM release archives preserve payload and folder metadata so installed script and
asset GUIDs stay stable. Repository internals and credentials remain excluded.
The UPM archive reader retains its existing 8 GiB total data budget; a valid very
large package can still require substantial editor memory.

Unity regression fixtures cover private controller serialization, actual Animator
mask evaluation, moved blendshapes, copied-FBX rollback, shared logout state,
isolated photoshoot pixels, import consent and archive failure cases. ReFit reset
is also replayed on disposable copies of the local avatar and clothing. These
checks do not replace a final VRChat upload/client test or a deployed account and
download integration check.

The deliberately excluded dynamic-normals shared-mesh deletion finding remains
unchanged in this verification pass.
