---
title: Telegram Login Setup
section: Reference
order: 145
audience: admin, dev
stage: beta
id: orbiters.reference.telegram-login
domain: website
type: reference
owner: orbiters-platform
lastVerified: 2026-09-04
---

# Telegram Login Setup

## Configure the Application

1. Create or choose the bot representing your website in BotFather. Open its
   **Login Widget** settings.
2. Register your website origin and the exact backend callback URL in **Allowed
   URLs**. The callback path is `/auth/telegram/callback`, without an `/api` prefix.
3. Copy the **Client ID** and **Client Secret** from those settings. Keep the default
   RS256 signing algorithm, or choose ES256. Other signing algorithms are not supported.
4. In Orbiters API Keys, create a global **Telegram Login** key for the deployment's
   environment and enter the three fields below. The setup guide displays the
   callback URL derived from the public API URL.

| Field | Value |
| --- | --- |
| `TELEGRAM_CLIENT_ID` | Client ID from BotFather |
| `TELEGRAM_CLIENT_SECRET` | Client Secret from BotFather |
| `TELEGRAM_CALLBACK_URL` | Exact registered backend callback, such as `https://api.example.invalid/auth/telegram/callback` |

The API Keys system encrypts stored credentials and masks the secret. The active
global key is selected for the runtime environment, using the existing common-key
selection rules. Credentials are read on each login attempt; changing this key
does not require restarting the backend.

The backend accepts HTTPS callbacks and HTTP loopback callbacks for local
development. Telegram must also accept and register the exact callback. An HTTPS
development domain can be used when loopback registration is unavailable.

## Deployment URLs

### Local development with an HTTPS hostname

Telegram's callback is a redirect in the browser performing the login, not a
server-to-server webhook. A development HTTPS hostname can resolve to your local
machine: the browser must resolve it correctly and trust its TLS certificate.
The backend still needs outbound access to Telegram for the token exchange.

For example, with the frontend at `https://dev.example.invalid` and the backend
at `https://dev.api.example.invalid`, register the frontend origin and
`https://dev.api.example.invalid/auth/telegram/callback` in BotFather. Set the
same callback in the **dev** Telegram Login key. Use the HTTPS frontend address
throughout the flow rather than switching between that hostname and localhost;
the login state cookie must return to the backend hostname that issued it.

A public tunnel is not inherently required for this browser redirect. If
BotFather rejects the registered development URL, or the browser completing the
login is on a device that cannot reach the local machine, use a reachable HTTPS
development deployment or tunnel instead.

### Environment configuration

The frontend uses `REACT_APP_BACKEND_URL` for both providers. The backend uses
`FRONTEND_URL` to return users to the website and `FRONT_URL` for credentialed CORS.
Set these for the intended website in each deployment, whether running locally
or in Docker. Register the corresponding Telegram callback for each environment.

For another website using the Orbiters backend, configure its deployment URLs
and bot credentials explicitly. Arbitrary return domains are not accepted from
login request parameters.

## Endpoints

| Method and path | Behavior |
| --- | --- |
| `GET /auth/telegram` | Starts Telegram authorization |
| `GET /auth/telegram/callback` | Validates state and completes authorization |
| `GET /auth/discord` | Starts Discord authorization |
| `GET /auth/discord/callback` | Completes Discord authorization |
| `GET /auth/connections` | Returns the authenticated user's provider connection status |
| `POST /auth/connections/telegram` | Starts linking Telegram to the authenticated account |
| `POST /auth/connections/discord` | Starts linking Discord to the authenticated account |

Connection requests require the existing bearer JWT. Linking also requires
credentialed requests to preserve the browser's session cookie. Success uses the
existing Orbiters access-token and refresh-cookie flow, then returns linked users
to **Account > Overview**.

## Identity and Verification

Telegram uses its current OpenID Connect authorization-code flow with PKCE.
Orbiters requests `openid profile`; it does not request phone numbers or permission
to message the user. The backend checks the token signature against Telegram's
public keys, issuer, client audience, expiry, subject, issued-at time, and nonce.
Browser session state expires after ten minutes and is consumed on callback.

The verified Telegram `sub` is stored as `Users.telegramId` with a named unique
index. Telegram usernames and pictures are profile data and are never used to
match or merge accounts. Linking locks the destination Orbiters account, checks
its authentication eligibility and token version, and rejects another account's
identity. Concurrent attempts are also protected by the database unique index.

The normal startup sync adds the nullable Telegram profile fields and unique
index. The API key enum value is registered through the existing explicit enum
migration before sync. Schema verification should run twice against a disposable
database to exercise both initial creation and subsequent alteration.

## Troubleshooting

- **Provider unavailable:** check that an active global Telegram Login key exists
  in the correct environment and contains all three fields.
- **Login expired:** begin again in the same browser with cookies enabled. Backend
  restarts clear pending login state in the existing in-memory session store.
- **Login failed:** check the registered callback and signing algorithm. Restart
  the flow after changing credentials. Temporary Telegram network failures also
  require a new attempt.
- **Connection already belongs to an account:** sign in to that account, or connect
  a different identity. Accounts are not automatically merged.

See [Telegram's official login documentation](https://core.telegram.org/bots/telegram-login)
and [Account Login and Connections](../how-to/03-account-and-discord-login.md).
