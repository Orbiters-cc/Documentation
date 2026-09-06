---
title: Local Setup
section: Development
order: 63
audience: dev
stage: stable
id: orbiters.development.local-setup
domain: website
type: how-to
owner: orbiters-engineering
lastVerified: 2026-07-12
---

# Local Setup

Orbiters can run locally or through Docker. Do not assume another developer has the same process already running.

## Install

Use Node.js 22.12.0 or newer. Mermaid rendering also requires the Puppeteer browser described in [Documentation diagrams](/documentation/orbiters.reference.documentation-diagrams).

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Backend

Run backend checks on an alternate port:

```bash
cd backend
FAIL_FAST=true PORT=4200 npm run dev:failfast
```

Use `EXIT_AFTER_DATABASE_INIT=true` when you only need schema startup validation.

## Frontend

The frontend reads `REACT_APP_BACKEND_URL`. Make sure it points to the backend environment you are testing.

```bash
cd frontend
npm run start
```

## Docker

Development:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

The development override builds the frontend's `development` stage, bind-mounts
source, and keeps `/usr/src/app/node_modules` in an anonymous container volume. This
prevents the host mount from hiding Linux dependencies. File watching uses Webpack
polling on Windows. Do not replace internal React Router links with document `href`
navigation: a full request downloads and recompiles the development bundle and makes
otherwise-fast local pages appear slow.

Production-shaped local run:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

The backend container mounts `./Documentation` as read-only. Initialize or update the documentation repo before expecting `/documentation` to show pages.

## When PostgreSQL refuses the connection

`SequelizeConnectionRefusedError` means the database endpoint could not be reached.
"Development database connection configured" only confirms that settings were loaded.
For a backend running directly on Windows, the database is normally `localhost:5433`;
inside Compose, it is `postgres-dev:5432`.

Check `docker info`, then `docker ps -a` and the `postgres-dev` logs. Start the existing
database container with `docker start postgres-dev`; preserve its volume and database
major version. The Compose configuration restarts PostgreSQL after the Docker engine
returns and waits for database readiness before starting a containerized backend.

If Docker Desktop itself fails with `com.docker.build: exit status 1`, inspect its
logs and check for an orphaned build-service process before considering an update or
reinstall. A stale Desktop helper can prevent the engine from starting. Do not use
factory reset or unregister its WSL data storage to resolve an application connection
error: those operations can destroy the database. After Docker recovers, restart the
backend with Node.js 22.12 or newer.

## Port Conflicts

Do not kill processes blindly. First check whether the port belongs to the main development environment.

Windows:

```powershell
netstat -ano | findstr :4200
```

Linux or macOS:

```bash
lsof -i :4200
```
