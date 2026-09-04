---
title: Local Development and OAuth
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

# Local Development and OAuth

## Local Routing

Development runs on the Windows workstation. Its hosts file resolves
`dev.orbiters.cc` and `dev.api.orbiters.cc` to `127.0.0.1`. Local Caddy serves
HTTPS using the trusted development certificate and forwards requests to:

| Local hostname | Destination |
| --- | --- |
| `dev.orbiters.cc` | Development frontend, port 3100 |
| `dev.api.orbiters.cc` | Development backend, port 4100 |

The frontend uses `https://dev.api.orbiters.cc` for API requests. Frontend origin
and credentialed CORS use `https://dev.orbiters.cc`. The root and frontend
`.env.dev` files contain the local API address; the backend `.env.dev` sets
`PUBLIC_API_URL` to the same address.

The temporary public forwarding to the workstation has been removed, including
its `dev-api.orbiters.cc` DNS alias. Development does not require Tailscale or the
production server. Existing public DNS for the original development hostnames
may reach a different server; the Windows hosts entries determine local access.

## OAuth Callbacks

Discord and Telegram authorization return the browser to the configured callback
URL. The browser resolves that URL using its own DNS configuration, including the
Windows hosts file. The backend then makes an outbound request to the provider
to exchange the authorization code.

Use the same desktop browser and development hostnames throughout the flow so
the callback receives the session cookie issued at login. The local certificate
must be trusted. Provider callback registrations must exactly match these URLs:

| Provider | Registration |
| --- | --- |
| Telegram Allowed URLs | `https://dev.orbiters.cc` |
| Telegram callback | `https://dev.api.orbiters.cc/auth/telegram/callback` |
| Discord login redirect | `https://dev.api.orbiters.cc/auth/discord/callback` |
| Discord verification redirect | `https://dev.api.orbiters.cc/verify/callback-discord` |

The two callback fields on the development Discord API key use the original
local API hostname. Telegram requires a Telegram Login dev key with its client
credentials and the callback above.

Telegram documents registration of Allowed URLs but does not specify a public
HTTP reachability check during that registration. Do not introduce a public
tunnel solely because OAuth uses a callback. If BotFather rejects a URL, inspect
its actual error before changing DNS or routing.

Server-to-server webhooks are separate from browser OAuth redirects. A provider
sending a webhook cannot use the workstation's hosts file and needs a reachable
endpoint or an appropriate forwarding tool.

## Apply and Check Configuration

After changing Docker-injected frontend environment variables, recreate only
the development frontend container. Reload the existing development backend to
pick up environment values and cached Discord strategy configuration.

From Windows, check that:

1. Both local HTTPS hostnames resolve to the workstation without certificate warnings.
2. The frontend homepage and API `/healthz` return 200.
3. `/auth/discord` redirects with the exact local API callback above.
4. A fresh login starts and completes in the same browser. Restart any flow begun
   before changing hostnames; its state cookie belongs to the previous hostname.

A health check confirms routing, not provider authorization. Complete a real
provider login separately after configuring its application and credentials.
Production configuration and provider credentials remain independent.

See [Telegram Login Setup](../reference/telegram-login.md) and
[Telegram's official login documentation](https://core.telegram.org/bots/telegram-login).
