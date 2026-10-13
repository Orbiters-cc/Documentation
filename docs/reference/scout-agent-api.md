---
title: Scout Agent API Reference
section: Reference
order: 81
audience: dev
stage: alpha
id: orbiters.reference.scout-agent-api
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-10-13
relations: orbiters.how-to.me-scout, orbiters.reference.job-search-worker-api, orbiters.decision.personal-agents-on-member-hardware
---

# Scout Agent API Reference

Scout's sync on the Pi (`agents/scout/scout_sync`) calls `/me-agent/scout/*` with its `orb_agent_…` token, and Hermes
calls `/mcp` with the same token. Every call acts for the member who paired Scout.

## Scopes

| Scope | Grants |
| --- | --- |
| `agent-config:read` | `GET /config`, `POST /status`, `POST /activity`, `GET /documents`, `GET /documents/:id`. |
| `secrets:read` | `POST /secrets` for the keys whose consumers include `scout` (model keys, Discord and Telegram bot tokens). |
| `sponsor:read` | `/mcp` with the AI app tools, run as the sponsor with the `read` scope only. |

Scout tokens issued before `sponsor:read` existed get it the next time Scout is paired.

## Endpoints

| Call | Use |
| --- | --- |
| `GET /config` | `{ config, keys }`: the Me → Scout settings and which Scout keys are saved. |
| `POST /secrets` | `{ names }` returns `{ NAME: value }` for saved keys Scout may receive. |
| `POST /status` | `{ gateway, hermesVersion, appliedConfig, error }`; `gateway` is `running`, `stopped` or `not installed`. |
| `POST /activity` | Summary shown in Me → Scout → Activity: `busy`, `lastActivityAt`, `sessions`, `subagents`, `recentTools`, `jobs`, `spend`. Times are Unix seconds. Lists are capped (10 sessions, 10 subagents, 20 tools, 20 jobs) and texts truncated. Message contents are never sent. |
| `GET /documents` | Document list with `sha256`, so the Pi fetches only changed files. |
| `GET /documents/:id` | The file's bytes, with its `Content-Type`. |

Members manage documents with `PUT /job-search/scout/documents/:name` (raw `application/octet-stream` body, PDF,
Markdown or text, up to 4 MB, 12 files and 20 MB in total) and `DELETE /job-search/scout/documents/:id`.

## Orbiters data through MCP

With `sponsor:read`, `POST /mcp` serves the AI app tool set as the sponsor with only the `read` scope: tools that
draft, publish, schedule, pay or change data are not listed. Calls appear in the AI app activity log as
**Scout (personal agent)** and count against the sponsor's AI app budget. The staff-only tool
`get_platform_overview` returns platform totals for the last N days: members, follows, assets, store sale records,
commission payments, managed communities and page traffic, with no individual member, buyer or message data.
