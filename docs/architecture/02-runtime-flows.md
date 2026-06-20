---
title: Runtime Flows
section: Architecture
order: 91
audience: dev
stage: stable
---

# Runtime Flows

This page summarizes the highest-risk runtime flows.

## Backend Startup

```mermaid
flowchart TD
    Start["server.js starts"] --> DB["initializeDatabase"]
    DB --> AI["ensure default AI config"]
    AI --> Bootstrap["bootstrap integrations"]
    Bootstrap --> DiscordStrategies["initialize Discord OAuth strategies"]
    DiscordStrategies --> Preflight{"EXIT_AFTER_DATABASE_INIT?"}
    Preflight -->|yes| Exit["close database and exit"]
    Preflight -->|no| Runtime["start runtime workers and listeners"]
    Runtime --> Listen["listen on configured port"]
```

## License Redemption

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Store
    participant DB
    User->>Frontend: Enter license key
    Frontend->>Backend: Redeem key
    Backend->>DB: Search mirrored sales
    Backend->>Store: Probe provider if needed
    Backend->>DB: Create or update UserAsset
    Backend-->>Frontend: Access result
```

## Store Webhook

```mermaid
sequenceDiagram
    participant Store
    participant Backend
    participant DB
    participant Outbox
    Store->>Backend: POST /store-webhooks/:provider/:secret
    Backend->>Backend: Validate signature
    Backend->>DB: Record or retry WebhookEvent
    Backend->>DB: Record sale or disable access
    Backend->>Outbox: Queue role revoke when needed
```

## Documentation Request

```mermaid
sequenceDiagram
    participant Browser
    participant Backend
    participant DocsRepo
    Browser->>Backend: GET /documentation?stage=beta
    Backend->>DocsRepo: Read Markdown
    Backend->>Backend: Filter audience and release stage
    Backend-->>Browser: Allowed page list or page content
```

