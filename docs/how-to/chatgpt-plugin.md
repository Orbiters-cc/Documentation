---
title: Use Orbiters from ChatGPT, Claude and other AI apps
section: Account
order: 36
audience: user, creator, mod, admin, dev
stage: beta
id: orbiters.how-to.chatgpt-plugin
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-10-02
relations: orbiters.community.events, orbiters.how-to.create-and-measure-assets, orbiters.how-to.discord-asset-access, orbiters.reference.chatgpt-plugin-mcp
---

# Use Orbiters from ChatGPT, Claude and other AI apps

The Orbiters plugin lets ChatGPT, Codex, Claude, Grok and Vibe act with your
Orbiters account: plan community events, explain why an asset is locked, prepare
asset drafts and brief you on commissions. It uses your current Orbiters
permissions, so it can only do what you could do on the website. Searching
creators, assets and help works before you connect.

## Connect your account

| App | Where |
| --- | --- |
| ChatGPT | **Apps**, add **Orbiters** (or mention `@Orbiters` in a chat) |
| Claude | **Customize → Connectors**, add Orbiters from the directory or as a custom connector |
| Grok | **Connectors → New Connector → Custom** |
| Vibe | **Connectors → Add custom connector** |

1. Add Orbiters in the app. Custom connectors ask for the MCP address shown on
   the homepage widget or in this guide's reference page.
2. When the app needs your account, it opens Orbiters and asks you to sign in.
3. Review the five permissions. **See your Orbiters data** is always on; switch
   off **Create and edit drafts**, **Publish outside Orbiters**, **Commission and
   Sona edits** or **Profile and articles** if you do not want to allow them.
4. Check that the page shows where you will return (for example `chatgpt.com` or
   `claude.ai`), then choose **Allow**.

Codex and Claude Code open the same Orbiters page.

### Grok and Vibe custom connectors

Use the **Server** / **MCP server URL** copied from the app’s form in
**Admin → API Keys**. For production it is
`https://api.orbiters.cc/mcp/connect`. This address requires authentication before
setup can finish. If Grok says **Connected** but tools keep asking for sign-in,
disconnect the previous connector and reconnect with this address. For OAuth,
finish Orbiters sign-in and approve permissions; an unfamiliar callback host
must first be trusted in the admin registration inbox or saved in the Grok key.

Vibe’s form follows **Connector name → Server → Description → Authentication →
Authorization header value**. Choose **API Token Authentication**, then **Bearer**.
Choose permissions under **Token permissions**, select **Generate personal token**,
and paste the copied token into Vibe’s **Token** field. It is shown only once,
acts as your own account and is stored as a hash. The default grants reading and
draft edits; publishing requires its own permission and confirmation preview.
Grok can also use a personal Bearer token. Choose OAuth instead if your app offers it.

Personal tokens can be revoked under **Manage your tokens** in the connector
form or disconnected in **Account → Connections → AI apps**. Revocation takes
effect immediately. A global connector setup key does not make a personal token
site-wide or let it act as other members.

## What it can do

| Area | Examples |
| --- | --- |
| Search and help | "Find avatars compatible with Novabeast", "how do downloads work?" (works signed out) |
| Community events | "Create a draft for Friday 9 PM in Chillout Lounge", "publish it", "did the Discord event go out?" |
| Access and support | "Why is the beta of my avatar locked?", "which Discord role unlocks this?" |
| Creator assets | Draft a listing from notes and finish it on Orbiters |
| Commissions | "What needs my attention?" |

Testers also get polls with a best-time suggestion, catalog audits and performance,
commission updates, Sonas, sticker quotes, social posts, community roles, boards
and articles.

Some answers appear as interactive cards (events with live delivery status, the
commission inbox, sticker comparisons, creator performance).

## What stays in your control

- Publishing, scheduling and cancelling take two steps: the app shows you a
  preview, and nothing happens until you confirm it.
- You get an Orbiters notification whenever an app publishes, schedules or
  cancels something for you.
- If something changed on the website since the app last read it, the change is
  refused and the app reads the latest version first.
- Payments, accepting or declining commissions, publishing assets and moving board
  cards stay on Orbiters.
- Apps never receive your Discord, VRChat or store credentials.

## Review and disconnect

**Account → Connections → AI apps** lists the connected apps and every action they took for
you. Choose the disconnect button next to an app to end its access immediately.

<audience include="admin, dev">

## Administer AI apps

- **Admin → AI apps** shows usage, the activity log (search by member, CSV
  export), connections, registered apps and the Knowledge MCP tokens (**Agent
  tokens**, formerly MCP Setup). For each tool choose **Everyone**, **Testers** or
  **Off**; preview tools start as Testers. Testers are staff, the members listed in
  Settings, and everyone on development.
- **Settings** holds testers, per-member request limits (and pauses), signed-out
  access, error alerts for staff, the directory listing and the trusted callback
  hosts. **Connections** lists apps refused by the host policy: **Trust** lets that
  app connect.
- **Overview → Homepage widgets** shows or hides the ChatGPT and Claude homepage
  widgets.
- **Directory** checks what the ChatGPT, Claude, Grok and Mistral listings still
  need, manages the reviewer account (a dedicated account with sample data and an
  expiring passcode for `/review-login`) and shows the DNS-AID record.
- **Admin → API Keys → Add key** has one form per app, in that app's own field
  order with copy buttons and real logos: **ChatGPT & Codex plugin** (Server URL
  or Tunnel; **Create** asks OpenAI for a tunnel ID with a single-use admin key; the
  commands install `tunnel-client` when missing, for Windows, macOS, Linux or
  Docker), **Claude connector**, **Grok connector** and **Vibe connector (Mistral)** (personal Bearer tokens
  or OAuth, with an optional "your own client"), and **Public MCP address** for a named
  Cloudflare tunnel that lets every app reach a development backend.
- Submission material is in `plugins/orbiters-chatgpt/SUBMISSION.md`;
  `plugins/orbiters-chatgpt/scripts/replay-cases.mjs` replays its checks against
  staging.

</audience>
