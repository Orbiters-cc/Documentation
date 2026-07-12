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

Orbiters runs through Docker Compose, with Caddy routing traffic to frontend and backend services. Production deploys and backups are coordinated by GitHub Actions and scripts in the main repository.

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

The manual production workflow:

1. Connects the GitHub runner to the Tailnet.
2. SSHes to the production host.
3. Checks out the selected ref on the production machine.
4. Creates and uploads a pre-deploy backup.
5. Runs a production-shaped backend preflight.
6. Switches Caddy to maintenance mode.
7. Rebuilds and recreates frontend and backend containers.
8. Waits for `/healthz`.
9. Writes deployment status metadata.
10. Restores the production Caddy config.

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
