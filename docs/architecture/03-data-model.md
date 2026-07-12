---
title: Data Model Notes
section: Architecture
order: 92
audience: dev
stage: stable
id: orbiters.architecture.data-model
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-07-12
---

# Data Model Notes

This is a high-level map of the Orbiters data model. It is not a full schema dump.

## Identity And Access

- `Users`: Discord-linked accounts.
- `UserAssets`: user access records for assets.
- `Roles`: Orbiters role metadata mapped to Discord roles.
- `UserDiscordServerPresence`: per-guild user state.
- `UserDiscordServerRole`: tracked Discord role state.

## Assets

- `Assets`: creator-owned items.
- `AvatarVersions`: version metadata for avatar assets.
- `AvatarBases`: avatar base definitions.
- `ModelFile`: model file records.
- `AssetTierAccess`: links assets to supporter tiers.

## Stores

- `StoreIntegrations`: creator-provider connections.
- `AssetStoreLinks`: canonical asset-to-product mappings.
- `StoreSales`: mirrored sales and license hashes.
- `WebhookEvent`: deduplicated provider events.

## Discord Integrations

- `DiscordIntegration`: guild routing to shared or custom bot mode.
- `DiscordVerificationRules`: guild-scoped verification rules.
- `Appeals` and `AppealRules`: guild-scoped moderation flows.

## Runtime Work

- `OutboxJob`: retryable side effects such as Discord role changes.
- `APIKey`: global and owner-scoped credentials.
- `File`: uploaded file records.
- `FileUsageHourly` and `StorageUsageSnapshot`: storage usage estimates and snapshots.

## Sequelize Sync Rules

New models must avoid column-level `unique: true`. Use named indexes instead. New enum columns on no-alter tables need explicit migration blocks and enum value registration where applicable.

<alpha>

The MCB custom-base adoption and path-identity contract is documented in [ADR 0003 - MCB Custom Base Adoption And Path Identity](../decisions/0003-mcb-custom-base-adoption-and-path-identity.md). Canonical source identity is stored in `AvatarBaseSourceRevisions` and `AvatarBaseSourceFiles`. `McbAvatarInstances` scopes component observations by user and workspace, `McbPathBindings` stores lifecycle-managed project-relative path history tied to canonical source identity, and `McbInstanceEvents` records registration, lineage, and recovery decisions. The Unity component remains operationally authoritative and locally revalidates every server suggestion. The former unscoped `AvatarPathOverrides` model is not part of the runtime contract; an existing physical table may remain dormant until a separately reviewed destructive migration removes it.

</alpha>

<alpha>

## Product Knowledge and Planning

- `KnowledgeSource`: registered source configuration and index health.
- `GitHubConnection`, `ExternalOAuthState`, `GitHubProjectSnapshot`, and
  `ExternalIssueLink`: separated OAuth identity, read-only Project snapshots, and
  stable issue linkage.
- `Board`, `BoardMembership`, `BoardSubmissionPolicy`, and `BoardItem`: independent
  planning containers, permissions, intake policy, and object placement.
- `Proposal`, `ProposalComment`, and `ProductDecision`: Markdown product context,
  discussion, and human outcomes.
- `ForecastScenario` and `ForecastLineItem`: private saved projections with snapshot
  assumptions.
- `AgentProfile`, `AgentRun`, and `AgentMutation`: non-human product identity,
  versioned research work, and idempotent API audit.
- `ProductResearchReport`, `ResearchRecommendation`, and `ResearchReportComment`:
  durable evidence, bounded recommendations, comments, similarity classification,
  and review outcomes.

These models use string-backed status fields and named indexes to avoid introducing
new Postgres enum-alter hazards.

</alpha>
