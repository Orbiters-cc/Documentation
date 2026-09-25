---
title: Configure Discord access to an asset
section: Creator Tools
order: 64
audience: creator, admin, dev
stage: beta
id: orbiters.how-to.discord-asset-access
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-25
---

# Configure Discord access to an asset

This workflow requires the matching website release. It is separate from the
older role-to-asset mapping that creates permanent licenses.

## Before starting

Own the asset in Orbiters and link your Discord account. To import a role, Orbiters
must have recorded your membership in its server, or you must have connected that
server as a creator. Customers also need a linked Discord account and recorded
role membership. The browser extension below only supplies names, never proof of
membership.

To assign roles, connect a bot for the destination server. Both you and the bot
need **Manage Roles**, with a highest role above the role being assigned. Discord
managed roles, the everyone role, Orbiters staff rank roles and appeal reviewer
roles cannot be assigned through asset synchronization.

## Add a rule

1. Open the asset's **Configuration → Access → Discord role access**.
2. Select a Discord server and a named role. If the name is missing, enter its
   **Discord role ID** and **Role name**, then choose **Save role name**.
3. Choose **Public**, **Beta** or **Alpha**. Alpha includes Beta and Public; Beta
   includes Public.
4. Choose the direction and select **Add access rule**.

| Direction | Result |
| --- | --- |
| Discord role → Asset access | A recorded role grants the selected scope. Orbiters also assigns the asset's associated role when configured. |
| Asset access → Discord role | Independently held access at the selected scope grants the selected Discord role. |
| Both directions | Either independently held role membership or access can drive the corresponding side. A role assigned by this sync cannot create its own continuing entitlement. |

You can add different rules for different scopes, up to 30 active rules per asset.
Remove a rule before changing its direction. Existing purchased and manual
licenses remain intact. A disabled license does not receive a new role-based
entitlement.

Role assignments run in the background. Members must join the destination server
before they can receive a role. Check the rule's error message if permissions,
membership or the bot connection prevent assignment.

**Remove rule** stops its role-based access immediately. Background cleanup removes
only assignments recorded as made by this sync, preserving pre-existing roles
and roles still required by independent access. Before deleting an asset, remove
its rules and allow their role cleanup to finish. **Refresh sync status** updates
assignment errors and the cleanup notice without changing the rules.

## Collect missing names in Chrome

1. Expand **Collect role names with the Chrome extension** in the role catalog.
2. Download and extract **Orbiters Role Names**. Open `chrome://extensions`, enable
   **Developer mode**, select **Load unpacked**, and choose the extracted folder.
3. Choose **Create extension connection** in Orbiters. Paste that code into the
   extension, choose the matching Orbiters environment, and select **Connect and
   collect role names**.
4. Browse `discord.com`: open server role settings or member profiles. The extension
   collects role ID/name pairs exposed by rendered role elements or role-list
   responses. It does not make additional Discord API requests.
5. Return to Orbiters and choose **Refresh roles**. Only named roles are selectable.

Connections last one hour, expire when Chrome closes, and can be ended with
**Disconnect**. Codes only authorize saving role labels in servers available to
your Orbiters account. They cannot authenticate other Orbiters APIs. The extension
does not read messages, Discord credentials or network authorization headers.

Discovery depends on what Discord exposes while you browse; it cannot enumerate
every server role automatically. A recorded name is preserved. Administrators can
correct it manually in **Admin → Discord servers → selected server → Known Discord
roles**, including naming previously unnamed roles. The catalog supports search
and pagination.

<audience include="dev">

`/asset-role-access/:assetId` lists and creates owner-scoped rules;
`DELETE /asset-role-access/:assetId/:ruleId` archives one rule. Role catalogs use
`GET/PUT /discord-role-catalog/:guildId`; `/servers` lists eligible servers.
`POST /discord-role-catalog/extension-token` creates a one-hour token for
`POST /discord-role-catalog/extension/:guildId`. The extension token has a separate
signing key derived from the application key, its own audience, account-version
revocation checks and no general API authority. Extension imports only fill
missing names, even for administrators.

`AssetDiscordAccessRules` and `AssetDiscordAccessMembers` are separate tables with
named unique indexes. Delivery receipts are written before Discord mutations so
interrupted grants can be recovered. Membership labels never write role membership
or platform permissions. Active imports are evaluated by the shared access policy
without creating a permanent `UserAsset`. The community role worker runs bounded
asset-rule batches, with per-rule PostgreSQL advisory locking and retryable errors.
Completed archived rules stop scheduling. A network error must not be interpreted
as an absent Discord member.

Extension sources are in `extensions/discord-role-names`; its downloadable archive
is `frontend/public/downloads/orbiters-role-names.zip`. Regenerate the archive after
changing its sources. Tests use local fixtures; live Discord collection and role
assignment require a connected account and bot in the deployed environment.

</audience>
