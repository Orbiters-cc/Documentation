---
title: Creator features production release handoff
section: Development
order: 90
audience: dev, admin
stage: beta
id: orbiters.development.creator-release-handoff
domain: website
type: runbook
owner: orbiters-engineering
lastVerified: 2026-09-25
---

# Creator features production release handoff

Use this document when the owner asks an agent to execute the production release.
It describes prepared changes, not a completed deployment. The preparing agent
has not committed or pushed the application changes and has not deployed them.
The executing agent must preserve unrelated work and follow the repository's
AGENTS.md. Do not change product scope while releasing.

## Scope and starting state

Application: `H:\metaverse\ORBITERS\server`, GitHub `blackorbit1/Orbiters`,
branch `dev`, starting commit `1ca61e3`. Inspect the current checkout before doing
anything: this snapshot can become stale. The working tree contains the complete
implementation, including untracked files that must be included in the release.
Do not reset it, clean it, or check out another branch over it.

Release these together:

- Magazine blog posts, full-resolution spread uploads/viewer, larger magazine
  homepage covers and the updated article upload validation.
- Creator VPM listings, repository import/discovery, public JSON feeds, release
  webhooks, workflow dispatch, native frontend/Caddy routes and install links.
- Separate external ownership and destination Discord roles, per-scope access,
  bidirectional destination access, migration and privacy export changes.
- Extension 1.3.0, automatic website connection, role ID/name/color collection,
  per-role upload confirmations/retries and rounded popup surface.
- Admin role collection dialog, searchable role list with unnamed IDs, live
  refresh, manual naming and Open in Discord. Tools page labels and AGENTS rules.
- Upload path validation, rejection of damaged/active image content and removal
  of internal database error details from blog responses.

The earlier creator improvements already in the base commit should remain intact.
Review `git diff --stat`, the full diff, and `git ls-files --others --exclude-standard`.
Include the updated Documentation submodule pointer. Do not commit diagnostics,
credentials, runtime data, generated build output or dependency directories.

Separate repositories:

- Documentation is `https://github.com/Orbiters-cc/Documentation.git`. Its prepared
  documentation, including this handoff, is committed/pushed separately. Resolve
  its exact current SHA with `git -C Documentation rev-parse HEAD`.
- `H:\metaverse\ORBITERS\vpm test`, `blackorbit1/orbiters-vpm`, was already
  committed/pushed at `0cc5e8e` (guarded handover). Workflow run
  [36139193781](https://github.com/blackorbit1/orbiters-vpm/actions/runs/36139193781)
  succeeded before application deployment; that did not activate cutover.
  Reinspect its branch/status and workflow before using it.
- GitHub repository URLs cannot redirect to another website. Its README and About
  link point at Orbiters. GitHub Pages redirects only when the canonical feed
  passes the migration gate; the old JSON URL remains a mirror for existing VCC
  subscriptions. This retained subscription behavior was explicitly requested.

## Release evidence already available locally

Read `diagnostics/role-collector-backend.log`, `role-collector-frontend.log`,
`role-collector-build.log` and `role-collector-browser.log` in the application repo.
They are local evidence, not production acceptance. The backend suite passed
970 tests with 29 deliberate skips; frontend passed 121 suites / 353 tests.
The extension fixture runs a real extension in an isolated headless Edge profile,
with website/Discord/API fixtures. Provider calls and production writes are absent.

`diagnostics/monthly-vpm-upgrade.log` records the earlier isolated PostgreSQL
fresh/populated/partially migrated schema checks, with two boots each. The
throwaway database was removed afterwards. No new columns were added by the
latest role collector fix: Role.color already existed. Startup regression tests
exercise the real outbox initializer and HTTP /healthz with enabled and disabled
external startup, replacing provider dependencies and the database with fixtures.

Local tests used Node 24. Production and CI use Node 22; a green CI run on the exact
release SHA is required. Existing AtomicEditor source-map and bundle-size build
warnings are not new errors. Never describe a fixture as a real Discord, GitHub,
OAuth, VCC or production verification.

## 1. Freeze and validate the exact release

From the application checkout (PowerShell):

```powershell
git -c safe.directory=H:/metaverse/ORBITERS/server status --short --branch
git -c safe.directory=H:/metaverse/ORBITERS/server diff --check
git -c safe.directory=H:/metaverse/ORBITERS/server diff --stat
git -c safe.directory=H:/metaverse/ORBITERS/server ls-files --others --exclude-standard
git -c safe.directory=H:/metaverse/ORBITERS/server/Documentation -C Documentation status --short
```

Check the extension ZIP contains exactly the current nine source files and that
its manifest version is 1.3.0. Do not deploy a ZIP from an older build. Run:

```sh
cd backend
npm ci
npm test
node --test test/discordRoleExtension.test.js test/assetDiscordAccess.test.js test/blogImageSafety.test.js test/vpmMagazine.test.js test/vpmImport.test.js test/vpmStartup.test.js test/vpmFrontendFeed.test.js
cd ../frontend
npm ci
CI=true npm test -- --watchAll=false --runInBand
npm run build
node scripts/test-monthly-vpm.cjs
node scripts/test-role-extension.cjs
cd ../Documentation
node scripts/validate-docs.js
```

These shell examples assume Node 22 and a shell supporting POSIX environment
assignments; use `$env:CI='true'` in PowerShell. Browser checks accept
`PLAYWRIGHT_MODULE`; extension QA also accepts `BROWSER_EXECUTABLE`. Install browser
test dependencies only in an isolated test environment. Do not use the user's
normal browser profile. Local Windows Node 24 was at
`C:\Users\Enzo\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin`;
calling the system npm.cmd can select an older Node despite PATH changes.

If schema code changed since the recorded upgrade check, rerun
`backend/test/creatorToolsUpgrade.test.js` against a new disposable PostgreSQL
container with database `creator_tools_fixture`, loopback port >=50000,
`CREATOR_TOOLS_UPGRADE_TEST=true`, `ENV_COMMON=true`, and the matching POSTGRES_*
variables. Never point this test at developer or production data. Its subprocesses
use port 4239 and skip external startup; that gate does not replace HTTP startup.

Commit only reviewed release files with a lowercase imperative message. Once the
owner has instructed you to execute the release, push the release branch, create
or update its PR, and wait for CI on the exact SHA. Attach any PR to the Codex task.
Do not force-push. Resolve intervening upstream changes without discarding work,
then rerun affected validation. Merge using the project's normal protected-branch
flow. Record the resulting full release SHA and documentation SHA. Do not deploy
an uncommitted checkout or a moving branch name.

## 2. Backups and environment gate

Follow [Deployment and backups](../operations/04-deployment-and-backups.md) and
[Structured deployment reports](../operations/05-structured-deployment-reports.md).
Inspect the last successful Backup production run and the running production SHA.
Resolve the configured production host/user/path from workflow variables; defaults
are Tailnet host `orbiters`, user `blackorbit`, path `/home/blackorbit/Orbiters/server`.
Do not print environment files, OAuth tokens, encryption keys or webhook secrets.

Verify the backup encryption recipient, offline recovery key, upload destination,
production deployment SSH/Tailnet access, and API_CREDENTIAL_ENCRYPTION_KEY. Preserve
that credential key; rotating it breaks stored connections. A usable backup needs
its checksum, encrypted upload confirmation and a tested isolated restore.
Preserve the current privacy deletion ledger independently from historical backups.

Validate FRONTEND_URL/FRONT_URL and frontend API origin, GitHub OAuth callback and
repository permissions for the creator VPM connection. Webhook URLs must use the
production API origin. A Chrome Web Store ID is optional: keep the unpacked install
walkthrough until a real published extension ID is available. Do not invent one.

## 3. Deploy with the existing production workflow

The approved deploy workflow creates/uploads the encrypted backup, enters
maintenance, stops old workers, checks out the exact ref, installs the credential
key, performs two database boots on a clone, builds/recreates app containers,
checks readiness and writes structured release evidence. Do not bypass any gate.

```powershell
$releaseSha = gh api repos/blackorbit1/Orbiters/git/ref/heads/main --jq '.object.sha'
gh workflow run deploy-prod.yml --repo blackorbit1/Orbiters -f "ref=$releaseSha" -f documentation_impact=yes -f "documentation_impact_reason=Creator VPM, magazines, Discord access and extension collection; creator-vpm, publish-magazine, discord-asset-access and vpm-migration docs updated"
gh run list --repo blackorbit1/Orbiters --workflow deploy-prod.yml --limit 5
```

Before dispatch, confirm that SHA is the reviewed merge with green CI.
Identify the run you just started by timestamp/ref, then `gh run watch RUN_ID
--repo blackorbit1/Orbiters --exit-status`. Record its URL and full deployed SHA.
Read the deployment event for backup checksum/upload, both preflight boots,
container images, readiness and final Caddy mode. Stop on a failed gate; do not
retry a destructive step blindly or bring old workers up against a migrated DB.

Check public API `/readyz` and `/healthz`, the homepage, `/creator?tab=vpm`, `/tools`,
`/blog`, and `/admin?tab=discord-servers`. Confirm the served frontend and backend
metadata identify the release SHA. Do not treat /healthz alone as database readiness.

## 4. Bootstrap and cut over the Orbiters VPM listing

Capture the old feed BEFORE cutover and retain it as release evidence. On a trusted
release workstation download the current `source.json` from
`blackorbit1/orbiters-vpm` main and `https://blackorbit1.github.io/orbiters-vpm/index.json`.
Validate JSON and SHA-256 both files. The last observed feed had six packages and
28 versions; compare the freshly captured contents, not those historical counts.

Resolve the intended active Orbiters owner/admin account from the production
database and confirm its identity from the existing creator/GitHub setup. Never
assume a user ID. Copy the reviewed JSON files into the deployed backend container
and run from its `/usr/src/app` directory:

```sh
node src/scripts/importOrbitersVpm.js OWNER_ID /tmp/orbiters-source.json /tmp/orbiters-before.json
```

The CLI requires an active owner/admin, preserves source URLs/checksums, rejects
conflicting ownership or versions, and retains visibility choices on rerun. It
must run AFTER successful deployment of the schema. Record its imported count.
Do not run arbitrary package release workflows to populate the initial listing.

Fetch `https://orbiters.cc/vpm/orbiters/index.json` without authentication. Assert:

- HTTP 200 and JSON content type, never SPA HTML; listing ID `cc.orbiters.vpm`.
- Every package/version in the captured feed exists with the same manifest URL
  and zipSHA256. Compare the complete manifests and explain intentional metadata
  changes. No empty catalog or silently omitted package counts as successful.
- `/vpm/orbiters` displays the packages, its copy control works, and the install
  URL is `vcc://vpm/addRepo?url=` followed by the encoded canonical JSON URL.
- My Custom Base, ReFit and asset install buttons use their intended new listing.

Then run **Build Repo Listing** in `blackorbit1/orbiters-vpm`; resolve its actual
workflow filename with `gh workflow list --repo blackorbit1/orbiters-vpm`, dispatch
it and wait for success. Inspect its migration-gate output. Verify the Pages
landing redirects to `/vpm/orbiters`, and its index.json matches the canonical
feed. Keep the hourly mirror workflow and old release archives. The gate must
not be disabled to force a redirect.

Connect the owner's GitHub account in VPM. Confirm existing imported listing is
shown rather than duplicated. Configure each source's release webhook through
the UI; verify its signed ping/delivery without exposing the secret. A real Build
Release action may publish a release: use the owner's intended version and inputs,
or a clearly nonpublishing workflow. Do not create a dummy public release. Record
any live release/installation step that could not be exercised.

## 5. Acceptance checks on deployed integrations

Use the owner's authorized test identities/assets and avoid changing real customer
access as a test. UI automation requires the owner's screen-control permission;
read-only API/CLI evidence and isolated browser fixtures do not grant it.

- Extension: download the deployed ZIP, extract over the installed folder, reload
  it in chrome://extensions, and refresh existing Discord tabs to replace the old
  MAIN-world observer. Open the signed-in production Orbiters tab. Confirm the
  popup says production, not development. Open the reported server, then a member
  profile or server role settings. Confirm ID-only rows, collected names/colors,
  queued status and API-confirmed checks. The admin list updates without a reload
  and manual input is not erased. Open in Discord points to the selected guild.
  Connection to the site alone cannot enumerate all hidden Discord roles.
- Disconnect pauses collection. Reconnect resumes. Failed/unauthorized uploads
  show an error and no saved check. Names/colors never establish membership.
- Asset access: external ownership role grants the selected scope and destination
  role; manual destination roles grant access only with the bidirectional option.
  Never assign the external ownership role. Verify revocation/cleanup with test
  users while preserving purchased licenses and pre-existing manual roles.
- Magazine: upload a legitimate large image, publish only content approved by the
  owner, turn pages and zoom on mobile, and verify the homepage cover and clipping.
  Check existing blog post images still load. Invalid IDs, SVG or damaged image
  uploads fail with a useful 400 response, without leaking SQL details.
- VPM: test URL import variants and OAuth return, copy snippet, source refresh,
  hide/remove visibility in a test listing, and actual VCC installation in a
  disposable Unity project. Do not hide real Orbiters releases for a smoke test.

## 6. Failure and rollback

Keep maintenance active if migration, readiness or catalog validation fails. Save
the failing run URL, exact phase and sanitized logs. Pause new VPM release webhook
processing or builds before restoring older state; retain the last good public
catalog. Before any data restore, capture the failed state and current privacy
ledger and assess writes made since the backup. Database restore discards newer
writes and needs an explicit recovery decision from the owner.

For code-only rollback, verify schema compatibility first; otherwise use the
backed-up database with its matching code and credentials. Follow the recovery
procedure in Deployment and backups. The restore tool is
`node scripts/orbiters-data.js hydrate --archive VERIFIED_ARCHIVE --env prod --force`;
it is destructive and is NOT an automatic retry command. Never hydrate the
privacy ledger from an older backup. Recheck current erasure obligations before
reopening traffic. Do not run a blind `git reset --hard` or schema downgrade.

If VPM cutover has already happened, retain the Pages mirror's last canonical
snapshot during outages. Do not rebuild it from the old source after creators
have hidden/removed versions, which would resurrect them. Restore the canonical
endpoint, compare the mirror, then resume the workflow. A repository README link
is not an HTTP redirect and is not a rollback mechanism.

## Completion report required from the release agent

Return release/PR/CI/deployment URLs and exact SHAs, documentation SHA, backup
checksum and encrypted-upload/restore evidence, schema and HTTP readiness results,
VPM pre/post package/version comparison, Pages cutover status, extension version,
and real acceptance results. List fixture-only or untested provider steps plainly.
Do not say production release is complete if any required gate failed, the public
feed is empty, or the intended owner cannot see the imported listing.
