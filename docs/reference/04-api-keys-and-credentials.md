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
lastVerified: 2026-07-14
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
- `PATREON`: creator access token, optional refresh token, and webhook secret.
- `KOFI`: official webhook verification token and public Ko-fi page URL.
- `PAYPAL`: creator REST application client ID, secret, live or sandbox environment,
  and optional account label.
- `VAPID`: Web push public/private keys and subject.

<alpha>

- `GITHUB_OAUTH_APP`: environment-specific client ID, client secret, and callback URL.
- `GITHUB_PROJECT`: environment-specific admin OAuth credential for read-only issue
  and Project synchronization.
- `AGENT_ACCESS`: hashed Product Steward bearer token with fixed scopes, expiration,
  revocation, and rate metadata.
- `GITHUB_REPOSITORY_READ`: encrypted, environment-bound fine-grained token used
  only for private issue reads; bind it to the expected owner and repository and
  grant only Metadata and Issues read access.
- `GITHUB_REPOSITORY_WRITE`: encrypted, environment-bound fine-grained token used
  only when a Board manager explicitly creates a repository issue; bind it to the
  expected owner and repository and grant Metadata read plus Issues read and write.
- `TRELLO_APP`: environment-specific Trello Power-Up API key and secret, with
  optional authorization-return and public-webhook URL overrides.
- `TRELLO_ACCOUNT`: encrypted creator authorization created by the Trello account
  connection flow; it is not entered in the generic API Keys form.
- `GUMROAD_OAUTH_APP`: environment-specific Gumroad client ID, client secret, and
  callback URL.
- `PATREON_OAUTH_APP`: environment-specific Patreon client ID, client secret, and
  callback URL.
- `MCP_ACCESS`: hashed read-only Knowledge MCP bearer token with an audience ceiling.

Raw agent and MCP tokens are revealed once and are not recoverable from stored
credentials. GitHub access tokens remain secret credential fields and never appear in
connection status responses.

</alpha>

## Setup Guides in the Website

The **API Keys** tabs in Creator and Admin expose a short setup guide as soon as a
provider is selected. Each guide appears before the credential fields and contains
at least three numbered steps plus a link to the provider's official setup
documentation.
The creator view shows creator-owned credential types; the admin view also shows
global and administrator-only types such as R2, the two configurable GitHub
credentials, and the Trello application.

The current guides cover every credential type that can be created from those tabs:

- **Discord:** create or select the Discord application, collect the application
  and bot credentials, then register both Orbiters callback URLs.
- **Cloudflare R2:** create the public and private buckets, issue a bucket-scoped
  Object Read & Write token, then copy the S3 URLs, access keys, and optional public
  files domain.
- **Gemini:** select the billing project in Google AI Studio, create the key, then
  record its project name and number with the credential.
- **Gumroad:** create the Orbiters application, generate the connected-account
  access token, then save the application values and API URL.
- **Jinxxy:** create a dedicated Creator API key, configure the Orbiters webhook,
  then save the API key and webhook signing secret.
- **Payhip:** enable software license keys for each product, enter their product key
  and secret as the documented JSON array, then add the optional account API key.
- **Lemon Squeezy:** create an environment-matched API key, copy the store ID, then
  create the Orbiters webhook and save its signing secret.
- **Patreon:** prefer the creator OAuth connection; for manual setup, create a
  creator client, copy the creator access and refresh tokens, grant member-email
  and campaign-webhook access, then save the webhook secret after registration.
- **Ko-fi:** enable the official webhook, copy the displayed Orbiters callback URL,
  save the verification token, then send Ko-fi's test event and confirm it appears
  before relying on shop or supporter notifications.
- **PayPal:** create a live or sandbox REST application in PayPal Apps & Credentials,
  copy its client ID and secret, choose the matching environment, then validate and
  synchronize it from Creator > Integrations and Creator > Revenues. Live accounts
  may need PayPal to enable Transaction Search.
- **Gumroad OAuth application:** create an application for the current environment,
  register the displayed Orbiters callback, and save its client ID and secret.
- **Patreon OAuth application:** create a Patreon client for the current
  environment, register the displayed callback, and save its client ID and secret.
  The creator access and refresh tokens shown on the same Patreon page are optional
  creator-account credentials; enter them through Creator > Integrations > Patreon
  > Use API key instead, not in this global application record.
- **VAPID:** generate one web-push key pair in a trusted terminal, save both keys,
  then set a monitored `mailto:` or HTTPS subject.
- **GitHub OAuth application:** create one OAuth App for the current environment,
  copy the displayed callback exactly with Device Flow disabled, then save the
  client ID and newly generated client secret.
- **GitHub private repository read access:** create a fine-grained token owned by an
  account that can see the private repository, limit it to `Orbiters` with only
  Metadata and Issues read permission, then save the token with the exact owner and
  repository names.
- **GitHub repository issue creation:** create a separate fine-grained token for the
  same repository, grant Metadata read and Issues read/write, then save it with the
  exact owner and repository names. Do not reuse the read-only synchronization
  credential or grant Project write permission.
- **Trello application:** create or select the Orbiters Power-Up and generate its
  API key, copy the environment-specific iframe URL from
  `setupGuide.connectorUrl`, add the origin of
  `setupGuide.authorizationReturnUrl` to allowed origins, then save the key and
  secret. The setup panel renders the connector, authorization return, and webhook
  base URLs as rounded read-only form fields with copy actions. Their adjacent
  `setupGuide.connectorNote`, `setupGuide.authorizationReturnNote`, and
  `setupGuide.webhookBaseNote` explain how each value is used.

The Trello URL fields stored with `TRELLO_APP` are overrides, not normally required
setup values. Runtime derives the authorization return URL from `FRONTEND_URL`, then
falls back to `FRONT_URL`, and appends `/creator?tab=integrations`. It derives the
webhook base from `PUBLIC_API_URL`. `TRELLO_RETURN_URL` and
`TRELLO_WEBHOOK_BASE_URL` override those defaults only when an environment needs an
explicit value. The setup guide resolves and displays the exact environment-derived
defaults, including the hosted `/trello/power-up/connector`; it does not load or
echo a stored override. A nonblank stored field replaces the derived default only at
runtime.

`GET /api-keys/options` returns the same `setupGuide` metadata used by both tabs.
Keep the service registry and this page aligned when a credential type or provider
workflow changes. Internal `GITHUB_PROJECT`, `TRELLO_ACCOUNT`, `AGENT_ACCESS`, and
`MCP_ACCESS` records are created by their dedicated authorization or token flows and
are not manually created from the generic API Keys form.

OAuth application setup guides expose their environment-specific callback as a
rounded, copyable read-only field before the secret fields. Patreon and Gumroad use
`${PUBLIC_API_URL}/store-oauth/callback`; GitHub uses
`${PUBLIC_API_URL}/github/oauth/callback`. Copy the rendered absolute URL rather than
constructing it manually, because development and production have different API
origins.

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
