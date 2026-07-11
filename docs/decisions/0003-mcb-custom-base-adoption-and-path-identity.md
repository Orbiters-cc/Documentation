---
title: ADR 0003 - MCB Custom Base Adoption And Path Identity
section: Decisions
order: 102
audience: dev
stage: alpha
---

# ADR 0003 - MCB Custom Base Adoption And Path Identity

## Status

Accepted and implemented for the operational creation, discovery, apply, reset, export/import lineage, and confirmed path-recovery paths. The feature remains alpha while broader archive fuzz coverage and moderation policy tooling remain open. Unity remains authoritative for file operations. The backend stores authenticated, owner-scoped history containing project-relative paths only; it never receives Unity GUIDs, absolute paths, or source files.

## Context

The original MCB creator workflow assumed that the scene contained an untouched default avatar base. A creator added MCB, created a custom-base asset, and then started modifying that base.

During adoption, creators also start from avatars that were already modified before MCB was added. Their project may rename or move the original FBX, for example:

```text
Reference source: Assets/MasculineCanine/FX/MasculineCanine.v1.5.fbx
Local target:     Assets/ultipaw.fbx
```

MCB therefore needs to keep two identities separate:

- the canonical original/default FBX identity used to build and verify patches;
- the local target FBX that MCB is allowed to modify in the current Unity project.

A Unity path is not an identity. Creators can rename files, move folders, duplicate projects, and import an avatar package into another project. SHA-256 fingerprints establish source identity. Paths and Unity GUIDs locate files after identity is known.

## Creator Flow

The create form asks what is in the scene:

- **Already customized base** means the live avatar is the finished custom base the creator wants to share.
- **Original/default base** means the creator still needs to make the custom base.

MCB should recommend and preselect a branch when the evidence is exact. The creator can still override the recommendation.

| Detected state | Recommended branch | Original-source input | Photoshoot |
| --- | --- | --- | --- |
| Every live target hash matches one known avatar-base source revision | Original/default base | Hidden | Hidden |
| Live hashes differ, but every `.originalbase` sidecar matches one known source revision | Already customized base | Hidden because valid keys already exist | Shown |
| Original FBX hashes match, but a renderer owned by that base uses a mesh from another asset | Already customized base recommended, creator can choose | Hidden because the untouched original FBX can seed the key | Shown for the recommended branch |
| Live hashes differ and a required original key is missing | Already customized base | Required | Shown |
| More than one avatar base or source mapping is possible | No automatic choice | Blocked until resolved | Follows the resolved branch |
| A new `Other` base is explicitly declared | Creator choice | Required only for an already-customized base | Follows the chosen branch |

Selecting `Winterpaw` by name is not sufficient evidence. MCB must compare the current hashes with Winterpaw's canonical source revision. When they match, it selects Winterpaw, recommends `Original/default base`, and does not show `.unitypackage` or raw-FBX inputs. When they do not match, source input remains required unless a valid `.originalbase` key already exists.

Photoshoot remains branch-specific. It is shown only when the scene already contains the final shareable custom base.

FBX hashes alone do not describe the final scene. MCB also compares base-owned renderer paths from the detected original FBX with the meshes assigned to those renderers in the scene. A mesh from another FBX or generated asset is customization evidence. MCB reports the affected renderers, recommends the already-customized branch, and preserves the creator's explicit scene-mode choice. Unrelated clothing renderers are ignored because their hierarchy paths are not owned by the detected base FBX.

## Canonical Avatar Base Fingerprints

Known avatar bases need canonical source revisions independent of creator assets. A revision contains one or more required source-file slots:

```text
AvatarBaseSourceRevision
  avatarBaseId
  label
  signature
  active

AvatarBaseSourceFile
  revisionId
  slotKey
  canonicalPath
  sha256
```

The natural uniqueness rules are `(revisionId, slotKey)` and a named index on `sha256`. A revision exists because one avatar-base family may publish several default FBX releases or require several FBX files.

Detection must match a complete revision one-to-one. It must not infer an avatar base from whichever custom-base asset happens to be accessible to the user. The result should report the avatar base, revision, per-file mappings, and match provenance such as `LIVE_HASH`, `ORIGINALBASE_HASH`, or `MANUAL`.

The creator endpoint exposes only avatar bases with at least one active, non-empty canonical revision. A known base with no canonical revision is an administration/configuration error; creator input must not become that base's first canonical fingerprint. Live-avatar discovery may contain clothing or props unrelated to the base. Detection can match a complete revision within that larger inventory, prefers the unique revision with the most matched source slots, and reduces the creation target list to those matched FBXs before submission.

## Local Override Contract

The MCB component stores the local mapping needed by that avatar instance:

- stable canonical source-file or source-slot ID when available;
- `referenceSourcePath`;
- `referenceHash`;
- `localTargetPath`;
- `localTargetGuid`;
- `preMcbBackupToken`;
- source import kind and a package filename when useful for diagnostics.

It does not store `originalBasePath` or a full pre-MCB backup path. Those paths are derived from the local target and backup token.

Persistent lookup must use strict identity:

1. Use a stable source-file/slot ID only when the supplied path and hash do not contradict it.
2. Otherwise use the exact `(referenceSourcePath, referenceHash)` pair.
3. Use hash-only matching only during discovery, and only when exactly one unmatched source and one unmatched local file remain.

A single local file or override cannot satisfy two required source slots. Repeated hashes are valid data, so the matcher must consume matches one-to-one and report ambiguity instead of taking the first row.

## Local Target Resolution

For an existing override, resolve the writable target in this order:

1. Use `localTargetPath` when a file exists there.
2. Only when that file is absent, resolve `localTargetGuid` through Unity.
3. When the GUID resolves, migrate the related sidecars, update `localTargetPath`, and persist the component.
4. When both fail, mark the mapping unresolved and require repair. Do not silently write to the canonical reference path.

When no override exists, the canonical reference path may be used only when it is a validated project asset path and the expected file exists.

Every path used for local reads or writes must be canonicalized and proven to remain under the Unity project `Assets` or `Packages` root. Prefix checks alone are insufficient because a value such as `Assets/../../outside.fbx` still starts with `Assets/`.

## Source Keys And Backups

The sidecars are named from the resolved local target:

```text
Assets/ultipaw.fbx
Assets/ultipaw.fbx.originalbase
Assets/ultipaw.fbx.backup20feb2025-143015
```

The rules are:

- `.originalbase` is the immutable original/default FBX used as the XOR or delta key.
- `.backup<ddMMMyyyy-HHmmss>` preserves the live pre-MCB file for recovery. A numeric suffix resolves same-second collisions.
- Resetting a custom-base version to the default base uses `.originalbase`.
- Removing MCB or explicitly restoring the pre-MCB state uses the dated backup. These are different actions.
- Existing `.originalbase` data must never be overwritten when its hash differs from the selected canonical source. MCB must stop and require an explicit repair decision.
- Every installed key must be hashed after copy and compared with the canonical source hash before component or backend state is committed.
- XOR, HDiff, and native-mesh operations must validate the key hash before use. Output should be produced in a temporary file, verified, and then replace the live target.

The original/default branch should create or validate `.originalbase` as soon as an exact default hash is known. This protects creators who later edit the live target in place instead of supplying a separate custom FBX.

Local file changes and component changes form one operation. A failed or timed-out asset-creation request must not leave a newly created backup, source key, or path override that claims the server asset was created successfully.

## Original Source Import

For an already-customized base, MCB accepts either:

- a `.unitypackage`, inspected as an archive without calling Unity's normal project import;
- one or more raw FBX files.

The `.unitypackage` reader extracts only FBX source entries and preserves each package pathname as the canonical published path. Extraction must use collision-free relative paths, bound total expanded bytes and per-entry bytes, reject malformed paths, and clean its temporary directory on clear, cancel, success, failure, and stale-session cleanup.

Raw external FBX files do not reveal their original Unity package path. MCB may infer a canonical path only when the selected file is already under the current project's `Assets` or `Packages` tree. Otherwise the creator must map it explicitly. Automatic filename matching is allowed only when unambiguous.

## Backend Authority Boundary

Unity owns the active override and every file operation. The backend owns canonical source identity and an authenticated history that can suggest a prior relative-path mapping. A server record never authorizes a write and is never applied automatically.

The server stores only paths rooted under `Assets` or `Packages`, canonical source path/hash, a dated-backup token, import kind, and package filename. It rejects absolute paths, traversal, bindings that do not match an active source FBX on the selected accessible asset, duplicate source mappings, and reuse of one target for multiple sources. It does not store Unity GUIDs, full package paths, source files, or machine filesystem paths.

This split is used because relative paths survive common project exports and imports and can improve recovery, while local existence and file hashes can only be trusted inside Unity. Server suggestions are restricted to the authenticated owner's history. Unity accepts one only when every unresolved source has a one-to-one mapping to an FBX used by the current avatar and either the live target or its `.originalbase` sidecar matches the canonical source hash. Otherwise no prompt is shown.

Discovery may accept a minimal request-scoped override mapping from the current component. That mapping is a compatibility hint, not authorization. The evaluator must be a pure service, consume source and local files one-to-one, and return match provenance. It must not reuse one hash-only override or one local file for multiple source files.

Discovery also accepts a separate hash inventory for `.originalbase` sidecars. Each entry uses the live target's project-relative path and the sidecar's hash; the sidecar filename itself is not published as an asset source path. This allows an applied custom FBX to remain compatible with assets built for its proven original base. Live files and source-key files share one consumed-target set, so one target cannot satisfy multiple required source slots.

When canonical source hashes exist, failure to match them is authoritative. Compatibility must not fall back to path-only `projectRecognitionPatterns`, because a different or already-modified FBX can still occupy the expected path.

The former unscoped `AvatarPathOverride` contract remains removed. Its replacement is deliberately split into `McbAvatarInstance`, `McbPathBinding`, and `McbInstanceEvent`, with named indexes, ownership scope, lifecycle state, and acceptance provenance. Existing deployments may still contain the old physical table; it remains dormant until a separately reviewed destructive migration removes it.

Custom-base creation also carries a client-generated request ID. The backend enforces the named natural key `(owner, mcbCreationRequestId)` and returns the existing asset for a repeated request. This makes a retry after a lost response or failed local commit idempotent.

## Portability And Telemetry

Identity has three serialized levels:

- `mcbInstanceId` is lineage and survives prefab or package export/import;
- `mcbComponentId` identifies one component copy and is rotated when Unity finds a duplicate in loaded scenes;
- `mcbServerInstanceId` is a claim linking an imported copy to the previously registered server instance.

The client also creates non-exported installation, project, and workspace IDs. Installation identity is stored in editor preferences, project identity in `ProjectSettings`, and workspace identity in `Library`. The server natural key is `(userId, workspaceId, componentId)`. This prevents records from different users or workspaces from becoming one global path override while preserving explicit import lineage.

Operational recovery files must not be uploaded to the backend. The dated pre-MCB backup must not be exported automatically because it can contain the creator's private modified asset. The original default FBX can also be license-restricted, so `.originalbase` must not be silently included in a package shared with another user.

After import into another project, MCB preserves mapping metadata, resolves the target by path then GUID, validates whether the source key is present, and registers a new scoped instance linked to the claimed origin. If the component was removed and recreated, MCB can search the authenticated user's prior bindings and ask the user to confirm a fully verified mapping. A missing local target invalidates the current binding but does not erase history.

Instance and recovery events provide internal adoption and lineage signals. Re-observation of lineage by another account, import links, and override patterns can support investigation, but copied identifiers are not proof of unauthorized sharing. Enforcement requires corroborating entitlement and delivery evidence and must not expose one user's history to another user.

## Release Gates

The feature is not complete until automated coverage includes:

- exact default hash auto-selects the avatar base and hides source inputs;
- renamed default FBX creates a canonical-to-local override instead of publishing the renamed local path as canonical;
- a valid `.originalbase` suppresses unnecessary source import for an already-customized base;
- repeated source hashes, repeated local hashes, stale IDs, and ambiguous mappings do not reuse a match;
- `localTargetPath` wins while present, GUID fallback updates a moved target, and sidecars move with it;
- missing target and GUID fail closed without writing to the reference path;
- existing correct and conflicting `.originalbase` files follow the immutable-key rules;
- path traversal and non-project write targets are rejected in Unity and by the backend;
- failed create requests roll back staged local state and retries are idempotent;
- `.unitypackage` extraction handles colliding names, malformed archives, size limits, and cleanup;
- every apply mode rejects the wrong source key before changing the live FBX;
- reset-to-default and restore-pre-MCB exercise different files;
- discovery compatibility is one-to-one and reports exact match provenance;
- public asset responses contain no creator-local path, GUID, backup token, or component tracking metadata;
- instance sync rejects source bindings outside the selected accessible asset and scopes history to the authenticated owner;
- recovery suggestions are complete, one-to-one, locally hash-verified, and explicitly accepted before use;
- applied custom FBXs remain discoverable through matching `.originalbase` hashes without weakening live-file matching;
- a base-owned SMR mesh swap recommends the already-customized flow while unrelated clothing renderers do not;
- package export/import reaches a deterministic `ready` or `source key required` state.

## Implementation Order

1. Add canonical avatar-base source revisions and a pure hash-matching service with one-to-one tests.
2. Drive the create form from one detection result so base selection, scene mode, source-key readiness, and photoshoot visibility cannot disagree.
3. Harden local override identity, project-path validation, immutable key installation, sidecar migration, rollback, and explicit pre-MCB restore.
4. Extract backend compatibility evaluation into a pure tested service and add owner/workspace-scoped instance and binding history.
5. Add locally verified, explicit recovery confirmation and preserve import lineage without making server history authoritative.

## Implemented State

The current implementation includes:

- canonical `AvatarBaseSourceRevision` and `AvatarBaseSourceFile` records, including startup backfill from existing source `ModelFile` rows;
- complete one-to-one matching with exact-path/hash reservation, strict request-scoped overrides, unique-hash fallback, ambiguity reporting, and no path-pattern fallback after canonical hashes exist;
- hash-driven avatar-base and source-revision detection in Unity, including renamed default FBX files and previously validated `.originalbase` sidecars;
- canonical-ready creator-base filtering, most-specific subset detection for avatars with unrelated FBXs, and a server guard preventing creator-defined revisions on existing known bases;
- server-first, idempotent custom-base creation followed by a rollback-capable local commit;
- immutable, hash-verified `.originalbase` installation and dated pre-MCB backups;
- path-first then GUID target resolution, sidecar migration, and fail-closed unresolved mappings;
- streaming two-pass `.unitypackage` inspection with bounded FBX extraction and owned temporary-directory cleanup;
- source-key hash checks shared by XOR, HDiff, and native mesh apply paths;
- an explicit Advanced Mode command to restore pre-MCB FBX backups after resetting an applied MCB version;
- public asset response sanitization that removes local paths, GUIDs, backup tokens, import diagnostics, and component identifiers;
- separate lineage, component, server-instance, installation, project, and workspace identities with duplicate-copy rotation;
- owner-scoped server instance, path-binding, and event records with named natural-key indexes and deactivation semantics;
- complete, one-to-one recovery suggestions that are revalidated against the current avatar and canonical source key before confirmation;
- source-binding canonicalization against the selected accessible asset and explicit accepted/declined recovery provenance;
- separate live-FBX and `.originalbase` discovery inventories with shared one-to-one target consumption;
- scene renderer provenance that detects base-owned mesh swaps and keeps the creator's scene-mode choice explicit;
- source-key UI that distinguishes a validated existing key from a required import and allows replacing the validated source.

Still deferred:

- destructive removal of the dormant legacy database table;
- broader malformed/archive-bomb fixture coverage beyond the implemented limits and parser checks;
- moderation policy and investigation tooling that treats lineage as a signal rather than proof.

## Consequences

- Creators with an untouched renamed Winterpaw FBX get the short default-base flow automatically.
- Creators starting from an existing custom base provide the original source only when MCB cannot validate an existing key.
- Canonical source identity remains stable when local filenames and folders change.
- Multi-FBX avatars fail safely on ambiguous identity instead of corrupting one target with another file's key.
- The backend can recover previously confirmed relative mappings without controlling local writes or receiving absolute machine paths.
- Exported components retain lineage, while workspace scope prevents unrelated projects from silently sharing one active server record.
- Anti-sharing work can use lineage and recovery events as signals, but still requires entitlement and delivery evidence.
