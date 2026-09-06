---
title: Configure Discord Integrations
section: Creator Tools
order: 42
audience: creator, admin, dev
stage: stable
id: orbiters.how-to.configure-discord-integrations
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-07-12
---

# Configure Discord Integrations

A customer can download their asset, but the owner role never arrives in Discord. Before changing their purchase, check the bot’s position: a connected bot can still be unable to assign the role.


Discord integrations connect creator servers to Orbiters workflows such as asset roles, verification, and appeals.

## Make the permission problem visible

This miniature role list starts in a broken state. Move the bot, then try disabling **Manage Roles**. Each control changes a different requirement.

```orbiters
{"kind":"discord-roles"}
```

The bot must have permission to manage roles and sit above the role it is assigning. Discord's [roles and permissions guide](https://support.discord.com/hc/en-us/articles/214836687-Discord-Roles-and-Permissions) explains the underlying hierarchy. Orbiters still needs the correct server, member and configured target role.

> **A better first test**
>
> If website access works but the role does not, inspect delivery. If the website access is missing too, investigate the purchase or access grant. These two reports lead to different fixes.


## Shared Bot Mode

Use shared bot mode when the Orbiters bot can serve the creator server.

1. Open **Creator**.
2. Open **Integrations**.
3. Choose an available Discord guild.
4. Invite or activate the shared Orbiters bot when prompted.
5. Configure roles and verification behavior.

## Custom Bot Mode

Use custom bot mode when the creator needs a dedicated bot identity.

1. Create a Discord application and bot.
2. Invite the bot to the server with the required permissions.
3. Enter the bot token and client ID in the creator integration form.
4. Save the integration.
5. Verify that the bot is online and can manage the configured roles.

## Role Requirements

The bot must be able to manage the target role. In Discord, that means the bot role must be above the role it grants or removes, and the bot must have the required server permissions.

## Verification And Appeals

Verification rules and appeals are scoped per guild. A user can be verified in one server and unverified in another.

<audience include="dev">

`discordClientManager` is the only module that creates discord.js clients or calls `login()`. Other services resolve a guild-specific client through the manager.

</audience>