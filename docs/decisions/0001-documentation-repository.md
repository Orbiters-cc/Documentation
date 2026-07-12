---
title: ADR 0001 - Documentation Repository
section: Decisions
order: 100
audience: dev
stage: stable
id: orbiters.decision.documentation-repository
domain: website
type: decision
owner: orbiters-docs
lastVerified: 2026-07-12
---

# ADR 0001 - Documentation Repository

## Status

Accepted.

## Context

Orbiters documentation was split between short website Markdown files under `backend/docs`, root operational notes under `docs`, and long README sections. This made the website docs incomplete and made operational knowledge hard to discover.

## Decision

Move website and ecosystem documentation into a dedicated root `Documentation` repository. The backend reads Markdown from that repository and serves filtered content through the existing `/documentation` API.

## Consequences

- Docs can be organized by reader need instead of backend folder location.
- Website documentation and repository documentation share one source.
- Docker must mount the documentation repository into backend containers.
- The parent repo needs submodule metadata that points to `https://github.com/Orbiters-cc/Documentation.git`.

## Repository Boundary

The Documentation repository is versioned independently. Application changes that
alter user logic update and publish Documentation first, then record its new gitlink
in the parent repository so CI and deployments resolve the reviewed content.
