---
title: Structured Deployment Reports
section: Operations
order: 54
audience: admin, dev
stage: alpha
id: orbiters.operations.structured-deployment-reports
domain: operations
type: runbook
owner: orbiters-operations
lastVerified: 2026-07-12
relations: orbiters.decision.structured-deployment-evidence, orbiters.operations.deployment-and-backups, orbiters.development.knowledge-base-and-mcp
---

# Structured Deployment Reports

Production deployment reports are deterministic evidence written by the deployment
script. They let an operator, administrator, or authorized local agent inspect what
ran without granting production shell access. An AI may summarize a report, but it
does not decide whether the deployment succeeded.

This alpha runbook describes the structured event implementation. Individual fields
remain `null`, empty, or `unknown` when the corresponding probe is unavailable; an
absent measurement must never be presented as a passing check.

## Artifacts

`backend/deployment-status.json` stores the current deployed commit and refresh times
for frontend and backend. `backend/deployment-events.jsonl` is the append-only
structured history. Override their locations with
`ORBITERS_DEPLOYMENT_METADATA_PATH` and `ORBITERS_DEPLOYMENT_EVENTS_PATH` when a
runtime mount uses different paths.

`scripts/deploy/write-deployment-event.js` writes exactly one JSON object per line.
`deploymentStatusService` normalizes safe fields, skips malformed history lines, and
returns the ten newest valid events with the current service status.

## Event Schema

Each schema-version-1 event can include:

- deployment ID, environment, commit, previous commit, trigger actor/ref/run URL,
  start, completion, and deployment times;
- changed paths and the subset considered schema-sensitive;
- documentation-impact status and the human reason;
- backup archive, SHA-256 checksum, upload status, and object key;
- overall preflight result, first-boot result, second-boot result, and duration;
- backend and frontend image identifiers;
- active Caddy mode and health-check duration;
- local backend, public API, and public frontend synthetic-check results;
- pending and failed outbox counts plus oldest pending time, captured from the
  deployed backend container;
- an explicit error-delta status and links or paths to retained artifacts;
- final outcome and bounded operator-facing message.

The deploy script derives changed paths from the previous and target commits. Model,
schema transition, index-repair, compose, and SQL paths are flagged as
schema-sensitive. It records an event on success and through the failure trap; the
single-write guard prevents duplicate terminal entries.

The current error-delta field is deliberately
`{ "status": "not_configured", "value": null }` until a production error provider
is connected. It must not be summarized as zero errors.

## Documentation Impact Declaration

Every deployment must declare one of the repository's accepted documentation-impact
states and a reason through the workflow or operator environment. `unknown` or `not
declared` is visible evidence that the review contract was not satisfied, not a
substitute for `no impact`.

Use `yes` when behavior, permissions, operations, API contracts, data meaning, or
user workflow changed. Update and validate this repository before deploying. Use
`no` only when a reviewer can state why no page is affected.

## Preflight and Backup Evidence

Schema-sensitive changes require the existing two-boot database preflight. The first
boot applies creation or explicit migration work; the second exercises the alter path
that commonly reveals Sequelize/Postgres incompatibilities. Preserve both outcomes
rather than collapsing them into one success string.

The pre-deploy archive is identified by path and SHA-256 checksum. Upload status is
separate from archive creation: a local backup can exist even when remote upload
fails. Treat a missing checksum, failed upload, or inaccessible artifact according to
the release's recovery policy before continuing.

The host must provide Node.js before deployment starts because structured event
writing is part of the deployment contract. A failed public API or frontend
synthetic check records a `degraded` outcome and exits non-zero even when containers
started successfully. Failure to persist the terminal event is itself a deployment
failure.

## Reading Reports

Administrators with deployment access read current status from the admin deployment
endpoint. A developer or owner MCP token with `context:read` can call
`list_deployment_reports`. The MCP response is the same deterministic status object;
it does not open log files or execute a diagnostic command.

When producing a human summary:

1. State the outcome, target commit, previous commit, and time.
2. Call out schema-sensitive changes and both preflight boots.
3. Report backup creation, checksum, and upload separately.
4. List failed or unmeasured synthetic checks.
5. Compare queue and error evidence without inventing a baseline.
6. State documentation impact and its reason.
7. Link retained artifacts when a path or URL is present.

Do not turn `null`, an empty list, `unknown`, or `not_run` into “healthy.”

## Incident Use

On failure, use `deploymentId` to correlate the JSONL event, CI run URL, backup, and
service logs. Compare the current and previous commit and inspect the schema-sensitive
path list before considering rollback. A rollback is an operator decision and must
follow the existing backup and deployment runbook; the report itself performs no
remediation.

If the event log contains malformed lines, preserve the file for investigation. The
reader ignores malformed entries so one damaged line cannot hide all valid history,
but the damage still requires operational follow-up.

## Verification

1. Exercise the event writer with fake environment values and a temporary JSONL path.
2. Confirm a valid line is parseable and secrets are absent.
3. Confirm missing optional probes normalize to unknown values, not pass.
4. Exercise both the success path and the deployment failure trap.
5. Confirm exactly one terminal event is appended per deployment ID.
6. Read the event through the admin route and an authorized MCP token.
7. Confirm a non-developer MCP token cannot access deployment reports.
