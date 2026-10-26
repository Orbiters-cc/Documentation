---
title: My Avatar gallery API and installation contract
section: Reference
order: 79
audience: dev
stage: alpha
id: orbiters.reference.myavatar-gallery-api
domain: myavatar
type: reference
owner: orbiters-engineering
lastVerified: 2026-10-09
relations: orbiters.tools.myavatar-asset-gallery, orbiters.myavatar.publish-to-gallery, orbiters.operations.known-vpm, orbiters.myavatar.customizable-parts
---

# My Avatar gallery API and installation contract

This page lists the data model, routes and Unity installation states behind the My
Avatar asset gallery. Buyer and creator workflows are in
[Add clothes and accessories from the My Avatar asset gallery](../tools/14-myavatar-asset-gallery.md)
and [Publish clothes and accessories to the My Avatar gallery](../how-to/publish-to-myavatar-gallery.md).

**Release status:** local development implementation (backend, My Avatar 0.9.0,
Orbiters Toolkit 0.3.12, MCB 1.11.1). Not deployed or published.

## Data model

Gallery assets are ordinary `Assets` rows of type `ACCESSORY` or `CLOTHING`. Releases do
not reuse `AvatarVersions`.

| Table | Purpose | Key fields |
| --- | --- | --- |
| `AvatarAssetVersions` | A release of an asset | `assetId`, `version` (unique per asset), `title`, `changelog`, `scope` (`public`, `beta`, `alpha`), `status` (`draft`, `published`, `withdrawn`), `publishedAt`, `rightsConfirmedAt`, `rightsConfirmedById`, `parts` (nullable JSONB: the checked parts definition) |
| `AvatarAssetVariants` | A downloadable package of a release | `versionId`, `label` (unique per release), `platforms` (`pc`, `android`, `ios`), `baseScope` (`any`, `bases`), `avatarBaseIds`, `fileId`, `sizeBytes`, `sha256`, `dependencies`, `manifest`, `contents`, `parameterBits`, `containsCode` |
| `PartVariants` | A variant of one of an asset's customizable parts | `assetId`, `versionId` (the release it was checked against), `partKey`, `kind` (`values`, `model`, `strings`), `name`, `description`, `language`, `authorId`, `official`, `status` (`published`, `withdrawn`, `removed`), `fileId` (private zip), `thumbnailFileId`, `thumbnail`, `sizeBytes`, `sha256`, `files`, `downloads`, `removedById`, `removedAt` |
| `AvatarAssetPurchases` | A purchase the gallery is watching | `userId` + `assetId` (unique), `provider`, `storeIntegrationId`, `status` (`pending`, `redeemed`, `expired`), `expiresAt` (7 days), `storeSaleId` |
| `KnownVpmRepositories` | Admin-approved dependency sources | `url` (unique), `status` (`approved`, `disabled`), `packageCount`, `lastValidatedAt`, `lastCheckedAt`, `lastError` |
| `KnownVpmPackages` | Packages of a known repository | `repositoryId` + `name` (unique), `status` (`pending`, `approved`, `disabled`), `supportedRange`, `versions`, `latestVersion` |

`Assets.preferredStore` and `Users.preferredStore` are nullable provider ids; the asset's
value overrides the creator's default. New columns are nullable and the new tables use
string columns with named unique indexes, so populated databases upgrade in place.

A variant is at most 300 MB. Its `manifest` declares what to install:

```json
{
  "schema": 1,
  "defaultSetup": "vrcfury",
  "setups": [
    { "key": "vrcfury", "label": "VRCFury",
      "prefabs": [{ "guid": "0123456789abcdef0123456789abcdef", "path": "Assets/Example/Jacket.prefab",
                    "name": "Jacket", "attach": { "mode": "auto" } }] }
  ]
}
```

`attach.mode` is `auto`, `configured`, `merge` or `parent` (with `attach.bone`). Uploads
are rejected when the package writes outside `Assets` and `Packages`, is not a readable
Unity package, or lacks a prefab the manifest names.

<alpha>

Every upload is also held to My Avatar's packager rules (`services/avatarAssets/packageCheck.js`): it is refused (400)
with source files (`.blend`, `.blend1`, `.spp`, `.psd`, `.psb`, `.max`, `.ma`, `.mb`, `.ztl`, `.kra`, `.xcf`), with
Poiyomi Pro files (a Poiyomi path with a `Pro` folder or named `Poiyomi Pro`), or without a prefab under `Assets`.
Prefabs under `Packages` are never offered. When the upload's `metadata` has no `manifest`, the variant gets one
`default` setup placing the outermost prefab (fewest path segments, then by path) with `attach.mode` `auto`; when it has
no `dependencies`, each `Packages/<id>/…` folder except `com.unity.*` becomes `{ "id": "<id>", "range": "*" }`.
`contents` then also records `prefabs` (`guid`, `path`; at most 200) and `warnings` (files under `Packages` that are
not imported, code).

</alpha>

## Routes

All routes are under the API origin. `optional` accepts anonymous callers;
`required` needs a session JWT or an `orbit-` Unity token.

| Method and path | Auth | Purpose |
| --- | --- | --- |
| `GET /avatar-assets/gallery?platform=&baseId=&type=&q=&offset=` | optional | Cards: access, price, stores (preferred first), best-fitting release (`fit.state`: `compatible`, `platform`, `base`, `unknown-base`, `none`). 60 per page. |
| `GET /avatar-assets/:assetId` | optional | Details with the releases visible to the caller and their variants. |
| `GET /avatar-assets/bases` | none | Registered avatar bases and recognition patterns. |
| `GET /avatar-assets/known-dependencies` | none | Approved Known VPM packages and versions in range. |
| `GET /avatar-assets/:assetId/variants/:variantId/download` | required | The package, after an access check. Headers `X-Orbiters-Package-Sha256` and `X-Orbiters-Creator-Trusted`. |
| `POST /avatar-assets/:assetId/purchases` | required | Body `{ "provider": "GUMROAD" }`. Returns the store URL and whether the purchase can be recognised automatically; records a pending purchase when it can. |
| `GET /avatar-assets/:assetId/purchases/status` | required | `none`, `pending`, `redeemed` or `expired`. |
| `GET`, `POST /avatar-assets/creator/assets` | required | The creator's gallery assets; create one (multipart `metadata` + optional `thumbnail`, `Idempotency-Key` header). |
| `PUT /avatar-assets/creator/assets/:assetId` | required | Edit an asset: `type`, `preferredStore`, `priceCents`/`free`/`currency`, `replacePreviews`, multipart `thumbnail` and `previews`. Also `name` (2–120 characters), `shortDescription` (up to 200) and `description` (up to 20,000), each only when sent. |
| `GET /avatar-assets/creator/assets/:assetId` | required | The website's gallery state of one of the creator's assets: `asset` (`inGallery`, `listed`) and every release, newest first, with its variants, `contents` included. 409 for a type that cannot join the gallery. |
| `POST /avatar-assets/creator/assets/:assetId/withdraw` | required | Withdraw every published release of the asset: `{ "withdrawn": <count> }`. |
| `PUT /avatar-assets/creator/preferred-store` | required | The creator's default preferred store. |
| `POST /avatar-assets/creator/assets/:assetId/versions` | required | Create a draft release. The version must be higher (semver) than the asset's latest published or withdrawn one. With `"resume": true`, an existing draft of the same version is returned instead of 409. |
| `PUT`, `DELETE /avatar-assets/creator/assets/:assetId/versions/:versionId` | required | Edit or delete a draft release. A released version keeps its number, title, changelog and scope (409 on a change). |
| `POST /avatar-assets/creator/assets/:assetId/versions/:versionId/variants` | required | Upload a variant (multipart `metadata` + `packageFile`). |
| `PUT /avatar-assets/creator/assets/:assetId/versions/:versionId/variants/:variantId` | required | Change a draft variant's `label`, `platforms`, `baseScope`, `avatarBaseIds`, `parameterBits`, `dependencies` or `manifest` without a new upload, validated like an upload. A new `manifest` may name the prefabs in `contents.prefabs`; fields left out keep their value. 409 for a published version or a label another variant of the release uses. |
| `DELETE /avatar-assets/creator/assets/:assetId/versions/:versionId/variants/:variantId` | required | Delete a variant. |
| `POST /avatar-assets/creator/assets/:assetId/versions/:versionId/publish` | required | Body `{ "rightsConfirmed": true, "publishListing": false, "variantIds": [ … ], "parts": { … } }`: the draft's other variants are deleted first (409 for an unknown id). Refused without the rights confirmation or a ready variant. `parts` is optional; see [Customizable parts](#customizable-parts). |
| `POST /avatar-assets/creator/assets/:assetId/versions/:versionId/withdraw` | required | Take a published release out of the gallery. |
| `GET /avatar-assets/:assetId/parts` | optional | The asset's customizable parts and their variant counts. |
| `GET /avatar-assets/:assetId/parts/:part/variants?query=&language=&sort=popular\|new&cursor=&limit=` | optional | A part's published variants, the creator's first. |
| `POST /avatar-assets/:assetId/parts/:part/variants` | required | Post a variant (multipart `variantFile` + `metadata`). |
| `GET /avatar-assets/part-variants/:variantId` | optional | One variant. |
| `GET /avatar-assets/part-variants/:variantId/download` | required | The variant's zip. Header `X-Orbiters-Variant-Sha256`. |
| `DELETE /avatar-assets/part-variants/:variantId` | required | Withdraw (author) or remove (asset creator, staff). |
| `/admin/known-vpm` (`GET`, `POST`, `PUT /:id`, `DELETE /:id`, `POST /:id/refresh`, `PUT /packages/:id`) | admin | Known VPM administration. |

Every creator route checks creator-tools access, and version routes refuse a version of another asset than the one
in the path. Images uploaded for an asset (thumbnail and pictures) are stored re-encoded, upright, without EXIF, GPS,
XMP or ICC metadata.

### Access and purchases

Access comes from `canUserAccessAsset`: the creator, owned licenses, supporter tiers,
Discord roles and testers. Tier, role and tester access is reported as `included` with a
label, never as a purchase. Free assets are available to signed-in users; testers of a
free asset get their beta or alpha scope.

A purchase is recognised when a sale in the creator's mirrored sales matches the
buyer's account email, Gumroad emails or linked Jinxxy account, and is not refunded.
The store webhook redeems pending purchases immediately; otherwise status checks
refresh the creator's sales at most every two minutes, and a background check runs for
pending purchases. A refund revokes access granted this way.

### Customizable parts

The creator-facing rules (the `<Prefab>.parts.json` file, the three kinds, variant contents and limits) are in
[Customizable parts and variants](../how-to/myavatar-customizable-parts.md). The server side:

- **Publishing.** `parts` in the publish body is `{ "file": "Assets/…/N4N0.parts.json", "definition": { …the file as
  written… }, "strings": { "<strings part key>": { "<text key>": "<text>" | { "text": "<text>", "max": 24 } } } }`.
  `services/avatarAssets/partsDefinition.js` checks it (unknown fields refused at every level, at most 512 KB) and
  requires every package the release keeps to contain `file` and every JSON file the definition names (strings files,
  base variant files; resolved like Toolkit's `ItemSettings.AssetPath`), using `contents.jsonFiles`, the JSON files
  under `Assets/` an upload records (at most 1000). The release stores `{ schema: 1, file, parts }`, each strings part
  with `texts` (`{ key: { text, max } }`, `max` defaulting to twice the text's length). Without `parts`, a release has
  none. A member's parts are those of the newest published release in a scope they reach (`public` without access).
- **`GET …/:assetId/parts`** → `{ assetId, release: { id, version } | null, parts: [{ key, label, description, kind,
  renderer, base: [{ name, file, language? }], variantCount, …kind fields }] }`: values parts add `fields` and `targets`,
  model parts `slots`, `blendshapes`, `maxTriangles`, `maxTextureSize`, `maxRadius`, `shaders`, strings parts
  `strings` and `texts`. 404 when the caller cannot see the asset.
- **A variant** answers `{ id, assetId, part, kind, name, description, language, official, author: { id, username,
  trusted, avatarUrl } | null, thumbnail (absolute PNG URL), downloads, sizeBytes, sha256, files: [{ name, bytes, type,
  width?, height? }], status, createdAt, updatedAt, mine, canRemove }`.
- **Lists** answer `{ part, kind, sort, variants, nextCursor }`, official first, then by downloads (`popular`, default)
  or creation (`new`), then newest id; `limit` 1 to 60 (30); `query` searches name, description and author; `language`
  matches the tag and its subtags (`pt` finds `pt-BR`); `cursor` is the previous answer's `nextCursor` (400 when it is
  not one). Only `published` variants of the part's current kind are listed.
- **Posting** needs download access to the asset (403 otherwise) and runs that check before the body is read. The zip
  is at most 16 MB (413) and checked by `partVariantCheck.js` (zip structure in `variantZip.js`, pictures and FBX in
  `variantFiles.js`); a refusal is 400 with the rule in `error`. `metadata.official: true` is for the asset's creator
  only (403 otherwise): an official post replaces the creator's official variant of the same name (200, same id), or
  answers 200 with it unchanged when the bytes are the same; any other post answers 201. 409 for bytes already
  published in the part, or a member's variant named like one of the creator's. 30 posts per member per hour.
- **Downloads** need download access to the asset; each counts once, except the author's own. **Delete** answers
  `{ id, status }`: `withdrawn` for the author, `removed` (with `removedById`) for the asset's creator or staff; 403
  for anyone else, 409 when it is no longer published. The zip and thumbnail leave storage then, and with the asset.

## Unity installation contract

My Avatar records each installation in `Library/OrbitersMyAvatar/gallery-jobs.json`
and resumes it after a reload, crash or reopening the project. Stages run in order:

| Stage | Done when |
| --- | --- |
| `queued` | Platform and the 256-bit parameter budget are checked; over budget, the user decides. |
| `download` | The package is in `Library`, outside `Assets`, and matches `X-Orbiters-Package-Sha256`. |
| `validate` | The archive is safe, holds the declared prefabs and, when it has code from an untrusted creator, the user accepted. |
| `dependencies` | The VPM plan the user accepted is applied. |
| `preview` | The files the import would replace are listed and the user accepted them. |
| `import` | Unity finished importing. |
| `attach` | Each declared prefab is attached once, with its receipt. |
| `verify` | The avatar is checked again; only then is the job `complete`. |

A job can also end `failed` (with **Retry**) or `cancelled`.

Retrying never attaches a second copy: attachments are matched by their receipt. After
any interruption the avatar is revalidated before a stage is considered done. Unity's
importer cannot be interrupted, so cancelling during `import` waits for it.

The receipt on `OrbitersAttachment.gallery` stores `assetId`, `releaseId`, `variantId`,
`assetName`, `version`, `setup`, `sha256`, `creatorName`, `installId` and the install time.
It drives the Installed, Update available and Remove states. Imported files are listed
in `Library/OrbitersMyAvatar/gallery-ledger.json` with their hashes, so Cleanup can tell
modified and pre-existing files apart. Cleanup quarantines files under
`Library/OrbitersMyAvatar/Gallery/Quarantine`.

## MCP tool

`myavatar_gallery` (My Avatar's `Orbiters.MyAvatar.MCP.Editor` assembly, compiled when
MCP for Unity 9.7.1 or later is installed) uses `GalleryPublisher`, the service behind the
Publish to the gallery window. Actions: `inspect`, `configure` (merges into the shared
`GalleryCreatorDraft`; prefabs and setup prefabs by path; `reset`), `list_assets`,
`build`, `test`, `preview_publish` / `confirm_publish`, `preview_withdraw` /
`confirm_withdraw` and `status` for pending jobs. `configure` cannot set the rights
confirmation or server ids; `confirm_publish` sets the rights only with the code from a
preview of an unchanged draft, valid 15 minutes. A script reload ends running jobs;
publishing resumes where it stopped because uploaded variants are recorded in the draft.

Shared pieces live in Orbiters Toolkit: `OrbitersTransfer` (downloads and uploads),
`SafeArchive`, `UnityPackageFiles`, `UnityPackagePreview`, `ContentTrust`,
`VersionRecord`, `VersionTimeline`, `BaseFingerprint` and `VpmDependencyPlan`.
