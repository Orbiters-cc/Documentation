---
title: VRChat Runtime Contract
section: General knowledge
order: 10
audience: public, user, creator, mod, admin, dev
stage: stable
id: orbiters.general.vrchat-runtime-contract
domain: general
type: invariant
owner: orbiters-docs
lastVerified: 2026-07-12
---

# VRChat Runtime Contract

VRChat content is authored in Unity but runs under VRChat-specific constraints.
Check the SDK contract before applying a normal Unity solution.

## Project Rules

- Create and migrate projects through Creator Companion or another VPM-compatible
  workflow.
- Use the Unity version currently supported by VRChat. A Unity Hub upgrade prompt
  is not a reason to move the project.
- Manage the VRChat SDK through VPM and run SDK validation plus Build & Test before
  treating editor behavior as verified.

## Avatar Rules

- Custom `MonoBehaviour` code does not run on uploaded avatars.
- Avatar behavior comes from allowed Unity/SDK components, playable layers,
  expression parameters and menus, PhysBones, contacts, and VRC constraints.
- Unsupported components can be stripped during build. A working editor scene is
  not proof that an uploaded avatar keeps the component.

## World Rules

- World scripts run through Udon or UdonSharp, not unrestricted C#.
- Synced state is owner-written. Network events are transient and are not replayed
  for late joiners.
- Pre-place network object pools instead of assuming ordinary runtime network
  instantiation.

## Platform Rules

PC and Android variants differ in shaders, component allowlists, performance
budgets, and upload limits. Variants of the same content use the same blueprint ID.
Keep avatar armatures and expression parameter layouts compatible: cross-platform
parameter synchronization depends on layout and type, not only parameter names.
