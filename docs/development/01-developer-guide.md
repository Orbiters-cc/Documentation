---
title: Developer Guide
section: Development
order: 60
audience: dev
stage: stable
---

# Developer Guide

## Repository Layout

- `backend`: Node.js and Express API.
- `frontend`: React app using HeroUI and Redux Toolkit.
- `Documentation`: Markdown source for website and ecosystem documentation.
- `webhook`: deployment helper service.
- `scripts`: deployment, backup, Caddy, and local utility scripts.
- `Caddyfile.*`: reverse proxy templates.

Backend endpoints are mounted directly under `https://api.orbiters.cc/<endpoint>` without an extra `/api` prefix.

## Backend Startup

The backend initializes Sequelize models at startup. Model changes must follow the Postgres alter rules in the main repo `AGENTS.md`.

Run schema preflight twice when models change:

```bash
cd backend
FAIL_FAST=true PORT=4200 EXIT_AFTER_DATABASE_INIT=true npm run dev:failfast
FAIL_FAST=true PORT=4200 EXIT_AFTER_DATABASE_INIT=true npm run dev:failfast
```

Windows PowerShell:

```powershell
$env:FAIL_FAST='true'; $env:PORT='4200'; $env:EXIT_AFTER_DATABASE_INIT='true'; npm run dev:failfast
```

Never use ports `4000`, `4100`, `3000`, or `3100` for backend testing. Those may already belong to a developer environment.

## API Base Paths

The frontend uses `REACT_APP_BACKEND_URL` and calls direct paths such as `/documentation`, `/assets`, and `/creator`. Do not add an extra `/api` prefix.

## Service Boundaries

- Store provider logic belongs under `backend/src/services/store/providers`.
- Asset access decisions belong in `accessPolicyService`.
- Discord role writes belong in `outboxService`.
- API credentials are resolved through `apiCredentialService`.
- Documentation reading and filtering belongs in `documentationService`.

## Documentation

Docs live in the root `Documentation` repository under `docs/`. The backend accepts `DOCUMENTATION_ROOT` for container and special local paths, but the default local path expects `Documentation/docs` beside `backend`.

