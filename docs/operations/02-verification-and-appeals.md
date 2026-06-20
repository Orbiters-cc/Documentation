---
title: Verification and Appeals
section: Operations
order: 51
audience: creator, mod, admin, dev
stage: stable
---

# Verification and Appeals

Verification and appeals are scoped to Discord servers. This lets creators manage their own communities without forcing one global verification state.

## Verification

A verification rule belongs to a guild. A user passes or fails verification for that guild only.

Successful verification can:

- stamp `verifiedAt` on that server presence,
- remove the server's new-member role,
- cancel the server-specific kick timer,
- let the user proceed through server-specific onboarding.

## Appeals

Appeals are also guild-scoped. A rejected appeal can unverify or remove a user from that guild without changing the user's state in another connected server.

## Creator-Managed Queues

Creators can manage appeal queues for guilds they own through Discord integrations. Global admins can support these queues when needed.

## Troubleshooting

Check these in order:

1. The Discord integration status is active.
2. The bot serving the guild is online.
3. The verification rule is visible and current for the guild.
4. The user has a `UserDiscordServerPresence` row for the guild.
5. The bot role is high enough to remove or grant the configured roles.

<audience include="dev">

Management routes under `/admin/verification` authorize either global admins or the creator owning the guild integration. Runtime verification reads guild-scoped presence state instead of the legacy global `User.verified` field.

</audience>

