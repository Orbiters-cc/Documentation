---
title: MCB Operating Contract
section: Tools
order: 110
audience: creator, dev
stage: stable
id: orbiters.tools.mcb-operating-contract
domain: mcb
type: invariant
owner: orbiters-mcb
lastVerified: 2026-07-12
relations: orbiters.how-to.mcb-and-unity-tools, orbiters.general.vpm-package-contract
---

# MCB Operating Contract

MCB applies custom avatar-base versions while preserving the original default FBX
as the source for resets and binary patches.

## Backup Invariant

If the default FBX is `A` and applied versions are `B` or `C`, `*.fbx.old` remains
the preserved copy of `A`.

- Create `*.fbx.old` only when it is missing.
- Never overwrite, delete, or move an existing backup during apply or reset.
- Reset by copying the backup over the working FBX while keeping the backup.
- An absent backup is valid only before the default base has ever been replaced.
- XOR patch generation and version switching must use the preserved default source.

## Validation

Run `Tools > My Custom Base (MCB) > Health Checks > All Deterministic` after changes
to apply/reset, native mesh payloads, advanced mesh replacement, dynamic normals,
materials, blendshapes, sliders, or applied-version caches. The batch entrypoint is
`MCBEditorHealthChecks.RunAllOrThrow`.

New editor UI belongs in UI Toolkit using the package styles; do not extend the
legacy surface with new IMGUI flows.
