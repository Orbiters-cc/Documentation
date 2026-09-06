---
title: Manage community age verification
section: Moderation
order: 146
audience: mod, admin, dev
stage: beta
id: orbiters.moderation.age-verification
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-09-05
---

# Manage community age verification

Moderators, administrators and owners can manage verification from
**Admin → Users**. Moderators receive a limited member directory. In the full
administrator table, select **More** for a human account. This modal groups the
Orbiters ID, Jinxxy ID, creation date and age-verification controls.

## Record or withdraw staff verification

1. Open the member's age-verification panel.
2. Enter a concise reason or evidence reference. Do not enter identity documents,
   document numbers, birth dates or other unnecessary identity information.
3. Choose **Staff verification** or **Furality convention evidence**.
4. Select **Mark as 18+** or **Revoke this verification**.

For Furality, confirm authenticated eligibility evidence for Ultra 2026 or a
later qualifying main convention. General membership, ticket purchases,
screenshots and attendance at smaller exempt events are not sufficient.

Revocation affects the selected source only. Use **Require staff review** when a
dispute should suspend overall eligibility despite other evidence. Resolve the
hold explicitly after investigating. The recent history records the actor,
time and reason for changes.

## Associate or correct a VRChat account

Administrators and owners can enter a VRChat ID or profile URL, preview it and
confirm the association. This action authoritatively confirms account ownership
on the member's behalf. The visible VRChat 18+ result is evaluated separately.

If another member already owns the association, the panel identifies that
Orbiters user ID and requires explicit reassignment. Reassignment withdraws the
previous member's VRChat evidence while preserving their independent sources.

Member-selected friend requests are recorded as **Member claimed**. Staff-entered
associations are **Admin confirmed**. The friend-request method does not
cryptographically prove ownership, so investigate disputed selections through
the review-hold workflow.

## Trust a Discord server

Open **Admin → Discord Servers** and search the server cards. Icons and counts
identify recorded communities. Open a server and select **Sync server** to refresh
its role catalog and your own membership. Choose the role that establishes adult
verification, enable **Trusted**, and record how the partner verifies adulthood.
Do not trust self-assigned roles or roles that merely mirror Orbiters approval.

Select **Review changes**, review the proposed changes, then save.
The preview uses fresh observations and may change as Discord updates. Old role
records alone never grant approval. Background synchronization checks known active
members after the policy is configured. Expand **Details & sync** on a member
row to refresh that membership and its roles, even before configuring trust.
Search by username or Discord ID and filter current or former periods.

Role names require a connected Orbiters bot that can access the server. Without
one, authorized member connections can supply their role IDs, which remain
selectable. The refresh result explains unavailable catalog or membership data.
**Sync with Discord** in Account Overview refreshes the profile, complete server
membership list and available role assignments. Partial results are reported;
renew Discord sign-in if the membership authorization is unavailable.

The directory shows recorded membership periods, including rejoins. Departure
dates are when Orbiters recorded the departure and may differ from the actual
departure time. The directory is not a complete roster of every Discord server.

Role removal, departure, role deletion or withdrawn trust invalidates that source.
An unavailable Discord connection does not establish a departure. Its last
successful observation expires normally, and the panel shows refresh failures.

<audience include="admin,dev">

## Connect the dedicated VRChat service account

In **Admin → VRChat**, enter the dedicated website
account's username and password. Complete the email, authenticator or recovery
code step if requested. Challenges last ten minutes and permit five attempts.

The backend must have `API_CREDENTIAL_ENCRYPTION_KEY` or the existing `JWT_SECRET`
configured. Only the encrypted authenticated session is saved; the password is
not retained. This connection has a dedicated card rather than editable raw
cookie fields. It is shared by this backend/database deployment.

The connected account card shows its profile picture, name, profile link and
connection health. Browse the paginated **Online** and **Offline** friend lists
and use **Load friends** or **Refresh friends** to retrieve the selected page.
Opening the tab and browsing saved pages do not call the VRChat data API.
The list does not show instance locations.
Claimed member requests are accepted automatically, with retries during temporary
failures. Unclaimed requests remain available for the member-linking flow.

Select a **Community group** to browse members and announcement history, and
publish announcements when the account has permission. See
[Manage a VRChat community](/documentation/orbiters.account.vrchat-community) for the group workflow
and admin-granted Community Leader accounts.

Use **Check connection** to validate a session and refresh the account profile.
Select **Change account** to reveal the replacement login form. Replacement login preserves the
working connection until the new login succeeds. **Disconnect** removes local
session material and attempts remote logout. If remote logout cannot be
confirmed, revoke the session through VRChat's account settings.

The service account must be configured before member linking or profile lookup
can work. Routine checks, rate limits and connection failures are shown on the
card. Do not configure a member's personal account as the service account.

</audience>
