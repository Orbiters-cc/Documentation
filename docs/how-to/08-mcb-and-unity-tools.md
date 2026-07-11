---
title: MCB and Unity Tools
section: Tools
order: 44
audience: public, user, creator, admin, dev
stage: stable
---

# MCB and Unity Tools

MCB and Unity-facing tools use Orbiters as the account, access, and package source for compatible avatar assets.

## What The Tools Use Orbiters For

The tools can call Orbiters to:

- check whether the user is connected,
- list accessible assets,
- fetch avatar base metadata,
- fetch available versions,
- download model or package files,
- upload creator package versions when authorized,
- record lightweight asset interactions.

## User Flow

1. Log in to Orbiters with Discord.
2. Open the compatible asset page or MCB page.
3. Connect the tool when prompted.
4. Choose an asset and version that your account can access.
5. Install or update through the tool.

## Inspect Version Capabilities

Select the `+` button on a version to expand its details. MCB shows every string flag from that version's `extraCustomization` metadata as a chip at the bottom of the version frame. For example, `advancedMeshReplacement` identifies a version that delivers an advanced native mesh instead of only replacing the source FBX.

## Switch Or Reset Mesh Versions

When switching between an advanced native-mesh version and an FBX-patch version, MCB restores the original FBX renderer mesh, primary armature pose, bone bindings, and renderer transform before applying the next version. If the switch fails, MCB restores the previous FBX and scene state instead of leaving a mixed version.

Resetting to the default base also replaces generated DynamicNormals or advanced native body meshes with the original FBX body mesh.

## Creator Flow

Creators configure avatar base data, version metadata, banners, and package files from the creator asset tools. Users only see versions allowed by their access scope.

## Connection Problems

If the tool cannot connect:

- confirm the user is logged in,
- confirm the backend URL points to the intended environment,
- check that the asset has compatible avatar base data,
- check whether the requested version requires beta or alpha access,
- retry after refreshing the Orbiters session.

<audience include="dev">

The legacy `unity-wizard` routes and newer `mcb` routes overlap. Avoid adding new behavior to the legacy path unless the caller still depends on it.

</audience>
