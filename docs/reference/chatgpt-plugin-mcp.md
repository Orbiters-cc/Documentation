---
title: ChatGPT plugin MCP and OAuth reference
section: Reference
order: 80
audience: dev
stage: beta
id: orbiters.reference.chatgpt-plugin-mcp
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-09-30
relations: orbiters.how-to.chatgpt-plugin, orbiters.development.knowledge-base-and-mcp
---

# ChatGPT plugin MCP and OAuth reference

## Endpoints

| Path | Purpose |
| --- | --- |
| `POST /mcp` | Stateless Streamable HTTP MCP. `orb_oat_` OAuth tokens get the plugin tools; `orb_mcp_`/`orb_agent_` API tokens keep the knowledge tools. A request without a token gets `401` with `WWW-Authenticate: Bearer resource_metadata="…/.well-known/oauth-protected-resource/mcp"`. |
| `GET /.well-known/oauth-protected-resource/mcp` | RFC 9728 metadata (also served without the `/mcp` suffix). Resource and issuer come from `PUBLIC_API_URL`. |
| `GET /.well-known/oauth-authorization-server` | RFC 8414 metadata, including `client_id_metadata_document_supported: true`. |
| `POST /oauth/register` | RFC 7591 dynamic registration. Redirect URIs must be HTTPS (or loopback) and, with the default policy, on a trusted host (`chatgpt.com`, `chat.openai.com`, `platform.openai.com`, `claude.ai`, `claude.com`, loopback). |
| `GET /oauth/authorize` | Authorization code with PKCE `S256`; stores a 10-minute request and redirects to `FRONTEND_URL/oauth/authorize?request=<id>`. |
| `POST /oauth/token` | `authorization_code` and `refresh_token` grants; `client_secret_post`, `client_secret_basic` or public clients. |
| `POST /oauth/revoke` | RFC 7009; revoking a refresh token revokes its whole token family. |
| `GET/POST /oauth/requests/:id[/approve\|/deny]` | Consent API used by the website (JWT). Impersonation sessions are refused. |
| `GET/DELETE /oauth/connections[/:id]` | The member's connected apps (JWT). |
| `GET /.well-known/openai-apps-challenge` | Returns `OPENAI_APPS_CHALLENGE` from the environment's active `CHATGPT_PLUGIN` API key, or `404`. |
| `/admin/chatgpt-plugin/*` | Admin console API, gated by the `admin-chatgpt-plugin` feature (admin and dev ranks by default). `POST /admin/chatgpt-plugin/tunnels` creates an OpenAI tunnel with a single-use admin key that is never stored or logged. |

## Plugin API key

The `CHATGPT_PLUGIN` API key is global and per environment. Every field is optional:

| Field | Meaning |
| --- | --- |
| `CONNECTION_MODE` | `server` or `tunnel`. Tunnel mode needs `TUNNEL_ID` (`tunnel_` followed by 32 lowercase hex characters). |
| `CLIENT_REGISTRATION` | `automatic` (dynamic registration and client metadata documents) or `manual`. |
| `OAUTH_CALLBACK_URL`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` | ChatGPT's "User-Defined OAuth Client". Manual registration needs the HTTPS callback and a client ID; with a secret the client uses `client_secret_post`, without one it is public and relies on PKCE. The client is rejected once the key is disabled or no longer matches. |
| `OPENAI_APPS_CHALLENGE` | Domain verification token for plugin directory submission. |

## Client ID metadata documents

A `client_id` that is an HTTPS URL on an allowed host (`chatgpt.com` and `claude.ai`
by default, **Settings → metadataDocumentHosts**) is resolved by fetching that
document (5 s timeout, 20 KB, no redirects). Its `client_id` must equal the URL and
each redirect URI must pass the redirect policy. The document is cached for 24
hours, and a stale copy is used for up to 7 days if the host cannot be reached.
These clients are public clients protected by PKCE.

## Secure MCP Tunnel

A `CHATGPT_PLUGIN` key in tunnel mode switches the environment to tunnel mode. OpenAI's `tunnel-client` forwards MCP requests and
protected-resource discovery from the local network, and rewrites the resource URL
to its tunnel service. `/oauth/authorize` then accepts a `resource` only when it is
this environment's MCP URL or an `https://*.openai.com` URL containing the
configured tunnel ID. The authorization endpoint itself is opened by the member's
browser, so the website and API must be reachable from that browser.

## Tokens

- Access tokens (`orb_oat_…`) last 60 minutes and refresh tokens (`orb_ort_…`) 60
  days by default (Admin → ChatGPT Plugin → Settings). Only SHA-256 hashes are stored.
- Refresh tokens rotate. Reusing a rotated refresh token, or replaying an
  authorization code, revokes every token issued from that grant.
- Tokens are bound to the member's `tokenVersion`: revoking all website sessions
  or closing the account ends plugin access as well.
- Client secrets are derived with HMAC from `MCP_OAUTH_SECRET` (falling back to
  `JWT_SECRET`) and never stored. Rotating the secret invalidates confidential clients.

## Scopes

`account:read` is always granted. The others (`events:*`, `assets:*`,
`commissions:*`, `posts:*`, `communities:read`, `boards:*`, `profile:write`,
`articles:write`) are a ceiling chosen on the consent screen: each tool still calls
the same services and permission checks as the website.

## Tools and audit

Tools are declared in `backend/src/services/mcp/plugin/tools/*` with a category,
scope, access level (`read`, `write`, `external`) and annotations derived from it.
`McpToolPolicy` stores per-tool switches (default on). Every call, including calls
to tools that are off or outside the grant, writes an `McpToolCall` row with a
redacted, truncated argument preview, the result link and the error. Unexpected
server errors are returned to the client as a generic message.

Write tools are idempotent where the website is: event drafts reuse
`clientRequestId` (or a stable id derived from the request), social posts reuse
their submission key, and asset drafts are matched through earlier audited calls.

## Data model

`McpOAuthClient`, `McpConnection`, `McpOAuthGrant`, `McpOAuthToken`,
`McpToolPolicy`, `McpToolCall` and `McpPluginSetting` sync without `alter`.
Account closure deletes the member's connections, grants and call history; account
merge drops the source account's connections.
