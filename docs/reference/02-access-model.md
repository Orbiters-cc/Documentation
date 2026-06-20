---
title: Access Model Reference
section: Reference
order: 71
audience: creator, admin, dev
stage: stable
---

# Access Model Reference

Orbiters access combines user identity, user assets, scopes, supporter tiers, roles, and feature flags.

## Documentation Audiences

- `public`: everyone.
- `user`: logged-in users.
- `creator`: creators and higher staff contexts.
- `mod`: moderators, admins, developers, and owners.
- `admin`: admins, developers, and owners.
- `dev`: developers and owners.

## Asset Scopes

| Granted scope | Public | Beta | Alpha |
|---|---:|---:|---:|
| `public` | yes | no | no |
| `beta` | yes | yes | no |
| `alpha` | yes | yes | yes |

## User Asset States

A user asset grants access only when it is enabled and its scope allows the requested version.

Common disabled reasons:

- refund or revocation,
- manual admin action,
- stale or invalid access record,
- migration cleanup.

## Supporter Tier Access

Supporter tiers grant public access only. They do not grant beta or alpha access.

## Feature Access

Admin and moderation UI visibility can depend on feature access flags in addition to rank. A rank alone should not be treated as proof that every admin tool is visible.

<audience include="dev">

Developer and owner ranks expand to creator, mod, admin, and dev audiences in documentation. Admin expands to mod and admin. Moderator expands to mod.

</audience>

