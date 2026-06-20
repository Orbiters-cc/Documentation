---
title: API Keys and Credentials
section: Reference
order: 73
audience: admin, dev
stage: stable
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

