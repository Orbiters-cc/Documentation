---
title: Avatar build profiling and polygon reduction
section: Development
order: 94
audience: dev
stage: alpha
id: orbiters.development.avatar-build-profiling
domain: myavatar
type: reference
owner: orbiters-engineering
lastVerified: 2026-10-30
---

# Avatar build profiling and polygon reduction

My Avatar applies polygon reduction to the avatar's build copy. Its error budget and shading checks decide whether
a simplified mesh is accepted. A shorter build must preserve those checks, including blendshape transfer and posed
geometry; disabling the optimizer is not an equivalent result.

## October 2026 measurement

The active Canine avatar's recorded upload took 765.3 seconds. The My Avatar structure pass took 587.5 seconds,
including 583.4 seconds in polygon reduction. This is editor preprocessing time, separate from bundling and upload.

Toolkit's surface queries used a uniform grid. Dense and overlapping body triangles crowded individual cells;
matching vertices and testing each candidate pose revisited these triangles many times. The implementation now uses
the shared mesh BVH, reuses each nearest-distance result for its shading test, and limits normal matching to nearby
triangles. Scratch lists remain local to each concurrent query batch.

On the same body mesh, a 991-point probe measured matching at 6,775 ms before and 606 ms after, and the distance and
shading check at 2,830 ms before and 284 ms after. A subsequent hidden SDK preprocessing run measured polygon
reduction at 83.9 seconds and the complete structure pass at 95.9 seconds. These are individual diagnostic runs,
not a distribution or a full upload comparison. The hidden run did not bundle, upload, or launch VRChat.

The error budget, 99-percent distance limit, worst-case distance limit, shading threshold, and candidate search
settings are unchanged. Closest-point barycentrics now come from the shared geometry implementation. Consequently,
the accepted polygon count can differ: the recorded run removed 17,184 polygons and the new run removed 13,076.
Fewer removed polygons are not treated as a reason to weaken the quality limits.

## Validation and remaining cost

Focused tests cover the two distance limits, nearby versus distant normals, hard-edge blendshape transfer,
concurrent matching, long thin triangles, shared BVH operations, and My Avatar optimization. The source avatar's
object count remained unchanged across the hidden build.

The same diagnostic run also spent 100.1 seconds in MCB's post-build links and animation-offset hook, mostly in
version link processing, even though it found no matching motions. This remains a separately measured bottleneck;
the surface-query improvement does not remove it. Bundle compression, shader processing, network upload, visual
mesh quality in VRChat, and target-device performance have not been validated by this editor-only measurement.
