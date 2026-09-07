---
title: MCB Adaptive Version Delivery
section: Reference
order: 147
audience: admin, dev
stage: alpha
id: orbiters.mcb.adaptive-delivery
domain: mcb
type: reference
owner: orbiters-mcb
lastVerified: 2026-09-07
relations: orbiters.mcb.version-pipeline-benchmarks, orbiters.tools.mcb-operating-contract
---

# MCB Adaptive Version Delivery

MCB can choose the faster download and decompression combination for each computer
and connection. Creators build the available LZ4 and Zstd representations once;
users download only the selected representation. Selection and background
measurements do not add a waiting step to Apply.

**Release status:** implemented and validated locally on 7 September 2026.
The Unity package, backend and admin interface have not been released or deployed.
This page describes that implementation; it is not an announcement of availability.

## What the user experiences

After authenticated MCB initialization, calibration starts when the Editor is idle.
The user can select, download and apply a version immediately. Without complete,
current measurements, MCB selects the smallest supported archive.

Unity **Preferences > MCB > Downloads** provides automatic-selection and
measurement-sharing controls, status, and a “Measure again when idle” button.
Disabling sharing keeps the local selection feature available. Disabling automatic
selection also stops calibration and selects the smallest supported download.

The existing 80 ms introduction and 600 ms completion feedback are preserved. The
completion animation follows scene assignment; it does not defer the avatar's
appearance. Compression does not remove Unity's first-use mesh construction cost.
Later applications reuse the generated local mesh cache.

## Calibration and the decision

| Measurement | Procedure | Reuse |
| --- | --- | --- |
| CPU | Deterministic synthetic 50 MB and 150 MB payloads; encode and decode each available codec; verify each roundtrip | 14 days, keyed by API origin, codec configuration, Unity version and computer characteristics |
| Network | Download and discard 25 MB; download another 100 MB only when the first transfer takes at most 2 seconds | One day; successful real version downloads refresh the estimate |
| Real choice | Record available archive sizes, predicted times, chosen codec and actual download duration/result | Optional server report |

MB means decimal megabytes. CPU calibration runs on a background thread at reduced
priority, with an excluded warmup. No avatar data is used to construct the dummy
payloads. The network reader streams into a bounded counting buffer rather than
retaining the downloaded dummy file in memory.

Calibration cancels for foreground download, Apply, submission, play mode,
compilation/import, SDK build work and Editor shutdown. Cancellation is checked
between codec blocks. A completed 25 MB measurement remains useful if foreground
work interrupts the optional 100 MB transfer. Failed calibration is deferred;
it cannot prevent version operations. Automatic retries are spaced by 15 minutes.

MCB fits nonnegative linear time estimates, then evaluates:

```text
estimated time(codec) = network latency + package bytes(codec) × network slope
                     + decode overhead(codec) + decoded bytes × decode slope(codec)
```

Actual archive sizes come from the server. Dummy compression ratios are never
used to estimate the size of an avatar download. CPU encoding times are collected
for analysis, but do not influence the final user's download choice. A single
network observation uses a throughput estimate through the origin. The model is
an estimate of transfer plus decompression, not a measured end-to-end Apply time.

## Packaging, storage and identity

The creator serializes the existing native mesh representation once and produces
its supported codec alternatives. Each uses independent 4 MiB blocks, Zstd level 9
or LZ4's standard encoder, followed by the existing original-base XOR wrapping.
Already compressed `.bin` entries use ZIP storage mode to avoid another compression
pass. The server validates variant paths, sizes and hashes before creating separate
downloadable archives. Both remain private and use the existing entitlement and
source-compatibility checks.

Each downloaded archive contains one representation of every advanced mesh, under
the canonical patch filenames, plus `mcb-delivery.json`. The client verifies that
this sidecar matches the variants declared by the authorized version. It updates
only compression and payload-hash fields. Source model IDs, source paths, renderer
mappings, bone paths, bind poses and the mesh serialization layout retain their
existing roles. The decrypted payload hash is verified before decompression or
mesh construction. Invalid delivery metadata or corrupted data fails before mesh
assignment.

Generated local mesh assets now prefer binary serialization and explicitly select
their main asset. Shared Windows-native SHA-256, buffered writes and bounded
four-worker word XOR reduce preparation work. These changes do not introduce a new
mesh transport representation, quantization, GPU requirement or AssetBundle build.

Two stored archives increase storage relative to storing Zstd alone. Common package
files occur in each archive. The initial benchmark fixture totaled 82.45 MB across both payloads. The later
creator regression build preserves every serialized position delta and totals
106.65 MB (35.19 MB Zstd, 71.46 MB LZ4), before common files and ZIP overhead.
See the [creator regression measurements](mcb-version-pipeline-benchmarks.md#creator-build-and-apply-regression)
for the distinction. A user downloads one
of them. Existing versions are not rebuilt automatically.

## Measurements available to staff

**Administration > MCB Performance** is available to admins, owners and developers.
It shows reporting installations, download decisions, codec shares, failures,
median decode time per MB, and the mean estimated saving against the alternative.
The 99% notice uses only choices where both codecs were available and calibration
was complete. Uncalibrated choices and single-codec availability cannot inflate
that comparison. Estimates are labelled separately from measured download times.

Reports contain timing/byte samples, the chosen codec and candidates, Unity version,
Editor platform, logical core count, memory size and a random installation ID.
The server combines the authenticated account ID with that random ID into a hash
and stores the hash rather than the raw installation or account ID in the sample.
These are pseudonymous operational measurements. Avatar contents, asset/version
identifiers, paths, hardware serial numbers and authentication tokens are absent
from the measurement body. Requests still use normal authenticated transport.

The summary covers the last 30 days. An hourly maintenance job removes older raw
reports. Requests are schema-validated, size-limited and rate-limited by authenticated
account. The dashboard returns aggregate data. Client reports are observations,
not trusted billing or security signals.

| Endpoint | Access and purpose |
| --- | --- |
| `GET /mcb/performance/bootstrap` | Authenticated; prepare reusable private probes; four requests per 15 minutes |
| `GET /mcb/performance/probe/25` or `/100` | Authenticated; fixed-size probe through existing private R2/local file delivery; eight requests per day |
| `POST /mcb/performance/reports` | Authenticated; bounded schema 1 reports; 120 requests per hour |
| `GET /mcb/performance/summary` | Admin/owner/dev aggregate view |
| `GET /mcb/:assetId/model?...&codec=LZ4` or `ZSTD` | Existing version authorization and source checks, followed by selection of a stored variant |

Probe files are generated once and reused. The configured administrative account
must exist as their storage owner. Bootstrap failure is optional for the client;
it does not disable version downloads. Network probes use the same configured
private file-delivery service as versions, with cache avoidance and exact byte-count
validation. The large probe is conditional on the client's small-probe result.

## Local evidence and release checks

The implementation benchmark used the same 82.89 MB native payload as the
[earlier experiments](mcb-version-pipeline-benchmarks.md), with one excluded warmup
and three alternating measured iterations:

| Production codec | Compressed mesh bytes | Median encode | Median decode |
| --- | ---: | ---: | ---: |
| LZ4 | 53.26 MB | 357 ms | 39.75 ms |
| Zstd level 9 | 29.19 MB | 1,314 ms | 144.05 ms |

These are payload and codec-stage measurements, not complete ZIP transfer or Apply
measurements. The independent block format changes Zstd's ratio from the earlier
monolithic experiment. The illustrative transfer/decode crossover for this fixture
is about 231 MB/s; actual decisions use the local calibration and complete archive
sizes. All 28 new benchmark observations passed byte-hash checks. Evidence is in
`Editor/Benchmarks/results/2026-09-07-adaptive.json` in the Unity package.

Validation covers both codecs through native Apply, binary cache reuse and Reset;
mesh geometry, bone references, skin weights, bind poses, multi-frame blendshapes
and applied asset/version provenance; corrupted delivery rejection; choice curves;
network probe sequencing; and unaligned XOR key/chunk boundaries. Temporary rigs
are used instead of switching the user's avatar. The deterministic health suite
passes, including the repaired file-backed path-resolution fixture and corrected
renderer restore assignment order.

Backend checks cover archive construction, private variant storage, fixed probes,
authorization, input limits, retention and aggregate queries. Disposable PostgreSQL
rehearsals boot both fresh and populated prior schemas twice and verify existing
records and source/renderer associations remain unchanged. The frontend has targeted
dashboard tests and a passing production build.

Final local totals: 49 Unity EditMode tests passed; 527 backend tests passed with
14 existing skips; two dashboard tests passed. The backend and frontend were
validated with Node 24.19.0. Both PostgreSQL 16 rehearsal scenarios passed their
two upgraded boots and record/index assertions. No live storage credentials or
user avatars were needed for those fixtures.

Native libraries are pinned with package digests, per-binary provenance and licenses.
Windows x64 is tested here. Linux x64 and Intel macOS libraries are bundled but
require platform validation. The current Apple Silicon library set provides Zstd
only; it cannot offer a local LZ4 choice or produce LZ4 during creator packaging.

Before release, validate the native plugins on each supported Editor platform and
rehearse real authenticated upload/download with the deployed storage configuration.
Release the matching backend and client together; do not publish new dual-codec
versions to older clients that do not understand those codecs. First-use Unity
blendshape construction and experimental prepared binary transport remain separate
work. No portability claim is made for the latter.
