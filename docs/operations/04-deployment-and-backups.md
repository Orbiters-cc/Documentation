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
lastVerified: 2026-07-12
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

</alpha>

## Caddy Config

Tracked Caddy templates:

- `Caddyfile.dev`
- `Caddyfile.prod`
- `Caddyfile.maintenance`

The active `Caddyfile` is machine-specific and ignored by git. Activate a template with:

```bash
scripts/caddy/activate-config.sh prod --reload
```

On Windows dev:

```powershell
.\scripts\caddy\activate-config.ps1 dev -Reload
```

## Production Deploy Flow

The manual production workflow holds a deployment lock before changing the server
checkout. Because the backend source is bind-mounted, maintenance begins before
checkout; allow time for image builds and the database rehearsal within the window.

The documentation impact reason can contain normal prose, quotes and line breaks.
The workflow preserves it as one SSH argument and checks the transferred files
before entering maintenance. A missing-file or argument-count failure at this
stage leaves the running release online.

The manual production workflow:

1. Connects the GitHub runner to the Tailnet.
2. SSHes to the production host.
3. Creates and uploads an encrypted backup of the running release.
4. Switches Caddy to maintenance mode and stops the old backend workers.
5. Checks out the selected ref and installs the production credential key.
6. Runs two database initialization passes against a clone using the running PostgreSQL image.
7. Rebuilds and recreates frontend and backend containers.
8. Waits for `/healthz`.
9. Writes deployment status metadata.
10. Restores the production Caddy config.

If public health checks fail, maintenance is restored. A failure after checkout
leaves maintenance active for investigation; never restart old code against a
migrated database without checking the recovery procedure.

Application deployment recreates only the frontend and backend, without restarting
PostgreSQL or unrelated services. PostgreSQL and production application containers
have restart policies; normal Compose startup waits for PostgreSQL's health check,
which uses the configured database name as well as its user.

## Before approving a release

Verify a fresh backup can be decrypted and its database dump restored in an isolated
database. Keep the age private key outside the server as well as in protected recovery
storage. The backup key is separate from `API_CREDENTIAL_ENCRYPTION_KEY`.

The deployment host needs Node.js on its non-interactive SSH path. The scripts also
look in `~/.local/bin`. CI uses a disposable encryption key with its isolated database;
production credentials must never be supplied to pull-request tests.

Check the **Backup production** workflow's last successful run, not just whether
the schedule exists. A rejected Tailscale login prevents the runner from reaching
the backup command. Review credential validity and authentication type, repair the
connection, then run and verify a manual backup before relying on the schedule again.

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

</audience>
