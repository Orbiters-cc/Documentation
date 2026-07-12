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

Use Node.js 22 or newer.

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
