---
title: AI apps MCP and OAuth reference
section: Reference
order: 80
audience: dev
stage: beta
id: orbiters.reference.chatgpt-plugin-mcp
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-10-02
relations: orbiters.how-to.chatgpt-plugin, orbiters.development.knowledge-base-and-mcp
---

# AI apps MCP and OAuth reference

One MCP server and one OAuth 2.1 authorization server serve ChatGPT, Codex, Claude
(web, desktop, mobile, Claude Code), Grok and Vibe. Code lives in
`backend/src/services/mcp/{oauth,plugin}`.

## Endpoints

| Path | Purpose |
| --- | --- |
| `POST /mcp` | Stateless Streamable HTTP MCP (JSON responses). `orb_oat_` OAuth tokens get the plugin tools; `orb_mcp_` personal connector tokens (`metadata.toolSet=plugin`) get scoped plugin tools; other `orb_mcp_`/`orb_agent_` tokens get the Knowledge tools. Without a token, `initialize` and `tools/list` work and only tools marked `auth: 'none'` can be called; calling another tool answers HTTP `401` with `WWW-Authenticate: Bearer error="invalid_token", …, resource_metadata="…", scope="read <tool scope>"` (lazy authentication). |
| `POST /mcp/connect` | Authenticated connector bootstrap for Grok and Vibe. Anonymous initialize/list calls receive a `401` OAuth discovery challenge. OAuth and personal connector tokens use the same plugin tools. |
| `GET /.well-known/oauth-protected-resource[/mcp[/connect]]` | RFC 9728 metadata with the matching resource URL. Both MCP resources are accepted by OAuth resource validation. |
| `GET/POST /oauth/connector-tokens`, `DELETE /oauth/connector-tokens/:id` | Human-member JWT API to list, generate and revoke personal Grok/Vibe tokens. POST accepts `app` and chosen `scopes`; `read` is required. Secrets are returned only by generation. |
| `GET /.well-known/oauth-authorization-server` | RFC 8414 metadata, including `client_id_metadata_document_supported` and `none` among the token endpoint methods (both required by Claude for CIMD). |
| `POST /oauth/register` | RFC 7591 dynamic registration. Redirect URIs must be HTTPS (or loopback) on a trusted host (`chatgpt.com`, `chat.openai.com`, `platform.openai.com`, `claude.ai`, `claude.com`, loopback, hosts trusted from the inbox, hosts of callback URLs pasted into connector keys). Refused hosts are recorded for the admin inbox. |
| `GET /oauth/authorize`, `POST /oauth/token`, `POST /oauth/revoke` | Authorization code with PKCE `S256`, `iss` in responses, rotating refresh tokens, RFC 7009 revocation. Loopback redirects match on any port (RFC 8252). |
| `GET/POST /oauth/requests/:id[/approve\|/deny]`, `GET/DELETE /oauth/connections[/:id]`, `GET /oauth/activity` | Website consent API, the member's connections and their own activity (JWT). |
| `GET /.well-known/openai-apps-challenge` | Domain verification token from the ChatGPT key. |
| `GET /.well-known/mcp/server-card.json` | MCP server card, the DNS-AID capability document. |
| `GET /ai-apps/widgets` | Public data for the ChatGPT and Claude homepage widgets (`enabled` follows the admin switches). |
| `POST /auth/reviewer-login` | Directory reviewer passcode sign-in (rate limited, assigned non-staff account only). |
| `/admin/chatgpt-plugin/*` | Admin console API (`admin-chatgpt-plugin` feature): overview, tools, calls (+ `calls.csv`), connections, clients, registrations, settings, readiness, reviewer, dns-aid, tunnels, self-test. |

## Scopes

Five consent switches: `read` (required), `drafts`, `publish`, `commissions`,
`profile`. Scopes are a ceiling; every tool re-checks the member's permissions.
Legacy scope names (`events:read`, `events:publish`, …) are mapped onto these when
tokens, grants and connections are read.

## Tools

Specs live in `backend/src/services/mcp/plugin/tools/*` and declare `category`,
`scope`, `access` (`read`, `write`, `external`), `stage` (`public` launch tools,
`preview` for testers), `auth` (`none` for signed-out tools) and `confirm`.

- **Audience**: `McpToolPolicy` stores `enabled` and `audience` (`everyone` or
  `testers`, null follows the stage). Testers: owner, admin and dev ranks, members in
  `settings.testerUserIds`, everyone on a development deployment.
- **Two-step confirmation** (`confirmations.js`): a confirm tool called without
  `confirmationCode` runs its `preview` and returns `{ confirmationRequired, action,
  summary, preview, confirmation: { code, expiresAt } }`. The code (8 characters,
  10 minutes, single use, stored as a SHA-256 hash in `McpPendingConfirmation`) is
  bound to the member, connection, tool and a hash of the arguments.
- **Notifications**: tools with `notice` create an Orbiters notification after
  success.
- **securitySchemes**: each tool lists `noauth`/`oauth2` with its scopes, on the
  tool descriptor (added to `tools/list`) and mirrored in `_meta`.
- **Cards**: `plugin/apps/**` registers MCP Apps resources (`ui://orbiters/…`,
  `text/html;profile=mcp-app`, CSP declared, self-contained HTML) and adds
  `_meta.ui.resourceUri` plus `openai/outputTemplate` to the tools they render.
- **Audit**: every call, including refused ones, writes an `McpToolCall` row with a
  redacted argument preview; previews are status `preview`. Unexpected errors are
  returned as a generic message.

## Limits and alerts

`settings.limits`: requests per member per minute, tool calls per member per day,
signed-out requests per IP per minute, and per-member overrides or pauses
(`pluginLimits.js`). `settings.alerts`: when errors in a window reach both a count
and a share of calls, staff (owner, admin, dev) get a notification, at most once
per cooldown (`pluginAlerts.js`).

## API keys

| Type | Fields |
| --- | --- |
| `CHATGPT_PLUGIN` | `CONNECTION_MODE` (`server`/`tunnel`), `TUNNEL_ID`, `CLIENT_REGISTRATION`, `OAUTH_CALLBACK_URL`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `OPENAI_APPS_CHALLENGE` |
| `CLAUDE_CONNECTOR` | `CLIENT_REGISTRATION`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` (callback fixed to `https://claude.ai/api/mcp/auth_callback`) |
| `GROK_CONNECTOR`, `MISTRAL_CONNECTOR` | `AUTHENTICATION` (`oauth`/`api_token`), `OAUTH_CALLBACK_URL` (trusts its host), `CLIENT_REGISTRATION`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` |
| `MCP_PUBLIC_URL` | `PUBLIC_URL`: HTTPS origin of a named tunnel; while active it replaces `PUBLIC_API_URL` as issuer and resource (`knownMcpUrls` still accepts the old resource) |

A manual ("your own") client is accepted only with its callback URLs while its key
is active. Client ID metadata documents are fetched only from allowlisted hosts
(5 s, 20 KB, no redirects), cached 24 hours and used stale for up to 7 days.

## Tunnels

- **OpenAI Secure MCP Tunnel**: the ChatGPT key's commands install `tunnel-client`
  v0.0.15 from GitHub releases when missing (SHA256SUMS verified; Homebrew on
  macOS), then `init --sample sample_mcp_with_dcr`, `doctor` and `run`. Docker: the
  `tunnel` profile of `docker-compose.dev.yml` runs `ghcr.io/openai/tunnel-client`
  with `.env.tunnel.dev`. `/oauth/authorize` accepts an `https://*.openai.com`
  resource only when it names the configured tunnel.
- **Cloudflare named tunnel**: the `public-tunnel` profile runs `cloudflared` with
  `TUNNEL_TOKEN` from `.env.tunnel.dev`; save its hostname in the `MCP_PUBLIC_URL`
  key.

## Directory readiness and discovery

`directoryReadiness.js` reports pass/warn/fail rows for every directory (HTTPS,
launch tool set, annotations, two-step publishing, listing lengths, privacy and
support URLs, reviewer account) and per platform (ChatGPT, Claude, Grok, Mistral).
Claude reaches the API from `160.79.104.0/21`. The DNS-AID record is
`_orbiters._mcp._agents.<site host>` (SVCB with `alpn="mcp"`, `port=443` and
`cap=<server card URL>`, or a `dnsaid_cap` TXT fallback); leave `cap-sha256` out
unless it is updated after every tool change.

## Tokens and data

Personal connector tokens are `MCP_ACCESS` keys with `metadata.toolSet=plugin`,
`app`, plugin `scopes` and the member’s `userTokenVersion`. They have no automatic
deadline; disabling/deleting the key or changing the account token version
invalidates them. The server accepts case-insensitive Bearer schemes, checks
human-account eligibility, current tool permissions, app availability and member
budgets, and audits calls as `api_token`. Agent and Knowledge token scopes cannot
be used to grant plugin permissions. Account Connections lists these personal
tokens alongside OAuth connections and disconnects them through the owner-scoped
revocation endpoint. Publishing retains the same two-step confirmation flow.


- Access tokens (`orb_oat_…`) last 60 minutes and refresh tokens (`orb_ort_…`) 60
  days by default. Only SHA-256 hashes are stored; reuse of a rotated refresh
  token or replay of a code revokes the whole family.
- Tokens are bound to the member's `tokenVersion`.
- Retention: tool calls 180 days, expired tokens and confirmation codes after a
  day, decided registration inbox entries after 90 days. Account closure deletes
  connections, grants, calls and pending confirmations.
- Tables (all sync without `alter`): `McpOAuthClient`, `McpConnection`,
  `McpOAuthGrant`, `McpOAuthToken`, `McpToolPolicy` (+ `audience` migration),
  `McpToolCall`, `McpPendingConfirmation`, `McpRegistrationAttempt`,
  `McpPluginSetting`.
