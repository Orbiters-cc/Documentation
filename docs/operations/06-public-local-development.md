---
title: Public Access to Local Development
section: Operations
order: 106
audience: admin, dev
stage: stable
id: orbiters.operations.public-local-development
domain: website
type: runbook
owner: orbiters-platform
lastVerified: 2026-09-04
---

# Public Access to Local Development

## Current Routing

The public server accepts development requests through its existing Cloudflare
tunnel and forwards them to the Windows development workstation over Tailscale.
The frontend and backend still run on Windows; the production application stays
on the public server.

| Public hostname | Destination |
| --- | --- |
| `dev.orbiters.cc` | Windows development frontend, port 3100 |
| `dev-api.orbiters.cc` | Windows development backend, port 4100 |
| `orbiters.cc` | Production frontend container |
| `api.orbiters.cc` | Production backend container |

The development upstreams are configured in `Caddyfile.prod` using the Windows
workstation's Tailscale IPv4 address. The public server runs this configuration
as `Caddyfile`. Both development routes forward the original host and set
`X-Forwarded-Proto` to HTTPS. Caddy also proxies the frontend hot-reload WebSocket.

`cloudflared/config.yml` routes both public development hostnames to Caddy on
port 80. Cloudflare terminates public TLS. The API uses the first-level hostname
`dev-api.orbiters.cc`: Cloudflare's standard Universal SSL certificate does not
cover the previous nested hostname `dev.api.orbiters.cc`.

## Availability

Keep the Windows machine awake, Tailscale connected on both machines, and the
local frontend and backend running. The public server's Caddy container must be
able to reach the workstation's Tailscale address on ports 3100 and 4100.

Requests reach the actual development services and database. Local code changes
and backend restarts are therefore visible through the public development URLs.
If the workstation or a service is unavailable, its development route fails;
requests are never sent to production as a fallback.

A Windows hosts-file entry for `dev.orbiters.cc` can remain for direct local
frontend access. The frontend uses `https://dev-api.orbiters.cc` for API requests.
The old local `dev.api.orbiters.cc` entry is not the public API address. No new
hosts-file entry is required for the public API.

## Application and Provider Settings

The local root and frontend `.env.dev` files use the new API hostname for
`BACKEND_URL`, `REACT_APP_BACKEND_URL`, and provider URLs. The backend `.env.dev`
sets `PUBLIC_API_URL` to the same address. Frontend origin and credentialed CORS
remain `https://dev.orbiters.cc`.

Changing Docker-injected frontend environment variables requires recreating the
frontend container; a browser refresh alone does not update its configuration.
The running backend must also reload environment changes and cached Discord
strategy configuration.

Register these URLs with their respective providers:

| Provider | Registration |
| --- | --- |
| Telegram Allowed URLs | `https://dev.orbiters.cc` |
| Telegram callback | `https://dev-api.orbiters.cc/auth/telegram/callback` |
| Discord login redirect | `https://dev-api.orbiters.cc/auth/discord/callback` |
| Discord verification redirect | `https://dev-api.orbiters.cc/verify/callback-discord` |

The two Discord callback fields on the **dev** API key use the new hostname.
The provider's own application registration must match them. Telegram additionally
requires a configured **Telegram Login** dev key; public routing alone does not
supply its client credentials. Keep production provider settings unchanged.

## Validate Routing

Check the following from the public server or another machine without the local
hosts-file override:

1. The development homepage returns 200 and serves the development frontend.
2. The development API `/healthz` returns 200 over validated HTTPS.
3. `/auth/discord` redirects with the new development callback URL.
4. `/auth/telegram/callback` without a login state returns a controlled
   `invalid_state` redirect to the development frontend.
5. The frontend `/ws` WebSocket upgrades with HTTP 101.
6. Production homepage and API `/healthz` continue to return 200.

Requests are still subject to existing Cloudflare security policies. A 403 from
Cloudflare can be a request-policy issue rather than a tunnel or Caddy failure.
Inspect response headers and Cloudflare events before changing origin routing.

## Configuration Changes and Rollback

Back up the public server's active `Caddyfile`, `Caddyfile.prod`, and
`cloudflared/config.yml` before editing them. Validate a candidate with
`caddy validate` and compare its adapted JSON to the live configuration so only
the intended hostname routes change. Write the active Caddyfile in place to
preserve its Docker bind mount, then use `caddy reload`.

Cloudflared must restart to pick up changes to this locally managed ingress
configuration. During a rollout, start a temporary connector on the same tunnel
with the updated configuration, wait for registered tunnel connections, restart
the normal connector, verify its connections, and remove the temporary connector.
This maintains an active connector for production throughout the change.

The initial rollout's server backups are under
`~/.local/state/orbiters-dev-routing/20260904T144749Z/`. Local environment and
Discord callback backups are under
`%LOCALAPPDATA%\Orbiters\dev-routing\20260904T144749Z\`.

To undo the rollout, restore the backed-up Caddy and tunnel configuration, reload
Caddy, and reload the tunnel configuration. Restore local environment values and
the dev Discord callback fields, then reload the development services. Restore
provider-side callback registrations if they were changed. The separately created
`dev-api.orbiters.cc` DNS record can be removed after confirming it is unused.

See [Telegram Login Setup](../reference/telegram-login.md) and
[Cloudflare Universal SSL limitations](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/).
