---
title: MCB Version Pipeline Benchmarks
section: Reference
order: 146
audience: dev
stage: alpha
id: orbiters.mcb.version-pipeline-benchmarks
domain: mcb
type: reference
owner: orbiters-mcb
lastVerified: 2026-09-07
relations: orbiters.tools.mcb-operating-contract
---

# MCB Version Pipeline Benchmarks

For the remaining Body construction bottleneck and the next proposed experiments,
see [First Apply Optimization Research](mcb-first-apply-research.md). Those proposals
are research only; no additional mesh-construction implementation was made.

Local experiments found substantial gains in advanced-mesh packaging and cache
storage. The largest remaining first-use cost was Unity's blendshape construction.
Binary cache serialization, buffered writes and Windows-native SHA-256 all improved
measured stages while preserving the representation checked by the experiment.

These results describe the initial experimental baseline. A subsequent local
implementation is documented in [MCB Adaptive Version Delivery](mcb-adaptive-delivery.md),
including the new block-codec results and completed health checks. It has not been
released. In the initial experiment, production packaging, downloads, Apply,
cache identity and UI timing were not changed. Creator-built
AssetBundles were excluded: previous product experiments had made network traffic
and server storage too expensive.

## Creator build and Apply regression

A later end-to-end regression used the actual Ultipaw creator inputs, with dynamic
normals enabled, then applied a local unsubmitted version and reset the active
avatar. It was not uploaded. The scene remained unsaved, with a separate recovery
checkpoint captured before testing. These are complete workflow observations on
one computer, not medians from the earlier microbenchmark suite.

| Operation | Measured result | Boundary |
| --- | ---: | --- |
| Complete creator packaging before the fix | 207.39 s | Includes dynamic normals, both payload variants, logic, metadata and manifest |
| Complete packaging with direct normal capture | 15.92 s | Same compressed payload bytes as the slow build |
| Final packaging preserving every encoded position delta | 10.42 s | Later observation; payload size differs from the preceding pair |
| Dynamic normal generation before the fix | 198.75 s | Most time was rebuilding 497 frames in a temporary Unity mesh |
| Direct capture of the selected normal frames | 1.39 s | 18 selected shapes; no temporary blendshape mesh |
| First Apply with frame-budgeted construction | 22.08 s | Scene work; 23.45 s observed wall time including presentation/scheduling |
| Apply after returning to Base Default, using the cache | 0.47 s | Scene work; 1.47 s wall time |
| Reset to Base Default | 0.29–0.33 s | Scene work; the first observed wall time was 3.98 s |

The expensive build stage was `Mesh.AddBlendShapeFrame`, taking 189.31 seconds
inside the temporary dynamic-normal mesh build. Calculating normals took about
1.57 seconds in that instrumented baseline. Capturing the calculated normal arrays
directly removes the temporary rebuild. A controlled slow/fast build pair produced
identical Zstd and LZ4 bytes before the separate position-encoding correction.

The first Apply still constructs the Unity mesh. It now yields between blendshape
submissions after an 8 ms work budget. A single native call reached 82.6 ms, so this
is not an 8 ms frame-time guarantee. The observed long uninterrupted construction
pause was removed; elapsed first-use time remains substantial. Cached Apply skips
that construction. The 80 ms intro and 600 ms completion animation remain intact.

### Fidelity and source preservation

The broken build omitted Body because it selected only renderers still backed by
the canonical FBX. A generated Body mesh was skipped while Hair remained selected.
Renderer collection now uses canonical model bindings and refuses incomplete or
ambiguous mappings.

The rebuilt version contains Body's 497 blendshapes and the other renderers' 8, 7,
11 and 7 blendshapes: 530 frames across five renderers. Every name, order, frame
weight and count matches the modified reference. Base vertices, normals, tangents,
UV channels, submesh indices, bind poses, skin weights and all 95 bone paths per
renderer compare exactly. The unrelated clothing mesh retained its source asset.

Position deltas are serialized without the old per-component `0.00001` cutoff.
Unity's public mesh construction still removes some near-zero position deltas when
normal/tangent deltas do not retain that vertex. The verifier reports exactness
separately: the largest observed source-frame position difference is below
`0.00001` mesh units. A skinned deformation comparison at the applied weights and
pose has a maximum Body position difference of `0.00000898` mesh units and RMS
`0.000000339`. This is not bit-identical preservation of every source FBX field;
blendshape normal/tangent delivery retains the existing selective dynamic-normal
policy.

Keeping every encoded position delta raises the final payloads to **35.19 MB Zstd**
and **71.46 MB LZ4**, versus 29.19 MB and 53.26 MB in the earlier fixture. A user
still downloads one variant. These are payload sizes, excluding common files and
ZIP overhead.

No FBX import occurred during the tested advanced Apply/reset transitions. The
canonical FBX, its `.meta`, and preserved original hashes remained unchanged.
The redundant importer work was replaced with direct root Animator-avatar
assignment when the canonical FBX already contains the original data. An actual
FBX replacement still requires restoration when switching back.

The gallery test found published 0.5.1 missing from the old cached list. A fresh
fetch populated both the visible list and shared cache. Deleting its local copy
kept the server entry available. Published metadata now takes precedence over a
downloaded copy, retaining its PUBLIC scope and server editing identity instead
of showing the Imported badge. Testing redownload also exposed an initialization
race: the UI could retain a garment hash after source mapping switched to the
avatar FBX. Source changes now refresh hash state, stale asynchronous results are
rejected, and downloads resolve the current source hash before requesting files.
A redownload with an intentionally stale garment hash then succeeded. Downloaded
metadata is now persisted locally as well, so repository scans after reload or
while offline recognize the downloaded version.

All 52 MCB and 29 Unit Git EditMode tests passed, along with both packages'
deterministic health checks. Unit Git tests verify ignored archive handling and
preservation of unrelated staged/unstaged changes. Aggregate local evidence is
`Editor/Benchmarks/results/2026-09-07-creator-regression.json`; the reusable reference
comparison is `MCBMeshRoundTripVerifier.Compare`. Existing uploaded incomplete
versions are not repaired automatically; publish a corrected build to replace
their behavior. Source fixes remain local and unreleased.

## Measurement conditions

- Date: 2026-09-07; package source commit `b4224c9d87fa5d4d043dd65d81d904b955c0752d`.
- Unity 2022.3.22f1 on Windows, Intel i7-12700K, 20 logical processors, approximately
  64 GB RAM, RTX 4080, NTFS storage. No GPU benchmark was run.
- One real advanced-mesh fixture: five meshes, 100,203 vertices and 530 total
  blendshape frames. Its original key file was 21.74 MB; the uncompressed native
  payload was 82.89 MB. MB means decimal megabytes throughout this page.
- Each timed variant used one excluded warmup and three measured iterations.
  Tables report medians. Comparisons alternated variant order where supported.
- File reads used the normal Windows cache. Reloads unloaded Unity objects first.
  Fresh-path imports still ran in the same project with existing import artifacts.
  Neither test represents a cold disk, a fresh Unity project or a restarted Editor.
- The active scene was already dirty. No version was applied to it and it was not
  saved. Only owned scratch assets were created and removed by the benchmarks.
- Allocation and process-memory counters were unavailable under this runtime.
  Zero readings in the first raw run must not be interpreted as zero allocations.

The experiments used the actual MCB mesh writer, parser, mesh creation method,
hash streams and XOR writer. Packaging covered the mesh sections, excluding about
50 KB of header and pose metadata, creator geometry processing, archive assembly
and upload. Timings from separate stages must not be added and presented as an
observed end-to-end Apply result.

Reproduction code lives under the package's `Editor/Benchmarks/` directory. The
aggregate evidence file is `Editor/Benchmarks/results/2026-09-07.json`; original
local checkpoints are under `Library/MCB/Benchmarks/`. Aggregates contain measured
samples without private source paths or mesh contents.

## Measured pipeline changes

| Stage | Current path | Experimental path | Result |
| --- | ---: | ---: | --- |
| Mesh-section packaging, buffer only | 18.903 s | 12.784 s | 32.4% less time |
| Mesh-section packaging, buffer plus Windows SHA-256 | 18.903 s | 4.767 s | 74.8% less time |
| Hash the original key, same-run comparison | 1,124.0 ms | 9.86 ms | About 114 times faster |
| Register and save generated mesh cache | 11.162 s, text | 0.628 s, binary | About 17.8 times faster |
| Reload unloaded cache objects, warm OS cache | 5.701 s, text | 0.165 s, binary | About 34.6 times faster |
| Generated cache file size | 584.90 MB, text | 151.36 MB, binary | 74.1% smaller locally |
| XOR decode | 51.65 ms, current parallel modulo | 18.21 ms, four bounded workers and contiguous words | 64.7% less time |

Packaging outputs and XOR-decoded bytes matched. The Windows hash implementation
matched the current SHA-256 provider for empty input, `abc`, the real source file
and the packaging stream results. The current Unity runtime selected
`SHA256Managed`; the experiment used Windows CNG through `bcrypt.dll`. This is a
provider and buffering change, not a hash-algorithm change. The native API contract
is documented by [Microsoft](https://learn.microsoft.com/en-us/windows/win32/api/bcrypt/nf-bcrypt-bcryptcreatehash).

The binary cache used a benchmark-only ScriptableObject subtype with
`PreferBinarySerialization`. Project-wide ForceText remained enabled. Unity
documents that this attribute selects binary serialization independently of the
project mode, and that the main asset determines serialization for the file.
[Unity API reference](https://docs.unity3d.com/2022.3/Documentation/ScriptReference/PreferBinarySerialization.html).

Saved and reloaded caches retained mesh counts and matched the MCB mesh-serialization
fingerprint, including the channels preserved by that format. This does not prove
that every possible Unity field, avatar behavior or platform-specific import is
identical. Already-loaded asset lookups were about 0.06 ms with either format;
binary storage helps saving and loading, not a lookup that already returns a live object.

## LZ4 and Zstd inside Unity

LZ4 remains a serious candidate. Its 53.26 MB payload is substantially smaller than
the current fixture's 82.01 MB outer ZIP, and it has the fastest measured decode.

The native follow-up loaded LZ4 1.9.4 and Zstd 1.5.5 inside Unity with identical
pinned-array bindings and output-allocation policies. Compression includes trimming
the output buffer; decoding includes allocating the destination. Verification was
outside the timers. These libraries were explicitly supplied for the benchmark and
were not installed into the production package.

| Payload codec | Compressed bytes | Compress in Unity | Decode in Unity |
| --- | ---: | ---: | ---: |
| LZ4 block | 53.26 MB | 131 ms | 24.90 ms |
| Zstd 3 | 32.33 MB | 326 ms | 85.61 ms |
| Zstd 9 | 26.45 MB | 1,094 ms | 113.54 ms |

LZ4's roughly 89 ms decode advantage over Zstd 9 is useful, but it is not a
seconds-long improvement by itself. Zstd 9's decode samples ranged from 88.69 to
118.81 ms; LZ4 ranged from 22.14 to 25.44 ms. More fixtures and slower machines are
needed before choosing a product-wide default. Both libraries are documented by
their maintainers: [LZ4](https://github.com/lz4/lz4) and
[Zstandard](https://github.com/facebook/zstd).

The following is a transfer model, **not a network benchmark**. It adds ideal serial
transfer time for a stored ZIP containing one compressed payload to the measured
Unity decode time. It excludes latency, protocol overhead, other version files,
verification, parsing, mesh construction and scene application.

| Effective connection | LZ4 | Zstd 3 | Zstd 9 |
| --- | ---: | ---: | ---: |
| 100 Mbps | 4.29 s | 2.67 s | 2.23 s |
| 1 Gbps | 0.45 s | 0.34 s | 0.33 s |
| 10 Gbps | 0.068 s | 0.111 s | 0.135 s |

For this fixture and machine, the LZ4/Zstd 9 crossover is approximately 2.4 Gbps of
effective throughput. Local storage and already-downloaded content have different
tradeoffs; LZ4 can be preferable there. A local binary cache can also remain
uncompressed, avoiding another decode entirely.

A standalone codec sweep also tested GZip 6 and Zstd levels 1, 6 and 15. GZip
produced 39.66 MB and decoded in 351 ms through Python's native binding. Zstd 15
saved only about 0.21 MB over level 9 while increasing compression from about
1.00 s to 7.09 s. These standalone timings use different bindings and, for Zstd,
a different library version; they must not be mixed into the Unity timing table.

Compression must precede the existing XOR transform. Deflating the already
compressed and XOR-transformed payload in the outer ZIP provided essentially no
size benefit, usually grew it slightly, and added about 0.5–1.1 s in single-sample
archive tests. A stored outer entry is therefore worth testing in the real packaging
flow. Compression of unrelated archive entries can remain independent.

If two delivery variants become justified, LZ4 plus Zstd 9 payload bytes totaled
79.71 MB in this experiment, slightly below the existing 82.01 MB ZIP fixture.
This arithmetic is only for this payload. It does not include duplicated metadata,
multiple platform or Unity-version variants, or establish a storage budget for the
whole catalog. Prefer a measured delivery policy over automatically doubling every artifact.

## The first-use bottleneck and a more ambitious candidate

The current parser took 1.164 s. Creating all five Unity meshes took 12.076 s in the
baseline suite. A follow-up separated geometry creation from blendshape submission:
the body geometry took 4.97 ms, while adding its blendshapes took 12.500 s. Other
meshes contributed less than a millisecond of blendshape submission combined.
These are separate runs, so the small difference between their totals is expected.

Accelerating vertex-buffer construction alone cannot remove that delay. Even
eliminating the measured body-geometry work entirely would save only about 5 ms.
The dominant work must be avoided, prepared earlier, or replaced with a different
way to load an already constructed Unity mesh.

A separate experiment compressed a **binary serialized mesh-cache file**, without
building an AssetBundle:

| Codec | Compressed binary cache | Unity decode |
| --- | ---: | ---: |
| LZ4 | 55.66 MB | 42.88 ms |
| Zstd 3 | 32.11 MB | 283.72 ms |
| Zstd 9 | 26.51 MB | 92.63 ms |

Copying the 151.36 MB uncompressed sample to a fresh asset path, synchronously
importing it and loading it took **0.701 s median**, with samples from 0.558 to
1.094 s. Mesh counts and the MCB serialization fingerprint matched afterward.
Decompression and network time are excluded from that import timing.

This is a promising way to bypass per-frame blendshape reconstruction without the
large transfer sizes seen in previous AssetBundle experiments. It is not yet a
validated distribution format: the sample used a benchmark container with local
script references and the same project's importer cache. Before selecting it,
test a production-shaped container in a clean project, package-script GUIDs,
subasset references, the supported Unity versions, PC/Android targets, multi-frame
blendshapes, skinning, bounds, normals and tangents. Account for any required
per-version or per-platform artifacts when evaluating server storage.

## Strategies with smaller or unproven gains

- **More XOR workers were worse.** Four workers took 18.21 ms, eight took 36.82 ms,
  and one took 227.71 ms in the contiguous-word prototype. Its extra copies make
  single-thread execution unattractive. Worker count should be bounded and measured.
- **Adaptive sparse/dense encoding was a modest size opportunity.** Derived from
  actual arrays, it reduced the blendshape section from 72.25 to 69.43 MB before
  compression, about 3.9% of that section or 3.4% of the whole payload. No new
  serializer or decoder was implemented for this calculation.
- **Keep deltas sparse until needed.** Dense prepared arrays represented roughly
  571 MB of data in the fixture. This is a computed array-size estimate, not a
  process-memory measurement. Incremental expansion could reduce temporary memory,
  but Unity's blendshape submission still needs measurement afterward.
- **GPU/CUDA and DirectStorage remain unbenchmarked.** Their integration costs are
  hard to justify for the measured XOR stage while Unity's blendshape submission
  dominates. Any future prototype must include CPU/GPU transfer and readback costs,
  and demonstrate that its output can enter Unity's actual mesh-loading path.
- **Frame budgeting improves responsiveness, not necessarily elapsed time.** It
  could spread preparation across Editor updates, but cannot shorten a single slow
  native call. Measure individual blendshape-call duration before promising a frame budget.

## Suggested implementation sequence

1. Resolve the deterministic health-check fixture mismatch described below, then
   establish integrated timings for download, payload preparation, mesh assignment,
   scene usability and presentation completion as separate events. Use both large
   advanced-mesh fixtures and small versions on a slower supported computer.
2. Introduce binary serialization for generated local mesh caches, with correct
   main-asset selection. Add a shared native hashing provider and buffered writer
   where measured, preserving hash identity and output bytes. Keep the original-base
   backup and reset rules from the [MCB Operating Contract](../tools/01-mcb-operating-contract.md).
3. Compare LZ4 and Zstd in the real version archive/download flow, including archive
   storage mode, package-plugin distribution, cancellation and bounded decompression.
   Measure creator upload size, stored bytes, user download time and first usable
   avatar. Choose network and local-cache policies separately.
4. Prototype prepared binary mesh delivery in a clean project. Its size and import
   result justify this experiment, but portability is a release gate. Keep it separate
   from choosing the codec so either decision can succeed independently.
5. Prepare likely versions before Apply and reuse immutable meshes by content
   identity. Include relevant format and import dependencies in the identity;
   avoid duplicating identical mesh caches solely because version labels differ.
   Bound disk/RAM use, invalidate correctly, and preserve original-base verification.
6. Benchmark the remaining retrieval and transition costs: staged extraction,
   targeted imports, overlapping download with preparation, repeated source hashes
   and FBX rollback copies. These were identified during review but not implemented
   or measured as complete alternatives in these experiments.

The immediate UX target is an already-prepared version whose scene assignment is
small enough to feel instant. The existing 80 ms introduction and 600 ms completion
animation remain intentional presentation behavior. The completion animation
continues after mesh assignment; it must not postpone avatar visibility or scene
interaction. Record “avatar ready” independently from “button finished animating.”

## Validation and limitations

All 168 Unity benchmark measurements, including warmups, completed with their
respective byte, structure or fingerprint checks. All standalone codec roundtrips
also passed. Owned benchmark assets were cleaned up. This is stage-level evidence,
not complete avatar integration or cross-machine validation.

`MCBEditorHealthChecks.RunAllOrThrow` passed the HDiff and native-mesh checks, then
failed in `RunVersionPathResolutionInvariantCheck`: “Expected 3 paths, got 0.”
That fixture supplies three fictional FBX paths without creating files, while
`AvatarPathOverrideService.ResolveLocalTargetPath` now requires an existing file.
The later reset check was not reached. The production resolver and health-check
source files were unchanged by this work; the suite must not be reported as green.
The native-mesh check returned successfully but also emitted “Bones do not match
bindpose” while its fixture restored renderer bounds through `SmrPathService`.
That console diagnostic also needs review before calling the health suite clean.

No source optimization was committed, pushed or enabled during that initial
experiment. The later implementation and validation status are recorded separately
in [MCB Adaptive Version Delivery](mcb-adaptive-delivery.md).
