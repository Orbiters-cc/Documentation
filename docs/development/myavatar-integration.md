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
lastVerified: 2026-09-28
---

# My Avatar integration contract

## Package boundaries

- `orbiters.myavatar` 0.2.0 owns the persistent avatar component, texture import,
  shader-slot discovery, assignment snapshots and Inspector workflow.
- `orbiters.toolkit` 0.2.1 owns the common Inspector shell and styles, glowing
  surface, vector logo renderer, account UI, authentication store and API roots.
  MCB 1.7.2 consumes the same shared services. The `Orbiters.Toolkit` assembly
  guards its editor services with `UNITY_EDITOR`; no editor logic enters players.
- `orbiters.unitgit` 0.1.1 is optional since My Avatar 0.2.0. When installed, the
  `MYAVATAR_UNITGIT` version define enables the commit step, which calls
  `CommitProjectFilesAsync(projectRoot, title, paths)`. It validates paths under the project, rejects ignored checkpoint files,
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
| `GET /myavatar/connection` | Returns connection state and the account AI preference (account row only). |
| `POST /myavatar/texture-plan` | Validates text context, calls the configured AI feature, returns assignment IDs and warnings. |
| `POST /myavatar/accessory-plan` | Validates accessory and avatar bone context, calls the configured AI feature, returns a variant, rigid target, bone links, setup rows and warnings. |

The request supplies up to 48 textures and 512 visible 2D shader slots, each with
a unique request-local ID. Textures carry name, source dimensions, filename role and
pixel statistics measured in Unity (`grayscaleFraction`, `normalColorFraction`,
`blackFraction`, `brightFraction`, `meanBrightness`) plus a nullable provisional
`localSlotId`. No image data is accepted. The prompt groups slots by material and
states each slot's existing texture as `name WxH`. The global JSON body limit
remains 1 MiB. No URLs are fetched from this request.

The Unity client applies local matches first and then sends only unresolved textures
and the slots this drop left free. A 2026-09-27 DeepSeek comparison (two ambiguous
eye textures, three runs each) found: reasoning on hit the 4,096-token output limit
in most runs after 13–22 s; reasoning off answered in 1.2–3.9 s; with reasoning off,
including resolved textures produced wrong placements in all three runs, while
unresolved-only produced no wrong placements (one complete, two partial answers).

Output is schema-constrained JSON with `assignments` (`textureId`, `slotId`,
`confidence`, `reason`) and `warnings`. Unknown IDs, duplicate assignments,
answers repeating a texture's own local slot and incompatible known roles are
rejected or excluded; an answer may move a provisional local match.
The client independently validates the returned IDs and available slots before
assigning any material.

The `MYAVATAR_TEXTURES` feature defaults to reasoning off. Admin → AI → Features
has a per-feature **Model reasoning** switch that overrides a feature's default; the
setting is recorded on each request in AI history. The feature uses existing AI provider routing, model settings,
user AI preference enforcement and private-content history handling. No separate
provider credential is needed. Source names and image contents are explicitly
untrusted prompt data. The endpoint allows 20 requests per user per hour, one
active request per user and at most 32 active requests in this process.

### Accessory placement

The alpha accessory drop asks `POST /myavatar/accessory-plan` only for what local logic
could not decide. The request has `avatar.bones` (at most 400: `id` `aN`, `name`,
`path`, nullable `human`), `accessory` (`name`; at most 24 `candidates` with `id` `cN`,
`name`, package-relative `path`, `kind`, `setup` component types, `renderers`, `bones`;
nullable `selected`; at most 400 `bones` with `id` `sN`, `name`, `path`, nullable
`parent` and `match`; `unresolved` bone IDs; `rigid`; at most 80 notable `objects` with
`id` `oN`, `path`, `components`) and at most 6 `docs` (`name`, `text` up to 4,000
characters, 12,000 in total). IDs must be unique and every reference must resolve inside
the request; a request with a single candidate, no rigid target, no unresolved bones and
no objects is rejected because nothing is left to decide. The prompt groups bones by
parent path. The documentation is untrusted text and the feature contract says so.

The response is `{ candidate, target, links: [{ bone, avatarBone, confidence }],
setup: [{ object, reason }], warnings }`. The schema only offers IDs from the request:
`candidate` only when there are several candidates, `target` only for rigid
accessories, link `bone` only from `unresolved`. The server again drops unknown IDs and
links below 0.8 confidence, keeps the most confident link per bone and one setup row per
object, and caps reasons at 160 and warnings at 200 characters (at most 4).
`MYAVATAR_ACCESSORIES` defaults to reasoning off, is overridable in Admin → AI →
Features, and uses the same preference enforcement, private history handling and
limits as texture matching (20 per user per hour in its own bucket, one active request
per user, 32 per process).

## Release

The package repository is `Orbiters-cc/MyAvatar`, branch `master`, with repository
variable `PACKAGE_NAME=MyAvatar`. It uses the standard **Build Release** workflow.
Publish Toolkit and Unit Git dependency releases before publishing My Avatar.
The first My Avatar release is 0.0.1; 0.1.0 adds the local-first texture pipeline;
0.2.0 adds locked-shader support, convention-independent matching, the morphing drop
field and makes Unit Git optional. The repository's release webhook is source 12 of
the canonical listing, created automatically when the source was added.
The release webhook refreshes the canonical Orbiters VPM source; an Actions success
alone does not prove VCC installation.

## Texture workflow in 0.1.0

The package reuses project assets and uses a bounded persistent source-file cache in
Library keyed by source path, size and modification time. New sources are copied in
parallel on worker threads without content hashing, into one texture folder per drop;
file staging is outside Assets. No project-wide FindAssets or file scan runs during a
drop. A minimal `.meta` with the owned importer settings (texture type, sRGB, not
readable) is written before import, so each file imports once; the result was
verified identical to Unity's defaults. Unity asset operations remain on the main
thread in one `StartAssetEditing` batch. There is no global texture postprocessor or
whole-project refresh in the drop/apply path; Unity's Parallel Import did not apply
to these imports in the test project. Incorrectly imported normal maps get an owned
copy so the source importer remains untouched.

Measured on a 13-texture, 236 MB set (Unity in the background): existing textures
reach assigned materials in about 0.7 s (previously 22–25 s, mostly waiting for AI);
a first import of the whole set takes about 8 s (previously about 25 s of
preparation and import alone).

Applied file → slot choices are remembered per avatar in
`Library/OrbitersMyAvatar/mappings.json` and take precedence over filename matching
and AI. Pixel statistics are read with synchronous 64 px readbacks (about 15 ms for
13 textures). Background AI answers merge into the applied batch: generated materials
are reused, the batch snapshot keeps its original `before` state, and stale answers
are rejected after another drop, slot edit, Undo/Redo or renderer change.

The component keeps renderer before/after snapshots and swaps entry state for
Undo and Redo. A new successful apply replaces the redo snapshot. Renderer
assignment conflicts prevent overwriting subsequent user edits. Unit Git includes
reused texture files and metadata in the scoped checkpoint.

Matching considers all existing textures on each material and separates primary
slots from detail layers. A colour-slot collision where exactly one image is mostly
black with bright details resolves locally to the material's emission slot. Client
and server accept well-supported color/emission role changes while keeping
normal/mask channel constraints. Unresolved cases retain a suggested target for
explicit selection. The backend image adapter distinguishes a Node Buffer from upload
objects (Buffer.buffer is an ArrayBuffer and must not reach the image validator).