---
title: Understand and control AI use
section: Account
order: 75
audience: public
stage: beta
id: orbiters.how-to.ai-use
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-27
---

# Understand and control AI use

Open [AI use](https://orbiters.cc/legal/ai) from the website footer or legal
navigation. This page explains the developer's use of AI, lists Orbiters' LLM
features and shows their currently configured provider and model.

## Turn AI assistance off

Sign in, then switch **AI-assisted features** to **Disabled** on the AI use page.
You can also open **Account → Overview → Preferences → AI-assisted features**.
Both controls save the same account preference immediately. If saving fails, the
control keeps the last confirmed choice and shows an error so you can retry.

The choice applies to new requests for your account, including asset AutoFill,
MCB version titles and changelogs, and My Avatar texture matching. Complete those
tasks manually when assistance is off. It does not undo completed work, erase
stored content, or recall a request already sent to a provider.

For Discord promotion assistance, link the Discord identity to your Orbiters
account so the account preference can be applied. Community managers separately
control whether assistance is enabled in their designated promotion channel.

## Understand the feature list

The page covers My Avatar texture matching, MCB version metadata, asset draft
AutoFill, community self-promotion classification and the administrator playground.
Each entry explains its inputs. My Avatar sends texture/material names and measured
statistics, not image pixels. AutoFill and promotion classification can send images
for analysis; this is not image generation.

The model list follows the server's default and per-feature overrides. The admin
playground can select a different model for each conversation. A missing active
model is shown explicitly. A loading error offers a retry instead of guessing a
model name. Showing a configured model does not establish that provider credentials
are available or that the provider is responding.

## Content storage differs by feature

- My Avatar texture matching and promotion classification omit request and response
  content from AI history, but retain usage and diagnostic metadata.
- AutoFill, MCB metadata and administrator chats retain request and response text.
  AutoFill also records submitted image references.
- Drafts, uploaded files, saved titles/changelogs and promotion invitations have
  their own storage. Disabling AI does not delete them.

Provider processing and retention are separate from Orbiters' storage. For data
requests, use [Privacy and shared content](15-manage-privacy-and-shared-content.md).

<audience include="admin,dev">
The public inventory is `GET /privacy/ai-features`; it returns feature names,
descriptions, inputs, audience and model/provider names. Prompts, model endpoints,
credentials and internal settings are excluded. The response is not cached.
Account preferences continue to use authenticated `GET/PUT /users/me/ai-preferences`.
See [Configure AI models, prompts and usage](../operations/14-ai-models-and-prompts.md).
</audience>
