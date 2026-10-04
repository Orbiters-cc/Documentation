---
title: Configure MCB Version Customization
section: How To
order: 90
audience: creator, dev
stage: alpha
id: orbiters.mcb.version-customization
domain: mcb
type: how-to
owner: orbiters-mcb
lastVerified: 2026-10-05
relations: orbiters.mcb.original-base-versions, orbiters.tools.mcb-operating-contract
---

# Configure MCB Version Customization

**Create MCB Version** groups version settings in cards: protection, supported
original bases, material slots, dynamic normals, genres and twisting bones. Each
card summarizes its state and expands only when you edit it. Settings are saved
with the built version.

**Release status:** local development implementation. These package and backend
changes and the Ultirex port have not been published or deployed. This guide does
not announce a release.

## Protection

Trusted creators and Orbiters administrators see a **Protection** card:

- **Verify a Discord role**: only members holding one of the asset's Discord role
  rules can download the version. The asset's owner and administrators can always
  download it. Turn this on after adding at least one rule with **Manage Discord
  roles**.
- **Protect with XOR encryption**: on by default. Each supported original receives
  its own copy, encrypted with that original model, so only owners of the original
  can use it. You can turn it off only while **Verify a Discord role** is on.

With XOR protection off, MCB builds one unencrypted package for every original.
It applies to any avatar with the version's skeleton, including avatars that
already use another custom base built on the same original. Users download and
apply it exactly like an encrypted version.

Unencrypted versions need advanced mesh replacement. MCB stores very large meshes
in one codec (ZSTD) so a package stays below the 600 MB upload limit.

The Discord role is the only download check for an unencrypted version: choose an
ownership role that proves the member owns the original base.

## Discord role access

A rule gives an access level to members who hold an **ownership role** in a Discord
server, and gives them the **destination role** in a server you manage. These are
the same rules as the asset's Access tab on Orbiters.

- In **Create custom base**, add rules under **Discord role access**. MCB creates
  them right after the asset.
- For an existing asset, select **Edit** on the asset and use **Discord role access**.
  Changes are saved immediately.

Server and role lists are searchable. Only named roles appear: name a server's roles
on Orbiters from the asset's Access tab (**Missing a role?**). The destination
server needs a connected bot with Manage Roles.

A member without the required role sees **Requires the … Discord role** instead of
the download button.

## Supported original bases

The card lists the originals registered for the asset. Select **Choose** to search
and select them; your selection is reused for the next version.

- With XOR protection, each selected original receives its own encrypted copy.
- Without XOR protection, the selection decides which avatars see the version:
  an avatar needs the bones that every selected original shares. Bones only some
  originals have, such as whiskers or a reparented chest bone, are created when the
  version is applied. Accessory models registered as originals (for example head
  feathers only) do not narrow this skeleton.

## Material slots

Unity keeps materials by submesh index. MCB matches them by the material slot names
the model files declare. Each custom slot takes the avatar's material from the
original slot of the same name, whatever piece layout the user's original has.
Blender's `.001` duplicate suffixes are ignored.

The card lists every custom renderer and slot. Change a slot's original slot when
the custom model's slot name is misleading; changed slots are highlighted. **Match
by names** clears your choices. For example, the Ultirex Body slot named `BodyMatt`
holds the claws and teeth, so it maps to `MiscMatt`.

- **Hidden original pieces**: renderers of the user's original model that the custom
  model replaces, such as separate claws or eye meshes of an all-pieces original.
  Applying hides them; resetting shows them again. Only renderers of the avatar's
  original model are hidden, never clothing. **Hide pieces the custom model
  replaces** adds the original's pieces missing from the custom model. Type piece
  names from other original versions and press Enter.
- **Fallback materials**: materials for slots an original lacks, such as reduced
  Quest models. Add them to the logic prefab's dependencies.

Custom renderers missing from the user's avatar are created next to its original
pieces. Resetting or switching versions restores the original materials and carries
materials the user changed on custom slots back to the original slots of the same
name.

## Genres

Select **Add genre** and name each mode. **Make default** marks the mode new users
receive. Each genre has two lists:

- **Blendshapes**: select **Add blendshapes**, choose a mesh, search and select any
  number of its blendshapes, then **Add selected at 100**. Adjust each value with its
  slider or field. A blendshape set by another genre returns to 0 when omitted.
- **Objects**: drop an object from the avatar or the logic prefab on **Add an object**
  and choose **Enabled** or **Disabled**. Logic objects use the installed
  `mcb logic/` prefix. An omitted object keeps its original state.

For example, a female mode can set `Body` / `ulti female` to `100`, enable
`mcb logic/Dynamics/BreastPhysics_female`, and disable a wrapper around contacts
that should not operate in that mode. Avoid locking contacts whose normal
animations must still turn them off.

The user chooses a mode with the installed version's **Genre** buttons. The choice
is remembered per asset across version changes. If the next version has no mode
with the same **Stable ID**, MCB selects and remembers that version's default.
Keep IDs stable when only changing a label.

The selected mode is fixed in the built avatar. MCB removes competing animation
curves and adds a final constant override on the build copy. This feature does
not expose an in-game genre switch or an animator-parameter link.

## Dynamic normals

Select **Set up dynamic normals** to choose, for each custom mesh, the blendshapes
that recalculate their normals. The searchable picker is the one ReFit uses.
**Flexings** and **Muscles** select names containing `flex` or `muscle`; they only
add to the explicit selection. Shapes such as `ulti female` or `belly suck` can be
selected without naming rules. Missing selected shapes fail validation.

## Twisting bones

Select **Set twisting bones** to open the custom model as a ghost with its skeleton.
Click bones on the model or in the **Bones** list; **Weighted only** limits the
list to bones that deform a mesh, and the search finds any bone. **Symmetry**
selects the mirrored bone too. Drag to turn and scroll to zoom.

Each selected bone needs the bone it aims at and an up reference. A bone with exactly
one child aims at it; other bones need an explicit choice. Expand a bone to pick
them, choose the **Ultirex**, **Linear** or a **Custom** weight curve, and change the
up direction. **Confirm** saves; **Cancel** leaves the version unchanged.

Twists are generated only on the upload/play copy, after VRCFury merges clothing
armatures. Every skin weighted to the bone is processed, including clothing. Each
bone adds a skinned bone, an up helper and a VRC aim constraint.

Bone paths are matched first. Originals that reparent a named joint resolve it
through one unique skinned bone of that name; ambiguous matches fail.

## Reuse an existing store asset

A custom base version belongs to an Orbiters asset. If a listing already exists
with Gumroad or Jinxxy integration, reuse that asset ID instead of creating a second
listing. Link its avatar base as well as its original source files.

## Local preview and publishing

**See differences** reads a complete local build directly. An incomplete local build
asks you to rebuild; it does not request an unpublished download.

Publishing checks the immutable build. If a source file such as the logic prefab
changed after the build, MCB names it and offers to publish the stored build or
cancel; rebuild to include the change. Encrypted versions with several originals
upload each original as a separate package through the source-support endpoint;
an unencrypted version is one package.

<audience include="dev">

## MCP authoring

With MCP for Unity connected, use `mcb_authoring`. It uses the current MCB login;
requests and responses never contain a token.

| Action | Result |
| --- | --- |
| `inspect` | Scene target IDs, local version identities and draft/registration schemas. |
| `create_base` | Register a new custom base, or set `data.existingAssetId` to link original support to an owned listing. |
| `import_fbx` | Import an FBX into a new `Assets/` path; differing existing content is rejected. |
| `configure` | Save a typed draft: asset, source/custom models, logic prefab, version metadata, exposed shapes, customization and `protection`. |
| `build` | Build the saved draft into a local artifact; returns its identity, protection and required skeleton size. |
| `apply` / `reset` | Apply the exact local version identity to the target avatar, or reset it. |
| `select_genre` | Select an installed genre by stable ID. |
| `preview_publish` | Validate and fingerprint an artifact; return its files and a confirmation code. |
| `confirm_publish` | Publish the unchanged artifact after explicit user approval of the preview. |
| `status` | Poll the job ID of a pending operation. |

`build` always uses the saved draft, even when an open creator form loaded another
version meanwhile. A trusted creator's draft sets `protection` to
`{ "xor": false, "discordRole": true }` for one unencrypted package; the server
rejects it for other creators, and when the asset has no Discord role rule.

Build, apply, reset, import and registration return pending jobs. Keep polling the
same job after a client timeout. A Unity domain reload clears in-memory jobs, so
inspect local artifacts before retrying. Confirmation codes expire after 15 minutes,
are single-use, and are invalidated when the artifact changes. Obtain human approval
before `confirm_publish`.

Typed `extraCustomization` entries are `genres`, `twistBones`,
`dynamicNormalBlendshapes` and `rendererLayout` (`renderers` with slot names per
submesh, `hide`, `fallbacks` with material GUIDs). Unknown sibling entries survive
serialization. Version metadata carries `protection` and, for unencrypted versions,
`skeleton` (required bone names); the server lists `discordRoleGranted` and
`discordRoles` for the signed-in member, skips the original-model hash check for
unencrypted downloads, and matches them in discovery by the avatar's transform names.

The twist weight-distribution implementation derives from Haï's MIT-licensed
Prefabulous Universal; the package includes its license and attribution.

</audience>
