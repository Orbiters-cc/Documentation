---
title: Notion Connection Setup
section: Reference
order: 76
audience: admin, dev
stage: alpha
id: orbiters.reference.notion-connection-setup
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-09-14
---

# Notion Connection Setup

Create a public Notion connection for Orbiters through the
[Notion developer portal](https://www.notion.so/profile/integrations).
Enable read, insert and update content capabilities. Creators select the pages and
source databases to share during OAuth authorization. Follow Notion's
[authorization guide](https://developers.notion.com/guides/get-started/authorization)
for connection distribution requirements.

Add a global **Notion application** credential in the Orbiters API-key administrator
interface, selecting the intended environment.

| Field | Value |
| --- | --- |
| `NOTION_CLIENT_ID` | Public connection OAuth client ID |
| `NOTION_CLIENT_SECRET` | Public connection OAuth client secret |
| `NOTION_REDIRECT_URL` | Exact frontend Creator URL, such as `https://dev.orbiters.cc/creator` |

For development, the callback is `https://dev.orbiters.cc/creator`.
For production, it is `https://orbiters.cc/creator`. Register the exact
value with Notion; the browser returns to that page and exchanges its authorization
code through the authenticated Orbiters backend. Local HTTP callbacks are accepted
only for localhost or 127.0.0.1. Use separate environment credentials where appropriate.

The Creator page recognizes the pending Notion OAuth state and opens Integrations
even when the callback contains only `code` and `state`, without a `tab` parameter.
Completion removes the authorization parameters from the URL. If an earlier attempt
returned to Assets without connecting, reload Orbiters and start **Connect workspace**
again; do not reuse the old authorization URL or code.

The backend requires `API_CREDENTIAL_ENCRYPTION_KEY`. Workspace access and refresh
tokens are encrypted as internal `NOTION_ACCOUNT` credentials owned by the creator.
They are never returned through connection-status APIs or exposed in browser settings.

Set `PUBLIC_API_URL` to the externally reachable backend origin to enable images
embedded from Orbiters. Notion must be able to fetch those capability URLs.

The integration uses Notion API version `2026-03-11`, including its
[saved views](https://developers.notion.com/guides/data-apis/working-with-views) and
[Markdown content](https://developers.notion.com/guides/data-apis/working-with-markdown-content)
APIs. It does not use an embedded Notion web page or personal browser cookies.

`NOTION_SYNC_ENABLED=false` disables the background scheduler. The general
`SKIP_EXTERNAL_STARTUP=true` flag also disables it. Do not use these flags when
validating actual background synchronization.

Before enabling production use, complete an OAuth connection and exercise import,
edit, image attachment, status move and disconnection with a designated test database.
Automated Orbiters tests use local provider fixtures and do not establish that a
particular live connection has the necessary capabilities or page access.
