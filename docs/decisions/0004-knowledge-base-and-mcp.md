---
title: ADR 0004 - Knowledge Base and MCP
section: Decisions
order: 103
slug: adr-0004-knowledge-base-and-mcp
audience: dev
stage: alpha
id: orbiters.decision.knowledge-base-and-mcp
domain: website
type: decision
owner: orbiters-engineering
lastVerified: 2026-07-12
relations: orbiters.decision.documentation-repository, orbiters.decision.server-side-doc-visibility, orbiters.development.knowledge-base-and-mcp
---

# ADR 0004 - Knowledge Base and MCP

## Status

Accepted for the alpha implementation.

## Context

Website help, architectural decisions, tool knowledge, and product research need one
discoverable context layer. Treating generated skills or an opaque vector database
as the source of truth would make review, provenance, and corrections harder. Agents
also need prior reports and human comments, not documentation alone, to avoid
repeating ideas across research runs.

## Decision

Reviewed Markdown in the Documentation repository remains canonical. The backend
builds a derived index with stable IDs, provenance, metadata filters, relations,
backlinks, and staleness state. The website and MCP apply the same server-side
audience and release-stage rules.

MCP v1 is stateless, read-only, scoped, rate-limited, and permission-filtered. It
exposes documents plus every visible report, report comment, proposal, board, and
decision needed to reconstruct product history. Full-text retrieval is the initial
baseline. Generated skills are downstream projections of reviewed knowledge, never
an input authority.

## Consequences

- Renaming or moving a page does not change its stable ID.
- CI must reject invalid metadata and broken local links.
- A source configuration can narrow visibility but cannot broaden it.
- Index and MCP responses can always identify the source path, commit, and checksum.
- Similarity search remains explainable and testable without an embedding service.
- Adding a new source requires an explicit registry entry and access-policy review.
- Skill generation must preserve citations back to canonical documents.

## Alternatives Rejected

- Using generated skills as canonical content, because transformations would obscure
  ownership and corrections.
- Replacing permission checks with one global agent index, because restricted
  reports and operations pages would leak.
- Requiring embeddings for the first release, because deterministic full-text search
  provides a simpler correctness baseline.
