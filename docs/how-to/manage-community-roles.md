---
title: Manage community roles
section: Community
order: 149
audience: user, creator, admin, dev
stage: beta
id: orbiters.creator.community-roles
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-09-22
---

# Manage community roles

Any signed-in personal account can create a community. Open **Account → Overview →
Your community → Create my community**, choose its name, continue and confirm.
The button expands into a focused dialog, like Connect VRChat; closing it saves
nothing. The same setup is available in the homepage **Create a community** widget.

After confirmation, **Community** appears in the navbar and the account card shows
**Manage my community**. Each account can own one community and help manage others.
Choose a community from the page selector when you have more than one.
Sections use the same grouped sidebar as Admin and Creator on desktop and a
compact **Community section** selector on mobile. Back and Forward restore your
selected section.

The homepage **Create a community** and **Creator status** widgets disappear once
you own a community or receive creator status respectively, including pinned
copies. Pending creator requests remain visible. These widgets share the normal
homepage pinning and layout controls; the homepage has no separate creation button.

Open **Community → Roles** for membership roles and automatic platform equivalents.
Community ownership and management never grant website Admin, Moderator or Creator
status. Website staff ranks never grant access to someone else's managed community.

## The default Orbiters community

The official **Orbiters** community is created automatically for the website owner.
If that owner already created a community, setup reuses its identity and preserves
its roles, assignments, connections and management team. It adopts the Orbiters
name instead of creating a duplicate workspace.

The name Orbiters is reserved for this official community and cannot be changed
after creation. Website Admins and Moderators do not automatically join its management
team: the owner explicitly grants community access, just as for other communities.
Other members can create their own differently named communities.

## Manage your team

The owner can connect platforms and invite
registered users through **Management team**. Community Admins manage roles,
verification, VRChat group tools and appeals. Community Moderators review appeals.
Only the owner can change connections or the selected VRChat group and grant or
revoke management access. These explicit management permissions are separate from
membership roles, even when a role is named “Admin” or “Community manager”.

**Verification** and **Appeals** operate only on Discord servers connected to the
selected community. Discord Verification Management is in this workspace; website
appeals and the platform VRChat service account remain separate in Admin. Creator connections contain stores
and creator tools; community connections live under **Community → Connections**.
Use **Events** to open your event workspace. Events keep their own provider
and event-team permissions; community management access does not grant event-team
access automatically. Event access never exposes the website Admin workspace.

This implementation requires the matching frontend and backend release.
Publishing this guide does not deploy the feature.

## Create a role

1. Select **Create role**. Its button expands into the editor. Choose a Discord
   server icon (the first is selected initially), then search its roles. The role
   supplies the initial name and color. **Discord role color** restores that color
   after a swatch choice; **Custom color** opens a picker and hex input. A manual
   role can simply use a typed name.
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

Selecting another Discord role restores that role's color and closes the custom
picker. You can then choose a preset or open **Custom color** again. Dragging
through a preset color inside the custom picker keeps the picker open.

## Prepare your connections

For Discord, connect the server in **Community → Connections**. Your linked Discord
account must own the server or have **Manage Roles**, and the chosen role must be
below your highest role unless you own the server. Exporting also requires the
bot's **Manage Roles** permission and a bot role above the equivalent. Managed
integration roles, `@everyone` and roles configured as Orbiters staff ranks are
excluded.

For VRChat, the community owner connects a dedicated account and selects a group
in **Community → VRChat**. The website service account is not available as a role
equivalent. The connected account needs group ownership or **View All Members** and
**Manage Roles**; exporting requires **Assign Roles** too. VRChat's hierarchy can
still protect individual members. See [Manage a VRChat community](manage-vrchat-community.md).
Connection ownership and platform permissions are checked again during synchronization.

Only registered Orbiters accounts participate in role rules. Members must link
their personal Discord or VRChat identity and join the corresponding community.
Rules do not create accounts or join people to servers or groups. Local accounts
without a valid linked platform ID do not trigger provider requests. Unknown users
or non-members are treated as unconnected, rather than as platform outages.
Old automatic error-only entries are removed on the next scan when no linked
membership or outstanding delivery remains; manual Orbiters assignments are kept.

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
Assignments stay visible while a save or refresh loads the updated status.
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

The next release returns a retryable **Community roles are busy syncing** message
when synchronization or another edit occupies the available role-processing
capacity. Wait a moment and retry the action. Background work skips busy roles
and checks them again on a later scan.

<beta>
The next release marks the affected member for checking when Orbiters receives a
Discord member-role change. The existing worker performs the sync; changes do not
wait for the next five-minute full scan. Events received during another sync are
queued durably. Older page refreshes cannot overwrite the result of a newer role
action, and repeated polling does not overlap.

Closing the owner's account disables its rules and queues removal of roles those
rules granted. See [Close your account](15-manage-privacy-and-shared-content.md#close-your-account)
for delayed provider cleanup.
</beta>

A failed platform read does not count as proof that a member lost their role.
Uncertain writes are recorded and checked against current provider membership
before another write. Completed work on the other platform remains recorded.

<audience include="dev">

## Implementation and validation

Default-community setup runs after database synchronization and can complete after
the owner's first sign-in. It prefers the configured primary owner identity; without
one, it accepts a single active account with website Owner rank. It never guesses
between multiple owners or picks an arbitrary administrator. A database advisory
lock and unique owner/system-key indexes prevent duplicate setup. The explicit
nullable-column migration preserves existing communities and can be rerun.


The JWT-authenticated `/community` API exposes capabilities and self-service community creation. Scoped `/community/:id` routes expose community-owned roles,
connection role choices, registered-user search and paginated assignments. Updates
use a role revision; saving an outdated editor returns a conflict. Provider roles
have a database uniqueness constraint across all community rules, including retiring
mappings. No provider IDs supplied by a browser bypass owner or permission checks.

`ManagedCommunity` and `CommunityManager` persist ownership and explicit team grants.
`CommunityRole`, `CommunityRoleLink` and `CommunityRoleMember` are separate tables
created without altering existing user or Discord-role tables. Role processing and
configuration use the same PostgreSQL advisory lock. Each external assignment has
a durable receipt in the membership row before the provider mutation. Re-linking
an account cleans up the receipt's original identity before granting a replacement.
Personal data exports include the member's Orbiters assignments and the creator's
role definitions, without internal provider delivery receipts. Account merges
transfer model-owned assignments and update the saved VRChat connection reference.

The next release uses a nonblocking advisory-lock attempt and admits role work
before acquiring a database connection. Each admitted operation budgets one lock
connection plus two for its independent receipt transactions and reads. With the
default five-connection pool, one role operation runs per process at a time.
Contention returns HTTP 409 for interactive changes and skips background work.
Pools smaller than three connections cannot admit role work. Provider receipts
remain independently committed before remote writes. The disposable PostgreSQL
regression covers same-role and different-role saturation, cross-process lock
contention and connection reuse after completion.

The worker starts through `server.js`, skips explicitly disabled external startup,
and scans up to three due roles per ten-second tick, with ten accounts per role.
Pending manual changes take priority over the normal cursor scan. Completed scans
are scheduled again after five minutes; provider outages remain visible and retry
without deactivating unrelated assignments. Reads in the UI refresh saved status
every fifteen seconds only while the document is visible.

The next release uses `community.role.invalidate` jobs when a live Discord change
cannot acquire the role lock. `community.roles.close` jobs retain encrypted
provider sessions and grant receipts after owner closure, retry incomplete
removals, and delete role records only after completion. Completed removals are
not repeated. Exhausted cleanup jobs remain visible as failed outbox jobs and
require operator review; never mark one processed merely to hide the failure.

The focused community-role tests cover rule evaluation, community and website permission isolation,
idempotent grant recovery, provider-owned roles, relinking, HTTP access, worker
startup and HTTP readiness. The opt-in database test requires a disposable
loopback PostgreSQL instance, creates fresh databases, and boots both fresh and
populated prior schemas twice while preserving user and assignment data.
`src/scripts/communityBrowserQa.cjs` validates the production frontend with local
API fixtures; it does not operate live Discord or VRChat roles.

</audience>
