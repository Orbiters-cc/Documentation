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
lastVerified: 2026-09-05
---

# Manage a VRChat community

Community Leaders can connect a dedicated VRChat account in **Account → VRChat**
to manage a community group. Community Leader is separate from Creator status
and can only be granted by an administrator. The tab stays hidden for other users.

<audience include="admin,dev">

## Grant Community Leader access

Open **Admin → Users → More** for a human account and enable **Community Leader**.
The member can reload their Account page to see the VRChat tab and the Community
Leader status in Overview. Disable the same switch to revoke access immediately.
Existing saved credentials stay encrypted; deleting the Orbiters account removes
its saved community session.

The shared Orbiters account remains under **Admin → VRChat**. It is independent
of each leader's account, credentials, rate limits and selected group.

</audience>

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
Community Leader access or connect a community-management session.

## Choose a group

Choose a card in **Choose your community group**. The picker lists groups joined
by the connected VRChat account and supports search and refresh. If the desired
group is missing, join it in VRChat and refresh the picker.

The selected group's banner, icon, name and member count identify it above the
**Members** and **Announcements** tabs. Members include profile pictures and
profile links. Both lists support pagination and refresh. **Change group** opens
the picker again; leaving a group in VRChat removes access to its management tools.

## Publish an announcement

1. Select **New announcement** on the intended group.
2. Enter a title of up to 100 characters and a message of up to 2,000 characters.
3. Choose **Group members** or **Public** as the audience.
4. Enable **Notify group members** if you want VRChat to notify the audience.
5. Select **Publish announcement** to send from the connected community account.

The account must own the group or have its announcement-management permission.
New posts preserve earlier announcement history. If sending returns an uncertain
result, check that history before composing a new submission; repeating the same
submission cannot automatically create another post.

These tools do not yet create event instances, assign meetup roles or invite members.
