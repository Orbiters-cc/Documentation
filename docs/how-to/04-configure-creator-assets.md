---
title: Creator Assets
section: Creator Tools
order: 40
audience: creator, admin, dev
stage: stable
id: orbiters.how-to.configure-creator-assets
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-07-12
---

# Creator Assets

Creators manage assets from the Creator area. The asset configuration screen is the source of truth for store links, access scopes, avatar base data, media, and version behavior.

## Configure An Asset

1. Open **Creator**.
2. Choose an asset.
3. Review the general metadata.
4. Configure store product links.
5. Configure access scopes if the asset has early-access users.
6. Configure avatar base or version information when the asset uses MCB or Unity tools.
7. Save and verify the public asset page.

## Access Scopes

Scope access controls which release channel a user can use:

- `alpha`: grants alpha, beta, and public access.
- `beta`: grants beta and public access.
- `public`: grants public access only.

Use scopes for test groups, early releases, creator QA, and staged updates. Do not use scope access as a substitute for license redemption unless you intend to grant that user direct access.

## Store Product Links

Store links connect an Orbiters asset to a product ID in a store integration. Add a public URL when users should see a purchase button.

## Discord Asset Roles

If an asset has a related Discord role, Orbiters queues a role grant when a user receives access through a supported workflow. Role removal is also queued when a matching refund or revocation disables access.

<audience include="dev">

Discord role writes go through `OutboxJob` rows and `outboxService`. Purchase, redemption, webhook, and sync code should enqueue role operations rather than mutating Discord roles inline.

</audience>
