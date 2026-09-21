---
title: Manage a VRChat community
section: Account
order: 148
audience: user, creator, admin, dev
stage: beta
id: orbiters.account.vrchat-community
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-09-21
---

# Manage a VRChat community

Any personal Orbiters account can create a community from **Account → Overview →
Your community**. Choose a name and confirm, then open **Community → VRChat**.
No website staff approval or creator status is required.

The community owner connects the dedicated account and selects its group.
Explicit Community Admins can manage group tools; only the owner can change its
connection. Website staff ranks provide no access to another owner's community.
See [Manage community roles](manage-community-roles.md) for setup and team permissions.

The shared website account stays in **Admin → Website VRChat**, with independent
credentials, rate limits and selected group. It cannot be selected for managed
community role synchronization.

The service-account password field submits **Connect service account** when Enter
is pressed. Once connected, the owner can change its profile picture in the same
card: choose a PNG, JPEG or WebP up to 10 MB and confirm the preview. Orbiters
normalizes it to a square and updates the connected VRChat profile. If upload
succeeds but the profile update cannot be confirmed, retrying the same image
reuses the confirmed upload.

## Manage the group's 18+ role

After selecting a group, check **Enable 18+ features**. Orbiters creates an **18 Plus**
role or reuses an existing **18+** or **18 Plus** role. VRChat rejects `18+` as a
new role name with “name has invalid text”; the accepted name does not change its
adult-verification purpose. The role must not be self-assignable, granted on join,
a default/management role, or grant permissions. The community account needs
Manage Roles, Assign Roles and View All Members, or group ownership.

Enabling starts a paced import of group members. Each person gets an automatically
created, unclaimed Orbiters record if their VRChat identity is not already linked.
These records cannot sign in. A visible VRChat **18+** label establishes adult
verification; a hidden or absent label does not establish adulthood. Valid existing
Orbiters evidence also counts. Verified members receive the group role; losing
verification queues its removal. Review-required accounts do not receive the role.

Progress and connection errors appear below the checkbox. **Rescan group members**
starts another explicit scan. Available membership updates from VRChat also queue
checks; the websocket cannot guarantee a complete roster. Viewing the tab makes
no provider requests. Disabling stops synchronization and leaves existing roles
and account records in place. Existing privacy-closed member records are not reopened.

The import also handles the community owner's linked identity. Each completed
batch saves its member updates and progress together. If another operation is
using the same VRChat account, an interactive action reports that the account is
busy: wait briefly and retry. Background synchronization retries on a later pass;
it does not queue database connections while waiting for the account. Imports and
identity linking use the same lock order across communities, including communities
whose owners belong to each other's groups. Linking, unlinking or merging may also
report busy during an import batch; retrying after that batch preserves the
existing connection until the action can complete.

VRChat does not let the community account change roles for members at equal or
higher rank, including the group owner. These members appear under **Manual role
changes needed**, with the required assignment or removal. Other members continue
syncing. Make the listed changes in VRChat using an account allowed to manage those
members, then **Rescan group members** to reconcile their status. Orbiters does not
automatically retry the same rejected role change on every worker pass.

Other permission, session or unsafe-role errors pause synchronization. Correct the
connection or permissions and rescan explicitly to resume.

When someone later connects their VRChat identity, an unclaimed imported record
merges into their signed-in account automatically. Staff can see **Automatically
created from a VRChat group** in the member's verification details.

## Connect your community account

1. Open **Account → VRChat** and enter the dedicated account's username and password.
2. Complete the email, authenticator or recovery-code step if VRChat requests it.
3. Check the connected profile picture and name. The password is used for login
   only; Orbiters stores the authenticated session encrypted.

Use **Change account** to replace the connection. The existing account keeps
working until replacement login succeeds. Use **Check connection** to refresh
the profile and connection status. Browse the online and offline friend lists
below the group tools.

This community connection is separate from your personal identity in
**Overview → Connections → VRChat**. Linking a personal identity does not grant
community ownership or connect a community-management session.

To schedule a gathering across Discord and VRChat, open **Community → Manage events**.
[Create and manage community events](manage-community-events.md) explains group
selection, website team access, announcements and configurable instance opening.

## Choose a group

Select **Load groups** the first time, then choose a card in **Choose your community group**. The picker lists groups joined
by the connected VRChat account and supports search and refresh. If the desired
group is missing, join it in VRChat and refresh the picker.

The selected group's banner, icon, name and member count identify it above the
**Members** and **Announcements** tabs. Members include profile pictures and
profile links. Both lists support pagination and refresh. **Change group** opens
the picker again; leaving a group in VRChat removes access to its management tools.

Member pictures use the icon returned by VRChat's group-member directory. If a
saved page still shows initials after an update, use its **Refresh** button once
to replace the saved member snapshot. Initials remain the fallback when a member
has no available picture.

Community owners and Community Admins can connect group roles to their Orbiters
community roles in **Community → Roles**. See [Manage community roles](manage-community-roles.md)
for assignments and per-role sync directions.

## Browse saved information

Opening the VRChat tab, changing tabs and browsing pages use saved information.
They do not refresh data from VRChat automatically. Use **Load friends**, **Load
this page**, or the corresponding **Refresh** button when you need a fresh snapshot.
The page shows when information was last loaded and whether it may be incomplete.
Previously loaded data survives reopening the page and backend restarts.

**Live updates** keeps supported account and friend changes in step with VRChat.
Group events can indicate that something changed without including a complete
member list or announcement. In that case the saved snapshot is marked stale;
refresh the relevant section when needed. After a connection interruption, saved
information remains available and may need refreshing. Repeated refresh clicks
within ten seconds reuse the same result.

Use **Refresh group details** after a group role change to recheck announcement
access. A live connection alone does not guarantee a complete, current roster.

## Publish an announcement

1. Select **New announcement** on the intended group.
2. Enter a title of up to 100 characters and a message of up to 2,000 characters.
3. Choose **Group members** or **Public** as the audience.
4. Enable **Notify group members** if you want VRChat to notify the audience.
5. Select **Publish announcement** to send from the connected community account.

The account must own the group or have its announcement-management permission.
New posts preserve earlier announcement history. If sending returns an uncertain
result, refresh that history before composing a new submission; repeating the same
submission cannot automatically create another post.

Use [Community events](manage-community-events.md) to create meetup instances and
send opt-in invitations. The 18+ controls above manage the adult-verification role.
