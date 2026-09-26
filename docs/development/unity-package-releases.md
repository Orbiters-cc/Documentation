---
title: Publish Unity package releases
section: Development
order: 90
audience: dev, admin
stage: stable
id: orbiters.development.unity-package-releases
domain: operations
type: how-to
owner: orbiters-engineering
lastVerified: 2026-09-26
---

# Publish Unity package releases

A change to the root `package.json` version starts **Build Release** when pushed
to the package repository's default branch. This publishes the package's existing
release artifacts and a Git tag named exactly after the version.

| Package | GitHub repository | Automatic release branch |
| --- | --- | --- |
| MCB | `Orbiters-cc/MyCustomBase` | `master` |
| ReFit | `Orbiters-cc/ReFit` | `master` |
| Unit Git | `Orbiters-cc/UnitGit` | `master` |
| Unity Package Manager | `Orbiters-cc/Unity-Package-Manager` | `main` |
| XRayGizmos | `Orbiters-cc/XRayGizmos` | `master` |

## Publish a new version

1. Finish the package changes and set a new, unused version in `package.json`.
2. Commit and push to the branch above, or merge a pull request into that branch.
3. Open **Actions > Build Release**. Check that `release-check`, `config`, and
   `build` all succeed, then inspect the tag and release assets under **Releases**.

The comparison uses the branch revision before the push and the final pushed
revision. A push containing several commits publishes the final version, including
when the version bump occurred before the last commit. A bump reverted within the
same push does not publish a release.

Other `package.json` edits can start the workflow, but the release jobs are skipped
when the version is unchanged. Pushes to other branches and tag pushes do not
start automatic releases. Pushing only the workflow configuration does not release
the current package version retroactively.

## Skips and retries

The `release-check` job writes its decision to the run summary. Automatic runs skip
versions that already have a tag and newly created branches without a previous
revision. A missing or unreadable comparison revision or invalid version fails the
check instead of guessing that a release should be published.

For an intentional manual release or retry, use **Actions > Build Release > Run
workflow** and select the intended branch. Manual runs bypass the version-change
and existing-tag checks and retain the existing release workflow behavior. If a
failure happened after tag creation, inspect that tag and the partial release
before retrying; use the same intended source revision. For a changed package,
choose a new version rather than reusing a published version.

Release runs share a concurrency group with cancellation of the running release
disabled. Wait for one release to finish before pushing another version: GitHub
concurrency permits one running and one pending run and may replace older pending
runs when more are queued.

## Repository configuration

GitHub Actions must be enabled, the repository variable `PACKAGE_NAME` must be set,
and repository policy must permit the existing actions and `contents: write` for
the build job. These settings were checked in all five repositories when this
workflow was introduced. The automatic trigger requires no additional secret or
personal access token.

Use a normal authenticated Git push or pull-request merge for version bumps.
Events caused by a workflow using its `GITHUB_TOKEN` generally do not start another
workflow; automation that commits version bumps needs an appropriate GitHub App
or personal access token if it is expected to trigger this release workflow.

The existing packaging and downstream listing workflows remain responsible for
their own outputs. A successful release does not by itself verify that a VPM feed
has refreshed or that installation succeeds in Creator Companion.

See [GitHub's workflow triggers](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
for branch and path filtering, and
[workflow concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)
for queue behavior.
