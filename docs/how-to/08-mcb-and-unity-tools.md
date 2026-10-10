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
lastVerified: 2026-09-28
---

# MCB and Unity Tools

You open MCB and see a version number, a beta chip and an Installed label. Each tells you something different. Learn to read those signals before changing a project you care about.


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

1. Open the compatible asset page or `/my-custom-base`, and press **Install**. The steps open in place, without signing in on the website: add the VRCFury and Orbiters repositories in Creator Companion, install My Custom Base in your avatar project, then add its component to the avatar root. **Escape** or **Close installer** closes them.
2. Sign in inside the tool with **Login with Discord** or **Login with Telegram** (see [Connect a Unity tool](#connect-a-unity-tool)).
3. Choose an asset and version that your account can access. A custom base appears under **Available Custom Bases** when you own it, hold a license or a Discord role for it, or claimed it for free.
4. Install or update through the tool (**Apply** on the version).

On a custom base's asset page, **Install** shows for everyone who can use it, including its creator. When the creator made it claimable, a signed-in member sees **Claim and install**: it adds a free license to their account, then opens the same steps.

## Connect a Unity tool

Unity tools sign in from the tool itself:

- **Login with Discord** or **Login with Telegram** in the tool opens Orbiters in
  your browser. Sign in if needed, check that the four-character code matches the
  one shown in Unity, and choose **Connect**. The tool then receives its own
  credential; nothing is copied by hand. A link lasts ten minutes and works once.
  If it expired or was already used, click Login again in Unity. If Orbiters
  could not be reached, **Try again** rechecks the same link; if your session
  ended, the page asks you to sign in again.
- The website no longer prepares **Magic Sync** tokens. If your tool only offers
  Magic Sync, update it to a version with Login.

A credential is only released to the tool that holds that login's secret.
Being on the same network or IP address as your browser is not enough.

<alpha>

## Code in downloaded versions

This describes the local, unreleased MCB 1.8.1 and Toolkit 0.3.1 changes. The server trust endpoint must ship before the client.

A version can contain Unity scripts, compiled assemblies or native plugins, either
directly or inside a `.unitypackage`. Unity compiles and runs that code as soon as
it is imported, before you apply anything. MCB therefore checks each download
before it writes any file under `Assets/`:

- Versions published by Orbiters and by creators Orbiters has marked as trusted
  install without a question.
- A version from any other creator that contains code opens a warning with the
  author and the list of code files. Orbiters does not control the content of
  those files. Choose **Cancel** unless you trust the author: MCB discards the
  download and adds nothing to your project.
- Your own versions also install without a question after MCB confirms your current identity against the fresh creator metadata.
- Versions without code never show the warning.

<audience include="creator">

If your versions include scripts or plugins, people who download them see this
warning unless Orbiters has marked your account as a trusted creator. Leave code
out of a version when the avatar does not need it.

</audience>

<audience include="admin">

To mark a creator as trusted, open **Admin → Users**, open the member, select
**Roles**, turn on **Trusted creator**, choose **Save roles** and confirm. Admins
and owners are always trusted. Turning the switch off brings the warning back for
that creator's versions that contain code.

</audience>

<audience include="dev">

`isTrustedCreator` in `mcbCreatorTrustService` decides trust: `User.trustedCreator`,
an admin or owner rank, or the designated administrator account. A version belongs
to its uploader, or to the asset owner when no uploader is recorded.

| Response | Trust data |
| --- | --- |
| `GET /mcb/:assetId/model-trust` | Current creator trust and exact resolved version/source identity; authenticated, uncached, without download accounting |
| `GET /mcb/:assetId/versions` | Each version: `creatorTrusted` and `creatorName` |
| `POST /mcb/assets/by-avatar-base` | Each asset: `creatorTrusted` for the owner, next to `ownerUsername` |
| `GET /mcb/:assetId/model` | Header `X-Orbiters-Creator-Trusted: true` or `false` on the package, `meshManifest`, `meshCommon` and `meshBlob` responses |

When the package is stored in R2, the header is on the Orbiters `302` response,
not on the storage response the redirect leads to. Before writing the downloaded
content, MCB requests `/model-trust` with the same version and source selection.
It skips consent only when the fresh response identifies this exact download and
its creator is trusted or is the current user. A failed request, missing endpoint,
unknown trust or mismatched identity keeps the warning enabled. Cached listing
flags never override a revocation. Only the
designated administrator changes trust, through `PATCH /admin/users/:id/moderation`
with `{ rank, creator, trustedCreator }`.

</audience>

</alpha>

## Read the interface before changing the avatar

```orbiters
{"kind":"mcb-version-tour"}
```

The illustration comes from the existing MCB product artwork. Its sample version numbers are not a recommendation to install a particular release.

For a new VRChat project, use the [official SDK setup guide](https://creators.vrchat.com/sdk/) and let Creator Companion guide the supported Unity setup. Keep a recoverable project copy before experimenting with packages or model versions.

## Inspect Version Capabilities

Select the `+` button on a version to expand its details. MCB shows every string flag from that version's `extraCustomization` metadata as a chip at the bottom of the version frame. For example, `advancedMeshReplacement` identifies a version that delivers an advanced native mesh instead of only replacing the source FBX.

## Switch Or Reset Mesh Versions

When switching between an advanced native-mesh version and an FBX-patch version, MCB restores the original FBX renderer mesh, primary armature pose, bone bindings, and renderer transform before applying the next version. If the switch fails, MCB restores the previous FBX and scene state instead of leaving a mixed version.

Resetting to the default base also replaces generated DynamicNormals or advanced native body meshes with the original FBX body mesh.

Switching from one FBX-patch version to another first puts back the models the previous version patched and the next one does not, with their import settings. Resetting restores each changed model's own import settings, kept before a version first gave it its own humanoid Avatar; models a version never touched are left as they are. MCB keeps each original FBX as a verified `.originalbase` backup: if the base package is imported again while a version is applied, the newly imported original replaces the older backup.

A version cannot be switched or reset while a refit is running on the avatar, and **Delete local files** is refused while the version is applied or its files are still used. A replaced renderer that was deleted or renamed is skipped with a warning; the rest of the avatar is still restored.

MCB identifies an applied advanced native-mesh version from the generated mesh assets that are bound to the avatar renderers. This keeps the version marked as current even when the source FBX bytes have not changed. The version row and its action button use the same applied-version state, so a version cannot appear current while also offering to apply itself again.

Custom Veins also follows these generated renderer bindings. Advanced native-mesh versions remain supported when their imported metadata does not contain source renderer paths.

## ReFit Assets

Running ReFit from the custom-base options updates the affected mesh rows and progress controls in place. The complete MCB options panel stays mounted after ReFit finishes, so expanded sections and scroll position are preserved.

Standalone ReFit also keeps its summary page mounted while processing. The ReFit button becomes an in-place progress bar with the current computation phase, and the editor remains responsive while the geometry work runs in the background.

When MCB is installed, standalone ReFit operations register their generated asset mesh and original renderer state with MCB automatically. This makes the asset appear as re-fitted in MCB's ReFit frame, where it can be un-refitted back to its original mesh. The integration is enabled by default and can be disabled from ReFit's Settings page with **Synchronize ReFit assets with MCB**.

Transferred blendshapes remain synchronized with matching avatar blendshapes during slider changes and version switching. MCB also recognizes standalone ReFit's default `refit_` prefix: for example, an asset blendshape named `refit_Smile` follows an avatar blendshape named `Smile`.

The main ReFit page lists every active re-fitted asset in the loaded scenes. Each row provides **Reset** to restore the asset's complete original renderer state and **Select** to locate it in the hierarchy. MCB-tracked assets remain listed after editor reloads; standalone results that are not registered with MCB remain available for the current editor session.

Resetting an MCB-tracked asset from standalone ReFit immediately updates an already-open MCB ReFit frame, including removing the `(re-fitted)` marker without reloading the frame.

## Creator Flow

Creators configure avatar base data, version metadata, banners, and package files from the creator asset tools. Users only see versions allowed by their access scope.

<alpha>

For linked Blender projects, see [Sync avatar edits from Blender](mcb-blender-sync.md) for connection states, exports, and native mesh previews.

</alpha>

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

The legacy `unity-wizard` routes and newer `mcb` routes expose the same token
response contracts through one shared WizardToken lifecycle service. IP-based
discovery is removed: `token=notoken` never returns a credential and always answers
425 with a message to copy the token or use Login, so older tools keep waiting
instead of failing. Credentials are released only to a caller that presents the
clipboard `orbit-…` token or the browser login's poll secret (`editorLinkService`).
Direct token reuse records each IP address and user agent in `WizardTokenUses`. Change lifecycle behavior in
the shared service so the two route families cannot drift. Avatar versions are
uploaded only through `POST /mcb/newVersion`; the `unity-wizard` routes no longer
accept uploads.

MCB UI Toolkit builds must not be re-entered by cache or network callbacks. User-info cache hits defer completion until after the current editor callback returns. Version rows request user metadata only when it is absent and subscribe separately to avatar-image completion. Asset thumbnails, banners, and author images update existing image controls through the bounded dynamic-content refresh instead of recursively rebuilding the complete inspector. Preserve this separation when adding asynchronous UI data.

</audience>