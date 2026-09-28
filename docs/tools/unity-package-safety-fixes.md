---
title: Unity package safety and avatar workflow fixes
section: Tools
order: 195
audience: creator, dev
stage: alpha
id: orbiters.tools.unity-package-safety-fixes
domain: mcb
type: reference
owner: orbiters-engineering
lastVerified: 2026-09-28
---

# Unity package safety and avatar workflow fixes

This page describes local, unreleased changes to My Custom Base, Orbiters Toolkit
and the My Avatar parameter display. Installing the currently published packages
does not establish that these changes are included. Unit Git is unchanged.

## Version storage and downloads

Version and original-base labels must be plain names. MCB rejects separators,
rooted paths, reserved filename characters, control characters, surrounding spaces
and trailing dots before constructing a storage path. Resolved paths must stay
inside version storage; symbolic links and junctions in that path are rejected.
A rejected label leaves existing versions untouched. Choose a plain release name
and retry instead of editing storage directories manually.

Both downloads held in memory and downloads saved to disk extract into a distinct
sibling staging directory. MCB validates archive entry paths, reconciles authorized
delivery metadata, verifies required payloads and their supplied hashes, then
writes version metadata and a completion manifest before replacing the old cache.
A corrupt ZIP, empty archive, unsafe entry or failed payload validation preserves
the previous destination. The directory swap restores the old directory if the
new directory cannot be moved into place.

A directory containing only a README is no longer a downloaded version. The cache
needs matching version metadata, a nonempty manifest, every declared output at its
recorded size, and all required model files listed in that manifest. Apply downloads
missing content again. Cache availability checks inspect metadata and file sizes;
they do not repeatedly hash whole models while drawing the inspector. Download
validation checks supplied payload hashes, and artifact validation checks output
hashes before publishing. Older caches without a completion manifest must be
re-downloaded; MCB does not silently mark partial folders complete.

## Failed ordinary FBX switches

Ordinary FBX switches now use the same rollback snapshot as advanced transitions.
Before changing models, MCB snapshots every affected working FBX and its metadata,
and records the associated editor Undo state. A failure restores that previous
working version across the affected files. If version B was active before a failed
switch to C, rollback restores B, while the immutable original-base backup remains A.
Reset to Base Default remains a separate action.

If restoring a file fails, MCB retains temporary recovery copies, reports the
failure and clears the applied-version marker instead of claiming the transition
succeeded. Inspect the local diagnostic for the recovery paths before retrying.

## Optional diagnostic reporting

**Advanced > Share MCB diagnostics** is off by default. An explicit saved opt-in
remains honored. Enabling it shares diagnostics emitted through MCB's own logger;
it does not subscribe to the global Unity console. Console visibility and sharing
are separate settings. The default minimum severity is Warning.

Messages and stack traces are capped and scrubbed for recognized credentials,
URLs, email addresses and filesystem paths. The current authentication token is
also removed if it appears verbatim in a report. Project paths, active-scene paths,
device names and hardware inventory are omitted. Free-form messages should still
avoid including secrets; pattern-based redaction cannot identify every possible
sensitive value.

Reporting keeps at most 32 pending diagnostics and 128 deduplication signatures.
Duplicate suppression expires after one minute. Only one request runs at a time,
with at least ten seconds between starts and a fifteen-second request timeout.
Additional reports are dropped while the queue is full. Turning sharing off clears
queued reports and aborts the current request. Reports already received by the
server are unaffected by disabling future sharing.

## Parameters and compression

My Avatar and MCB show parameter estimates **before compression**. Installed
VRCFury controls compression during its build; adding or removing the deprecated
Unlimited Parameters component does not control that behavior. The misleading
per-avatar switch is removed. The status describes VRCFury's actual global setting:
automatic compression, ask during build, or disabled. Change that behavior in
VRCFury's global settings. Reading the estimate does not change those settings or
add/remove avatar components.

Full Controllers have independent parameter namespaces. Two controllers each
adding a local float called `Shared` contribute 16 estimated bits. Explicit global
rules can share the same parameter; two controllers declaring that float global
contribute 8 bits. Local names also remain separate from same-named descriptor
parameters. Wildcard and exclusion rules are respected. These remain estimates:
VRCFury's completed build determines actual compression and final memory use.

## Physics and accessory posing

PhysBone discovery excludes each `ignoreTransforms` branch, including descendants,
from that component's simulated set. An ignored chain can be offered by **Add
physics** when it meets the other eligibility rules. A separate PhysBone driving
that chain still makes it simulated.

Accessory following stores rest offsets in the matching avatar bone's coordinate
space, including scale. Changing the avatar's or bone's scale then editing a pose
keeps the clothing offset proportional, including nonuniform scale. Scale edits on
bones and their ancestors also schedule synchronization. Following remains an
editor pose aid, not a replacement for checking the final avatar build.

## Photoshoot freshness

A photoshoot compares the source hierarchy, local transforms, object visibility,
renderer state, mesh assignments, material assignments and blendshape weights
before reusing its clone. Relevant source changes rebuild that clone. Camera,
lighting and framing changes can still reuse an unchanged avatar. Capture runs
this check as well, so saving from an already-open photoshoot uses current source
appearance. Editing a pose clip also invalidates its sampled pose.

## Verification

In Unity 2022.3.22f1 with VRChat SDK 3.10.3 and VRCFury 1.1334.0:

- 44 new EditMode regression cases passed, covering storage, rollback, reporting,
  parameter namespaces, ignored branches, scale and photoshoot clone refresh.
- 36 existing version-availability, original-base and delivery tests passed.
- All MCB deterministic health checks passed: binary patching, native mesh
  payloads, delivery, and apply/reset invariants.

Tests used local fixtures. No live issue report or VRChat upload was used to
validate these changes. The package edits remain local and uncommitted.
