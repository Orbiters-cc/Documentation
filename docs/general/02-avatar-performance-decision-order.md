---
title: Avatar Performance Decision Order
section: General knowledge
order: 20
audience: public, user, creator, mod, admin, dev
stage: stable
id: orbiters.general.avatar-performance-decision-order
domain: general
type: how-to
owner: orbiters-docs
lastVerified: 2026-07-12
relations: orbiters.general.vrchat-runtime-contract
---

# Avatar Performance Decision Order

Optimize the metric that determines the worst SDK rank first. Reducing triangles
does not help when texture memory, material slots, skinned meshes, PhysBone checks,
contacts, or constraints remain the limiting metric.

## Triage Order

1. Run the SDK performance report for the target platform.
2. Record the worst-ranked metric and the next two closest limits.
3. Reduce hidden or duplicate renderers, material slots, and texture memory before
   changing visible geometry without evidence.
4. Inspect PhysBone affected transforms, colliders, and collision checks together;
   component count alone is incomplete.
5. Inspect constraint count and depth, contacts, particles, lights, audio sources,
   and animators.
6. Build and test the actual PC and Android variants. Disabled objects still count
   toward static avatar rank.

## Mobile Gate

The reviewed 2026-05-06 limits cap Android avatar download size at 10 MB and
uncompressed size at 40 MB. Poor and Very Poor mobile avatars are hidden by
default, and excessive categories may be removed even after a user chooses to show
the avatar. Treat the Android variant as a separate constrained build, not a PC
avatar with only its shader swapped.

## Verification

The SDK rank is static analysis. Confirm the result in-client because shader cost,
runtime animation, and scene population can change practical performance.
