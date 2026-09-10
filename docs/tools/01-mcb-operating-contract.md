---
title: MCB Operating Contract
section: Tools
order: 110
audience: creator, dev
stage: stable
id: orbiters.tools.mcb-operating-contract
domain: mcb
type: invariant
owner: orbiters-mcb
lastVerified: 2026-09-10
relations: orbiters.how-to.mcb-and-unity-tools, orbiters.general.vpm-package-contract
---

# MCB Operating Contract

MCB applies custom avatar-base versions while preserving the original default FBX
as the source for resets and binary patches.

## Backup Invariant

If the default FBX is `A` and applied versions are `B` or `C`, `*.fbx.old` remains
the preserved copy of `A`.

- Create `*.fbx.old` only when it is missing.
- Never overwrite, delete, or move an existing backup during apply or reset.
- Reset by copying the backup over the working FBX while keeping the backup.
- An absent backup is valid only before the default base has ever been replaced.
- XOR patch generation and version switching must use the preserved default source.

<alpha>

## Installed version options after editor reloads

MCB restores the installed version's metadata before drawing its action button and
customization options, including ReFit and blendshape controls. Shared mesh assets
are checked as a complete set: one reused mesh alone does not identify a release.
If the saved version marker is stale, MCB recovers only when the applied meshes
identify one available version. When several versions use identical meshes, the
explicit installed version determines which options belong to the avatar.

## Responsive gallery cards

Gallery cards expand evenly to fill each row as the inspector is resized. The
grid keeps consistent edge spacing and gaps, adds columns when there is enough
room, and keeps thumbnails square. Incomplete final rows remain centered.

## Creator version window

**Create new version** opens a separate, resizable window containing the existing
Blender connector, model inputs, customization settings, and Build/Publish controls.
The form fills the window with a small edge padding, without an outer card or asset-name header.
The asset's version timeline remains in the inspector. Clicking the action again
focuses the open window. The window stays bound to its original avatar and asset
even when the inspector selection changes. Draft metadata and the success screen
survive editor reloads and closing/reopening the window within the Unity session.

After building, a **Version built successfully** screen offers a large **Upload
version** button, followed by **Create new version** and all unpublished builds
for that asset with individual **Upload** buttons. Upload sends the saved artifact
through the same validation and publishing pipeline as the version timeline.
Failures leave the build available for retry and show the error in the window.

The parent picker combines server versions with saved published versions for the
selected asset, including the applied version. An empty server response does not
erase known local parents. Unpublished drafts and other assets are excluded.
The initial selection prefers the applied parent and suggests the next patch after
the highest known published version: an installed 0.5.2 suggests 0.5.3. Refreshing
the list preserves the chosen parent and edited version number. This local
implementation is not yet released.

**Export offline version** is available on every version with local content,
whether the creator window is open or closed. Download a server-only version
first to make its content available for export.

## Advanced mesh build and publication

When the server generates missing version metadata, its Gemini structured-output
request uses the `APPLICATION_JSON` MIME enum. Provider failures return a readable
502 response without exposing request credentials. Supplied titles and changelogs
are preserved; supplying both avoids the metadata-generation request.

The locally validated implementation defaults new MCB components to **Use Advanced
Mesh Replacement**. Explicit saved choices remain intact. Creator builds map every
renderer in the canonical source model to its avatar path, including renderers
whose live mesh has already been replaced by a generated mesh. A missing renderer
or ambiguous binding stops the operation instead of producing a partial version.

Dynamic normal frames are calculated directly for the selected shapes during
packaging. Building a temporary Unity mesh containing every blendshape is no
longer necessary. The source model remains unchanged.

Advanced Apply and reset assign meshes and the root Animator avatar directly.
When the canonical FBX already contains the preserved original data, they do not
change its importer merely to assign a copied avatar asset. Returning from an FBX
replacement still restores the original file and importer when necessary.
First-use mesh creation yields between blendshape submissions; subsequent Apply
operations reuse the local native mesh cache. Neither path changes bone indices
or weight values to guess a missing bone binding.

A successful upload immediately enters the server-backed gallery and shared cache.
Removing its local copy removes the download, not its server availability. A fresh
server response refreshes both the shared cache and visible gallery. Source-model
changes refresh hash state, and downloads read the selected source hash so an
earlier garment detection cannot cause a false compatibility rejection. Downloads
also persist their authorized metadata for local scans after reload or while offline. A Unit Git
checkpoint failure cannot turn a successful upload into an unsubmitted version.

These fixes are local and unreleased. See [the measured version pipeline](../reference/mcb-version-pipeline-benchmarks.md)
for timings, fidelity checks and remaining first-use costs.

## Saved accessory ReFits per version

ReFit operations started through MCB save the fitted accessory mesh and renderer
state for the current custom-base version. Returning to the original base restores
the accessories' original state; applying the custom version again restores its
saved fits without running ReFit again. Switching between custom versions restores
each version's own fits. Accessories with no saved fit use their original state.

Saved data lives under `Assets/MCB/refits/<MCB component ID>/<asset ID>/v<version>-<identity>/`.
It includes the mesh, bone paths, captured pose, bounds, blendshape weights and
transferred-shape mapping. The component identity separates avatars, and the
version identity includes the default-base version. These are local authoring
assets, separate from downloaded version packages; save the avatar scene to retain
its component identity across sessions.

Unchecking an accessory and applying in the ReFit panel also disables its saved
fit for the current version. Fitting it again replaces that choice. A manually
replaced accessory mesh is not overwritten by a saved fit. Missing or incompatible
armature paths skip restoration with a Console warning. These changes are local
and unreleased.

### Automatic flex transfer and animation links

MCB ReFit now includes every blendshape on the selected custom-base Body mesh whose
name contains `flex`, ignoring case, as well as the version's exposed blendshapes.
Flex shapes do not need an MCB slider definition. Exact names are preserved and
duplicate requests are removed.

During avatar preprocessing, MCB's existing BlendShapeLink service copies body flex
animation curves to the corresponding generated accessory shapes. For example,
animating `biceps flex right` on Body also animates its transferred shape on each
currently refitted accessory. Mapped output names, including a `refit_` prefix,
are supported. These are build-time animation links, not an Edit Mode live watcher.
No additional VRCFury Blendshape Link component, runtime script, factor parameter
or wrapper blend tree is created. The existing build pipeline's temporary-controller
requirement still applies; original authoring clips are not edited.

Run ReFit again on accessories fitted before this change: restoring a saved fit
does not generate missing flex shapes. Reset or manually replaced accessory meshes
are excluded. Do not strip transferred flex shapes with a build optimizer; if a
captured renderer or shape disappears, preprocessing reports an error instead of
silently producing a broken link. This feature is local and unreleased.

<audience include="dev">
`MCBReFitFlexTests` covers mesh-only shape discovery, exact source/output mappings,
direct curve transfer and sampled animation values, repeated application without
new clip variants, authoring-controller isolation, and build-copy capture across
renderer renaming and mesh cloning. The capture callback runs at `-10001`; the
existing link callback applies direct copies after version/manual correctives at
`-9000`. References are scoped to the build avatar, not a same-named scene avatar.
</audience>

</alpha>

## Validation

Run `Tools > My Custom Base (MCB) > Health Checks > All Deterministic` after changes
to apply/reset, native mesh payloads, advanced mesh replacement, dynamic normals,
materials, blendshapes, sliders, or applied-version caches. The batch entrypoint is
`MCBEditorHealthChecks.RunAllOrThrow`.

New editor UI belongs in UI Toolkit using the package styles; do not extend the
legacy surface with new IMGUI flows.
