---
title: Grant assets through Discord roles
section: Creator Tools
order: 48
audience: creator, admin, dev
stage: beta
id: orbiters.creator.discord-role-assets
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-23
---

# Grant assets through Discord roles

Open **Creator → Assets → Discord role assets** to choose which roles give their
members an equivalent asset. You need creator access and a Discord server connected
to your account through **Community → Connections**. Platform administrators can
also select shared platform servers; they cannot edit another creator's assets.

1. Select the Discord server. Search by role name, Discord role ID or linked asset.
2. Choose **Set up asset** on the role.
3. **Link an asset** you own, or choose **Create an asset**, name it and select its
   type. Assets already connected to another role are unavailable for linking.
4. Confirm. Orbiters creates the mapping and grants the asset to its recorded active
   role members. Existing licenses, including disabled licenses, are preserved.
5. Open the linked asset's name to configure its images, description and files.

The recorded member count comes from saved Discord membership information. It is
not a live count from Discord. Newly recorded role holders receive the linked asset
through their usual asset synchronization. Asset ownership can also grant the
matching Discord role through the existing background queue.

**Unlink** asks you to confirm before removing the mapping. It stops future role
and asset synchronization but keeps the asset and all existing licenses. If a
mapping belongs to another creator, its owner must manage it.

The former global **Website roles** editor has been removed. Asset mappings live
here; permissions to review appeals live in **Community → Appeals → Settings &
reviewers**, after selecting a server. Enabling an appeal reviewer role grants
permission to approve or reject that server's appeals through Discord; it does
not grant website staff rank or access to another community.

<audience include="dev">

`GET /creator/discord-assets/servers` lists authorized servers. `GET
/creator/discord-assets/:guildId` returns recorded roles, member counts and the
creator's available assets. `PUT /creator/discord-assets/:guildId/:roleId` accepts
either an owned `assetId` or `create: { name, type }`. `DELETE
/creator/discord-assets/:guildId/:roleId/:assetId` removes one owned mapping.

Writes lock the integration, role and asset in a transaction. They recheck guild
and asset ownership, use the existing `Asset.relatedRoleId` and role classification,
and insert missing `UserAsset` rows in batches without replacing existing rows.
No new database columns or schema migration are required.

</audience>
