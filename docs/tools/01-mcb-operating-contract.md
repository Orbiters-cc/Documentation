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
lastVerified: 2026-09-07
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

<alpha>

## Advanced mesh build and publication

The locally validated implementation defaults new MCB components to **Use Advanced
Mesh Replacement**. Explicit saved choices remain intact. Creator builds map every
renderer in the canonical source model to its avatar path, including renderers
whose live mesh has already been replaced by a generated mesh. A missing renderer
or ambiguous binding stops the operation instead of producing a partial version.

Dynamic normal frames are calculated directly for the selected shapes during
packaging. Building a temporary Unity mesh containing every blendshape is no
longer necessary. The source model remains unchanged.

Advanced Apply and reset assign meshes and the root Animator avatar directly.
When the canonical FBX already contains the preserved original data, they do not
change its importer merely to assign a copied avatar asset. Returning from an FBX
replacement still restores the original file and importer when necessary.
First-use mesh creation yields between blendshape submissions; subsequent Apply
operations reuse the local native mesh cache. Neither path changes bone indices
or weight values to guess a missing bone binding.

A successful upload immediately enters the server-backed gallery and shared cache.
Removing its local copy removes the download, not its server availability. A fresh
server response refreshes both the shared cache and visible gallery. Source-model
changes refresh hash state, and downloads read the selected source hash so an
earlier garment detection cannot cause a false compatibility rejection. Downloads
also persist their authorized metadata for local scans after reload or while offline. A Unit Git
checkpoint failure cannot turn a successful upload into an unsubmitted version.

These fixes are local and unreleased. See [the measured version pipeline](../reference/mcb-version-pipeline-benchmarks.md)
for timings, fidelity checks and remaining first-use costs.

</alpha>

## Validation

Run `Tools > My Custom Base (MCB) > Health Checks > All Deterministic` after changes
to apply/reset, native mesh payloads, advanced mesh replacement, dynamic normals,
materials, blendshapes, sliders, or applied-version caches. The batch entrypoint is
`MCBEditorHealthChecks.RunAllOrThrow`.

New editor UI belongs in UI Toolkit using the package styles; do not extend the
legacy surface with new IMGUI flows.
