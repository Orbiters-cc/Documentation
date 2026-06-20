---
title: Testing Strategy
section: Development
order: 61
audience: dev
stage: stable
---

# Testing Strategy

Tests must be deterministic and must not call remote vendors, Discord, production APIs, or machine-specific absolute paths.

## Test Data

Use local fixtures:

- fake users with fixed IDs,
- fake assets and store integrations,
- fake license keys such as `TEST-GUMROAD-LICENSE`,
- fake emails under `example.invalid`,
- fake Discord guild and role IDs,
- fake webhook payloads saved in tests or built inline.

## Backend Tests

Run all backend tests:

```bash
cd backend
npm test
```

Run documentation tests:

```bash
cd backend
npm run test:docs
npm run test:integration
```

## Startup Validation

When backend logic changes, boot with `FAIL_FAST=true` on an alternate port:

```bash
cd backend
FAIL_FAST=true PORT=4200 npm run dev:failfast
```

For database-only preflight:

```bash
cd backend
FAIL_FAST=true PORT=4200 EXIT_AFTER_DATABASE_INIT=true npm run dev:failfast
```

## Recommended Coverage

Add focused unit tests for:

- documentation audience and stage filtering,
- access policy decisions,
- outbox terminal job requeue behavior,
- webhook retry behavior,
- provider webhook signature validation,
- Payhip product JSON parsing,
- creator store-link create, update, conflict, and delete behavior.

