---
title: Publish and manage a VPM listing
section: Creator Tools
order: 66
audience: creator, admin, dev
stage: beta
id: orbiters.how-to.creator-vpm
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-25
---

# Publish and manage a VPM listing

This workflow requires the matching Orbiters VPM release. Open **Creator → Your
work → VPM** to manage public Unity package listings for Creator Companion.

## Create your listing

1. Choose **New listing**, enter its name and a URL slug, then **Create listing**.
   The address is fixed after creation so installed repositories keep working.
2. Optionally fill in the author, repository ID, description, banner and information
   link under **Author and listing details**.
3. Add a public GitHub repository as `owner/repository`, or a public HTTPS package ZIP.
   You can also import the `githubRepos` and `packages[].releases` sources from an
   existing package-listing `source.json`.
4. Wait for the import, then open **Public listing**, copy its JSON URL, or choose
   **Add to Creator Companion**.

Each ZIP must contain `package.json` at its root with a valid package name and
semantic version. Unity/VPM metadata is preserved, including dependencies and
deliberate migration fields. Orbiters adds the public download URL and SHA-256 of
the exact archive. Public GitHub releases, including prereleases, are imported;
draft releases and private repositories are excluded.

One creator can manage ten listings, with up to 30 sources per listing and 1,000
release ZIPs per source. Each archive is limited to 128 MB and its manifest to
256 KB. A failed source refresh keeps its last good catalog and reports an error.

## Connect release webhooks and builds

**Connect GitHub** grants separate repository authorization for VPM management.
Ordinary GitHub identity linking does not retain a repository token. GitHub's
OAuth API requires the `repo` scope for workflow dispatch; Orbiters encrypts the
retained token. **Disconnect GitHub builds** disables that authorization locally
before attempting remote revocation.

- **Set up webhook** creates a Releases webhook for a repository where you have
  GitHub administrator permission. **Manual webhook setup** shows its URL and
  a one-time secret: add these in GitHub repository Settings → Webhooks, select
  `application/json`, keep SSL verification enabled, and select Releases.
- A release event queues a refresh. Signed delivery IDs are deduplicated and failed
  work retries through the existing background queue. Manual **Refresh releases**
  is also available.
- **Build Release** opens the repository's active workflows. Choose a workflow,
  branch/tag and its input values, then **Run build**. The selected workflow must
  declare `workflow_dispatch`. Follow **View build on GitHub** for logs and status.
  A successful build updates the listing when it publishes a release and the
  release webhook is connected.

## Control versions

**Hide** excludes a version from the public feed. **Remove** keeps a removal record
so a subsequent webhook or refresh cannot re-add it. **Restore** makes either kind
available again if its release still exists upstream. Removing/hiding a version
can stop projects with a pinned dependency from resolving it; installed files are
not deleted. A deleted upstream release becomes unavailable after a refresh.

**Remove source** removes its versions from Orbiters. Also delete its webhook in
GitHub repository settings. You can add the source again intentionally.

The public listing includes package search, dependencies, version downloads and
installation guidance. MCB, ReFit and the asset installation wizard use the
official Orbiters listing address after deployment.

<audience include="dev">

Management routes are under `/vpm` on the API; public JSON is
`/vpm/:slug/index.json`. The website serves the same path through Caddy or its
native frontend server. Source imports resolve and pin public DNS addresses on
every redirect, validate ZIP limits, and never extract files to disk. HMAC-SHA256
webhooks verify the raw request body and configured repository. A per-source
database lock serializes imports and source deletion; version publication is
transactional. Visibility tombstones survive refreshes.

See [VPM migration runbook](../development/vpm-migration.md) before changing the
official listing or GitHub Pages address.

</audience>
