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

Local experiments found substantial gains in advanced-mesh packaging and cache
storage. The largest remaining first-use cost was Unity's blendshape construction.
Binary cache serialization, buffered writes and Windows-native SHA-256 all improved
measured stages while preserving the representation checked by the experiment.

These are experimental results, not shipped behavior. Production packaging,
downloads, Apply, cache identity and UI timing were not changed. Creator-built
AssetBundles were excluded: previous product experiments had made network traffic
and server storage too expensive.

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

No source optimization was committed, pushed or enabled. This page records the
experimental evidence and the proposed sequence only.
