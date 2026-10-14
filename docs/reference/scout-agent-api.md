---
title: Orb agent API
section: Reference
order: 81
audience: dev
stage: alpha
id: orbiters.reference.scout-agent-api
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-10-14
relations: orbiters.how-to.me-scout, orbiters.reference.job-search-worker-api, orbiters.decision.personal-agents-on-member-hardware
---

# Orb agent API

Orb's sync on the Pi (`agents/orb/orb_sync`) calls `/orb-agent/*` with its `orb_agent_…` token, and Hermes calls
`/mcp` with the same token. Every call acts for the member who paired Orb. Orb was called Scout: the old base path
`/me-agent/scout/*` serves the same routes for Pis that have not been updated yet.

## Scopes

| Scope | Grants |
| --- | --- |
| `agent-config:read` | `GET /config`, `GET /notifications`, `POST /status`, `POST /activity`, `POST /board`, `POST /codex`, `GET /documents`, `GET /documents/:id`, `/research`. |
| `secrets:read` | `POST /secrets` for the keys whose consumers include `orb` (model keys, Reddit app credentials, Discord and Telegram bot tokens). |
| `sponsor:read` | `/mcp` with the AI app tools, run as the sponsor with the `read` scope only. |

Tokens issued before `sponsor:read` existed get it the next time Orb is paired.

## Endpoints

| Call | Use |
| --- | --- |
| `GET /config` | `{ config, keys, codex }`: the Orb → Assistant settings, which Orb keys are saved, and the ChatGPT (Codex) sign-in state. |
| `POST /secrets` | `{ names }` returns `{ NAME: value }` for saved keys Orb may receive. |
| `GET /notifications?after=<id>` | `{ cursor, notifications }`: unread bell notifications after `after` from the last 24 hours, in the categories chosen in Orb → Assistant, oldest first, at most 20 per call (`id`, `category`, `title`, `body` up to 600 characters, absolute `url`, `createdAt`). Without `after`, or when relaying is off, it returns no notifications and the current cursor. Keep `cursor` for the next call. |
| `POST /status` | `{ gateway, hermesVersion, appliedConfig, error }`; `gateway` is `running`, `stopped` or `not installed`. |
| `POST /activity` | Summary shown in Orb → Assistant → Activity: `busy`, `lastActivityAt`, `sessions`, `subagents`, `recentTools`, `jobs`, `spend` (with `byRole`: chat, planning, background) and `background` (`state` `running`, `paused` or `off`, `reason`, `model`, `workers`, status `counts`, task titles for `running`, `queued` and `done`, and per-provider `providers` pacing: `state`, `monthUsd`, `todayUsd`, `capUsd`, `allowanceTodayUsd`, `keys`, `unlockedUntil`, for up to 12 providers). Times are Unix seconds. Lists are capped (10 sessions, 10 subagents, 20 tools, 20 jobs, 3 running, 6 queued, 8 done tasks) and texts truncated. Message contents are never sent. |
| `POST /board` | Live research board snapshot, sent by `orb-board.service` whenever a task is queued, starts or finishes: `counts` (`ready`, `running`, `scheduled`, `blocked`, `done`) and up to 16 `running`, 8 `queued` and 10 `done` tasks, each with `id`, `board` (`research-<n>` for a project board, empty for the 24/7 queue), `title`, `status`, `model` and `at` (Unix seconds). Task bodies and results are never sent. |
| `POST /codex` | `{ state, url, code, error }`: the ChatGPT sign-in as Hermes sees it. `state` is `requested`, `waiting`, `connected`, `failed` or `signed-out`; `url` (an `https://auth.openai.com/` link) and `code` are kept only while `waiting`. The sign-in tokens stay on the Pi. |
| `GET /research` | Research projects to run: `queued`, `running` and `stopping` ones, each with `title`, `brief`, `hours`, `reportEveryHours`, `startedAt`, `endsAt`, `progress`, `reportCount` and `latestReport`. |
| `POST /research` | `{ title, brief, hours, reportEveryHours }` starts a project on the member's behalf (origin `chat`); at most 3 run at once. |
| `POST /research/:id/progress` | `{ status, progress }`: the Pi moves a project from `queued` to `running` (Orbiters sets `startedAt` and `endsAt`), from `running` to `done` and from `stopping` to `stopped`; `progress` holds `round`, `done`, `open`. |
| `POST /research/:id/reports` | `{ round, final, body }` stores a report (Markdown, up to 20,000 characters, 200 per project). |
| `GET /research/:id/reports`, `POST /research/:id/stop` | The project's reports, newest first; stopping a running project marks it `stopping`. |
| `GET /documents` | Document list with `sha256`, so the Pi fetches only changed files. |
| `GET /documents/:id` | The file's bytes, with its `Content-Type`. |

## Member endpoints

The Orb workspace uses these with the member's session (they replace `/job-search/scout/*`):

| Call | Use |
| --- | --- |
| `GET /job-search/orb` | Settings, status, activity, documents, research projects and the Codex sign-in state. |
| `PUT /job-search/orb` | Saves the settings. |
| `GET /job-search/orb/board` | `{ board }`: the latest snapshot from `POST /board`. |
| `POST /job-search/orb/unlock` | `{ provider, hours }` runs a paced provider past today's share for `hours` (0 to 24, 0 ends the unlock); its monthly cap still applies. |
| `POST /job-search/orb/codex` | Asks the Pi to start a ChatGPT sign-in (rate limited). |
| `PUT /job-search/orb/documents/:name`, `DELETE /job-search/orb/documents/:id` | Upload (raw `application/octet-stream` body, PDF, Markdown or text, up to 4 MB, 12 files and 20 MB in total) or remove a document. |
| `POST /job-search/orb/research`, `GET /job-search/orb/research/:id/reports`, `POST /job-search/orb/research/:id/stop` | Start a project (origin `site`), read its reports, stop it. |

Documents and research are stored in `OrbAgentDocuments`, `OrbResearchProjects` and `OrbResearchReports`, and are
exported and deleted with the member's account.

## Orbiters data through MCP

With `sponsor:read`, `POST /mcp` serves the AI app tool set as the sponsor with only the `read` scope: tools that
draft, publish, schedule, pay or change data are not listed. Calls appear in the AI app activity log as
**Orb (personal agent)** and count against the sponsor's AI app budget. The staff-only tool
`get_platform_overview` returns platform totals for the last N days: members, follows, assets, store sale records,
commission payments, managed communities and page traffic, with no individual member, buyer or message data.

The read-only Discord tools cover servers the sponsor manages: `list_my_discord_servers`, `get_discord_server_stats`,
`get_discord_server_roles`, `list_discord_channels`, `read_discord_channel`, `get_discord_announcements` and
`get_discord_activity`. They are preview tools for ChatGPT and Claude connections and available to Orb through its
sponsor access.

The Reddit, X and Instagram tools are not Orbiters endpoints: they run in a local `social` MCP server on the Pi. See
[Set up Orb, your personal business assistant](/documentation/orbiters.how-to.me-scout).
