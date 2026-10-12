---
title: Job Search Worker API Reference
section: Reference
order: 80
audience: dev
stage: alpha
id: orbiters.reference.job-search-worker-api
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-10-12
relations: orbiters.how-to.me-job-search-worker, orbiters.decision.personal-agents-on-member-hardware, orbiters.reference.steward-api-and-token
---

# Job Search Worker API Reference

The paired job worker calls `/job-search/worker/*` with `Authorization: Bearer orb_agent_…`. The token
belongs to a personal agent account sponsored by the member (see
[Steward API and Token Reference](/documentation/orbiters.reference.steward-api-and-token)) and needs the
`job-search:work` scope. Every call acts for the sponsor; the worker cannot read or write another member's
workspace. Bodies are limited to 1 MB, except `PUT /geo/:key` (8 MB, checked after the token).

## Claiming work

`POST /claim` long-polls for up to 25 seconds and returns as soon as work exists.

| Field | Meaning |
| --- | --- |
| `capacity` | Free task slots (0–10). |
| `collect` | `true` to also take the next queued collection run. |
| `waitMs` | How long to wait for work (0–25000). |
| `kinds` | Optional subset of task kinds. |

The response is `{ tasks: [{ id, kind, target, payload, generation, attempts, routeKey }], run }`.

Orbiters decides what is due: action tasks first (priority 2), then the member's own requests (priority 1),
then bulk lane work. At most one task runs per source route (three for company discovery) and three per
lane. Paused lanes are never claimed.

## Task kinds

| Kind | Target | What the worker does |
| --- | --- | --- |
| `location` | offer id | Office research: addresses in the description, business directory, employer pages. |
| `company` | company key | Public rating, review and salary evidence. |
| `description` | offer id | Full LinkedIn or WTTJ description and logo. |
| `further` | offer id | Exact-match offer page on the employer or a search result. |
| `board` | `ashby:slug` or `wttj:slug` | Every technical offer on that employer board. |
| `enrich` | offer id | Normalise a manually added offer. |
| `geocode` | `home` or `place:<offer id>` | IGN address search. |
| `commute` | `<offer id>:<place id>` | Bike and transit times through PRIM. |
| `credential-test` | `france-travail` | Request a France Travail token. |
| `company-import` | company key | Parse pasted company-page text. |
| `salary-scan` | `all` | Salary and meal-voucher rescan of every offer. |
| `map-cities` | `fr` | Download and upload the French city datasets. |

## Running a task

| Call | Use |
| --- | --- |
| `POST /tasks/:id/report` | `{ generation, message?, url? }`. With a message: a progress note shown in Research. Without: renews the 3-minute lease only. |
| `POST /tasks/:id/complete` | `{ generation, outcome, error?, result?, retryAt? }`. |

Outcomes:

- `done` — finished; `result` is shown to the member.
- `deferred` — the source asked to wait. The task retries at `retryAt` without using an attempt, and every
  bulk task of the same route is parked until then.
- `error` — retryable failure; retried with exponential backoff, failed after three attempts.
- `invalid` — permanent failure (bad input, nothing to find).

Every write made for a task carries `taskId` and `generation`. If the member cancelled or restarted the task,
or its lease expired, the call fails with `409` and the message `Task is no longer running for this
generation`; the worker drops its result.

## Offers and evidence

| Call | Use |
| --- | --- |
| `POST /jobs/upsert` | `{ items, taskId?, generation? }`, 1–200 items: `{ raw, job, origin, evidence, checkedAt?, places?, research? }`. |
| `GET /jobs` | `?after=&limit=&companyKey=` pages offers in id order (up to 500). |
| `GET /jobs/:id` | One offer with its places. |
| `PATCH /jobs/:id` | `{ changes, expect?, observations?, taskId, generation }`. |
| `PUT /jobs/:id/places` | `{ places, selected?, taskId, generation }`, up to 50 places. |
| `GET` / `PUT /companies` | Company evidence by `name`. |

`job` uses the engine's snake_case fields. Orbiters applies the original merge rules: deleted offers are
reported as `deleted` and never revived, historical evidence never overwrites collected offers, and a summary
never replaces a full description. `research` lists follow-up lookups (`further`, `location`, `description`,
`board`); `staleHours` refreshes a finished task only once it is that old. `PATCH` refuses the change with `409`
when a field in `expect` no longer has the value the worker read.

## Collections, settings and keys

| Call | Use |
| --- | --- |
| `POST /runs/:id/progress` | `{ results, status? }` renews the run lease; returns `{ cancelRequested }`. Final statuses: `complete`, `partial`, `cancelled`, `interrupted`. |
| `GET` / `PUT /settings/:key` | Only `collection-progress:*` checkpoints and `salary-rescan`. |
| `POST /salary-scan` | Stores the last scan summary. |
| `POST /commutes` | Saves a trip; refused when home, travel date or the office changed meanwhile. |
| `PUT /geo/:key` | `fr-cities` or `paris-arrondissements`. |
| `POST /secrets` | `{ names }` returns the values the job worker may receive: France Travail credentials and the PRIM key. |
| `POST /enqueue` | Queues a lookup the engine asked for, with optional `staleHours`. |
