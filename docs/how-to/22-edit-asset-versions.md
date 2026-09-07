---
title: Edit releases in the version workspace
section: Creator Tools
order: 220
audience: creator, admin, dev
stage: beta
id: orbiters.how-to.edit-asset-versions
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-07
---

# Edit releases in the version workspace

Open an avatar asset's configuration and select **Versions**. Publish versions from
MCB Creator mode first; the website manages the uploaded releases. This workspace
is implemented for the next application release and is not yet deployed.

## Follow the history

The left-hand graph shows version numbers, titles, release channels, availability
and dates. Every connection follows the version's actual parent. Forks occupy
separate colored lanes; **Tip** marks a version with no children. Independent roots
stay disconnected. Channel names describe access, so Alpha, Beta and Public are
not branch names.

Select a version to open its editor. Search highlights matching numbers, titles
and channels while retaining the connections for context. On narrower screens,
the scrollable graph sits above the editor.

## Edit and save a release

1. Enter a recognizable **Version title** and write **Release notes** describing
   features, improvements and fixes.
2. Select the **Release channel**, release date and **Parent version**. A parent
   must belong to the same asset and avatar base. A version cannot become its own
   ancestor. Choose **No parent** for an independent root.
3. Set **Available to eligible users** to hide or restore the release. The selected
   channel follows the groups configured in the asset's Access tab.
4. Adjust customization, blendshapes and dependencies as needed, then select
   **Save changes**. The graph reflects saved parent links and release details.

Version drafts stay separate when switching versions. An unsaved marker identifies
each edited release. **Discard** restores that version's saved values. A failed
save keeps the draft for retry. Drafts are held in the current page; save before
leaving or closing it.

## Configure MCB options

- **Customization:** toggle custom veins, body dynamic normals and flexing dynamic
  normals. Add avatar-relative mesh paths for realistic-material suggestions.
- **Blendshapes:** enter the exact model name and default value, expose a slider
  and choose whether it starts enabled. Expand **Correctives** to pair source and
  correction names, choosing Blendshape or Animation from each type dropdown.
- **Dependencies:** add or remove package rows, each with a package identifier and
  required version. Duplicate names and incomplete rows must be fixed before saving.

The website edits the settings consumed by MCB. It cannot create blendshapes or
animation clips inside an existing model; the names must match the uploaded build.

## Inspect and maintain files

**Version package** shows the uploader, avatar base, base version and recorded file
size. **Download offline version** generates a Unity package from saved settings.
Save or discard edits before generating it.

**Custom vein texture** previews and downloads the stored PNG. Upload or replace a
PNG up to 20 MB to rebuild the archive. This file operation saves immediately;
save or discard metadata edits before replacing the texture.

Version numbers identify uploaded builds. Source model metadata, upload details
and fingerprints are inspectable under **Build information**. Rebuild in MCB to
change build identity or binary contents; they are not free-form metadata fields.

<audience include="dev">

The workspace uses the existing creator version GET, PUT, texture and saved-package
routes. PUT validates the editable fields and supports `scope`, `date` and
`parentVersionId` alongside title, release notes, availability, dependencies,
blendshapes and customization. It serializes version edits with a transaction and
asset row lock, then checks parent ancestry before updating. There is no schema
migration or fabricated branch metadata. MCB corrective entries retain `correctives`
with `Blendshape` / `Animation` type values.

</audience>
