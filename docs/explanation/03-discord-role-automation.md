---
title: Discord Role Automation
section: Explanation
order: 82
audience: creator, admin, dev
stage: stable
---

# Discord Role Automation

Orbiters grants and removes Discord roles through an outbox queue. This makes role changes retryable and keeps user-facing flows from blocking on Discord availability.

## When Roles Are Queued

Roles can be queued when:

- a user redeems an asset linked to a Discord role,
- a sale or license event revokes access,
- a sync job detects that a role-backed asset should change state.

## Why A Queue Exists

Discord can fail temporarily because of permissions, outages, rate limits, missing members, or bot availability. Queueing lets Orbiters retry transient failures and mark terminal failures without losing the original intent.

## Revoke Safety

Before removing a role, Orbiters checks whether the user still has another enabled asset that backs the same role. This prevents one revoked asset from removing a role that another active asset still grants.

<audience include="dev">

Outbox job types are `discord.role.grant` and `discord.role.revoke`. Stale in-progress jobs are recovered after worker interruption. Non-retryable Discord errors are marked failed.

</audience>

