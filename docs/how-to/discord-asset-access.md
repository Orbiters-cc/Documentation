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
2. Search for the **Ownership Discord server**, then choose its named ownership
   role. Under **Add discord role to list**, enter an unknown role's ID and matching
   name before selecting it.
3. Choose **Public**, **Beta** or **Alpha**. Alpha includes Beta and Public; Beta
   includes Public.
4. Search for your **Destination Discord server**, then choose the **Asset
   destination role** members receive there.
5. Choose the direction and select **Add access rule**.

| Direction | Result |
| --- | --- |
| Ownership role → Asset + destination role | The external ownership role grants the selected access type and the destination role. |
| Also allow the destination role to grant asset access | A manually assigned destination role also grants that access type, without requiring the external ownership role. |

For example, **Owns Rexouium** in Rexouria can grant Ultirex access and **💪ultirex**
in Orbiters Hideout. With the second option, manually assigning **💪ultirex** also
grants Ultirex access. Orbiters never assigns the external ownership role. A role
assigned by this synchronization cannot keep its own entitlement alive.

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
3. Return to Orbiters while signed in, in the same browser. The extension connects
   automatically. Its popup shows the connection and lets you pause collection.
4. Browse `discord.com`: open server role settings or member profiles. The extension
   collects role IDs, names and colors exposed by rendered role/member elements or role-list
   responses. It does not make additional Discord API requests.
5. The popup lists collected roles with **Queued**, **Saved** (a confirmation check),
   or **Not sent**. It also identifies development connections. Use **Retry uploads**
   after resolving an error.
6. In the admin server view, **Server roles** refreshes every five seconds without
   clearing manual edits. Unnamed roles appear as their IDs; names and color swatches
   appear when collected. **Open in Discord** opens the selected server directly.
   In asset configuration, choose **Refresh roles**; access-rule selectors require
   named roles.

Connections last one hour, renew while Orbiters is open, expire when Chrome closes,
and can be ended with **Disconnect**. Scoped credentials only authorize saving role labels in servers available to
your Orbiters account. They cannot authenticate other Orbiters APIs. The extension
does not read messages, Discord credentials or network authorization headers.

Discovery depends on what Discord exposes while you browse; it cannot enumerate
every server role automatically. A recorded name is preserved. Administrators can
correct it manually in **Admin → Discord servers → selected server → Add discord
role to list**, including naming previously unnamed roles. The catalog supports search
and pagination.

<audience include="dev">

`/asset-role-access/:assetId` lists and creates owner-scoped rules;
`DELETE /asset-role-access/:assetId/:ruleId` archives one rule. Role catalogs use
`GET/PUT /discord-role-catalog/:guildId`; `/servers` lists eligible servers.
`POST /discord-role-catalog/extension-token` creates a one-hour token for
`POST /discord-role-catalog/extension/:guildId`. The extension token has a separate
signing key derived from the application key, its own audience, account-version
revocation checks and no general API authority. Extension imports only fill
missing names and colors, even for administrators. ID-only observations are also
recorded. The response confirms each persisted role; the extension never treats
a failed or unconfirmed submission as saved.

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

Administrators can open **Admin → Discord servers → Collect roles** to install
or connect the same extension. The window opens from its button and returns
focus there when closed. Extension 1.3 connects to an already-open Orbiters tab
when installed or when its popup opens. To update an unpacked installation,
replace the extension folder with the new download and click **Reload** on
`chrome://extensions`. **Connect installed extension** retries the website
handshake; manual token copying is not required.

The popup retains up to 2,000 observations per browser session and shows them in
expandable groups. Pending uploads survive renewal for the same account. Logging
out, disconnecting or changing accounts/environments clears local observations.
Already saved roles remain in Orbiters. Installing an updated unpacked extension
requires replacing its files and reloading it; an old local copy does not update
when the website deploys.

After reloading an updated unpacked extension, refresh open Discord tabs so they
use the updated page observer.
