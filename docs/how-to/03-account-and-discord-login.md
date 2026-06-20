---
title: Account and Discord Login
section: How To
order: 32
audience: public, user
stage: stable
---

# Account and Discord Login

Orbiters accounts are based on Discord login. Discord identity lets Orbiters connect website access, creator permissions, server verification, and Discord role automation.

## Sign In

1. Select **Login / Sign Up**.
2. Authorize the Orbiters Discord application.
3. Return to Orbiters.

After login, the frontend stores a short-lived JWT and uses a refresh cookie to rotate it.

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

