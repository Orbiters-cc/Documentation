---
title: Data Model Notes
section: Architecture
order: 92
audience: dev
stage: stable
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

