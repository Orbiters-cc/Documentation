---
title: API Reference
section: Reference
order: 70
audience: dev
stage: stable
---

# API Reference

Orbiters serves REST endpoints directly from the API host root. Use `https://api.orbiters.cc/<endpoint>` in production and the configured `REACT_APP_BACKEND_URL` locally.

## Public Or Optional Auth

- `GET /documentation`
- `GET /documentation/:slug`
- `GET /blog-posts`
- `GET /blog-posts/:id`
- `GET /assets`
- `GET /assets/:id`
- `POST /bugs`
- `GET /verify/settings`
- `GET /push/public-key`
- selected `mcb` and `unity-wizard` read routes

Optional auth means the endpoint can return richer data when a valid JWT is present.

## Auth

- `GET /auth/discord`
- `GET /auth/discord/callback`
- `GET /auth/me`
- `POST /auth/refresh`
- `POST /auth/logout`

OAuth login issues a short-lived JWT and a refresh token stored in an HTTP-only cookie.

## User And Asset Access

- `/users`
- `/assets`
- `/files`
- `/keywords`
- `/supporter`
- `/mcb`
- `/unity-wizard`

User-facing access checks should go through shared services. Do not duplicate access rules inside a route.

## Creator

- `/creator`
- `/creator/integrations`
- `/creator/appeals`

Creator routes require authentication and creator ownership checks where relevant.

## Admin

- `/admin/users`
- `/admin/assets`
- `/admin/avatar-bases`
- `/admin/user-assets`
- `/admin/roles`
- `/admin/features`
- `/admin/verification`
- `/admin/appeals`
- `/admin/appeal-rules`
- `/admin/bugs`
- `/admin/ai`
- `/admin/deployment`
- `/admin/developer` when developer redirections are enabled

Admin routes use JWT auth and feature/rank gates depending on the area.

## Webhooks

- `POST /store-webhooks/:provider/:secret`

Store webhook routes receive provider events. The `secret` segment identifies the store integration. Provider modules validate signatures and parse provider-specific payloads.

