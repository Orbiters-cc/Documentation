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
| `agent-config:read` | `GET /config`, `GET /notifications`, `POST /status`, `POST /activity`, `GET /documents`, `GET /documents/:id`, `/research`. |
| `secrets:read` | `POST /secrets` for the keys whose consumers include `scout` (model keys, Discord and Telegram bot tokens). |
| `sponsor:read` | `/mcp` with the AI app tools, run as the sponsor with the `read` scope only. |

Scout tokens issued before `sponsor:read` existed get it the next time Scout is paired.

## Endpoints

| Call | Use |
| --- | --- |
| `GET /config` | `{ config, keys }`: the Me → Scout settings and which Scout keys are saved. |
| `POST /secrets` | `{ names }` returns `{ NAME: value }` for saved keys Scout may receive. |
| `GET /notifications?after=<id>` | `{ cursor, notifications }`: unread bell notifications after `after` from the last 24 hours, in the categories chosen in Me → Scout, oldest first, at most 20 per call (`id`, `category`, `title`, `body` up to 600 characters, absolute `url`, `createdAt`). Without `after`, or when relaying is off, it returns no notifications and the current cursor. Keep `cursor` for the next call. |
| `POST /status` | `{ gateway, hermesVersion, appliedConfig, error }`; `gateway` is `running`, `stopped` or `not installed`. |
| `POST /activity` | Summary shown in Me → Scout → Activity: `busy`, `lastActivityAt`, `sessions`, `subagents`, `recentTools`, `jobs`, `spend` (with `byRole`: chat, planning, background) and `background` (`state` `running`, `paused` or `off`, `reason`, `model`, `workers`, status `counts`, task titles for `running`, `queued` and `done`, and per-provider `providers` pacing: `state`, `monthUsd`, `todayUsd`, `capUsd`, `allowanceTodayUsd`). Times are Unix seconds. Lists are capped (10 sessions, 10 subagents, 20 tools, 20 jobs, 3 running, 6 queued, 8 done tasks) and texts truncated. Message contents are never sent. |
| `GET /research` | Research projects to run: `queued`, `running` and `stopping` ones, each with `title`, `brief`, `hours`, `reportEveryHours`, `startedAt`, `endsAt`, `progress`, `reportCount` and `latestReport`. |
| `POST /research` | `{ title, brief, hours, reportEveryHours }` starts a project on the member's behalf (origin `chat`); at most 3 run at once. |
| `POST /research/:id/progress` | `{ status, progress }`: the Pi moves a project from `queued` to `running` (Orbiters sets `startedAt` and `endsAt`), from `running` to `done` and from `stopping` to `stopped`; `progress` holds `round`, `done`, `open`. |
| `POST /research/:id/reports` | `{ round, final, body }` stores a report (Markdown, up to 20,000 characters, 200 per project). |
| `GET /research/:id/reports`, `POST /research/:id/stop` | The project's reports, newest first; stopping a running project marks it `stopping`. |
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
