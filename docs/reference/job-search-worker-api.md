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
lastVerified: 2026-11-02
relations: orbiters.how-to.me-job-search-worker, orbiters.how-to.n4n0-job-search, orbiters.decision.personal-agents-on-member-hardware, orbiters.reference.steward-api-and-token
---

# Job Search Worker API Reference

The paired job worker calls `/job-search/worker/*` with `Authorization: Bearer orbiters_agent_…`. The token
belongs to a personal agent account sponsored by the member (see
[Steward API and Token Reference](/documentation/orbiters.reference.steward-api-and-token)) and needs the
`job-search:work` scope. Every call acts for the sponsor; the worker cannot read or write another member's
workspace. Bodies are limited to 1 MB, except `PUT /geo/:key` (8 MB, checked after the token).

The sponsor must also have the `n4n0-workspace` feature (`hermesAccess.requireSponsorFeature`, read at most once a
minute per sponsor). Without it every call answers
`403 { error: "This account does not have N4N0's Hermes features.", code: 'FEATURE_REQUIRED' }`, and the agents' `/mcp`
access is refused too.

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
| `location` | offer id | Office research: addresses in the description, business directory, employer pages. Bulk office research queues the offers in the member's search place first (the city of the saved collection; none for a whole country or remote). |
| `company` | company key | Public rating, review and salary evidence. |
| `description` | offer id | Full LinkedIn or WTTJ description and logo. |
| `further` | offer id | Exact-match offer page on the employer or a search result. |
| `board` | `ashby:slug` or `wttj:slug` | Every technical offer on that employer board. |
| `enrich` | offer id | Normalise a manually added offer. |
| `geocode` | `home` or `place:<offer id>` | IGN address search; a home IGN cannot find (outside France) goes through OpenStreetMap's Photon. |
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
| `POST /secrets` | `{ names }` returns the saved values the job worker may receive (consumer `job-worker`): `FRANCE_TRAVAIL_CLIENT_ID`, `FRANCE_TRAVAIL_CLIENT_SECRET`, `PRIM_API_KEY`, `USAJOBS_API_KEY`, `USAJOBS_EMAIL`, `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `JOOBLE_API_KEY` and `THE_MUSE_API_KEY`. |
| `POST /enqueue` | Queues a lookup the engine asked for, with optional `staleHours`. |

## Collection runs

A claimed `run` carries the settings Orbiters validated (`collectionSources.js`; the worker validates them again in
`engine/source_settings.py`):

| Field | Meaning |
| --- | --- |
| `country` | ISO code of the country searched (`countries.js` / `engine/countries.py`: US, FR, GB, CA, DE, ES, IT, NL, BE, CH, AT, PL, IE, AU, NZ, IN, SG, BR, MX, JP). Runs saved before countries existed have none and read as `FR`. |
| `query`, `location` | The first search term and place. |
| `queries`, `locations` | Every search term (up to 6) and place (up to 3). A profile search has one query per role chip, or the skill and tool chips when there is no role chip. |
| `keywords` | Up to 30 skill, tool, industry, language and level chips. |
| `remote` | `any`, `remote`, `hybrid` or `onsite`. |
| `searches` | How many (query, place) pairs run: `queries × locations`, at most 8. |
| `profile` | `{ chips, usedAt }` for a search made from the member's profile, kept on the run for its history. |
| `sources`, `boards`, `limit`, `pages_per_run`, `start_page`, `resume`, `ft_department` | Unchanged; `boards` also takes `smartrecruiters` company IDs. |

The worker runs every source for each (query, place) pair in turn and stores only the offers that fit
(`source_settings.wanted`): with keywords, the title or description must contain at least one of them as a whole word;
with a work mode other than `any`, the offer's mode must match (`remote` also accepts an offer whose location or remote
text says remote; `hybrid` and `onsite` also accept an unknown mode). When a run has more than one pair, each source
result carries `search: "<query> · <place>"`. A source without offers in the run's country (`sourceCatalog.js`
`countries`) is reported as `exhausted` with the note `No offers in this country.`; Orbiters already refuses to queue
one. A source whose key is missing fails with `<Source> needs <KEY>: save it in N4N0 → Sources › Source keys.`

Saved progress is one `collection-progress:<sha256>` setting per source and (query, place). The hashed identity is
`{ source, query, limit }`, plus `location` for location-aware sources (JobSpy, Adzuna, Jooble, The Muse, USAJOBS),
`country` for country-aware ones (Indeed, Glassdoor, Himalayas, Jobicy, Adzuna, Jooble, SmartRecruiters),
`department` for France Travail and `boards` for employer boards. Indeed, Glassdoor, Himalayas and Jobicy leave
`country` out for France, so French checkpoints saved before countries still match. Orbiters and the worker hash
the same `json.dumps(identity, sort_keys=True)` text, and both test suites assert the same digests.

## Member access

The workspace calls `/job-search/*` with the member's session. Every route needs the `n4n0-workspace` feature, and
all of them except the setup routes also need a paired Hermes machine: an active `job-worker` or `n4n0` agent
profile sponsored by the member, with an active agent token that has not expired. Without one they answer
`409 { error: 'Pair your Hermes machine in N4N0 Settings > Agents to use this feature.', code: 'HERMES_MACHINE_REQUIRED' }`.

| Call | Use |
| --- | --- |
| `GET /job-search/hermes` | Setup route: `{ paired, agents }`, the agent kinds with a live token. |
| `GET /job-search/agents`, `POST` / `DELETE /job-search/agents/:kind/pair` | Setup routes: list, pair and unpair the agents (`jobSearchSetupRouter.js`, mounted before the other job search routers). |
| `GET /job-search/secrets`, `PUT` / `DELETE /job-search/secrets/:name` | Setup routes: which keys are saved, save one (`{ value }`), remove one. |
| `GET /job-search/meta` | Also returns `countries` (`code`, `name`, `currency`, `center`, `zoom`) and `countryDefaults` (place, sources and boards per country). `collection` is the saved search (a legacy one with `country: 'FR'`) or the default United States search. |
| `POST /job-search/collect` | Queues a run. Send `profile: { chips: [{ kind, value }] }` to search with the profile: kinds `role`, `skill`, `tool`, `industry`, `language`, `seniority`, `location`, `remote`; 1–80 characters each, at most 60, with at least one role, skill or tool. A source without offers in the country is refused with `400`. |
| `GET /job-search/profile` | `{ profile, source, builtAt, editedAt, locked, documents, upToDate, unreadable, hermes, chips }`. `source` is `documents` (Orbiters' reading) or `hermes`; `locked` lists the fields the member edited; `hermes.status` is `none`, `queued`, `done` or `failed`. |
| `PUT /job-search/profile` | `{ profile }` saves the member's edit; fields that differ from the documents' reading become `locked`. |
| `POST /job-search/profile/rebuild` | Reads the documents again and asks the Hermes machine to read them; `{ reset: true }` drops the edits. |
| `GET /job-search/learning?list=<id>` | The Quest of one list (without `list`: the list holding the `priority-shortlist` track, else the first list with offers, else the first list), with `lists` for the switcher (`id`, `name`, `count`, `cleared`). |
| `POST /job-search/learning/:cardId/start`, `POST /job-search/learning/:cardId/attempt` | Take `listId` in the body; progress is stored on that list's track. |

Every list has its own learning track: `list-<id>`, or `priority-shortlist` for the list that held the only Quest before
every list had one. `migrations/jobQuestTracks.js` binds that track back to the member's oldest list named
"Priority shortlist" when it lost its list, gives every other list its own track, and never changes existing tracks or
progress. Deleting a list deletes the progress on its own track; `priority-shortlist` progress is kept for a later list
of that name.

A profile has the fields `summary`, `targetRoles`, `skills`, `tools`, `seniority` (`{ level, years }`), `languages`
(`[{ name, level }]`), `industries`, `locations`, `country`, `remote` and `salary` (`{ min, max, currency, period }`),
cleaned by `profile/profileSchema.js` whoever wrote them. Documents (`PUT /job-search/n4n0/documents/:name`) accept PDF,
Word (`.docx`), Markdown, text and CSV, and each upload or removal rebuilds the profile. N4N0 reads them through
`GET /n4n0-agent/profile/request` and `POST /n4n0-agent/profile`; see
[N4N0 agent API](/documentation/orbiters.reference.scout-agent-api).
