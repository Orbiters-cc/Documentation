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
lastVerified: 2026-07-12
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

<audience include="dev">

`WebhookEvent` rows are deduplicated by store integration and external event ID. Already processed events are ignored on retry. Failed or incomplete events are reset to `RECEIVED` when the provider sends the same event again.

</audience>
