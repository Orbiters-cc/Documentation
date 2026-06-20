---
title: ADR 0001 - Documentation Repository
section: Decisions
order: 100
audience: dev
stage: stable
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

## Notes

The remote documentation repository was empty when this structure was created locally. Do not push from an agent without an explicit user request.

