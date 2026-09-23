---
title: Test accounts and use the updated staff workspace
section: Operations
order: 52
audience: mod, admin, dev
stage: beta
id: orbiters.operations.account-and-workspace
domain: operations
type: runbook
owner: orbiters-operations
lastVerified: 2026-09-23
---

# Test accounts and use the updated staff workspace

## Return from impersonation

An authorized administrator can start impersonation from the user list. While
impersonating, open the navbar profile picture and select **Stop impersonating**.
Orbiters restores the original administrator and opens the user list. The same
action is available in the mobile account menu.

Impersonation access tokens last 30 minutes. Renewal now keeps the impersonated
identity, using the original administrator's authenticated refresh session. The
administrator must still have permission, and both account token versions must
remain valid. Revoking either account's session prevents renewal. A transient
network error can be retried; a revoked session requires signing in again.

## Find moderation and role settings

- **Community → Website moderation** contains website member review, website
  appeals, reports and privacy requests, filtered by existing staff permissions.
- **Community → Appeals → Settings & reviewers** controls which roles can review
  the selected Discord server's appeals. These changes save immediately.
- **Creator → Assets → Discord role assets** creates or links role-based assets
  per creator-owned server. See [Grant assets through Discord roles](../how-to/manage-discord-role-assets.md).

Community management permissions remain separate from website staff permissions.
The global Website roles editor is no longer available. Admin retains platform
services, feature access, asset administration and operational tools.

## Features and avatar bases

**Admin → Features** groups access rules by feature. Search by name, rank or user,
then filter category or active/paused state. Edit an existing rule, add a rank or
user rule, or remove one after confirmation. Uncovered features and creator tool
settings are available below the rule cards.

**Admin → Avatar Bases** shows linked assets and project-recognition rules. Edit
the base name, matching strategy and required project-relative paths. Asset links
are managed from the asset configuration. Cancel, Escape or the close control
dismisses an unsaved editor. Removing a base requires confirmation.

## Understand imported accounts

Enabling VRChat community 18+ features imports members who have not linked an
Orbiters account. These entries represent group members and cannot sign in yet.
The user list labels their source **Imported from VRChat**, displays their saved
VRChat profile image when available, and says they have not signed in. This is
different from an ordinary account whose sign-in has been disabled.

## Other staff tools

**Admin → Discord Servers** sorts by server name or recorded members, ascending
or descending. Sorting applies to the full result set before pagination. Counts
reflect recorded active membership, not a live query to Discord.

**Admin → Security** includes Telegram among the supported login providers in
its session-revocation explanation. For failed deliveries, see
[Recover Background Jobs](background-jobs.md).
