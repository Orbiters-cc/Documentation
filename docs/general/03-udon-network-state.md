---
title: Udon Network State
section: General knowledge
order: 30
audience: creator, dev
stage: stable
id: orbiters.general.udon-network-state
domain: general
type: invariant
owner: orbiters-docs
lastVerified: 2026-07-12
relations: orbiters.general.vrchat-runtime-contract
---

# Udon Network State

Use synced variables for durable state and network events for immediate effects.
If a late joiner must observe a value, encode it as synced data.

## Owner-Written State

- Only the owner of a networked object can change its synced variables.
- Transfer ownership before changing shared state when the local player is not the
  owner.
- With manual sync, change the value, apply it locally, then call
  `RequestSerialization()`.
- Apply received values from `OnDeserialization()`.
- Do not call `RequestSerialization()` merely because a player joined; VRChat sends
  the current synced state to late joiners.

## Events

- Use explicit public `[NetworkCallable]` methods for intended network entrypoints.
- Prefix public methods or custom events with `_` when they must never be callable
  over the network.
- Network events reach current recipients once and are not durable history.
- Keep payloads small and rate bounded. Queued events can clog Udon networking;
  inspect queued-event counts and `Networking.IsClogged` before sending more.

Do not use instance master as a security boundary. Ownership can move, and
authorization belongs in explicit state and validation rules.
