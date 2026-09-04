---
title: Account Login and Connections
section: How To
order: 32
audience: public, user
stage: stable
id: orbiters.how-to.account-and-discord-login
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-04
---

# Account Login and Connections

Sign in to Orbiters with Discord or Telegram. Connecting both providers lets you
use either one to reach the same account, purchases, and creator permissions.
Discord server verification and role automation require a Discord connection.

## Sign In

1. Select **Login / Sign Up**.
2. The button expands into **Discord** and **Telegram**. Choose a provider.
3. Authorize Orbiters with that provider and return to the website.

Your first sign-in creates an account. Later sign-ins with the same provider open
that account. Telegram can be used without a Discord account. If Telegram is not
configured for this deployment, the sign-in page explains that it is unavailable.

Keyboard users can select either provider after expanding the button. Escape
closes the chooser. The animation respects reduced-motion preferences.

After login, the frontend stores a short-lived JWT and uses a refresh cookie to rotate it.

## Connect Another Login Provider

1. Sign in to the Orbiters account you want to keep using.
2. Open **Account > Overview > Connections**.
3. Select **Connect Discord** or **Connect Telegram** for an unconnected provider.
4. Authorize the connection. Orbiters returns you to Overview and shows **Connected**.

Connect the second provider here before using it to sign in separately. A separate
first sign-in creates a separate account. Orbiters does not merge accounts based
on matching names or email addresses, and rejects a connection already owned by
another account. Existing connections cannot be replaced or disconnected here.

Connecting Telegram preserves an existing Orbiters profile. Connecting Discord
uses your Discord profile and enables Discord synchronization. **Sync with Discord**
is disabled until Discord is connected. Telegram login alone does not grant any
Discord roles or creator privileges.

If authorization is cancelled or the login attempt expires, restart it from the
chooser or the Connections section.

## Request Creator Status

Creator status controls access to creator profiles and creator tools. To request it:

1. Open **Account > Overview**.
2. Find **Creator Status**.
3. Select **Request creator status**.

The request remains visible as **Review pending** until an administrator reviews it.
Submitting again while the request is pending does not create a duplicate. After an
administrator accepts or dismisses the request, Orbiters sends an account notification
that links back to the Overview tab. A dismissed request can be submitted again later.

When the request is accepted, the Creator Status card changes to **Creator** and creator
tools become available to the account.

## Default Currency

In **Account > Overview > Account Information**, choose **Default currency** and
select **Save currency**. New and existing accounts start with EUR. This preference
is saved to your account across devices and is used by **All (estimate)** in the
Creator Revenues tab. It does not change checkout prices, payment currencies, or
the original amounts recorded in revenue history.

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

For Telegram deployment configuration, see [Telegram Login Setup](../reference/telegram-login.md).

</audience>
