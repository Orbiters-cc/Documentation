---
title: API Keys and Credentials
section: Reference
order: 73
audience: admin, dev
stage: stable
id: orbiters.reference.api-keys-and-credentials
domain: website
type: reference
owner: orbiters-security
lastVerified: 2026-07-12
---

# API Keys and Credentials

Runtime credentials are stored in the `APIKeys` table instead of hardcoded environment variables where possible.

## Credential Types

- `DISCORD`: OAuth application and bot credentials.
- `R2`: Cloudflare R2 storage credentials and quota settings.
- `GEMINI`: AI provider key.
- `GUMROAD`: Gumroad application and access token fields.
- `JINXXY`: Jinxxy API key and webhook secret.
- `PAYHIP`: Payhip product JSON and account API key.
- `LEMONSQUEEZY`: Lemon Squeezy API key, store ID, and webhook secret.
- `VAPID`: Web push public/private keys and subject.

<alpha>

- `GITHUB_OAUTH_APP`: environment-specific client ID, client secret, and callback URL.
- `GITHUB_PROJECT`: environment-specific admin OAuth credential for read-only issue
  and Project synchronization.
- `AGENT_ACCESS`: hashed Product Steward bearer token with fixed scopes, expiration,
  revocation, and rate metadata.
- `GITHUB_REPOSITORY_READ`: encrypted, environment-bound fine-grained token used
  only for private issue and fallback Project reads; bind it to the expected owner
  and repository.
- `MCP_ACCESS`: hashed read-only Knowledge MCP bearer token with an audience ceiling.

Raw agent and MCP tokens are revealed once and are not recoverable from stored
credentials. GitHub access tokens remain secret credential fields and never appear in
connection status responses.

</alpha>

## Environments

API keys can be scoped by environment. Runtime lookup prefers the current environment, then `common`, then unscoped keys.

## Bootstrap

On a fresh or recovered database, seed required global keys before flows such as Discord auth, bot login, push notifications, license sync, or R2 storage can run.

```bash
cd backend
npm run api-keys:bootstrap -- --type DISCORD --environment dev --file ./secrets/discord-api-key.json
```

Use field names from `backend/src/services/apiKeyDefinitions.js`.

## Safety

Do not paste real secrets into documentation, issue reports, Discord channels, or screenshots. Use safe examples and refer to field names.
