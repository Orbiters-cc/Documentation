---
title: Deployment and Backups
section: Operations
order: 53
audience: admin, dev
stage: stable
id: orbiters.operations.deployment-and-backups
domain: operations
type: runbook
owner: orbiters-operations
lastVerified: 2026-10-20
---

# Deployment and Backups

Validate configuration and revision, preserve backups, then inspect startup.


<alpha>

The privacy release requires a dedicated production credential key before preflight.
Preserve the newest privacy deletion ledger independently when restoring older data.
See [Privacy and Credential Security Architecture](/documentation/orbiters.reference.privacy-security)
for the environment secret, migration and restore procedure.

</alpha>

Orbiters runs through Docker Compose, with Caddy routing traffic to frontend and backend services. Production deploys and backups are coordinated by GitHub Actions and scripts in the main repository.

The former Gitea experiment and its Docker-socket webhook deployers are retired.
They are absent from Compose; `git.orbiters.cc` returns HTTP 410. Preserved legacy
repository data is not a service dependency and must not be reactivated by deployment.
Production Caddy administration listens only inside the Caddy container; use the
documented `docker exec` reload path. The development administration port is published
only on the host loopback interface.

<alpha>

The deploy script also appends versioned deterministic evidence for changed paths,
documentation impact, backup checksum/upload, both schema preflight boots, images,
synthetic checks, queue state, artifacts, and terminal outcome. See **Structured
Deployment Reports** for interpretation and incident use.

Image IDs in a completed deployment report come from the replacement containers,
after recreation. Match those immutable IDs with `docker inspect` when checking
which build is actually serving traffic; a mutable image tag alone is insufficient.

Backups exclude regenerable `.cache` directories, including rendered documentation
diagrams. Those files may belong to the container user and are recreated on demand.
Uploads, the privacy deletion ledger and credential key files remain recovery data;
permission failures on those files must still stop the backup.
Deployment creates the privacy ledger as a private file owned by the host backup
user before the container starts writing to it. Repeated preparation keeps existing
records intact. If an older ledger belongs to another user, preserve it and repair
ownership; never delete it to make a backup succeed.

</alpha>

## Caddy Config

Tracked Caddy templates:

- `Caddyfile.dev`
- `Caddyfile.prod`
- `Caddyfile.maintenance`

Each template ends with a `*.orbiters.cc` site for creator addresses and the presentation page; it needs a
wildcard DNS record, see [Creator Addresses and Wildcard DNS](/documentation/orbiters.operations.creator-addresses).

The active `Caddyfile` is machine-specific and ignored by git. Activate a template with:

```bash
scripts/caddy/activate-config.sh prod --reload
```

On Windows dev:

```powershell
.\scripts\caddy\activate-config.ps1 dev -Reload
```

## Releasing from a workstation

The usual way to release is `npm run release` from the repository root, on the `dev`
branch with a clean tree:

```bash
npm run release -- --docs no --reason "Why documented behavior is unchanged"
```

Use `--docs yes --reason "Pages updated: ..."` when the release changes documented
behavior; it then requires the Documentation gitlink to change. The command:

1. Reads the deployed commit from the host and decides, with `scripts/deploy/release-plan.sh`'s
   patterns, which parts changed.
2. Runs the former CI checks for those parts side by side, typically in about 75 seconds:
   backend tests against disposable databases in the local `postgres-dev` container, the two
   schema boots and the account-lock check; frontend translations, tests and the production
   bundle; deploy script tests; Pi agent tests; documentation validation. Nothing is pushed
   when a check fails; each failure prints the end of its log.
3. Pushes `dev` and fast-forwards `main` on GitHub, and pushes the commit to the host's
   repository over SSH (the host cannot read the private GitHub repository on its own).
4. Uploads the deploy scripts and only the frontend bundle files the host does not already
   have. The bundle is built with the host's public `REACT_APP_*` values; the frontend's
   other settings never leave the host. Production bundles carry no source maps, whether
   built on the workstation or on the host.
5. Runs `release-remote.sh` on the host (below) and, when `agents/` changed, reinstalls the
   Pi agent at the same time.

`--full` selects every step, `--server-build` builds the frontend on the host instead,
`--dry-run` prints the plan, and `--skip-checks` is for emergencies only. `--checks-only`
runs the checks on the `dev` commit and stops there: nothing is pushed or released, and
uncommitted files elsewhere in the checkout do not matter (the checks run on an export of
the commit). `npm run release -- --rollback` runs the rollback below. The command needs the `orbiters` and `pi` SSH
aliases, Docker with the `postgres-dev` container, and `uvx` for the Pi agent tests.

## Production Deploy Flow

The manual **Deploy production** workflow is the fallback when no workstation is
available; it runs the same host steps. It uploads the selected release's `scripts/deploy`
folder to a temporary directory on the host and runs `release-remote.sh` from it, so a
release always runs its own deploy scripts rather than the older checkout's copies. The
script holds the deployment lock before changing anything.

A release only does the work its changes need. `release-plan.sh` compares the target
commit with the last release that completed (the commit in `backend/deployment-status.json`):

| Changed files | Extra work |
| --- | --- |
| Models, migrations, `config/database`, `schemaTransitionService`, `dbDedupeIndexes`, backend `package.json` or lockfile, Compose files, `.sql` | Full encrypted backup uploaded to R2, preflight on a clone of the production database, index dedupe |
| Anything under `backend/` | Backend image rebuild (the image holds the code; unchanged dependency layers come from the cache) |
| Anything under `frontend/`, Compose files | Frontend image rebuild |

An unknown previous release, or the workflow's **full_release** option, selects
everything. The steps are:

1. Fetch the target commit and decide the plan.
2. Back up: a full encrypted archive uploaded to R2 when the schema may change;
   otherwise an encrypted database snapshot kept on the host in
   `backups/pre-deploy-db` (the newest three are kept; the nightly backup still goes off-site).
3. Check out the release and install or verify the production credential key. The site
   stays up: the backend runs the code baked into its image, and only runtime data is
   mounted from the checkout (`backend/uploads`, `backend/privacy-state`, `backend/.cache`,
   the deployment status and event files, the backup event file, and the env files read at runtime).
4. Tag the running images as `:previous` and keep their deployment status in
   `.deploy-state/previous-status.json`, for rollback.
5. When the schema may change: boot the new backend image twice against a clone of the
   production database, using the running PostgreSQL image.
6. Build the images whose inputs changed. Cached layers are reused, so a code-only
   backend build takes seconds. An uploaded frontend bundle from this exact commit is
   moved to `frontend/prebuilt` and copied into the image (`FRONTEND_BUNDLE=prebuilt`);
   otherwise the frontend is built on the host. An unchanged frontend keeps its image and
   keeps reporting the commit it was built from.
7. Switch Caddy to maintenance, run the index dedupe when the schema may change, and
   recreate the frontend and backend containers.
8. Wait for `/readyz`, restore the production Caddy config, run the public checks and
   write the deployment status and event. The event's `plan` records which parts ran.
9. Release disk space: untagged images, a leftover `node_modules` volume from the older
   bind-mounted layout, and the least recently used build cache above 12 GB (or all of it
   when less than 8 GB of disk is free). A smaller cap evicts the backend's dependency
   layers and makes the next backend build reinstall them. Named rollback and recovery
   images are never removed.

Maintenance therefore covers only the container swap and backend start, usually about
15 seconds. A failure before the swap leaves the running release online; the checkout
may already show the new commit, which does not affect the running containers.

### Rolling back

On the production host, `scripts/deploy/rollback-prod.sh` puts the `:previous` images and
deployment status back in service behind maintenance, keeps the replaced images as
`:rolled-back`, and appends a `rolled_back` deployment event. The next release compares
against the restored commit, so it rebuilds whatever changed since then. The database is
not rolled back: when the newer release changed the schema, check the recovery procedure
first, since older code may not run against the newer schema.

The documentation impact reason can contain normal prose, quotes and line breaks. It is
validated, with the other arguments, before the release touches the host.

The host remembers the backup recipient the workflow passes (`.deploy-state/backup-age-recipient`),
so a release started over SSH from a trusted machine can encrypt backups without it.

When a full archive is uploaded, R2 must confirm the object before the local copy is
released; an unverified archive stays on the host and stops the deployment. Before
creating a new archive, the release runs the same verification against older local
archives. If disk pressure interrupted an archive, encryption leaves a `.partial` file
rather than publishing the final archive name, and the next verified cleanup removes it.
After a failed run proves an older release's incomplete final filename never uploaded,
pass its basename through the workflow's `discard_incomplete_backup` input. The workflow
rejects paths and unexpected names, and refuses to continue when the named file is absent.

CI runs only when started by hand and is a smoke run of about a minute: the sign-in and
error catalog tests, the proxy login check, the deploy script tests, the translation check
and the documentation validation. It is the only place that installs the backend's
dependencies on a clean machine. Every other check (all backend and frontend tests, the
database boots, the production bundle) runs on the workstation, with a release or
`npm run release -- --checks-only`.

If public health checks fail, maintenance is restored. A failure during or after the
container swap leaves maintenance active for investigation; never restart old code
against a migrated database without checking the recovery procedure.

`/healthz` checks process liveness only. `/readyz` returns 200 when the backend can
complete a database query within two seconds, or 503 when the database connection
pool is stalled or unavailable. Concurrent readiness probes share one outstanding
query, and responses expose no database details. Deployment checks `/readyz` both
locally and through the public API with a five-second network timeout. Neither
endpoint alone verifies external providers or a complete user journey.

Application deployment recreates only the frontend and backend, without restarting
PostgreSQL or unrelated services. PostgreSQL and production application containers
have restart policies; normal Compose startup waits for PostgreSQL's health check,
which uses the configured database name as well as its user.

### After a Docker daemon crash

Production containers (PostgreSQL, backend, frontend, Caddy, the Cloudflare tunnel and
mail) use `restart: always`. With `unless-stopped`, Docker 29 leaves every container
stopped when its daemon crashes and systemd restarts it: on 2026-10-15 a BuildKit panic
(triggered by `docker buildx history ls`, which must not be run on the host) kept the
whole site down until the containers were started by hand. A daemon restart starts all
containers at once rather than in Compose order; the backend retries the database for
about 45 seconds and then exits with an error, so Docker starts it again until
PostgreSQL accepts connections. `always` also restarts a container that was stopped on
purpose, such as the backend during an index dedupe, once the daemon restarts.

If containers are ever found stopped after a daemon restart, start PostgreSQL first,
wait for `pg_isready`, then the rest:

```bash
docker start postgres-prod
docker exec postgres-prod pg_isready
docker start backend-prod frontend-prod caddy cloudflared mailserver-prod
```

Enabling Docker's live restore on the host (`"live-restore": true` in
`/etc/docker/daemon.json`, then `sudo systemctl reload docker`) goes further: containers
keep running while the daemon crashes or restarts, including for Docker upgrades.

## Before approving a release

Production HTTPS ends at Cloudflare. The tunnel connects to Caddy over the private
Docker network; Caddy and Express must both trust that proxy path so the original
HTTPS scheme reaches the session middleware. Keep `Secure`, `HttpOnly` and
`SameSite=Lax` on the OAuth state cookie. If both Discord and Telegram immediately
report an expired login, check that each authorization redirect sets that cookie
and that a callback from the same browser accepts its state. A healthy `/healthz`
response alone does not validate login. The release checks exercise both state flows
through the production Caddy configuration with an isolated provider fixture whenever
Caddy, the server entry point, authentication routes or middleware change.

Configure `SMTP_PASSWORD` explicitly; email is disabled when it is missing and
Orbiters does not use a built-in mail password. Removing credentials from the
current Git tree does not revoke values in earlier commits. Rotate any still-active
values with their consumers, keep replacements in private runtime configuration,
and verify database and SMTP authentication without sending test messages.
Rotating both JWT signing secrets requires users to sign in again. The separate
`API_CREDENTIAL_ENCRYPTION_KEY` must remain available to decrypt stored connections.

Verify a fresh backup can be decrypted and its database dump restored in an isolated
database. Keep the age private key outside the server as well as in protected recovery
storage. The backup key is separate from `API_CREDENTIAL_ENCRYPTION_KEY`.

The deployment host needs Node.js on its non-interactive SSH path. The scripts also
look in `~/.local/bin`. Release checks and CI use a disposable encryption key with an
isolated database; production credentials must never be supplied to tests.

Check the **Backup production** workflow's last successful run, not just whether
the schedule exists. A rejected Tailscale login prevents the runner from reaching
the backup command. Review credential validity and authentication type, repair the
connection, then run and verify a manual backup before relying on the schedule again.

## Check backups in the admin

**Admin → System & operations → Backups** shows the production database size, the
nightly backups and the backups taken before deployments, newest first, with their
size and whether R2 holds an off-site copy. It warns when no nightly backup finished in
the last 26 hours (the workflow starts at 03:17 UTC) and links to the **Backup
production** workflow runs. Each finished archive is recorded by
`scripts/deploy/create-prod-backup.sh` as one line in `backend/backup-events.jsonl`,
mounted read-only into the backend; pre-deploy backups also come from the deployment
events. The development database dump tool appears only where developer redirections
are enabled (`ENABLE_DEV_REDIRECTIONS=true`). **Storage** (R2 and local usage, delivery
mode, sync and health checks) is available in every environment.

If the nightly run is refused with `orbiters-deploy-gate: refused: unreviewed stdin
script`, a workflow's `sh -s` script changed without regenerating the deploy gate's
allowlist: see [Remote diagnosis](/documentation/orbiters.operations.remote-diagnosis).

## Local Backup

Create a development backup:

```bash
node scripts/orbiters-data.js backup --env dev --output backups
```

Create a production backup on the production host:

```bash
node scripts/orbiters-data.js backup --env prod --output backups/pre-deploy
```

Backups include code, database dumps, config, and uploaded files. They contain secrets when env files are included.
Existing backend credential-key files are included in the configuration snapshot.
Keep an independent protected copy of the production encryption key as well; never
replace a newer privacy deletion ledger with an older backup during recovery.

## Production Backup Encryption

Production backups should leave the production host only as encrypted artifacts.

Generate an age key pair on a trusted machine:

```sh
age-keygen -o orbiters-backups-age-key.txt
```

Store the private key offline or in a password manager. Put only the public recipient in the GitHub production environment:

```text
BACKUP_AGE_RECIPIENT=age1...
```

Decrypt a backup on a trusted machine:

```sh
age -d -i orbiters-backups-age-key.txt -o orbiters-prod.zip orbiters-prod.zip.age
```

Hydrate from a decrypted archive:

```sh
node scripts/orbiters-data.js hydrate --archive orbiters-prod.zip --env prod --force
```

<audience include="dev">

The production preflight runs backend database initialization with `EXIT_AFTER_DATABASE_INIT=true`, `SKIP_EXTERNAL_STARTUP=true`, `FAIL_FAST=true`, and `PORT=4200` against a cloned Postgres container. It should catch schema sync failures before touching the live database schema.

The backend image switches Debian package sources to HTTPS and retries transient
index downloads before Puppeteer installs Chrome dependencies. A package-signature
failure still stops preflight; never bypass signature validation.

</audience>
