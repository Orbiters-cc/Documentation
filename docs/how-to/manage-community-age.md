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
administrator table, select **18+ status** for a human account.

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

Open **Admin → Discord Servers**, select a recorded server, and choose the role
that establishes adult verification. Record how the partner verifies adulthood.
Do not trust self-assigned roles or roles that merely mirror Orbiters approval.

Select **Preview affected members**, review the proposed changes, then save.
The preview uses fresh observations and may change as Discord updates. Old role
records alone never grant approval. Background synchronization checks known active
members after the policy is configured; individual refresh is also available.

The directory shows recorded membership periods, including rejoins. Departure
dates are when Orbiters recorded the departure and may differ from the actual
departure time. The directory is not a complete roster of every Discord server.

Role removal, departure, role deletion or withdrawn trust invalidates that source.
An unavailable Discord connection does not establish a departure. Its last
successful observation expires normally, and the panel shows refresh failures.

<audience include="admin,dev">

## Connect the dedicated VRChat service account

In **Admin → API Keys → VRChat service account**, enter the dedicated website
account's username and password. Complete the email, authenticator or recovery
code step if requested. Challenges last ten minutes and permit five attempts.

The backend must have `API_CREDENTIAL_ENCRYPTION_KEY` or the existing `JWT_SECRET`
configured. Only the encrypted authenticated session is saved; the password is
not retained. This connection has a dedicated card rather than editable raw
cookie fields. It is shared by this backend/database deployment.

Use **Check connection** to validate a session. Replacement login preserves the
working connection until the new login succeeds. **Disconnect** removes local
session material and attempts remote logout. If remote logout cannot be
confirmed, revoke the session through VRChat's account settings.

The service account must be configured before member linking or profile lookup
can work. Routine checks, rate limits and connection failures are shown on the
card. Do not configure a member's personal account as the service account.

</audience>
