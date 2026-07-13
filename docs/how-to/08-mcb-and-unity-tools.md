---
title: MCB and Unity Tools
section: Tools
order: 44
audience: public, user, creator, admin, dev
stage: stable
id: orbiters.how-to.mcb-and-unity-tools
domain: mcb
type: how-to
owner: mcb-maintainers
lastVerified: 2026-07-13
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

MCB identifies an applied advanced native-mesh version from the generated mesh assets that are bound to the avatar renderers. This keeps the version marked as current even when the source FBX bytes have not changed. The version row and its action button use the same applied-version state, so a version cannot appear current while also offering to apply itself again.

Custom Veins also follows these generated renderer bindings. Advanced native-mesh versions remain supported when their imported metadata does not contain source renderer paths.

## ReFit Assets

Running ReFit from the custom-base options updates the affected mesh rows and progress controls in place. The complete MCB options panel stays mounted after ReFit finishes, so expanded sections and scroll position are preserved.

When MCB is installed, standalone ReFit operations register their generated asset mesh and original renderer state with MCB automatically. This makes the asset appear as re-fitted in MCB's ReFit frame, where it can be un-refitted back to its original mesh. The integration is enabled by default and can be disabled from ReFit's Settings page with **Synchronize ReFit assets with MCB**.

Transferred blendshapes remain synchronized with matching avatar blendshapes during slider changes and version switching. MCB also recognizes standalone ReFit's default `refit_` prefix: for example, an asset blendshape named `refit_Smile` follows an avatar blendshape named `Smile`.

The main ReFit page lists every active re-fitted asset in the loaded scenes. Each row provides **Reset** to restore the asset's complete original renderer state and **Select** to locate it in the hierarchy. MCB-tracked assets remain listed after editor reloads; standalone results that are not registered with MCB remain available for the current editor session.

## Creator Flow

Creators configure avatar base data, version metadata, banners, and package files from the creator asset tools. Users only see versions allowed by their access scope.

## Connection Problems

If the tool cannot connect:

- imported version details and the currently applied local version remain visible while the backend is unavailable,
- reconnecting refreshes remote access data without replacing the local advanced-mesh identity with the unchanged source FBX hash,
- confirm the user is logged in,
- confirm the backend URL points to the intended environment,
- check that the asset has compatible avatar base data,
- check whether the requested version requires beta or alpha access,
- retry after refreshing the Orbiters session.

<audience include="dev">

The legacy `unity-wizard` routes and newer `mcb` routes overlap. Avoid adding new behavior to the legacy path unless the caller still depends on it.

MCB UI Toolkit builds must not be re-entered by cache or network callbacks. User-info cache hits defer completion until after the current editor callback returns. Version rows request user metadata only when it is absent and subscribe separately to avatar-image completion. Asset thumbnails, banners, and author images update existing image controls through the bounded dynamic-content refresh instead of recursively rebuilding the complete inspector. Preserve this separation when adding asynchronous UI data.

</audience>
