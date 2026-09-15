---
title: Support Several Original Base Versions
section: How To
order: 89
audience: creator, dev
stage: alpha
id: orbiters.mcb.original-base-versions
domain: mcb
type: how-to
owner: orbiters-mcb
lastVerified: 2026-09-15
relations: orbiters.tools.mcb-operating-contract, orbiters.mcb.adaptive-delivery
---

# Support Several Original Base Versions

One custom asset can support several releases of its original avatar base. Each
custom release contains a separately encrypted payload for every selected
original. Users receive the payload matching the original files in their project.

**Release status:** implemented and tested locally on 15 September 2026. The MCB
package and backend changes have not been released or deployed. Publishing this
guide does not release the feature.

## Before you start

Use the original, unmodified FBX files for each base release. Each original version
needs a name or version number and a mapping for every target FBX used by the
custom asset. An asset with Body and Accessories targets needs both mappings for
every original version.

To extend a saved custom release, keep at least one of that release's supported
original FBX sets available locally. MCB uses it to reconstruct the saved custom
payload before encrypting it for the newly selected originals.

## Create an asset with several originals

1. Open **Create custom base** and choose the scene mode and target FBX files.
2. Set up the first original/default source and give it an **Original base version**
   name, such as `1.5`.
3. Select **Add original base version** for each additional release.
4. For each release, enter its **Name / version** and choose **Choose package**
   or **Choose FBX**, or drop the files onto its card. The input type is independent
   for each release. Each card shows its mapping progress and becomes **Ready**
   when its name and required file mappings are complete.
5. Check the original FBX selected for each target slot. MCB selects an exact
   filename match, or the sole file when there is only one target. Resolve any
   remaining choices before continuing.
6. Finish creating the custom asset.

Package selection extracts FBX entries into temporary storage; it does not import
the package into the scene. Verified original keys are retained locally under
`Assets/MCB/original-base-keys/`. They are not included in custom-version uploads.
Adding the same complete original file set twice is rejected.

## Choose support when publishing a custom release

Open **Create new version** and use **Supported original base versions** to choose
the originals for the release. The form restores the previous selection for this
asset; with no saved selection, every registered original starts selected.
**Select all** includes every registered original.

Build requires at least one selected original and all of its original keys.
MCB builds the custom content and encrypts it separately against each selected
original set. The saved build retains these variants for upload through the normal
**Upload version** flow. Changing the support selection changes the build inputs;
rebuild before uploading an edited form.

## Add support to an existing asset

1. Open the asset and select **Support new version**, beside **Edit**.
2. In **Original files**, name the first new original version, choose or drop its
   package or FBX files, and check the target mappings. Add another card for each
   additional original release.
3. Select **Continue** when the originals are ready. In **Custom versions**, leave
   **All versions** selected or toggle individual releases. Search filters the
   visible rows while preserving selections outside the filter; the count always
   shows the full selection.
4. Review the original and custom version counts in the fixed action bar, then
   select **Add support to … versions**.

The window downloads each selected saved release, verifies and decrypts its
payload using an available original, and uploads variants encrypted against the
new originals. It uses the saved release's geometry and options, so the current
scene does not replace historical content.

Expand **Use registered originals** in the first step to extend more custom
releases for an existing original. **Future versions only** in the second step
registers the new originals without changing saved custom releases.

The action bar stays visible while either list scrolls. In **Custom versions**,
search and selection controls also stay visible while the release list scrolls.
Missing names or file
mappings keep **Continue** disabled and show what is needed. **Back** preserves
the files and selections. The draft is retained across Unity reloads and reopening
the window within the same Editor session.

Progress identifies the release being processed. If processing fails, completed
releases keep their added support. Retry continues the remaining releases; the
server also recognizes support already saved for the same original identity.
If an original key is missing, import the matching original FBX through the window
and retry. Its content hash must match the original required by the saved release.

## What users receive

Discovery matches a complete original FBX set. Files from different original
releases cannot be combined to produce a compatible match. The available-version
list includes releases supporting that set, and download chooses its encrypted
package automatically.

The identity includes every target path and original hash, so two original
releases sharing one unchanged FBX remain distinct. Download folders, version-list
caches and persisted applied-version state also retain this identity. Two avatars
in one project can therefore use different originals of the same custom release.

<audience include="dev">

## Delivery and validation

Registered sets are SOURCE ModelFile rows grouped by a source-version key. A
custom release records its per-original files, package reference and adaptive
delivery metadata in `originalBaseVersions`. Requests send both the original hash
and `sourceKey`; both must identify the selected variant. The model endpoint keeps
its normal authentication and scope checks and authorizes mesh blobs only within
the selected variant.

Historical support stores additional packages without replacing the version's
existing outputs. Registration snapshots existing single-original releases before
adding source rows. Support uploads must preserve their saved output identities.
Native mesh backfills retain the codec representations available in the saved
delivery; FBX delta backfills reconstruct and verify the saved FBX before creating
a fresh XOR payload.

Coverage includes original-set normalization and matching, owner authorization,
transaction rollback and retry, isolated variant packages, authorized download
routing, XOR and native-codec roundtrips, and separate local identities. The Unity
deterministic health checks cover apply/reset and native delivery invariants.

</audience>
