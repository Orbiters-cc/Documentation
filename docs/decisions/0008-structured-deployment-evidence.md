---
title: ADR 0008 - Structured Deployment Evidence
section: Decisions
order: 107
audience: dev
stage: alpha
id: orbiters.decision.structured-deployment-evidence
domain: operations
type: decision
owner: orbiters-operations
lastVerified: 2026-07-12
relations: orbiters.operations.structured-deployment-reports, orbiters.operations.deployment-and-backups
---

# ADR 0008 - Structured Deployment Evidence

## Status

Accepted for the alpha implementation.

## Context

Free-form deployment logs are difficult to compare across runs and easy for an AI
summary to misread. Operators need proof of backup, schema preflight, deployed commit,
health checks, queue state, and documentation impact without granting an agent shell
access to production.

## Decision

The deployment script writes one versioned JSONL terminal event containing the
available deterministic evidence. The backend normalizes and returns recent events
through the existing deployment-status service. Developer and owner MCP actors may
read this safe report through a fixed tool.

AI is limited to summarizing recorded fields. Script exit status and explicit probe
results determine the event outcome; the model neither declares success nor executes
remediation.

## Consequences

- Success and failure deployments use one comparable schema.
- Unknown or unavailable evidence remains explicit.
- Deployment history can be inspected without arbitrary filesystem or shell access.
- Documentation impact becomes a visible release declaration.
- Schema-sensitive changes retain first-boot and second-boot evidence.
- Event schema changes require a version increment and compatible normalization.
- JSONL retention, backup, and access permissions remain operational concerns.

## Alternatives Rejected

- Letting an agent inspect raw production logs and decide success, because that grants
  excessive access and produces non-deterministic conclusions.
- Storing only the latest deployment, because incident comparison needs history.
- Writing prose-only reports, because fields cannot be reliably validated, filtered,
  or compared.
