---
title: Set up Scout, your personal business scout
section: Account
order: 38
audience: admin, dev
stage: alpha
id: orbiters.how-to.me-scout
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-10-13
relations: orbiters.reference.scout-agent-api, orbiters.how-to.me-job-search-worker, orbiters.decision.personal-agents-on-member-hardware
---

# Set up Scout, your personal business scout

Scout is a Hermes assistant running on your Raspberry Pi. It looks for realistic ways to earn more, reads your
Orbiters numbers, and writes to you on Discord or Telegram. You configure everything in **Me → Scout** on
orbiters.cc; the Pi picks up changes within a minute.

## Before you start

- Hermes and the Scout sync are installed on the Pi (`agents/scout/install/install.sh`).
- In **Me → Agents & keys**, Scout shows **Paired** (run `sudo scout-pair` on the Pi with the token from **Pair**).
- Pair and configure on **orbiters.cc**, not on a development site: the Pi only talks to the site it is paired with.

## Give Scout a model and a way to reach you

1. In **Me → Agents & keys**, save the key of the main model (Anthropic, DeepSeek or OpenRouter).
2. Choose at least one messaging app:
   - **Discord:** create a bot in the Discord developer portal, turn on **Message Content Intent**, invite it to a
     private server you are in, save its token, and enter your Discord user ID in **Me → Scout**.
   - **Telegram:** save the bot token from @BotFather and enter your Telegram user ID (ask @userinfobot). A Telegram
     bot answers only one program at a time, so stop any other tool that used the same bot.
3. Within a minute the Scout card shows **Gateway running**. Send Scout a message to check.

The daily digest goes to Telegram when it is set up, otherwise to the Discord channel you entered, otherwise to
your Discord direct messages (after you have written to Scout once).

## Tell Scout about you

- **Owner brief:** who you are, what you sell, your capacity, goals, red lines and voice.
- **Watch list:** public accounts and pages to follow.
- **Documents:** your CV, skills sheets or notes (PDF, Markdown or text, up to 4 MB each). Re-upload a file with
  the same name to replace it.
- **Rhythm and budget:** digest time, how often Scout may interrupt you, and the monthly API budget it should respect.

## What Scout can read in Orbiters

Scout uses the Orbiters AI app tools as you, with read access only: your account, assets and creator performance,
commission inbox, events, boards and articles, plus the staff-only **platform overview** (platform-wide totals, no
individual member data). It can never draft, publish, schedule, pay or change anything. **Unpair** removes the access
at once.

## Watch what it is doing

The **Activity** section shows whether Scout is working, its recent conversations, subagents, the tools it used,
scheduled jobs and this month's API spend against your budget. Message contents stay on the Pi. "No report from your
Pi" means the Pi has not checked in for three minutes.
