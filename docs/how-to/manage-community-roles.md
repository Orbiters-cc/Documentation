---
title: Manage community roles
section: Creator
order: 149
audience: creator, admin, dev
stage: beta
id: orbiters.creator.community-roles
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-09-20
---

# Manage community roles

Open **Admin → Community & moderation → Community** to create roles for your
creator community. Creator accounts can open this area without receiving global
staff access. Every role, rule and member assignment belongs to the creator who
created it; community roles do not change Orbiters staff ranks or feature access.

This implementation requires the matching frontend and backend release.
Publishing this guide does not deploy the feature.

## Create a role

1. Select **Create role**, enter a name and optional description, and choose a color.
2. Choose how membership is decided:

| Direction | Behavior |
| --- | --- |
| Manual | Assign the Orbiters role yourself. |
| Into Orbiters | A matching Discord or VRChat role grants the Orbiters role. |
| From Orbiters | An Orbiters assignment grants its connected platform equivalents. |
| Two-way | Independent platform roles grant the Orbiters role, which can grant the other equivalents. |

3. For automatic roles, choose a Discord server and role, a VRChat group and role,
   or both. Each platform role can belong to only one Orbiters rule.
4. For **Into Orbiters** or **Two-way**, choose **Any linked role** or **All linked
   roles**. “All” requires every selected equivalent to be held independently.
5. Save. New rules enter the background queue. The cards show assignment counts,
   the latest completed scan and members needing attention.

You can have up to 30 active roles. Search finds roles by name or description.

## Prepare your connections

For Discord, connect the server in **Creator → Integrations**. Your linked Discord
account must own the server or have **Manage Roles**, and the chosen role must be
below your highest role unless you own the server. Exporting also requires the
bot's **Manage Roles** permission and a bot role above the equivalent. Managed
integration roles, `@everyone` and roles configured as Orbiters staff ranks are
excluded.

For VRChat, a Community Leader first connects an account and selects a group in
**Account → VRChat**. Administrators can also use the shared account configured in
**Admin → VRChat**. The account needs group ownership or **View All Members** and
**Manage Roles**; exporting requires **Assign Roles** too. VRChat's hierarchy can
still protect an individual member from role changes. See
[Manage a VRChat community](manage-vrchat-community.md).

Only registered Orbiters accounts participate in role rules. Members must link
their personal Discord or VRChat identity and join the corresponding community.
Rules do not create accounts or join people to servers or groups.

## Assign or exclude a member

Open a role's **members** button and search by name, Orbiters ID or Discord ID.
**Grant role** creates a manual assignment; **Block role** excludes a matching
search result directly. Existing assignments have three modes:

| Assignment | Result |
| --- | --- |
| Follow rules | Automatic conditions decide membership. Manual-only roles have no automatic condition. |
| Always grant | Keep the Orbiters role regardless of automatic conditions. |
| Always block | Exclude the member even when they match a condition. |

Manual changes update the Orbiters assignment immediately; platform work is queued.
The member list refreshes saved status while it is visible. It shows the evidence
behind automatic membership, pending synchronization and actionable errors.
**Refresh members** checks saved status immediately; **Sync** on the role card queues
a fresh scan.

## Understand two-way rules and removals

For a fictional example, the **Community manager** role imports from a Discord
manager role and exports a VRChat equivalent. When someone independently receives
the Discord role, they gain the Orbiters and VRChat roles. If the Discord source
is removed, the automatic Orbiters assignment ends and Orbiters removes the VRChat
role that this rule granted.

A role that Orbiters itself granted is not treated as independent evidence on the
next scan. This prevents two-way rules from keeping themselves alive indefinitely.
Roles already held before Orbiters tried to assign them stay under platform control
and are preserved during cleanup. **Always grant** keeps its equivalents active;
**Always block** removes only equivalents owned by this rule.

Turning off **Automatic sync** pauses provider work and preserves existing roles.
Editing equivalents queues cleanup of roles previously assigned by the removed
mapping. Archiving clears the Orbiters assignments and queues the same cleanup,
including for paused roles. Review unfinished cleanup under **Archived roles**.
The original connection must remain available until its pending removals finish.
Switching to **Manual** removes the equivalents and queues their cleanup, including
when the previous automatic rule was paused.

## Resolve synchronization issues

Open members when a card reports a problem. Reconnect unavailable integrations,
correct role hierarchy or permissions, or have the member link their account and
join the community. Then choose **Sync**. Background scans are bounded and may
take longer in large communities; they are not instantaneous.

A failed platform read does not count as proof that a member lost their role.
Uncertain writes are recorded and checked against current provider membership
before another write. Completed work on the other platform remains recorded.

<audience include="dev">

## Implementation and validation

The JWT-authenticated `/community` API exposes capabilities, creator-owned roles,
connection role choices, registered-user search and paginated assignments. Updates
use a role revision; saving an outdated editor returns a conflict. Provider roles
have a database uniqueness constraint across all creator rules, including retiring
mappings. No provider IDs supplied by a browser bypass owner or permission checks.

`CommunityRole`, `CommunityRoleLink` and `CommunityRoleMember` are separate tables
created without altering existing user or Discord-role tables. Role processing and
configuration use the same PostgreSQL advisory lock. Each external assignment has
a durable receipt in the membership row before the provider mutation. Re-linking
an account cleans up the receipt's original identity before granting a replacement.
Personal data exports include the member's Orbiters assignments and the creator's
role definitions, without internal provider delivery receipts. Account merges
transfer model-owned assignments and update the saved VRChat connection reference.

The worker starts through `server.js`, skips explicitly disabled external startup,
and scans up to three due roles per ten-second tick, with ten accounts per role.
Pending manual changes take priority over the normal cursor scan. Completed scans
are scheduled again after five minutes; provider outages remain visible and retry
without deactivating unrelated assignments. Reads in the UI refresh saved status
every fifteen seconds only while the document is visible.

The focused community-role tests cover rule evaluation, creator isolation,
idempotent grant recovery, provider-owned roles, relinking, HTTP access, worker
startup and HTTP readiness. The opt-in database test requires a disposable
loopback PostgreSQL instance, creates fresh databases, and boots both fresh and
populated prior schemas twice while preserving user and assignment data.
`src/scripts/communityBrowserQa.cjs` validates the production frontend with local
API fixtures; it does not operate live Discord or VRChat roles.

</audience>
