---
title: Use Orbiters from ChatGPT and Codex
section: Account
order: 36
audience: user, creator, mod, admin, dev
stage: beta
id: orbiters.how-to.chatgpt-plugin
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-09-30
relations: orbiters.community.events, orbiters.how-to.create-and-measure-assets, orbiters.how-to.discord-asset-access
---

# Use Orbiters from ChatGPT and Codex

The Orbiters plugin lets ChatGPT and Codex act with your Orbiters account: plan
community events, explain why an asset is locked, prepare asset drafts, brief you
on commissions, price stickers and more. It uses your current Orbiters
permissions, so it can only do what you could do on the website.

## Connect your account

1. In ChatGPT, open **Apps** and add **Orbiters** (or mention `@Orbiters` in a chat).
2. Choose **Connect**. Orbiters opens and asks you to sign in if needed.
3. Review the permissions. Required access (your profile) is always on; switch off
   anything you do not want to allow, such as **Publish and cancel events** or
   **Schedule social posts**.
4. Check that the page shows where you will return (for example `chatgpt.com`), then
   choose **Allow**.

You can connect Codex the same way; it opens the same Orbiters page.

## What it can do

| Area | Examples |
| --- | --- |
| Community events | "Create a draft for Friday 9 PM in Chillout Lounge", "publish it", "did the Discord event go out?", availability and movie polls |
| Access and support | "Why is the beta of my avatar locked?", "which Discord role unlocks this?" |
| Creator assets | Draft a listing from notes, audit your catalog, compare views and shop clicks, list the releases you may use |
| Commissions | "What needs my attention?", post a progress update, update Sona notes, prepare a reference brief |
| Stickers | Compare finishes, sizes and copies with Orbiters prices; shipping estimates by country |
| Social posts | Prepare destination-specific captions and schedule them, then check delivery results |
| Community roles | Explain role rules and why a member has or lacks a role |
| Boards and articles | Summarize a board, draft a proposal, change your creator page appearance, draft an article |

## What stays in your control

- Drafts are created first. Events, social posts and cancellations only reach
  Discord, VRChat or social networks when you explicitly ask for that action.
- If something changed on the website since ChatGPT last read it, the change is
  refused and ChatGPT reads the latest version before trying again.
- Payments, accepting or declining commissions, publishing assets and moving board
  cards stay on Orbiters.
- ChatGPT never receives your Discord, VRChat or store credentials.
- Delivery results come from Orbiters receipts, not from the assistant's guess.

## Disconnect

Open **Account → Connections → AI apps** and choose the disconnect button next to
the app. Access ends immediately; you can connect again from ChatGPT later.

<audience include="admin, dev">

## Administer the plugin

- **Admin → API Keys → Add key → ChatGPT & Codex plugin** follows the order of
  ChatGPT's **Plugins → Add** window, with a copy button for each value and a
  256 × 256 icon to download. Choose the connection:
  - **Server URL** when the environment is public over HTTPS (production).
  - **Tunnel** when ChatGPT cannot reach the backend, such as local development.
    Tunnel IDs are issued by OpenAI: either paste one from OpenAI Platform →
    Settings → Tunnels, or choose **Create** and enter an OpenAI admin key with
    **Tunnels Manage** and your organization ID. The admin key is used for that
    one request and never saved. Then run the `tunnel-client` commands shown under
    the ID on a machine that reaches the backend. Keep the tunnel's MCP URL on the
    same origin as `PUBLIC_API_URL`.
- **Advanced OAuth settings** stay on **Automatic** unless ChatGPT reports that it
  cannot discover OAuth settings. Automatic covers dynamic registration and
  ChatGPT's client metadata documents. With **Your own client**, paste ChatGPT's
  **Callback URL**, generate a client ID (and a secret for a confidential client),
  then copy the client ID, secret, token endpoint auth method, authorization URL,
  token URL and scopes into ChatGPT. Orbiters only accepts that client with that
  callback while the key is active.
- The **Domain verification token** is only needed when you submit to the plugin
  directory. It is served at `/.well-known/openai-apps-challenge`.
- **Admin → ChatGPT Plugin** shows the connection mode (Server URL or Tunnel),
  endpoints and reachability checks under Settings, usage, a live activity log with each call's
  inputs and result, connected members and registered apps. Turn single tools or
  whole categories off, pause the whole plugin, revoke a member's connection or
  block an app. A tool that is turned off disappears from new tool lists and
  refuses calls from clients that still remember it.
- Submission material (listing, starter prompts, test cases and annotations) is in
  `plugins/orbiters-chatgpt/SUBMISSION.md`.

</audience>
