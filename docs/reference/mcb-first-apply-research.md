---
title: MCB First Apply Optimization Research
section: Reference
order: 148
audience: dev
stage: alpha
id: orbiters.mcb.first-apply-research
domain: mcb
type: reference
owner: orbiters-mcb
lastVerified: 2026-09-07
relations: orbiters.mcb.version-pipeline-benchmarks, orbiters.mcb.adaptive-delivery
---

# MCB First Apply Optimization Research

This is a research proposal. No further mesh-construction optimization was implemented
for this investigation. The [existing measurements](mcb-version-pipeline-benchmarks.md)
separate initial payload preparation, native mesh creation, cached Apply and UI completion.

## Why Body dominates

The corrected custom Body has 89,166 vertices and 497 blendshapes. A fresh read of
the canonical model on 7 September found 41,416 vertices and 461 blendshapes. The
different vertex counts rule out simply cloning the original mesh and appending
36 shapes for this avatar: its geometry and shape arrays have a different topology.

Unity's [UUM-5820 report](https://issuetracker.unity3d.com/issues/mesh-dot-addblendshapeframe-performance-decreases-when-consecutively-adding-blend-shapes)
documents increasing `AddBlendShapeFrame` cost as shapes accumulate, with its sample
rising from about 11 ms to over 110 ms per call. Unity categorizes this as a performance
feature request. That supports the observed bottleneck; it does not prove which
internal allocations dominate this exact Unity build.

If construction accounts for 80% of the measured first Apply, eliminating everything
else saves at most 20% (1.25x speedup). Making construction ten times faster would
reduce the total to approximately 28% (3.57x speedup). These are Amdahl estimates,
not new benchmarks, and exclude any separately measured download delay.

## Candidate experiments, in priority order

| Strategy | Expected benefit | Main release gate |
| --- | --- | --- |
| Deliver a compressed, already-built binary Unity mesh | Bypass hundreds of per-shape API calls | Clean-project portability, exact data, package/type references, bounded import pause |
| Prepare the selected/downloaded version during idle time | Move construction before the Apply click | No unexpected network downloads, cancellation, bounded memory and main-thread work |
| Reuse immutable meshes by content identity across versions | Avoid construction for identical payloads under different version labels | Identity includes format/editor dependencies; bind bones and materials independently for each avatar |
| Bulk serialized mesh construction | Potentially submit all shape storage once | Unsupported serialized layout can change; require pinned-version proof and do not mutate user assets |
| Buffer reuse, sparse expansion and worker-side parsing | Reduce allocation/GC and secondary preparation cost | Measure separately from the native call; preserve exact source data |

### Prepared binary mesh delivery

The existing same-project experiment had a 151.36 MB binary cache that compressed
to 26.51 MB with Zstd 9 or 55.66 MB with LZ4. Copy, import and load at a fresh asset
path took 0.701 seconds median, excluding decompression and transfer. These are the
earlier fixture's values, not a new measurement of the corrected 0.5.2 payload.
The actual corrected delivery sizes must be remeasured before choosing a format.

This is a native serialized mesh artifact, not an AssetBundle. The experiment is
interesting specifically because its compressed transfer size may remain competitive.
It must retain existing authenticated delivery, source verification and original-base
protection rather than introducing an unrestricted mesh download.

First prototype one Body as a native Mesh asset without scene objects or external
materials, then all five meshes. A manifest can identify renderer bindings while
materials and bone transforms are resolved against the destination avatar. This
avoids depending on a creator's scene references; any ScriptableObject container
also needs stable package script identity. Existing same-project results do not prove
that condition in an installed package with regenerated metadata.

Use a fresh Unity project with the actual release archive, then a second supported
Editor/platform. Test fresh import, domain reload, cache deletion/redownload and a
different avatar instance. Compare vertex attributes, all shape names/order/weights
and deltas, submeshes, bind poses, bone weights and a skinned deformation snapshot.
Record archive bytes, storage for both codecs, creator time, first usable avatar,
peak memory and p95/maximum main-thread stall. A subsecond total can still contain
a visible synchronous asset import; elapsed time alone is not a sufficient pass.

### Preparing earlier and reusing content

Start from a version already selected or downloaded, with explicit workload budgets
and immediate cancellation when the user changes selection. Prewarming every version
would waste CPU, disk and network. The existing 8 ms budget can yield only between
native calls; an individual call previously reached 82.6 ms. Prewarming therefore
cannot promise an 8 ms frame and is weaker than bypassing shape construction.

Cache immutable mesh data by verified content plus relevant format/import identity,
while resolving the current avatar's bone transforms separately. Cache sharing must
not reuse another avatar's transform array or mutate a mesh shared by other users
of that cache. Benchmark cache hits across two version labels before widening scope.

### Lower-priority techniques

- Unity's [MeshData API](https://docs.unity3d.com/2022.3/Documentation/ScriptReference/Mesh.MeshData.html)
  supports worker-side vertex/index preparation, but does not expose a bulk blendshape
  constructor. Geometry preparation was about 5 ms in the earlier Body measurement.
- [GetBlendShapeBuffer](https://docs.unity3d.com/2022.3/Documentation/ScriptReference/Mesh.GetBlendShapeBuffer.html)
  exposes an existing GPU buffer. It is not a replacement for creating persistent
  Unity shape names, frames and authoring metadata. CUDA/Burst only help if the
  measured work moves out of the serial native construction path; include readback.
- Reordering small shapes before large ones might reduce cumulative rebuilding if
  the engine repeatedly copies prior storage. This remains an inference. Changing
  indices risks animation/slider associations and violates the current order check;
  it is not acceptable without an explicit complete remapping design.
- DirectStorage, memory mapping and filesystem copy tricks target I/O. They cannot
  eliminate native per-shape construction and should follow a demonstrated I/O bottleneck.
- Lossy quantization, PCA/SVD shape approximation, dropping shapes and splitting Body
  into several renderers change fidelity or avatar behavior. They are not the preferred
  route when complete blendshapes, existing materials and weight painting must survive.

The next useful experiment is a clean-project binary-mesh delivery proof with byte
and deformation checks. Keep the intentional 80 ms introduction and 600 ms completion
animation separate from avatar readiness throughout these comparisons.
