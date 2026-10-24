---
title: Set up N4N0, your personal business assistant
section: Account
order: 38
audience: admin, dev
stage: alpha
id: orbiters.how-to.me-scout
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-10-19
relations: orbiters.reference.scout-agent-api, orbiters.how-to.me-job-search-worker, orbiters.decision.personal-agents-on-member-hardware
---

# Set up N4N0, your personal business assistant

N4N0 is a Hermes assistant running on your Raspberry Pi. It looks for realistic ways to earn more, reads your
Orbiters numbers, and writes to you on Discord or Telegram. You configure everything in **N4N0 → Assistant** on
[orbiters.cc/orb](https://orbiters.cc/orb); the Pi picks up changes within a minute.

N4N0 was called Scout, and the workspace was called Me. Old `/me` links and `?tab=scout` still open the right tab.

## Before you start

- The `orb-workspace` feature is enabled for your account (accounts that had `me-workspace` were moved over).
- Hermes is installed on the Pi, and you have a copy of `agents/orb` from the Orbiters repository on it.
- Pair and configure on **orbiters.cc**, not on a development site: the Pi only talks to the site it is paired with.

## Install or upgrade N4N0 on the Pi

From the copy of `agents/orb`, run:

```bash
sudo bash install/install.sh
```

The installer puts the sync in `/opt/orb` and its configuration in `/etc/orb/env`, and starts two services:

| Unit | Does |
| --- | --- |
| `orb-sync.service` with `orb-sync.timer` | Applies your settings, sends the status and relays notifications every minute. |
| `orb-board.service` | Runs all the time and keeps the research board on the site live. |

Then open **N4N0 → Agents & keys**, choose **Pair** on N4N0, and run `sudo orb-pair` on the Pi with the token. The card
shows **Paired**. Run the installer again to update; it keeps the pairing.

The token is valid for 180 days. From 14 days before it ends, the N4N0 page warns you and Orbiters sends you a
notification (relayed to your main channel) at 14 and 3 days: choose **Pair** again and run `sudo orb-pair` with the
new token. The old token stops working at once. An expired token is refused, and the Pi's sync log says
`Orbiters refused N4N0: This token has expired`.

**Upgrading a Pi set up as Scout:** run the same installer. It stops and removes the `scout-sync` units and
`/opt/scout`, copies `/etc/scout/env` to `/etc/orb/env` (so the pairing is kept), renames the Hermes profile
`scout-worker` to `orb-worker` and moves its tasks on every board, and moves the notes in `~/scout` to `~/orb`.

Logs: `journalctl -u orb-sync` and `journalctl -u orb-board`.

### Watch the Pi

**N4N0 → Assistant** shows a host panel under the N4N0 status card. With its minute
sync the Pi also sends a host report: CPU use and load, memory and swap, disk,
temperature and clock speed, power (the kernel's live undervoltage alarm), Wi-Fi
signal and traffic, process count, uptime, and the state, memory, uptime and
restarts of `hermes-gateway`, `orb-board`, `findings-worker` and Docker. Small
charts cover the last 24 hours; hover them for a reading. A chip says **Live**,
**Late** (no report for 3 minutes) or **Offline** (15 minutes), and old readings
are dimmed. The Pi opens no port for this: it reads `/proc` and `/sys` and sends
the report out with the rest of the sync.

`vcgencmd` throttling history (“throttled since boot”) needs the `hermes` user in
the `video` group; without it the panel only shows the live undervoltage alarm.

## Give N4N0 a model and a way to reach you

1. In **N4N0 → Agents & keys**, add a key or sign-in for each provider you use (see
   [Choose providers and keys](#choose-providers-and-keys)).
2. Choose at least one messaging app:
   - **Discord:** create a bot in the Discord developer portal, turn on **Message Content Intent**, invite it to a
     private server you are in, save its token, and enter your Discord user ID in **N4N0 → Assistant**.
   - **Telegram:** save the bot token from @BotFather and enter your Telegram user ID (ask @userinfobot). A Telegram
     bot answers only one program at a time, so stop any other tool that used the same bot.
3. Within a minute the N4N0 card shows **Gateway running**. Send N4N0 a message to check.

Pick your **Main channel** (Telegram or Discord) in **N4N0 → Assistant → Reach and rhythm**. N4N0 writes there first,
and the daily digest goes there. If the main channel is not set up, N4N0 uses the other one. On Discord, digests go to
the channel you entered, otherwise to your direct messages (after you have written to N4N0 once).

**Stream replies live** (on by default) makes Telegram show N4N0's answer as it is written, using Telegram's native
streaming drafts in direct messages; the draft updates every 1.5 seconds. While N4N0 thinks or uses tools, a short
progress message shows what it is doing and is deleted when the answer arrives. Discord receives the finished reply.
N4N0 keeps the Anthropic prompt cache for an hour and compacts a long chat after an hour without messages, so replies
start sooner.

## Choose providers and keys

| Provider | Cost |
| --- | --- |
| Anthropic, DeepSeek | Pay as you go. |
| OpenRouter | Pay as you go. Without a cap, only models ending in `:free` run. |
| Google AI Studio (Gemini), Groq, Cerebras, Mistral, NVIDIA NIM, SambaNova | Free tier. |
| ChatGPT (Codex) | Your ChatGPT plan. |

For ChatGPT, choose **Sign in with ChatGPT** in **N4N0 → Agents & keys**. The page shows a code: enter it at OpenAI
when asked. The sign-in tokens stay on the Pi.

Each provider takes up to five API keys: choose **+** on the provider's last key to add another. Extra keys are
pooled, and each key becomes its own lane for background work.

> Free-tier limits usually apply to the account, not the key. Extra keys from the same account add no quota. For
> example, OpenRouter allows 20 requests a minute and 50 a day until you buy $10 of credit, then 1,000 a day.

## Get Orbiters notifications on your main channel

Turn on **Orbiters notifications on your main channel** and choose the categories to relay (payments and
commissions, comments, boards, moderation, Orbiters updates and so on). Within a minute of a new notification in the
bell, N4N0's bot sends its title, text and link to your main channel. No AI model is involved, so it costs nothing.
Only unread notifications from the last 24 hours are relayed, and notifications that arrived before you paired N4N0
are never replayed. Your notification settings in Orbiters still decide which notifications exist at all.

## Tell N4N0 about you

- **Owner brief:** who you are, what you sell, your capacity, goals, red lines and voice.
- **Watch list:** public accounts and pages to follow.
- **Documents:** your CV, skills sheets or notes (PDF, Markdown or text, up to 4 MB each). Re-upload a file with
  the same name to replace it.
- **Reach and rhythm:** digest time and how often N4N0 may interrupt you or ask questions.

## Choose models and pace background research

**N4N0 → Assistant → Models and background work** sets one model per job:

- **Chat** answers you on Discord and Telegram.
- **Planning** queues research for the workers every few hours, folds their findings into N4N0's idea ledger and
  writes the daily digest.
- **Background research** runs that queue around the clock on cheap and free models. Choose up to 16 workers at
  once; the Pi runs as many as its memory holds (about 300 MB each, so 8 on a 4 GB Pi) and shows that limit under the
  slider. List up to 40 models; the list shows how many of the 40 are used, and
  **Add a model** picks a provider and model pair that is not listed yet.

**Use the models** decides how the list is used:

- **All at once** (default) gives each queued task the next model and key in turn, so every provider works in
  parallel.
- **In order** walks the list: a task takes the first model that is available.

A lane whose tasks fail with rate-limit errors rests for 15 minutes; after 20 rate-limit errors in a row it rests an
hour, and a free tier whose daily quota is used rests until the provider resets it (midnight Pacific for Google AI
Studio, midnight UTC for the others). A model that refuses a request as too large sits out for six hours. Groq's free
tier stays out of the worker lanes altogether: its per-minute token cap is smaller than one research request.

OpenCode Zen's free models only answer the OpenCode app, so the Pi runs them inside the OpenCode CLI instead of as a
Hermes worker: two queued questions at a time wait for that lane, answered one by one as a separate, unprivileged
`orbcode` user that cannot read any of N4N0's files or keys. A failed run hands the question back to the other workers.

Paid providers (Anthropic, DeepSeek, OpenRouter) each get a monthly cap for background work. The Pi spreads the cap
evenly over the days left in the month, and each day's share opens hour by hour (a 24th of it each hour, the first at
midnight), so workers run through the day instead of in one burst at night. Once a provider has used the share open so
far, tasks go to the other models in the list, and when none is left, queued tasks wait until the next hour or month. A cap of 0 allows only free models. To run a paced provider past
today's share, unlock it from the research board for 2, 6 or 12 hours; the monthly cap still applies. To stop using a
model for a while, press its pause button in the list: it takes effect at once, without saving, and the Pi gives it no
new tasks (running ones finish) until you resume it. Spend comes from
Hermes' own cost estimates on the Pi, not from your provider billing, so treat it as an estimate. **Chat and planning
per month** is a separate budget N4N0 respects for its own work.

When the queue runs dry between planner runs, a worker queues the next questions on the cheap model (at most every 15
minutes). Workers may also queue one follow-up question per task, and at most 12 tasks per worker wait at once; the
rest wait until there is room. At most 10 questions per worker are created a day (40 with 4 workers): before a
question runs, the Pi drops it when it repeats one asked in the last two weeks (same main words) or, for worker
follow-ups and refills, when the day's limit is reached. Questions the planner or you queue are never dropped for the
limit. When N4N0 says it will look into something, it queues the task right away. Background
workers only see your owner brief and public web pages, never your documents, CV or Orbiters data, because free
models may log prompts.

Every minute the Pi copies each finished task's summary into `~/orb/findings/<day>.md` and only then archives the task,
so no result is lost unread. `findings/recent.md` holds the last 24 hours and `findings/questions.md` the queue and the
questions of the last two weeks: the planner folds the findings into N4N0's idea ledger (`ideas.md`) every few hours,
and the daily digest reads both the ledger and the last day's findings. Day files are kept for 30 days. N4N0 stays up to date without a new conversation: when its instructions change, the next
message you send carries the new version, and each message carries a short status of the background work and
research projects when it changed (the `orb-live` hook on the Pi adds it). Your conversation history is kept. Saving the brief, budget or rhythm never
restarts N4N0; changing keys or models does.

## Hand N4N0 a research project

For anything bigger than a quick question, start a research project in **N4N0 → Assistant → Research**: the area, what
you want to learn, how long (2 hours to a week) and how often you want a report. You can also ask N4N0 in Telegram or
Discord ("dig into BOOTH demand for muscular bases this afternoon"); it starts the project for you with the
`orb-research` command on the Pi (`start`, `list`, `show`, `stop`).

A project runs in rounds on its own task board on the Pi. A lead step on the planning model splits the area into
questions, background workers research them on the cheap models, then a report on the planning model sums up what is
new (with links), the ideas with a value range and confidence, the open questions, and queues the next round's
questions. Each report reaches your main channel and appears in **N4N0 → Reports**: every project is a card there, and
a card opens all its reports, with arrows (or ← and →) to move between them and buttons that copy one report or all of
them as Markdown, ready to paste into another AI.

A report waits for its round to finish. When workers crash (usually a model provider refusing calls), N4N0 runs each
crashed question once more; if most of the round is still lost, the report waits for the interval you chose instead of
reporting almost nothing. Each report also lists the facts it verified; N4N0 keeps them out of the report you read and
hands them to every later round, so rounds stop re-checking and repeating what is already known, and it archives any
questions a report queues beyond the round's size. When the time is up, or you press **Stop**, open questions are
dropped and a final report sums up the whole project. Up to three projects run at once, and they share the workers and
the background budget with the 24/7 research.

### Run an SEO audit

In **N4N0 → Assistant → Research**, switch from **Research an area** to **SEO audit**.
Enter the **Site to audit** (a full address such as `https://orbiters.cc`), an
optional **What to check first**, and the longest audit time (2 h, 8 h or 1 day),
then **Start SEO audit**.

The audit uses the Hermes SEO plugin, which the installer adds to Hermes and the
`orb-worker` profile at a pinned commit. N4N0 queues one question per specialist on
the background models: technical SEO, content quality, structured data, sitemaps
and robots.txt, performance, AI search readiness, agent accessibility and search
intent. The card shows how many of the eight have answered. When they all have,
or the time is up, the planning model merges them into one prioritized report,
sent to your main channel and listed in **N4N0 → Reports** like other projects.
Specialists only read the site's public pages, its `robots.txt`, sitemaps and
`llms.txt`, and public read-only services.

No key is needed. A Google API key for the Hermes SEO plugin (`GOOGLE_API_KEY`) adds
PageSpeed Insights field data to the performance check.

N4N0 and its workers can also look for ideas in the
[Hermes community showcase](https://hermes-agent.nousresearch.com/docs/user-stories) (the `hermes-user-stories`
skill, refreshed daily); the planner queues one look at it a day.

## What N4N0 can read

N4N0 uses the Orbiters AI app tools as you, with read access only: your account, assets and creator performance,
commission inbox, events, boards and articles, the Discord servers you manage (stats, roles, channels, messages,
announcements and activity), plus the staff-only **platform overview** (platform-wide totals, no individual member
data). It can never draft, publish, schedule, pay or change anything. **Unpair** removes the access at once.

On the Pi, N4N0's chat and workers also have read-only social tools:

| Tools | Source and limits |
| --- | --- |
| `reddit_search`, `reddit_subreddit`, `reddit_find_subreddits`, `reddit_post` | The Reddit API. Reddit refuses unauthenticated use: create a "script" app at [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) and save its app ID and secret in **N4N0 → Agents & keys**. |
| `x_profile`, `x_post` | Public X embed pages, then twitter-viewer.com or archivlyx.com. No keyword search. |
| `instagram_profile` | igexport.com. Post links and media only, no captions. |

These sources are unofficial, allow only a few requests a minute and may stop working at any time.

N4N0 can also read your repositories through your Orbiters GitHub connection (**Creator → VPM**), read-only, and, once
you set them up, up to two mailboxes and your Google Calendar, Drive, Docs and Sheets: see
[Give N4N0 your email and Google Workspace](/documentation/orbiters.how-to.orb-mail-google).

## Watch what it is doing

**N4N0 → Assistant → Activity** shows whether N4N0 is working, its chat and planning spend against that budget, recent
conversations, subagents, the tools it used and scheduled jobs. Message contents stay on the Pi. "No report from your
Pi" means the Pi has not checked in for three minutes.

The research board shows each provider's spend against its cap and the tasks from the 24/7 queue and from research
projects. A task appears in **Up next**, moves to **Running now** when a worker takes it and stacks in **Recently
done**, within seconds. Project tasks are tagged with the project title. Click a task to open it: the window shows the
question, the worker's progress live (its reasoning, each tool call and what it returned), then the result and its
sources. The Pi sends a task's content only while its window is open. If the board stops moving, check
`journalctl -u orb-board` on the Pi.
