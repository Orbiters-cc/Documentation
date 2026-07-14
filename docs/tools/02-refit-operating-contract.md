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
lastVerified: 2026-07-14
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

## Environment

ReFit Settings exposes the same **Dev Environment** switch as MCB. Production uses
`https://api.orbiters.cc/refit`; development uses `http://localhost:4100/refit`.
When MCB is installed, ReFit reads and writes MCB's persisted environment selection
so both tools always address the same backend. A standalone ReFit install persists
the selection independently and defaults to production.

## Manual ReFit Commissions

The result screen lists creators who currently accept manual ReFit commissions.
Creator profile pictures are center-cropped and circular; missing pictures use the
same circular fallback frame.
The user can select several creators and continue to Orbiters through a short-lived,
one-time browser handoff. When MCB authentication is available, that handoff also
opens the matching Orbiters account in the browser. A standalone ReFit install can
still continue, but the website asks the user to sign in.

The handoff includes only the selected creator IDs and bounded ReFit context: asset
name, source avatar, target avatar, mode, and blendshape. It does not upload the
Unity asset, mesh, scene, local paths, or authentication token.

On Orbiters, the user can reorder creators, override each response time, or ask all
selected creators at once and take the first acceptance. See [Request a Manual
ReFit Commission](../how-to/10-request-refit-commission.md).
