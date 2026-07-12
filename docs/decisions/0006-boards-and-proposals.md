---
title: ADR 0006 - Boards and Proposals
section: Decisions
order: 105
audience: dev
stage: alpha
id: orbiters.decision.boards-and-proposals
domain: website
type: decision
owner: orbiters-product
lastVerified: 2026-07-12
relations: orbiters.development.boards-proposals-and-forecasts, orbiters.decision.github-connection-separation
---

# ADR 0006 - Boards and Proposals

## Status

Accepted for the alpha implementation.

## Context

The original idea-box concept combined the idea, kanban placement, GitHub issue,
visibility, and forecast in one mental object. Multiple personal Boards, creator
planning, moderation, synchronized delivery status, and future commission items need
independent lifecycles and permissions.

## Decision

Use `Proposal` as the canonical Markdown product idea and `Board` as the general
planning container. A `BoardItem` places a Proposal or external issue in a Board.
Membership and submission policy belong to the Board. Comments and product decisions
belong to the Proposal or research report. Forecast scenarios privately snapshot
selected Proposal assumptions.

Orbiters owns Proposals and local Board configuration. GitHub owns issue content and
Project delivery status. The first synchronization phase only copies GitHub state
into linked Board items. Linking preserves both identities: the issue remains the
delivery record while the Proposal remains the product-context record.

## Consequences

- One Proposal can participate in several planning views without duplication.
- Visibility and moderation are explicit states, not a public/private Boolean.
- A creator's `Creations` Board can evolve toward commissions without overloading
  Proposal records.
- Forecast history remains reproducible after Proposal edits.
- Public Orbiters intake and moderated creator intake remain separate Board policies.
- GitHub status drift is reconciled from stable field and option node IDs.
- Moving a GitHub-backed item locally is blocked until write synchronization has its
  own permission and failure contract.

## Alternatives Rejected

- Keeping “Idea Box” as the universal entity name, because Boards will contain more
  than ideas.
- Copying GitHub issues into Proposals, because the two sources would diverge.
- One global Board, because personal and creator workflows need independent
  membership and submission rules.
- Public/private as a single flag, because moderation, staff review, membership, and
  unlisted sharing have different meanings.
