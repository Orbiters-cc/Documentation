---
title: ADR 0009 - Codebase Memory Context Provider
section: Decisions
order: 209
audience: dev
stage: alpha
id: orbiters.decision.codebase-memory-context-provider
domain: operations
type: decision
owner: orbiters-engineering
lastVerified: 2026-07-12
relations: orbiters.development.knowledge-base-and-mcp, orbiters.development.product-steward-agents
---

# ADR 0009 - Codebase Memory Context Provider

## Status

Accepted for local coding-agent context.

## Decision

Use `codebase-memory-mcp` 0.9.0 as the structural code-context provider for the
Orbiters server, MCB, ReFit, Unit Git, and XRay Gizmos repositories. Keep the
Orbiters Knowledge Base MCP separate: codebase-memory explains code structure;
Orbiters MCP exposes reviewed product knowledge, reports, comments, proposals,
decisions, boards, and deployment evidence.

The Windows installer is pinned to the official release archive and verifies its
published SHA-256 before replacing the binary. Agent registration is opt-in because
the upstream installer edits every detected agent configuration.

## Evidence

The reproducible harness in `scripts/benchmarks/code-context-benchmark.js` ran 13
repository-specific architecture, graph, path, and code-search cases across five
repositories on 2026-07-12.

- 13 of 13 commands exited successfully.
- Expected-identifier recall was 100% for the defined cases.
- Mean query time was 1,451 ms; median query time was 127 ms.
- Clean indexing took 560-5,248 ms per repository on the benchmark machine.

The checked-in baseline is
`scripts/benchmarks/code-context-benchmark-baseline.json`. Graphify 0.8.21 was
detected, but no repository contained a current `graphify-out/graph.json`; the
benchmark did not trigger paid semantic extraction merely to manufacture a
comparison. This result proves functional coverage for the chosen cases, not
semantic superiority over every alternative.

## Operating Rules

1. Install with `scripts/setup/install-codebase-memory.ps1`.
2. Pass `-RegisterWithDetectedAgents` only when broad local configuration changes
   are intended.
3. Index the five repositories with
   `scripts/setup/index-orbiters-codebases.ps1`.
4. Keep automatic indexing and the Git-aware watcher enabled.
5. Re-run the benchmark after a provider upgrade or material repository-layout
   change and review recall as well as latency.
6. Do not treat graph results as authority when exact source reads or tests
   disagree.

## Consequences

Structural context is local, fast, reproducible, and does not require uploading the
repositories to a semantic extraction service. The provider still needs local
installation and per-machine agent configuration. Exact source inspection remains
the final evidence for implementation and review.
