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

1. In **Me → Agents & keys**, save the key of each provider you use (Anthropic, DeepSeek, OpenRouter).
2. Choose at least one messaging app:
   - **Discord:** create a bot in the Discord developer portal, turn on **Message Content Intent**, invite it to a
     private server you are in, save its token, and enter your Discord user ID in **Me → Scout**.
   - **Telegram:** save the bot token from @BotFather and enter your Telegram user ID (ask @userinfobot). A Telegram
     bot answers only one program at a time, so stop any other tool that used the same bot.
3. Within a minute the Scout card shows **Gateway running**. Send Scout a message to check.

Pick your **Main channel** (Telegram or Discord) in **Me → Scout → Reach and rhythm**. Scout writes there first, and
the daily digest goes there. If the main channel is not set up, Scout uses the other one. On Discord, digests go to the
channel you entered, otherwise to your direct messages (after you have written to Scout once).

## Get Orbiters notifications on your main channel

Turn on **Orbiters notifications on your main channel** and choose the categories to relay (payments and
commissions, comments, boards, moderation, Orbiters updates and so on). Within a minute of a new notification in the
bell, Scout's bot sends its title, text and link to your main channel. No AI model is involved, so it costs nothing.
Only unread notifications from the last 24 hours are relayed, and notifications that arrived before you paired Scout
are never replayed. Your notification settings in Orbiters still decide which notifications exist at all.

## Tell Scout about you

- **Owner brief:** who you are, what you sell, your capacity, goals, red lines and voice.
- **Watch list:** public accounts and pages to follow.
- **Documents:** your CV, skills sheets or notes (PDF, Markdown or text, up to 4 MB each). Re-upload a file with
  the same name to replace it.
- **Reach and rhythm:** digest time and how often Scout may interrupt you or ask questions.

## Choose models and pace background research

**Me → Scout → Models and background work** sets one model per job:

- **Chat** answers you on Discord and Telegram.
- **Planning** queues research for the workers every few hours, folds their findings into Scout's idea ledger and
  writes the daily digest.
- **Background research** runs that queue around the clock on cheap models. Choose up to 16 workers at once; the Pi runs as many as its memory holds (about 300 MB each, so 8 on a 4 GB Pi) and shows that limit under the slider. List up to
  three models in order of preference (for example Claude Haiku, DeepSeek V4.1 Flash, then a free OpenRouter model).

Each provider gets a monthly cap for background work. The Pi spreads the cap evenly over the days left in the month:
once a provider has used today's share, workers move to the next model in the list, and when none is left, queued tasks
wait until the next day or month. A cap of 0 allows only free models (OpenRouter ids ending in `:free`). Spend comes
from Hermes' own cost estimates on the Pi, not from your Anthropic or DeepSeek billing, so treat it as an estimate.
**Chat and planning per month** is a separate budget Scout respects for its own work.

When the queue runs dry between planner runs, a worker queues the next questions on the cheap model (at most every 15 minutes). Workers may also queue one follow-up question per task, and at most 12 tasks per worker wait at once; the rest wait until there is room. When Scout says it will look into something, it queues the task right away. Background workers only see your owner
brief and public web pages, never your documents, CV or Orbiters data, because free models may log prompts.

Background results are stored with each task on the Pi; the planner folds them into Scout's idea ledger every few hours and the digest reports them. Scout's instructions are fixed when a conversation starts, so after changing models or enabling background work, send `/new` to Scout to start a fresh conversation that knows about it. Saving the brief, budget or rhythm never restarts Scout; changing keys or models does.

## What Scout can read in Orbiters

Scout uses the Orbiters AI app tools as you, with read access only: your account, assets and creator performance,
commission inbox, events, boards and articles, plus the staff-only **platform overview** (platform-wide totals, no
individual member data). It can never draft, publish, schedule, pay or change anything. **Unpair** removes the access
at once.

## Watch what it is doing

The **Activity** section shows whether Scout is working, its chat and planning spend against that budget, the
background research board (busy workers, the running and queued tasks, recent results and each provider's spend
against its cap), recent conversations, subagents, the tools it used and scheduled jobs. Message contents stay on the Pi. "No report from your
Pi" means the Pi has not checked in for three minutes.
