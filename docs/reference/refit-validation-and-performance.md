---
title: ReFit Validation and Performance
section: Reference
order: 145
audience: dev
stage: alpha
id: orbiters.refit.validation-performance
domain: refit
type: reference
owner: orbiters-refit
lastVerified: 2026-09-05
relations: orbiters.tools.refit-operating-contract
---

# ReFit Validation and Performance

This describes the local development implementation. See the [ReFit Operating
Contract](../tools/02-refit-operating-contract.md) for the creator-facing workflow.

## Execution Contract

Use `ReFitService.ExecuteCoroutine(request, progress, onComplete)` from an editor
coroutine runner. Staging and baking use Unity objects on the main thread;
geometry uses captured arrays on a worker. The existing three-argument entry point
remains the MCB integration contract. A fourth `CancellationToken` argument is
available; synchronous service/engine calls also accept a token after progress.

Settings and requested shape names are copied at invocation. Keep input Unity
objects alive. The service checks input transforms, renderer state, metadata and
native mesh revisions before applying asynchronous output. A changed input rejects
the result rather than applying geometry computed against an obsolete pose.

Dispose an abandoned coroutine. The wizard disposes its execution stack when
closed. Cancellation is cooperative at geometry-phase boundaries. Validation and
preflight do not repair the live scene. Explicit armature repair is a separate
`ReFitAssetPipeline.RepairSceneAssetArmature(request, report)` operation.

Scene application is a short synchronous Undo transaction after computation.
Invalid armature application rolls back the scene, including prefab connectivity
when unpacking was required, and removes only operation-created output assets.
An optional prefab-save warning can retain a valid saved mesh. Successful scene
undo does not remove mesh files. Direct engine callers own the output mesh,
including partial output reported on failure; the service cleans up failed output.

## Settings and Integrations

`ReFitSettingsPresets.ApplyTightness(settings, value)` shares the wizard clearance
policy with integrations (`0` loose, `1` tight). Primary and transferred-shape
smoothing remain independent. Advanced **Garment type** accepts `Auto`, `UpperBody`
or `Other`; automatic upper-body inference no longer uses avatar ancestor names.

XRay Gizmos is optional. Its separate editor adapter supplies projection/island
toggles through a narrow bridge; the main editor assembly does not reference XRay.
Optional MCB authentication/environment reflection is centralized in one service.

Cached bindings and transferred deltas validate mesh content, pose, skinning,
base-affecting garment shapes/sliders, target frame content and geometry settings.
Same vertex/triangle counts or unchanged shape names are insufficient. Missing or
mismatched provenance causes recomputation, not reuse of potentially stale output.

## Geometry and Performance

Source/target BVHs and bindings are shared within an operation. A deformed-body
index is built once per clearance pass and reused by guards/final measurement.
Final penetration is measured after all corrections; overwritten intermediate
measurements are removed. BVH queries use a query-local bounded stack and subranges
sort in place, avoiding recurring allocations without shared mutable query state.
Native plugins and GPU kernels are not part of this implementation.

Staging evaluates whether source-joint snapping actually improves a standalone
garment's alignment. It samples up to 512 vertices before/after snapping; if both
mean and P95 body distance worsen by more than 1 mm, it preserves the authored scene
pose. This prevents an extra accessory joint from folding an already fitted mesh.
It does not establish a universal exact-fit guarantee.

## Running Validation

Use a disposable test scene/project for batch work. Never upload licensed models
or generated previews into source control. The runner's types below are in
`Orbiters.ReFit.Editor.Tests`.

| Entry point | Evidence |
| --- | --- |
| `ReFitDeterministicTestRunner.RunOrThrow()` | Synthetic cases, authored FBXs, optional private asset regressions; throws on failure |
| `ReFitDeterministicTestRunner.RunBatchMode()` | Batch/CI exit status |
| `ReFitDeterministicTestRunner.BenchmarkHoodie(true)` | Explicit baseline recording on a reference revision |
| `ReFitDeterministicTestRunner.BenchmarkHoodie(false)` | One/four-shape timing and geometry comparison against the recorded baseline |
| `ReFitDeterministicTestRunner.AuditHoodie()` | Full debug-stage hierarchy, per-bone weights/bounds and four offscreen JPEG views |
| `ReFitStandaloneCompilation.Run()` | Asynchronous main-source compilation excluding Orbiters/project references |

Per-case status/timings are in `Temp/ReFitTests/latest.txt`. Missing prerequisites
are `SKIP`, not `PASS`. The deterministic suite excludes the selection-changing
VRCFury build and scene-dependent validation; run those only through their explicit
integration entries. The public MCB coroutine contract is tested separately using
multiple shapes, without driving the MCB UI or a complete version-application flow.
Standalone compilation writes `Temp/ReFitTests/standalone/result.txt`; this does not
replace a fresh-project package-resolution test.

Private audit/benchmark artifacts stay under `Temp/ReFitBenchmarks`. Capture needs
graphics support. Engine timings exclude scene saving and debug snapshot overhead;
record settings, machine/editor load and repeated timings. The four-shape sample
uses one muscle shape plus three other available shapes, not necessarily four
full-body deformations. Never overwrite a baseline after an optimization and then
call the comparison independent validation.

## Reading Results

Both authored fixtures check forward/reverse surface distance and polygon quality.
An additional v1/v2 inserted-joint comparison requires every corresponding base
vertex and shape delta to agree within 1 mm. That does not mean the separately
authored result matches everywhere within 1 mm; coverage and outlier distances must
be reported separately. Performance parity permits at most 0.01 mm output drift.

Inspect the complete hierarchy, not only counts: one intended root, anatomically
connected mapped chains, preserved clothing extras, correct leaf direction/length
and no unintended deforming lower-leg/hand branches. Compare influence totals,
vertex counts and spatial bounds against original clothing and target-body regions.
Review offscreen images too. A passing regression suite or unchanged geometry can
still preserve pre-existing clipping under particular poses or clearance settings.
