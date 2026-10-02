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
lastVerified: 2026-10-01
---

# Publish and manage a VPM listing

This workflow requires the matching Orbiters VPM release. Open **Creator → Your
work → VPM** to manage public Unity package listings for Creator Companion.

## Import an existing VPM repository

Paste your repository under **Bring your existing VPM** and choose **Import
repository**. HTTPS links, `.git` links, SSH clone URLs such as
`git@github.com:artist/tools.git`, and `artist/tools` are accepted. Orbiters reads
its listing configuration and published catalog, preserves the package versions,
download URLs and checksums, and creates its hosted address. If no catalog has
been published, the repository's release ZIPs are imported in the background.
Both the VRChat single-package and package-listing templates are supported.

After **Connect GitHub**, Orbiters discovers public VPM repositories you can
manage and imports them automatically. **Find my VPM repositories** runs discovery
again. Importing the same repository again opens its existing listing; it does
not duplicate packages or reset hidden/removed versions. Repository permissions
still apply to builds and webhook setup.

The **Creator Companion listing URL** uses a copyable snippet. Copy the complete
JSON address into VCC, or choose **Add to Creator Companion**.

## Create a new listing

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
release ZIPs per source. A listing holds up to 3,000 versions and 6 MB of package
metadata. Each archive is limited to 128 MB and its manifest to
256 KB. A failed source refresh keeps its last good catalog and reports an error.

## Connect release webhooks and builds

**Connect GitHub** grants separate repository authorization for VPM management.
Ordinary GitHub identity linking does not retain a repository token. GitHub's
OAuth API requires the `repo` scope for workflow dispatch; Orbiters encrypts the
retained token. GitHub's short-lived access token is renewed automatically, and the
longer-lived renewal token is kept current in the background, so the connection
stays valid until you disconnect it or revoke the Orbiters app in GitHub.
If GitHub or the database is briefly unavailable during a renewal, the action
reports a temporary error to try again in a moment and the background renewal
retries on its next run; you are only asked to reconnect when GitHub rejects the
authorization.
**Disconnect GitHub builds** disables that authorization locally before
attempting remote revocation.

- Adding a GitHub source while GitHub is connected creates its Releases webhook
  automatically when you have GitHub administrator permission on the repository.
  The source card shows whether new releases update the listing automatically.
- **Set up webhook** creates or reconnects that webhook later, for example after
  you gain administrator permission. **Manual webhook setup** shows its URL and
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

### Hide a whole package

Versions are grouped by package under each source. Select the eye button next
to a package name to hide every version of that package, including versions that
later releases or refreshes add. The package disappears from the listing JSON and
from its public page, and moves to the collapsed **Hidden packages** group below
the sources. Open the group to select the eye button again and restore it; the
version choices you made before (hidden, removed or visible) come back unchanged.
You can still hide, remove or restore single versions while the package is
hidden. The MCB package in the official Orbiters listing cannot be hidden because
Orbiters tools read its releases from the public feed.

**Remove source** removes its versions from Orbiters and deletes the webhook
Orbiters created on GitHub. Delete a manually added webhook in GitHub repository
settings. You can add the source again intentionally.

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

`PUT /vpm/:id/packages/:name` with `{ "hidden": true | false }` stores the
package state in `VpmPackages` (`listingId`, `name`, `hiddenAt`; unique on
listing and name). Listing details return `hiddenPackages`. `publicFeed`
excludes hidden package names in SQL and again in `feed()`, so no version of a
hidden package reaches the public JSON. Hiding never edits `VpmVersion.visibility`.

See [VPM migration runbook](../development/vpm-migration.md) before changing the
official listing or GitHub Pages address.

</audience>

ZIP attachments without a root package manifest are skipped when refreshing
GitHub releases. A malformed package manifest stops that refresh and leaves the
last valid catalog available.
