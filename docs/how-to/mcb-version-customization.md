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
lastVerified: 2026-10-04
relations: orbiters.mcb.original-base-versions, orbiters.tools.mcb-operating-contract
---

# Configure MCB Version Customization

MCB creators can attach genre choices, twist-bone settings and explicit dynamic
normal selections to each custom-base version. These controls live in **Create
MCB Version** and are saved with the built artifact.

**Release status:** local development implementation. These package changes and
the Ultirex port have not been published. This guide does not announce a release.

## Genre choices

Expand **Genre options**, add a mode and give it a readable label. Choose one
default. Add the blendshape rules and GameObject states for that mode. Mesh and
object paths are relative to the avatar root; installed logic uses the
`mcb logic/` prefix. You can enter an object path or drag an object from the
avatar or the logic prefab.

For example, a female mode can set `Body` / `ulti female` to `100`, enable
`mcb logic/Dynamics/BreastPhysics_female`, and disable a wrapper around contacts
that should not operate in that mode. Animation can still toggle children of
that wrapper for posing. Avoid locking the individual contacts when their normal
animations must still turn them off.

The user chooses a mode with the installed version's **Genre** buttons. Additional
modes wrap onto another row in a narrow Inspector. The choice is remembered per
asset across version changes. If the next version has no mode
with the same stable ID, MCB selects and remembers that version's default.
Keep IDs stable when only changing a label. IDs are under **Advanced identity**.

A blendshape used by another mode resets to zero when omitted from the selected
mode. An omitted GameObject rule restores its original active state. Resetting
the custom base restores the saved scene values.

The selected mode is fixed in the built avatar. MCB removes competing animation
curves and adds a final constant override on the build copy. This feature does
not expose an in-game genre switch or an animator-parameter/hair link.

## Dynamic normals

Select **Setup dynamic normals** to expand a searchable picker for each custom
mesh. Select the exact shapes that need normal recalculation. **Flexings** adds
names containing `flex`; **Muscles** adds names containing `muscle`. Both are
shortcuts that populate the same explicit selection.

The picker shows the selected count, supports selecting all search results and
clearing the selection, and shares its behavior with ReFit. Creators can include
shapes such as `ulti female` or `belly suck` without relying on naming keywords.
Missing selected shapes fail validation rather than silently disappearing.

## Twisting bones

Select **Set twisting bones** to open the custom model preview. Click a bone, or
search the bone list. **Symmetry** starts enabled and selects the matching side
when a recognized mirrored bone exists. Drag to orbit and scroll to zoom.

Each selected bone needs an aim bone and an up reference. A bone with exactly
one child gets that child as its initial aim; other bones need an explicit pick.
The initial weight curve is the Ultirex curve. **Advanced curve and direction**
lets you edit its full tangents, weights and up direction. **Confirm** saves the
draft; **Cancel** leaves it unchanged.

Twists are generated only on the upload/play preprocessing copy, after VRCFury
merges clothing armatures. Every skin weighted to the chosen bone is processed,
including clothing. Each entry adds a skinned bone, an up helper and a VRC aim
constraint. The window reports this cost before confirmation.

Bone paths are matched first. Supported originals that reparent a named joint
can resolve it through one unique skinned bone of that name; ambiguous matches
fail. Native mesh application records custom skeleton parents and added bones,
then restores them when switching or resetting the version.
If the custom skeleton changes parents inside a connected model prefab, MCB
unpacks that instance as part of the undoable apply operation. Undo restores the
prefab connection; resetting the version restores the original bone parents.
New builds obtain their default humanoid definition from the selected original
model, so resetting another base does not reuse an unrelated avatar's mapping.

## Reuse an existing store asset

A custom base version belongs to an Orbiters asset. If a listing already exists
with Gumroad or Jinxxy integration, reuse that asset ID. Creating a second listing
splits its identity, access and store connections. When linking an existing listing,
set its avatar-base identity as well as registering its supported source files.
MCP registration accepts `avatarBaseId` for this association and preserves the
listing's store metadata.

Original FBXs are registered by verified content hash. A source key proves which
original bytes can reconstruct a payload; it does not by itself validate every
renderer layout. Test the intended avatar prefab separately. A Quest original
key does not make a PC payload Quest-ready.

The local implementation exposes each built original-source variant from its
shared draft folder. Gallery filtering uses the selected avatar's matching source
key; the union of all supported originals is not an active source key. The local
implementation is unpublished. Automatic discovery uses the avatar's current
mesh sources and applied-version bindings, so an old automatically saved source
from another avatar cannot keep unrelated custom bases in the matching gallery.
Explicit manual source assignments remain available.

For originals with different renderer layouts, source metadata can carry an
explicit `rendererLayout` mapping. It names the original renderers and the custom
renderer destinations, with each destination material slot pointing to an original
renderer and slot index. Applying preserves the scene's material references,
creates missing mapped renderers, and disables original pieces absent from the
custom layout. Reset restores their materials and visibility and removes the
created renderers. Unrelated objects at destination paths cause validation to fail
before layout changes. Registering another hash without its layout mapping and
an apply/reset check is insufficient evidence of support.

A slot absent from a reduced original can explicitly reference a creator-bundled
default material by GUID. Include those materials through the logic prefab's
`NativeRendererMaterialLibrary` dependency list. Use separate material and texture
assets to avoid overwriting the user's originals. Reset restores the original
renderer layout and the actual local original's Animator Avatar definition.

<audience include="dev">

## MCP authoring

With MCP for Unity installed and connected, use `mcb_authoring`. It uses the
current MCB login; requests and responses never require an agent to copy a token.

| Action | Result |
| --- | --- |
| `inspect` | Scene target IDs, local version identities and draft/registration schemas. |
| `create_base` | Register a new custom base, or set `data.existingAssetId` to link original support to an owned listing. Existing listing metadata is preserved. A duplicate owned name is rejected with its existing ID. |
| `import_fbx` | Import an FBX into a new `Assets/` path; differing existing content is rejected. |
| `configure` | Save a typed draft with asset, source/custom models, logic prefab, version metadata, exposed shapes and customization. |
| `build` | Build a local artifact; return its folder, identity and original-support count. |
| `apply` | Apply the exact local version identity to the target avatar. |
| `select_genre` | Select an installed genre by stable ID. |
| `preview_publish` | Validate and fingerprint an artifact; return its files and a confirmation code. |
| `confirm_publish` | Publish the unchanged artifact after explicit user approval of the preview. |
| `status` | Poll the job ID of a pending operation. |

Creation needs a stable `requestId`, a name, original source metadata, local source
models and an existing avatar-base ID or a new avatar-base name. Linking an
existing asset uses `existingAssetId` and the source metadata instead of creating
another listing. After an interrupted registration, inspect owned assets and link
the returned ID before retrying creation under another request ID.

Build, apply, import and registration return pending jobs. Keep polling the same
job; do not start a duplicate operation after a client timeout. A Unity domain
reload clears in-memory jobs, so inspect local artifacts before retrying.

Publication is separate from building or applying. Confirmation codes expire
after 15 minutes, are single-use, and are invalidated when artifact metadata,
manifest or output validation changes. The agent must obtain human approval
before submitting `confirm_publish`.

The typed `extraCustomization` entries are `genres`, `twistBones` and
`dynamicNormalBlendshapes`. Curve data includes tangents, weights, weighted mode
and wrap modes. Unknown sibling customization entries survive serialization.

The twist weight-distribution implementation derives from Haï's MIT-licensed
Prefabulous Universal; the package includes its license and attribution.

</audience>
