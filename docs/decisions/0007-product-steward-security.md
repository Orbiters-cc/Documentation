---
title: ADR 0007 - Product Steward Identity and Local Execution Security
section: Decisions
order: 106
audience: dev
stage: alpha
id: orbiters.decision.product-steward-security
domain: website
type: decision
owner: orbiters-security
lastVerified: 2026-07-12
relations: orbiters.development.product-steward-agents, orbiters.decision.knowledge-base-and-mcp, orbiters.decision.boards-and-proposals
---

# ADR 0007 - Product Steward Identity and Local Execution Security

## Status

Accepted for the alpha implementation.

## Context

Product agents need recognizable authorship and durable product memory, but a website
endpoint that sends arbitrary prompts to a developer machine would be a critical
remote-code-execution boundary. Reusing a human account or a server-side model
session would also confuse identity, authentication, and authority.

## Decision

Create a non-authenticating Agent `User` for presentation and authorship plus a
one-to-one `AgentProfile` for charter, sponsor, lifecycle, sources, audience ceiling,
and allowed actions. Authority comes only from an expiring, revocable, scoped agent
token stored through the existing token-management structure.

Execution is local and manually initiated. Orbiters produces a non-secret research
brief. The operator configures the reveal-once secret separately. The API accepts
only fixed, schema-validated operations tied to an `AgentRun`; every mutation is
idempotent and auditable. Stored token authority is intersected with the active
profile on every request. Reports and Agent-authored Proposals begin private and
require human review.

## Consequences

- Agent comments and reports link to a clearly marked profile.
- Agent users cannot use Discord login, OAuth account flows, or ordinary rank to gain
  authority.
- The website has no command, shell, filesystem, or remote-run channel to a local
  agent.
- Token revocation or profile deactivation stops future access.
- Tightening current profile actions or Knowledge audiences narrows existing tokens
  without waiting for expiration.
- Prompts can be shared safely because they contain no credential.
- Product research remains separate from the server's AI provider configuration.
- A future pairing-code flow can improve secret delivery without changing the brief
  or scoped API contract.

## Alternatives Rejected

- Triggering a local coding agent from the website, because arbitrary instruction
  delivery crosses an unacceptable machine-security boundary.
- Embedding the bearer token in the generated prompt, because prompts are routinely
  copied, logged, and retained.
- Reusing a human User without an account type, because readers could not distinguish
  automated authorship.
- Connecting Product Stewards directly to the existing AI model scaffold, because
  research identity and local execution have different lifecycles.
