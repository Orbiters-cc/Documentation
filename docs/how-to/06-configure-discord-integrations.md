---
title: Configure Discord Integrations
section: Creator Tools
order: 42
audience: creator, admin, dev
stage: stable
---

# Configure Discord Integrations

Discord integrations connect creator servers to Orbiters workflows such as asset roles, verification, and appeals.

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

