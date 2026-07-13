---
title: API Reference
section: Reference
order: 70
audience: dev
stage: stable
id: orbiters.reference.api
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-07-13
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
- `GET /users/:id/profile` for a public profile, created assets, authored activity,
  provider links, profile comments, and `user.publicBoards`. Public Board previews
  contain only owner-owned public Boards, safe counts, and at most three
  `{ "title", "status" }` summaries inside each column. Publishing the Board makes
  this bounded projection visible for every placed item, including a private local
  Proposal or Trello mirror; body, URL, repository, number, metadata, visibility,
  and comments are omitted.
- `POST /users/:id/profile/comments` for an authenticated public profile comment
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

<alpha>

## Product Knowledge and Planning

- `/knowledge` for permission-filtered Knowledge Base search and reads
- `/mcp` for stateless, scoped MCP requests
- `/github` for user GitHub identity linking
- `/admin/github` for environment-specific read-only GitHub synchronization
- `/trello` for creator account authorization, Board import, automatic and manual
  bidirectional synchronization, disconnect, and signed webhook callbacks
- `/admin/knowledge-base` for source, index, and MCP-token administration
- `/boards` and `/proposals` for planning and moderation
- `/forecasts` for Board-scoped private Creator and staff revenue projections
- `/research-reports` for report review, comments, decisions, and promotion
- `/admin/agents` for Product Steward profiles, tokens, briefs, and runs
- `/agent/v1` for fixed scoped local-agent operations

`GET /boards?owned=true` requires authentication and returns only Boards owned by
the current User. Creator > Boards uses `PATCH /boards/:id` with
`{ "visibility": "private" }` or `{ "visibility": "public" }` for its visibility
control. The normal Board edit authorization still applies.

`GET` and `HEAD /trello/power-up/connector` are public hosted iframe responses for
Trello Power-Up registration. They declare no Power-Up capabilities and expose no
Board data; account authorization and synchronization remain on the protected
`/trello` REST routes.

An Agent token with `research-reports:write` can upload a private image through
`POST /agent/v1/runs/:publicId/media`, then include the returned media object in the
run's single report. Authorized report readers retrieve a referenced stored image
through `GET /research-reports/:reportId/media/:fileId`; the general file route does
not make report media public.

These endpoints are alpha and must not be exposed without their documented JWT,
feature, audience, or scoped-token controls.

</alpha>
