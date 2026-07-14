---
title: Account and Discord Login
section: How To
order: 32
audience: public, user
stage: stable
id: orbiters.how-to.account-and-discord-login
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-07-14
---

# Account and Discord Login

Orbiters accounts are based on Discord login. Discord identity lets Orbiters connect website access, creator permissions, server verification, and Discord role automation.

## Sign In

1. Select **Login / Sign Up**.
2. Authorize the Orbiters Discord application.
3. Return to Orbiters.

After login, the frontend stores a short-lived JWT and uses a refresh cookie to rotate it.

## Notifications And Account Actions

The avatar at the right of the navigation bar opens the account menu. Its badge is
the unread notification count. The menu shows up to four recent notifications as a
compact card stack. Hover or keyboard-focus expands the stack so titles, relative
times, and message excerpts remain readable. Selecting a card marks it as read and
opens its destination when it has one. **View all** opens the complete inbox under
**Account > Notifications**. The same menu contains **Mark all read**, **My
Account**, and logout; there is no separate notification-bell destination.

The Account notification page lists current and older notifications above the
preference controls. Use **Load older notifications** for the next page and **Mark
all read** to clear the unread state without deleting history. Use **Account >
Notifications** or **Creator > Notifications** to enable or disable comments,
commerce, Boards, moderation, creator/asset, and platform-update categories. New
enabled notifications can also appear as temporary website toasts.

## What Login Controls

Login can affect:

- which assets you own,
- whether creator pages are available,
- whether admin or moderation tabs are available,
- whether documentation sections are visible,
- whether Unity-facing tools can identify your account.

## Verification Is Server-Scoped

Discord server verification is not a single global flag. A user can be verified in one connected server and not verified in another. Server-specific verification state is stored per Discord integration.

<audience include="dev">

OAuth login uses one Orbiters Discord application. Creator custom bots are gateway and REST clients only; they are not used for user OAuth.

</audience>
