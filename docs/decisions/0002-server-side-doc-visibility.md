---
title: ADR 0002 - Server-Side Documentation Visibility
section: Decisions
order: 101
audience: dev
stage: stable
id: orbiters.decision.server-side-doc-visibility
domain: website
type: decision
owner: orbiters-engineering
lastVerified: 2026-07-12
---

# ADR 0002 - Server-Side Documentation Visibility

## Status

Accepted.

## Context

Documentation includes public user help, creator setup steps, moderation procedures, admin operations, and developer implementation details. Some pages and sections must not be sent to users outside the intended audience.

## Decision

Filter documentation on the backend before the frontend receives Markdown. Page frontmatter controls page-level access. Inline tags control section-level access. Release-stage filtering also happens on the backend.

## Consequences

- Restricted Markdown is not present in the browser for unauthorized users.
- Frontend rendering remains simple.
- Tests must cover both page-level and inline filtering.
- Docs authors need to use frontmatter and inline tags consistently.
