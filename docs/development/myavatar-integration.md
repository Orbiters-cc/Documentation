---
title: My Avatar integration contract
section: Development
order: 92
audience: dev, admin
stage: beta
id: orbiters.development.myavatar-integration
domain: general
type: reference
owner: orbiters-engineering
lastVerified: 2026-09-26
---

# My Avatar integration contract

## Package boundaries

- `orbiters.myavatar` 0.0.1 owns the persistent avatar component, texture import,
  shader-slot discovery, assignment snapshots and Inspector workflow.
- `orbiters.toolkit` 0.2.1 owns the common Inspector shell and styles, glowing
  surface, vector logo renderer, account UI, authentication store and API roots.
  MCB 1.7.2 consumes the same shared services. The `Orbiters.Toolkit` assembly
  guards its editor services with `UNITY_EDITOR`; no editor logic enters players.
- `orbiters.unitgit` 0.1.1 exposes `CommitProjectFilesAsync(projectRoot, title,
  paths)`. It validates paths under the project, rejects ignored checkpoint files,
  performs Git work off the main thread and notifies consumers after completion.
  Existing scoped-index behavior preserves unrelated staged work.

The component implements the VRChat editor-only interface so it is removed from
uploaded avatars. Original renderer material references and the most recent
assignment snapshot are scene data. File copies and generated materials are
project assets; there are no absolute source paths in the serialized component.

## Backend routes

Both routes require the ordinary Orbiters Bearer authentication and return
`Cache-Control: private, no-store`.

| Route | Behavior |
| --- | --- |
| `GET /myavatar/connection` | Returns connection state and the account AI preference. |
| `POST /myavatar/texture-plan` | Validates context and preview, calls the configured AI feature, returns assignment IDs and warnings. |

The request supplies up to 48 textures and 512 visible 2D shader slots, each with
a unique request-local ID. One JPEG contact sheet contains six columns of 112px
tiles; its base64 field is capped and decoded bytes cannot exceed 512 KiB. The
global JSON body limit remains 1 MiB. No URLs are fetched from this request.

Output is schema-constrained JSON with `assignments` (`textureId`, `slotId`,
`confidence`, `reason`) and `warnings`. Unknown IDs, duplicate assignments,
occupied local slots and incompatible known roles are rejected or excluded.
The client independently validates the returned IDs and available slots before
assigning any material.

The `MYAVATAR_TEXTURES` feature uses existing AI provider routing, model settings,
user AI preference enforcement and private-content history handling. No separate
provider credential is needed. Source names and image contents are explicitly
untrusted prompt data. The endpoint allows 20 requests per user per hour, one
active request per user and at most 32 active requests in this process.

## Release

The package repository is `Orbiters-cc/MyAvatar`, branch `master`, with repository
variable `PACKAGE_NAME=MyAvatar`. It uses the standard **Build Release** workflow.
Publish Toolkit and Unit Git dependency releases before publishing My Avatar.
The first My Avatar release is 0.0.1. The release webhook refreshes the canonical
Orbiters VPM source; an Actions success alone does not prove VCC installation.

## Texture workflow update after 0.0.1

The next package update reuses project assets and uses a bounded persistent source-file
cache in Library. Unchanged source and cached-asset timestamps skip content reads;
new sources are copied and SHA-256 hashed in one worker-thread pass. No project-wide
FindAssets or file-size/hash scan runs during a drop. New copies live in a content-addressed texture
folder; file staging is outside Assets. Unity asset operations remain on the main
thread and use bounded import batches. There is no global texture postprocessor
or whole-project refresh in the drop/apply path. Incorrectly imported normal maps
get an owned copy so the source importer remains untouched.

The component keeps renderer before/after snapshots and swaps entry state for
Undo and Redo. A new successful apply replaces the redo snapshot. Renderer
assignment conflicts prevent overwriting subsequent user edits. Unit Git includes
reused texture files and metadata in the scoped checkpoint.

Matching considers all existing textures on each material and separates primary
slots from detail layers. Filename conflicts remain eligible for AI matching. Client and server accept
well-supported color/emission role changes while keeping normal/mask channel
constraints. The server computes blackFraction, brightFraction and meanBrightness
from each JPEG tile, excluding padding. Unresolved cases retain a suggested target
for explicit selection. The AI request carries actual project-relative asset paths.
The backend image adapter must distinguish a Node Buffer from upload objects:
Buffer.buffer is an ArrayBuffer and must not be passed to the image validator.
This fixes the misleading 20 MB rejection for small contact sheets. The updated
AI prompt also uses whole-material context and primary/detail distinctions.