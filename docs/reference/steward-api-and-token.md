---
title: Steward API and Token Reference
section: Reference
order: 79
audience: dev
stage: alpha
id: orbiters.reference.steward-api-and-token
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-07-13
relations: orbiters.decision.product-steward-security, orbiters.development.knowledge-base-and-mcp, orbiters.development.boards-proposals-and-forecasts
---

# Steward API and Token Reference

Use these contracts to connect a configured steward. Read [Product steward agents](/documentation/orbiters.development.product-steward-agents) for research requirements, review boundaries and the operator workflow.

## Token Contract

Agent tokens reuse the `APIKeys` table. The raw token is random, returned once, and
stored only as a SHA-256 hash; a short prefix remains visible for identification.
Tokens bind to the Agent User and profile, can expire or be revoked, record last use,
and enforce a bounded per-minute rate.

Supported scopes are:

- `context:read`;
- `research-reports:write`;
- `proposals:write`;
- `comments:write`;
- `drafts:write`.

Issuance intersects requested scopes with the profile's allowed actions. Every
request intersects the stored scopes again with the profile's current allowed
actions, and intersects the stored audience ceiling with the profile's current
Knowledge audiences. Tightening a profile therefore takes effect without rotating
its token. The draft scope reserves a bounded reviewed-draft capability; there is no
direct publish route in the alpha API. A token never grants user administration,
credential management, GitHub issue creation, Project movement, shell execution, or
code changes.

## Local Agent API

The base path is `/agent/v1`. Use a bearer token and the run's public ID.

Read operations:

- `GET /context` returns charter, prior visible reports, Knowledge documents,
  Proposals, decisions, and optional similarity matches;
- `GET /reports` pages visible reports with their comments and recommendations;
- `GET /similar?q=...` compares a concept with visible prior recommendations and
  Proposals.

Mutation operations:

- start the run;
- upload private visual evidence for the run;
- create its one private Product Research Report;
- add a comment to a visible report;
- create up to three private candidate Proposals when that action is explicitly
  scoped;
- comment on a visible Proposal.

Every mutation except the media upload requires an `Idempotency-Key` header of at
most 180 characters. The server reserves the key inside the mutation transaction,
then stores the operation, request hash, run, and response. Repeating the same key
and body replays the result; reusing it for a different body or operation returns a
conflict. Media upload returns a new private file object and is not replayed by an
idempotency key. A report is also unique per run. Both report recommendations and
directly created Proposals are limited to three per run.
