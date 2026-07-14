---
title: Admin and Moderation
section: Operations
order: 50
audience: mod, admin, dev
stage: stable
id: orbiters.operations.admin-and-moderation
domain: operations
type: runbook
owner: orbiters-operations
lastVerified: 2026-07-14
---

# Admin and Moderation

Administrative access depends on rank and feature access. Moderators may see a smaller operational surface than admins or developers.

## Users

Admins can inspect users, diagnose account problems, review Discord identity, and update ranks where permitted.

Use user tools when you need to answer:

- which Discord account is linked,
- whether the account has creator status,
- which assets are attached,
- whether Discord roles or verification state need attention,
- whether tokens should be revoked.

The **Moderate User** dialog can update the Orbiters rank and creator status together.
Granting creator status directly also accepts that user's pending creator request.
Leaving creator status disabled while saving dismisses a pending request. Orbiters
notifies the affected user when creator status is granted, removed, or a pending request
is dismissed.

## Creator Requests

Open **Admin > Creators** to review users who requested creator status. The tab provides
Pending, Accepted, Dismissed, and All views. Each pending request shows the applicant's
Orbiters identity, Discord identity, email when available, and submission time.

- **Accept** grants `User.creator` access and records the administrator and review time.
- **Dismiss** closes the request without granting creator access.

The user receives an account notification for either decision. When a user submits a new
request, the designated Orbiters administrator plus authenticated admin and owner accounts
receive a moderation notification linking directly to **Admin > Creators**. A user can
have only one pending creator request at a time.

## Assets And User Assets

User assets represent a user's relationship to an asset. Important fields include:

- whether access is enabled,
- the source of access,
- the saved scope,
- the store integration that validated a redemption,
- the license key when stored for matching revocation events.

Disabled user assets should not grant active access.

## Store And Webhook Issues

When a creator reports a store issue, check:

- integration status,
- credential status,
- last sync time,
- product links,
- webhook registration state,
- recent webhook events,
- whether a revoked event had enough data to match a redeemed license.

## Bug And Issue Handling

The admin issue tools collect reports submitted from the frontend. Prioritize reports that block login, asset access, downloads, creator revenue, or moderation.

## Blog Audience Notifications

When saving a published Blog post, moderators, developers, administrators, and
owners can choose **All users** or **All creators** in **Notify on save**. Drafts
cannot generate an audience notification. Each eligible human account receives one
system notification linking to `/blog/:id`; account notification preferences are
honored. Saving a post without an audience selection does not send anything.

## Notification Delivery Test

Administrators, developers, and owners can use **Admin > Developer > Notification**
to preview and deliver a real in-app notification. The tool supports:

- one human account selected through username or user-ID autocomplete;
- creators, moderators, developers, administrators, owners, or all staff;
- every human account that can authenticate.

Start with **Moderation action required**, **API quota reached**, **New creator**,
or **New asset added**, or choose **Custom notification**. Presets fill the category,
internal type, title, message, and destination link; every field remains editable
before delivery. The preview is presentation-only and does not create a row.
Selecting **Send notification** is the explicit delivery action.

Delivery honors each recipient's category preferences. A result of zero recipients
means the selected group is empty or a specific recipient disabled that category;
it is not reported as a successful delivery to one person. Audience delivery is
limited to human accounts that can authenticate, and the sender ID is retained in
notification metadata for operational diagnosis.

The four presets are safe test templates and event contracts. They do not by
themselves subscribe to every vendor or moderation event; automatic producers must
call the notification service at the point where the corresponding event is
authoritatively detected.

<audience include="dev">

`WebhookEvent` rows are deduplicated by store integration and external event ID. Already processed events are ignored on retry. Failed or incomplete events are reset to `RECEIVED` when the provider sends the same event again.

</audience>
