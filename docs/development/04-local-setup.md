---
title: Local Setup
section: Development
order: 63
audience: dev
stage: stable
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

