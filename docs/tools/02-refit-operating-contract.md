---
title: ReFit Operating Contract
section: Tools
order: 120
audience: creator, dev
stage: stable
id: orbiters.tools.refit-operating-contract
domain: refit
type: reference
owner: orbiters-refit
lastVerified: 2026-07-12
relations: orbiters.tools.mcb-operating-contract, orbiters.tools.unitgit-operating-contract, orbiters.tools.xray-gizmos-operating-contract
---

# ReFit Operating Contract

ReFit transfers clothing or accessory deformation from model A to model B and
writes the result as non-destructive blendshapes on duplicated mesh assets. Source
mesh assets are never modified.

## Output

- Generated meshes live under `Assets/ReFit/<asset name>/` and receive a `refit`
  blendshape enabled at 100 by default.
- Body-shape transfer adds separate shapes such as `refit_Belly_Big`.
- Cross-avatar mode replaces the asset armature, projects target skin weights, and
  preserves unmatched skirt, physics, or prop bones by re-parenting them.
- Blendshape-only mode keeps the armature and writes a standalone prefab when
  possible.
- Scene application is Undo-aware.

Use `ReFitService.Validate(request)` to stage and diagnose a request without
changing assets. Use `ExecuteCoroutine` for editor UI so geometry work does not
freeze the main thread. Batch validation uses
`Orbiters.ReFit.Editor.Tests.ReFitDeterministicTestRunner.RunBatchMode`.

When MCB invokes ReFit, the default base is model A, the applied custom base is
model B, generated files are committed through Unit Git, and reset must restore the
original meshes after a Unity restart.
