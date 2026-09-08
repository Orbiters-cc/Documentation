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
lastVerified: 2026-09-08
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
The live documentation chart and image recovery fixes were added locally on
8 September. Publishing this documentation alone does not deploy those changes.

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
pass. For renderer-based versions, the server validates variant paths, sizes and
hashes, then stores a common package and private codec blobs. It does not create
two complete downloadable archives. All requests use the existing entitlement and
source-compatibility checks. Earlier dual-codec packages retain their stored archives.

Each downloaded archive contains one representation of every advanced mesh, under
the canonical patch filenames, plus `mcb-delivery.json`. The client verifies that
this sidecar matches the variants declared by the authorized version. It updates
only compression and payload-hash fields. Source model IDs, source paths, renderer
mappings, bone paths, bind poses and the mesh serialization layout retain their
existing roles. Encoded blobs are verified before decoding, and renderer-based
versions also verify the decoded content identity before mesh construction.
Invalid delivery metadata or corrupted data fails before mesh assignment.

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

### Live decision plot

```orbiters
{"kind":"mcb-delivery-live"}
```

The chart above reads the current environment's authenticated performance endpoint;
it does not contain sample points or a saved screenshot. Sign in as an admin, owner
or developer. It refreshes every minute while visible, on returning to the page,
or when you select **Refresh live data**. Each refresh covers the last 30 days and
loads every page without sampling. Loading, incomplete results and an empty window
are displayed explicitly. If the website has not received the chart implementation
yet, the explanation below remains usable without the interactive view.

Each dot is one reported, calibrated download decision with both codecs available.
Its horizontal position is the predicted LZ4 transfer plus decode time; its vertical
position is the same prediction for Zstd. The dashed diagonal means equal time.
Above it, LZ4 should finish sooner; below it, Zstd should finish sooner. The blue and
purple regions show these two outcomes, while the dot's color shows what MCB actually
selected. For example, a point at LZ4 0.8 seconds and Zstd 0.5 seconds lies below the
diagonal and predicts a 0.3-second saving with Zstd.

Hover over a point for its timestamp and failed-download indicator. Identical
predictions can overlap. Missing calibration and single-codec downloads stay in
the admin summary instead of appearing as misleading zero-time dots. These are
predictions for transfer and decode; they exclude Unity mesh construction, avatar
assignment and progress animations, so they do not measure the full Apply time.

### Admin measurements and retention

**Administration > My Custom Base > Delivery performance** is available to admins, owners and developers.
It shows reporting installations, download decisions, codec shares, failures,
median decode time per MB, and the mean estimated saving against the alternative.
The 99% notice uses only choices where both codecs were available and calibration
was complete. Uncalibrated choices and single-codec availability cannot inflate
that comparison. Estimates are labelled separately from measured download times.

Calibration plots show every reported compression/decompression point with median
fitted coefficients for each codec. These are population summaries, not one universal
computer model. The decision plot places predicted LZ4 time on the horizontal axis
and predicted Zstd time on the vertical axis: LZ4 wins above the equal-time diagonal,
Zstd below. Dot color records the actual selection; failed transfers remain visible
in tooltips. Only calibrated decisions with both candidates belong in that plot.

Select a real download to explore its two transfer-plus-decode curves against network
speed. Its archive sizes and latest preceding calibration determine the crossover.
The shaded areas show which codec is predicted to win. Missing preceding calibration
is shown explicitly. The plots omit mesh construction and are not measured end-to-end
speedups. Reports load in pages of 500 under one time window, without random sampling;
loading and partial-fetch failures remain visible.

Reports contain timing/byte samples, the chosen codec and candidates, Unity version,
Editor platform, logical core count, memory size and a random installation ID.
The server combines the authenticated account ID with that random ID into a hash
and stores the hash rather than the raw installation or account ID in the sample.
These are pseudonymous operational measurements. Avatar contents, asset/version
identifiers, paths, hardware serial numbers and authentication tokens are absent
from the measurement body. Requests still use normal authenticated transport.

The summary covers the last 30 days. An hourly maintenance job removes older raw
reports. Requests are schema-validated, size-limited and rate-limited by authenticated
account. The dashboard returns aggregates and staff-only timing points without the
stored installation hash. Client reports are observations,
not trusted billing or security signals.

| Endpoint | Access and purpose |
| --- | --- |
| `GET /mcb/performance/bootstrap` | Authenticated; prepare reusable private probes; four requests per 15 minutes |
| `GET /mcb/performance/probe/25` or `/100` | Authenticated; fixed-size probe through existing private R2/local file delivery; eight requests per day |
| `POST /mcb/performance/reports` | Authenticated; bounded schema 1 reports; 120 requests per hour |
| `GET /mcb/performance/summary` | Admin/owner/dev aggregate view |
| `GET /mcb/performance/points` | Admin/owner/dev; paginated 30-day points and preceding calibration; `until`, `afterTime`, `afterId` cursor |
| `GET /mcb/package-versions` | Admin/owner/dev; public MCB package catalog with saved support status |
| `PUT /mcb/package-versions` | Admin/owner/dev; atomically save selected public versions, status and message |
| `GET /mcb/check-connection?packageVersion=1.5.2` | Existing authentication; explicit package support policy and custom update message |
| `GET /mcb/:assetId/model?...&codec=LZ4` or `ZSTD` | Existing version authorization and source checks, followed by selection of a stored variant |

Probe files are generated once and reused. The configured administrative account
must exist as their storage owner. Bootstrap failure is optional for the client;
it does not disable version downloads. Network probes use the same configured
private file-delivery service as versions, with cache avoidance and exact byte-count
validation. The large probe is conditional on the client's small-probe result.

## Identical meshes across versions

The local implementation now packages each renderer separately. Changing Hair can
reuse an unchanged Body, including its already constructed blendshapes. This needs
the matching backend and client; application source is not yet deployed.

Each renderer has a SHA-256 identity over its decoded native payload. Geometry,
blendshape frames, weights, bind poses, renderer paths, bone bindings and authoring
pose belong to that identity. Source FBX identity and payload format are included
too. This deliberately refuses reuse when geometry matches but its rig context
differs. LZ4 and Zstd representations share the same decoded identity.

Before downloading, the client requests the authorized version manifest. It checks
its descriptors against the version metadata, verifies cached encoded blobs, and
chooses compression using only the remaining download/decode work. Up to three
missing blobs transfer concurrently. A cached supported representation can be
retained even when another renderer uses a different codec. When everything is
cached, only common version files transfer. Downloads and local ZIP assembly stream
through disk rather than keeping a complete reconstructed archive in RAM.

Generated Unity meshes are shared within an asset and Unity Editor version. Apply
preserves unchanged mesh objects through base restoration, validates and reapplies
the target's bone bindings, and still applies the new logic, materials and
customization. The component records which version is applied separately from the
shared mesh path, so identical meshes do not make two versions indistinguishable.

Creator builds seed the encoded-blob cache. Deleting a local version retains shared
meshes and blobs for other versions and future downloads. **Delete unused generated
meshes** preserves references from open avatars and saved scenes, prefabs and assets.
Encoded blobs remain in MCB's data cache outside the Unity Assets folder. Saved
offline Unity packages still include their primary mesh representation.

The server keeps blobs private and version-owned. A known hash cannot retrieve a
blob that the requested authorized version does not declare. Physical deduplication
between different server version records is not part of this change. Existing
published packages are not rewritten into renderer-based versions automatically;
creators must rebuild to obtain per-renderer reuse.

The 8 September local integration run used the real UltiPaw reference, five
renderers and 497 Body blendshapes. A local fixture server exercised the actual
package-processing service and authorized model route with isolated identities
and storage. The Editor exercised download, extraction, the full version Apply
coroutine and Reset in a temporary preview scene.

| Operation | Meshes downloaded | Transfer bytes | Apply time |
| --- | ---: | ---: | ---: |
| A, empty cache | 5 | 25,789,595 | 34.52 s |
| B, only ManeHair changed | 1 | 378,197 | 1.38 s |
| C, meshes previously seen in A; new logic/defaults | 0 | 1,558 | 0.74 s |

B avoided 98.5% of the baseline transfer bytes. C used already constructed meshes,
including the earlier Hair from A. Four mesh references stayed assigned directly
through B-to-C; the changed Hair returned to its cached A representation. Reset
restored the original base in approximately 93 ms. These are single-run local
observations, not Internet speed estimates or guarantees. Geometry verification,
rendering and UI completion animation are excluded from the Apply timings.

All renderer geometry, skin weights, bind poses, bone paths and blendshape layouts
passed reference comparison. Position deltas stayed within the existing Unity
precision tolerance of 0.00001; this is not a claim of bit-exact blendshape deltas.
The test confirmed the changed Hair shape, new logic, new blendshape defaults,
version provenance, safe version-cache deletion and reset. The source FBX hash
remained unchanged. Deterministic checks additionally cover codec-independent
cache reuse and bone palette association. Evidence is stored in
`Editor/Benchmarks/results/2026-09-08-cross-version-reuse.json` in the package.

The follow-up passed 63 Unity EditMode tests and all deterministic health checks,
plus 532 backend tests with 14 existing environment-dependent skips. Backend
coverage includes inaccessible versions, incorrect source hashes, unrelated blob
hashes, private storage, offline export restoration and editing common texture
files without invalidating mesh identities. Fully cached common-only downloads
are not reported as compression choices, since no mesh compression decision is
needed. No production upload or deployment was performed.

## Public package support

Open **My Custom Base > Package versions**, select one or several releases, choose
a status, enter the message and save. Deprecated and unsupported statuses require
a nonblank message, up to 2,000 characters. The interface previews the changed state
immediately and restores the prior state on failure.

- **Supported:** clear the warning and connected-feature restriction.
- **Deprecated:** display the custom warning while allowing connected features.
- **Unsupported:** require an update before connected features; locally saved versions
  remain available.

The catalog reads only `orbiters.mcb` from the
[public VPM feed](https://blackorbit1.github.io/orbiters-vpm/index.json), with a five-minute
cache. On 7 September 2026 the feed contained MCB 1.5.2; its separate `ultipaw` entries
are not MCB package releases. Catalog failures do not erase existing policy. Startup
reads the stored exact-version policy without waiting for GitHub. A newer major
version alone does not make a supported version unsupported.

Clients check on startup and reconnection. Existing published clients need the new
policy-aware package code before they can honor these individual support settings;
this is not a server-side ban on requests from old clients. Policies are stored in
`mcb_package_policies`, with the last editing staff ID and timestamp.

## Connection recovery and installation dependencies

Profile pictures and gallery images reject destroyed Unity texture handles instead
of treating a dictionary entry as a successful cache hit. Owned UI textures stay
loaded through unused-asset sweeps and are released on assembly reload. Images can
reload from disk, and a failed image request becomes eligible for retry after
30 seconds. Profile elements update as image loading completes, with a periodic
check while attached to the panel.

In development mode, the shared URL resolver maps the development API's absolute
image URLs to the active local API, preserving their paths and query parameters.
Independent CDN origins remain unchanged. Backend image conversion endpoints
request PNG for Unity. Gallery rows center their cards as the available width
changes, including the final partially filled row.

A transient backend transport failure retains the offline report and saved versions.
The Editor quietly probes again after 2 seconds, backing off to at most one probe
per minute; a response restores connectivity, rechecks package support and refreshes
the gallery. Recovery does not replay uploads. The local development watcher is
restricted to source/configuration and excludes `uploads` and `.cache`: generated
delivery JSON must not restart the API. Restart the development watcher once after
adopting its configuration.

Python is not required by MCB users, and Unity installation is not treated as proof
of a Python installation. C# calls the bundled native codecs directly. Python scripts
are optional developer benchmarks or CI/package preparation tools; release archives
exclude `.py` files and require all distributed codec binaries. Windows codec
roundtrips passed with an empty executable search path. The separate Blender-sync
feature uses Blender's embedded interpreter, not system Python.

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

The admin/recovery follow-up passed 58 Unity EditMode tests (including native
roundtrips with no executable search path), six focused backend tests, seven frontend
tests, and a production build. A fixture-only headless browser rendered all three
plots and saved an unsupported package status plus message with no browser errors.
Fresh and populated-schema rehearsals each booted twice, preserving existing rows
and the new support policy; points and their preceding calibration were verified.
A simulated offline incident in the live Editor recovered without reloading it.
The locally constructed release archive validated 224 files with zero Python files.

The 8 September documentation/image follow-up passed 61 Unity EditMode tests and
23 frontend tests, plus the production frontend build. The image regressions cover
destroyed Unity texture handles, disk reload, bounded failure retry and development
API/CDN URL separation. Live Editor checks confirmed a valid account avatar and
all four checked gallery thumbnails. Unity's layout engine centered full and
partial card rows at 340, 540 and 800 pixels. A fixture-only browser rehearsal
rendered the real documentation Markdown and live-data widget at desktop and phone
widths, exercised refresh, and kept the admin plots and package controls working
with no browser errors. The authenticated local telemetry endpoint was also checked
separately. Application source remains local and undeployed.

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
