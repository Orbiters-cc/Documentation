---
title: VPM migration runbook
section: Development
order: 89
audience: dev, admin
stage: beta
id: orbiters.development.vpm-migration
domain: website
type: runbook
owner: orbiters-engineering
lastVerified: 2026-09-25
---

# VPM migration runbook

The new API, creator interface and installation URLs must deploy together. The
GitHub Pages workflow has a safety gate and continues building the existing
catalog until the hosted feed is ready. Application deployment remains a separate
release step; a passing local test or GitHub Pages workflow does not establish it.

1. Back up the application database and deploy the reviewed backend, frontend and
   Caddy changes. Configure the normal frontend/API origins and credential
   encryption key. Verify `/readyz` and `/healthz`.
2. Download and review the current `source.json` from the Orbiters VPM repository
   and its published `index.json`. Resolve the intended owner's actual database ID.
3. From the deployed backend, run:

   ```sh
   node src/scripts/importOrbitersVpm.js OWNER_ID /reviewed/source.json /reviewed/index.json
   ```

   For production, prefer the guarded **Bootstrap Orbiters VPM production**
   workflow. Supply the exact deployed application SHA and both reviewed file
   hashes. It refuses a different checkout, requires database readiness, resolves
   exactly one active owner using a connected Creator VPM identity or the owner's
   existing persisted GitHub ID/login, imports through temporary container files,
   and compares every public package/version
   URL and checksum after the transaction. Its sanitized evidence output includes
   the deployed frontend/backend SHAs and latest structured deployment event.

   This creates `/vpm/orbiters`, preserves every published manifest, URL and
   checksum, and registers its repository/ZIP sources. Re-running it preserves
   visibility choices and rejects a conflicting owner or checksum. It does not
   contact providers or change GitHub repositories.
4. Compare the hosted `https://orbiters.cc/vpm/orbiters/index.json` with the old feed,
   validate the VPM metadata, and check public listing search and VCC install links.
5. Run **Build Repo Listing** in the existing GitHub VPM repository. The first
   handover requires the existing package versions, download URLs and checksums to
   match. Once ready, Pages redirects to `/vpm/orbiters` and the old JSON address
   mirrors the canonical feed. Its hourly workflow keeps old VCC subscriptions
   updated. During an Orbiters outage after handover, it retains the last canonical
   feed rather than resurrecting versions the creator hid or removed.
6. In the creator's VPM tab, authorize GitHub repository access and set up each
   release webhook. Verify a real release/build separately from fixture testing.

The GitHub repository URL itself cannot redirect externally; its README and
homepage point at Orbiters. Do not delete old release archives.

## Orbiters package release notifications

As of 2026-09-26, the canonical Orbiters listing has active GitHub `release`
webhooks for MyCustomBase, ReFit, UnitGit, Unity-Package-Manager, XRayGizmos and
Toolkit. Each repository uses its own source endpoint and signing secret,
configured through the VPM webhook service. Do not copy another source's URL or
secret. ReFit's existing configuration was retained when adding the other hooks.

A version-changing push runs the package's Build Release workflow. Publishing the
release notifies Orbiters, which queues the package import. Commits without a
release do not trigger this import. The package repository's separate GitHub Pages
listing workflow is not required for the canonical Orbiters feed to import a
GitHub release. Existing VCC subscriptions using the old mirrored listing can
still wait for its refresh interval and VCC's own cache refresh.

GitHub's initial webhook ping returning HTTP 200 confirms endpoint/signature
acceptance, not a completed package import. Check the source status and public
feed after a real release. Toolkit 0.2.0 was released before its webhook was
installed, so its initial import was queued separately.
## Discord access upgrade in the same release

Role rules now distinguish `roleId` (ownership proof) from `targetRoleId`
(destination). Existing import/both rules acquire their asset's associated role
as the target. Export-only rules and rules with no destination are archived for
cleanup; creators must recreate those with an explicit destination. Existing
licenses and delivery receipts are preserved. The migration handles missing and
partially added nullable columns and leaves existing non-null targets unchanged.

## Extension publication

The downloadable extension connects automatically from exact production/development
Orbiters origins using a scoped one-hour credential. Publish the packaged extension
in the Chrome Web Store, then set `REACT_APP_ROLE_EXTENSION_STORE_ID` to the real
store ID when building the frontend. Until publication, the UI provides complete
Load unpacked instructions. A local ZIP cannot trigger normal one-click Chrome
installation on Windows/macOS.

## Validation boundaries

Automated checks use isolated PostgreSQL databases, API fixtures and provider
stubs. Fresh, populated and partially applied upgrades boot twice; the real
outbox initializer is exercised through HTTP readiness with external startup
enabled and disabled. Browser checks cover the production build and a real
extension loaded into an isolated headless browser profile. Live OAuth consent,
GitHub workflow execution for a creator, Discord role assignment, and actual VCC
package installation still require their deployed integrations.
