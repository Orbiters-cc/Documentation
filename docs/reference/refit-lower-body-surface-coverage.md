---
title: ReFit Lower-Body Surface Coverage
section: Reference
order: 145
audience: dev
stage: alpha
id: orbiters.refit.lower-body-surface-coverage
domain: refit
type: reference
owner: orbiters-refit
lastVerified: 2026-09-27
relations: orbiters.tools.refit-operating-contract, orbiters.refit.validation-performance
---

# ReFit Lower-Body Surface Coverage

The development implementation improves blendshape transfer to low-resolution shorts and trousers. It preserves the existing authored-pose workflow. This page describes locally validated code, not a published package release.

## Why a garment can clip

A lining or hard-edged hem can point inward. Using its vertex normal as a skin-facing constraint can reject the nearby leg and bind to a much farther surface. Separately, a dense muscle bulge can cross the interior of a large garment triangle even when the triangle's corners clear the skin.

`ReFitSettings.preserveLowerBodyCoverage` defaults to `true`. The policy identifies lower-body cloth from existing bone regions: at least 32 non-tubular welded groups, at least one quarter leg groups, and no arm or head groups. Closed tubular accessories retain their existing policy. Garment names are not used to classify meshes.

For eligible cloth, correspondence uses the nearest body surface with the configured region policy; lining and hem normals do not reject nearby skin. Projection debug notes identify this decision. With clearance correction enabled, dense body vertices support the interiors of the original garment triangles. Support retains its original triangle and barycentric coordinates throughout the solve to avoid jumping between legs or onto a lining.

The correction preserves the original positive gap separately for each transferred shape so additive shapes do not each consume the same initial clearance. Local diffusion reduces abrupt changes, followed by unsmoothed support passes. The existing transferred total-correction budget still applies. The algorithm does not change topology, UVs, skin weights, or the base mesh.

## Regeneration and diagnostics

Regenerate from the original garment input to obtain the improved transferred shapes. Previously saved result meshes do not update automatically. Binding and transfer cache identities were revised so earlier correspondence is not reused by the new policy.

The `surface-coverage` diagnostic records support count, correction count, maximum added correction and last support residual. This residual measures the support solve; it is not proof that the entire garment is intersection-free. `surface-coverage-limited` warns when a residual greater than 0.5 mm remains after the bounded solve.

Disabling `preserveLowerBodyCoverage` restores the previous correspondence and correction behavior for comparisons. Disabling clearance correction skips the dense support pass. Neither option changes the scene pose.

## Validation and limits

The deterministic dense-peak fixture reproduces clipping with the policy disabled and checks clearance with it enabled at 25%, 50%, 75%, 100%, and two additive shapes at 100% each. It also checks an unchanged zero shape, deterministic identical shape transfer, and rotated/scaled geometry. The full deterministic run passed 65 checks with five optional scene/VRCFury checks skipped.

A private shorts replay used the original garment, a matching body FBX, copied transform/renderer hierarchies, and front, side, three-quarter and rear Unity-camera images. The large visible thigh holes were removed. With both shapes at 100%, nearest-face penetration candidates decreased from 613 to 170; 168 remaining candidates were independently confirmed inside the body. Internal crotch intersections and pre-existing rear fur protrusions remain. This is not a zero-intersection result or a guarantee for arbitrary animation poses.

Hoodie, glowstick and tanktop FBX comparisons produced identical vertices, normals, tangents, topology, skinning and every blendshape with the policy enabled and disabled. These raw FBX controls do not reproduce every authored pose of the older scene fixtures. The glowstick replay retained the same 18 intersections between separate components and zero within-component intersections across the tested weights; its pre-existing 100% edge/orientation outliers were unchanged. This comparison does not replace the skipped scene/VRCFury integration checks.

A temporary 20-degree leg spread was evaluated on copied rigs and converted back into the original stance. It increased the combined-shape penetration candidates to 223 and the maximum edge stretch from 6.668 to 7.401. It is retained only as an opt-in replay parameter, not enabled in the fitting pipeline.

Use `ReFitSurfaceCoverageTests.RunOrThrow()` for the synthetic regression. `ReFitShortsValidation.Run(...)` is an opt-in private-fixture replay; its fixture paths must exist, and each output label must be unique. Always inspect final geometry in the original pose, including individual and combined weights, before accepting a result.
