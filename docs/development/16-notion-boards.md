---
title: Notion Board Integration
section: Development
order: 77
audience: dev
stage: alpha
id: orbiters.development.notion-boards
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-10-20
---

# Notion Board Integration

`backend/src/services/notion` implements creator OAuth, database/view discovery,
Kanban import, task writes and periodic synchronization. Native Notion pages become
ordinary proposals, so homepage previews, full-page editing, client permissions and
commission linking reuse the existing board-entry workflow.

## Routes

All `/notion` routes require a signed-in creator. Board mutations additionally require
the connected creator who owns that board. Responses use `private, no-store` caching.

| Endpoint | Purpose |
| --- | --- |
| `GET /notion/account` | Configuration availability and sanitized connection status |
| `POST /notion/connect` | OAuth URL and expiring, creator-bound state |
| `POST /notion/complete` | Consume state and exchange the authorization code |
| `DELETE /notion/account` | Pause boards, disconnect locally and revoke authorization |
| `GET /notion/sources?q=…&cursor=…` | Search accessible data sources |
| `GET /notion/sources/:id` | Supported views, status properties and Files properties |
| `POST /notion/boards` | Create a private board and queue its initial import |
| `GET /notion/boards/:id` | Sync status and the board's queued or refused moves (`moves`) |
| `POST /notion/boards/:id/sync` | Queue or resume synchronization |
| `PATCH /notion/boards/:id` | Pause/resume using Boolean `paused` |
| `DELETE /notion/boards/:id` | Detach the source while preserving editable proposals |
| `POST /notion/boards/:id/moves/:itemId` | `{ action: 'retry' \| 'undo' }` for a refused move |
| `POST /notion/boards/:id/tasks` | Create a page using a persisted request UUID |
| `POST /notion/tasks/:proposalId/link` | Recover an uncertain creation using a Notion page URL/ID |

Content and image operations use the existing `/board-entries` endpoints.

## Persistence and concurrency

`NotionConnection` owns one workspace authorization per creator. `NotionBoardSync`
stores data source/view IDs, column mappings, attachment property, scheduling and
status. `NotionPageLink` maps a remote page to a proposal and optional board placement;
its snapshot also records interrupted creation/edit operations.

The three tables have named unique indexes and sync without `alter`. API-key enum
values `NOTION_APP` and `NOTION_ACCOUNT` are registered before model sync through the
existing explicit PostgreSQL enum migration. No existing table columns are changed.

Session advisory locks serialize each board's sync and writes. Column moves never wait
for that lock: `notionMoveQueue.queue` updates the board item at once and records
`snapshot.pendingMove` (`rev`, `columnKey`, `from`, `state`) under a row lock, so a later
move of the same card replaces it. Each move adds an outbox job `notion.move` keyed
`notion.move:<linkId>:<rev>`; it retries while the board is locked, and `runSync` also
sends queued moves when it starts and before it releases the lock. A sync keeps a card
with a queued or refused move in the chosen column. When the move is sent, a Notion
status that is neither `from` nor the target stops it as `conflict` (with Notion's
column) instead of overwriting it; 401/403/404 and missing statuses stop as
`reconnect`, `forbidden`, `unavailable` and `missing-status`, while 429, 5xx and
uncertain responses retry. Moves within one column change Orbiters only. The scheduler prevents
overlapping passes, checks five due boards per pass, and spaces requests by at least
350 ms per credential. Only explicit 429 responses are retried automatically, respecting
Retry-After. Ambiguous page creations are preserved for reconciliation, not replayed.

View queries use Notion's saved filters and sorts, consume every cursor and release
their temporary query. A full snapshot is bounded at 500 tasks. Failed or incomplete
snapshots never delete missing placements. Successful removal affects only placement;
the proposal and linked commission remain. Old columns are retained until a replacement
snapshot finishes. Pause/disconnect state is rechecked between task imports.

## Editing and media

`GET /pages/:id/markdown` returns Notion's enhanced Markdown: XML-like tags such as
`<empty-block/>`, `<unknown url alt="bookmark"/>`, `<columns>` or `<span color>`, and no
blank lines between blocks, so CommonMark would read the rest of a page as one raw HTML
block. `frontend/src/components/shared/notionMarkdown.js` converts it to plain Markdown
(https-only links and media, text kept for unknown tags) wherever Notion content is
rendered. Summaries are stored without tags. `savePage` records `fetchedAt` and
downloads a page again when it was read before its edit minute ended, because Notion
rounds `last_edited_time` to the minute.

Read current remote content before saving and check its version. Notion versions
ignore changing AWS signed-image query strings. A persisted edit intent recognizes
partial title/body success after a lost response. Exact Markdown replacements do not
authorize deletion of nested pages or databases. Advanced markup stays in the raw
Markdown editor; truncated/unknown content cannot be edited through Orbiters.

The page's Files properties and cover are read alongside content. Details refresh
temporary Notion file links. Optional attachment writes preserve the full existing
Files array and deduplicate Orbiters image links. Failed attachment delivery reports
text success separately, so retry does not repeat an already-applied content change.

Workspace credentials participate in account export exclusion and account-closure
revocation. Closing a user removes their connection and sync links while preserving
shared proposal and commission records under the existing privacy rules.

## Validation

Run the backend suite on supported Node. Focused Notion tests cover authorization,
token renewal, API pacing, mappings, pagination, partial edits, uncertain creation,
ownership, interrupted snapshots and worker scheduling. `notionStartup.test.js` runs
the actual scheduler initializer and actual `server.js` HTTP wiring with local
dependency fixtures; it does not start real integrations.

`notionUpgrade.test.js` requires explicit `NOTION_UPGRADE_TEST=true` and an isolated
loopback PostgreSQL fixture. It boots fresh and populated databases twice, preserving
an existing API-key enum and a partially introduced connection row. Backend boot uses
port 4219 and exits after database initialization; this is a schema gate, separate
from the HTTP startup test.

Build the frontend, then run `frontend/scripts/test-notion-ui.cjs` with Playwright.
It intercepts all APIs and vendors and exercises import settings, task creation,
inline editing, advanced block retention, mobile clipping and dismissal. The existing
board-card browser suite verifies image drops, commission controls and animation
intermediate frames. Neither suite performs live Notion writes.
