---
title: ADR 0005 - Separate GitHub Identity and Project Connections
section: Decisions
order: 104
audience: dev
stage: alpha
id: orbiters.decision.github-connection-separation
domain: website
type: decision
owner: orbiters-security
lastVerified: 2026-07-13
relations: orbiters.development.github-connections, orbiters.decision.boards-and-proposals
---

# ADR 0005 - Separate GitHub Identity and Project Connections

## Status

Accepted for the alpha implementation.

## Context

Orbiters must match an issue author to a website account and also read a private
repository and user-owned ProjectV2. Identity matching needs little privilege.
Project and private-repository reads need separate least-privilege credentials and
environment-specific operational control.

## Decision

Use two OAuth connection kinds. `USER_IDENTITY` belongs to one human user, requests
`read:user`, stores stable GitHub identity, and immediately revokes the temporary
credential. `ADMIN_PROJECT` belongs to an environment rather than a user account,
requests only `read:project`, and stores its encrypted access and optional refresh
tokens through the existing API key infrastructure.

Because classic OAuth offers no read-only private-repository scope, do not add
`repo` to `ADMIN_PROJECT`. Store a separately managed, environment-bound
`GITHUB_REPOSITORY_READ` fine-grained token limited to the Orbiters repository with
only Metadata and Issues read access. The OAuth credential remains responsible for
Project reads. This keeps the OAuth consent narrow and makes private issue access
independently rotatable.

The backend calls GitHub REST and GraphQL directly. Development and production use
separate OAuth application records and Project credentials. Alpha synchronization is
strictly GitHub-to-Orbiters; Project writes require a separately approved `project`
scope.

## Consequences

- Disconnecting a user identity cannot interrupt the Project sync.
- Rotating production authorization cannot modify development state.
- Issue-author matching survives GitHub login changes.
- Admin endpoints return metadata and prefixes, never raw credentials.
- OAuth callback and state validation are shared, but scope, ownership, and storage
  depend on connection kind.
- Runtime environment binding prevents a development callback from rotating the
  production integration, or the reverse.
- Revocation fails closed locally even when GitHub is temporarily unavailable.
- A future GitHub App may replace repository access without changing the user
  identity contract.

## Alternatives Rejected

- One global token for identity and Project access, because it mixes privileges and
  ownership.
- Calling the local `gh` executable from backend requests, because shell execution,
  global keyrings, and mutable local configuration are unsuitable production
  dependencies.
- Requesting Project write scope during the first release, because read-only sync
  must prove stable identity and reconciliation first.
