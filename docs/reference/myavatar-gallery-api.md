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
lastVerified: 2026-10-05
relations: orbiters.tools.myavatar-asset-gallery, orbiters.myavatar.publish-to-gallery, orbiters.operations.known-vpm
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
| `AvatarAssetVersions` | A release of an asset | `assetId`, `version` (unique per asset), `title`, `changelog`, `scope` (`public`, `beta`, `alpha`), `status` (`draft`, `published`, `withdrawn`), `publishedAt`, `rightsConfirmedAt`, `rightsConfirmedById` |
| `AvatarAssetVariants` | A downloadable package of a release | `versionId`, `label` (unique per release), `platforms` (`pc`, `android`, `ios`), `baseScope` (`any`, `bases`), `avatarBaseIds`, `fileId`, `sizeBytes`, `sha256`, `dependencies`, `manifest`, `contents`, `parameterBits`, `containsCode` |
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
| `PUT /avatar-assets/creator/assets/:assetId` | required | Edit an asset. |
| `PUT /avatar-assets/creator/preferred-store` | required | The creator's default preferred store. |
| `POST /avatar-assets/creator/assets/:assetId/versions` | required | Create a draft release. |
| `PUT`, `DELETE /avatar-assets/creator/versions/:versionId` | required | Edit or delete a draft release. |
| `POST /avatar-assets/creator/versions/:versionId/variants` | required | Upload a variant (multipart `metadata` + `packageFile`). |
| `DELETE /avatar-assets/creator/variants/:variantId` | required | Delete a variant. |
| `POST /avatar-assets/creator/versions/:versionId/publish` | required | Body `{ "rightsConfirmed": true, "publishListing": false }`; refused without the rights confirmation or a ready variant. |
| `POST /avatar-assets/creator/versions/:versionId/withdraw` | required | Take a published release out of the gallery. |
| `/admin/known-vpm` (`GET`, `POST`, `PUT /:id`, `DELETE /:id`, `POST /:id/refresh`, `PUT /packages/:id`) | admin | Known VPM administration. |

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
