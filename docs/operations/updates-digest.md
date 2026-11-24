---
title: Run the daily updates digest
section: Operations
order: 54
audience: admin, dev
stage: stable
id: orbiters.operations.updates-digest
domain: operations
type: runbook
owner: orbiters-operations
lastVerified: 2026-11-24
relations: orbiters.operations.deployment-and-backups
---

# Run the daily updates digest

Once a day the Orbiters bot posts what is new in the tools of the Orbiters VPM and in
Orbiters - N4N0, in the Discord and Telegram rooms an owner chose. Everything is in
**Admin > Assets & products > Updates**.

Only an owner, signed in as themselves, can use the digest. Other administrators, and anybody
impersonating an owner, are refused by every one of its requests. Connecting a channel goes
through the connection picker that creators use for their own channels; connecting one there
posts nothing and adds it to no digest.

Two rules hold whatever else happens:

- **A room posts news only after its own test.** You send a test there and say in the tab that
  you saw it. Scheduled digests and **Send now** both need that. It is undone by itself when the
  channel is disconnected, also if it is connected again after that, when its account changes, or
  when another bot posts there. Connecting a channel that is still connected changes nothing.
- **Send now and tests post exactly what their confirmation showed.** The confirmation lists the
  messages, every address in them, and the rooms. If anything is different when they are sent,
  what differs is not posted and the tab shows what it would be then. A confirmation is used once:
  sent twice, it posts once. A scheduled digest has no confirmation: it reads the news at its time.

## To stop all posting

1. Turn **Updates digest** off at the top of the tab, and refresh the page. It must still
   be off.
2. Read the top of the tab. If it says that a message was requested and nobody knows yet
   whether it appeared, that message may still appear, also after Off.
3. Look at the rooms themselves, and at **Needs your answer**.

What Off does: from the moment the tab has answered, Orbiters sends no message to Discord or
Telegram any more, in any room, for daily digests, **Send now** and tests, whichever server
process works on them. Opening the tab still asks the platforms which rooms these are. Nothing
that was waiting is posted later as it was: turning the digest on again never brings back a test
or a half-posted digest.

What Off cannot do: call back a message that Orbiters had already requested. A platform may
have accepted it without its answer reaching Orbiters, and may show it late. Orbiters
cannot see that, and "no request is under way" does not exclude it. This is bounded:
while it is not known what became of a message, tests included, Orbiters posts nothing else
in that room. So one message per room, at most, can still appear, and it is counted at the
top of the tab until somebody answers for it. The bound ends with the answer: a message that
was answered with **It did not appear**, or whose room was removed, can still appear late.
Messages that an earlier release left without an answer count too; there may be several.

What was published while the **digest** was off is in the next daily digest of every room that
stayed on, if it is still published then, the kind of update stayed on, and its source can be
read. Turning a **room** off is different: what is published until it is on again is never posted
there. Leave the digest off while you investigate, and the rooms on if you want their backlog.

**Look at the tab regularly**: after each scheduled time at first, then at least once a week.
Nothing outside the tab says that a room waits for an answer, for a test or for GitHub, and an
open tab does not refresh itself. Each room's card says why it receives nothing, where somebody
can do something about it: not tested, disconnected, an account that is no longer an owner, a bot
that cannot be reached, a message that waits for your answer, and what stopped its last scheduled
digest. A day without news leaves a **Nothing new** row under **Recent posts**; a day without a row
is a day on which nothing ran.

## What a digest says

- **Versions and links** (the default): each product with its version and its official link.
  Nothing anybody wrote is posted, apart from the tool's name.
- **Release notes**: also up to four lines of the release notes: the version's own section in
  the tool's README, or else the text of its GitHub release. Where there is neither, only the
  version and the link are posted; commit messages never are. Links, addresses, handles and
  phone numbers are left out. Nobody checks what the lines say.

No AI writes anything in a digest. A version is shown as numbers and at most one known word
such as `dev.15` or `rc.1`; build details and other suffixes are left out, and a product
whose numbers could be a phone number is named without its version. Nothing is posted on a
day without news.

## Rules worth knowing

- The digest is off, and no room receives it, until an owner adds a room, turns that room on,
  turns the digest on, sends a test there and confirms that it appeared. **Can receive the digest**
  counts the rooms that are on and tested and that nothing the tab knows of keeps from being posted
  in.
- Connecting a room and adding it post nothing. An added room is always off. It starts with what is
  published after it is turned on, and a kind of update after that kind is turned on. Earlier
  history is never posted.
- Two rooms can have the same name. The tab shows, wherever a room is added, listed or
  confirmed: its platform, its server, who can read it as far as the platform says, the id
  that messages are sent to, and a link that opens it where the platform has one. The id is what
  decides. What is not shown is not known: a platform that does not answer leaves the server's id
  and nothing about the readers. Discord's readers are who may view the channel in its server.
- A version is announced once in a room. Deleting a release and publishing it again under
  the same version does not announce it again. A pre-release that becomes a stable release
  is announced as a stable release.
- **No message is posted more than ten minutes after it was prepared.** A scheduled one is then
  prepared again from what is published at that moment, also after the server was stopped, after
  the platform refused it for a while, and after you answered for a message before it. A release
  that was withdrawn, turned into a draft or reclassified before that is not posted as it was. What
  you confirmed with **Send now** is not posted later than ten minutes after it was accepted; it and
  tests are tried once.
- A scheduled message that is refused for the moment is tried eight times in all, at growing
  intervals. **A scheduled digest that is not through six hours after it was made is over**; what is
  left and still published goes with the next one. So does what a refused message holds:
  **Next digest** and **Send now** show it.
- The whole list of desktop releases is read, through every page GitHub links to, and its first
  page once more at the end. Drafts are left out. If a page fails, takes too long, the list moved
  meanwhile or has more than 100 pages, that room's digest waits, tools included, says why on the
  room's card, and tries again. If two published releases have one tag, the card names the tag, and
  no room that receives desktop releases is posted in until one of them is removed or renamed. A
  change in the middle of the list, in the seconds in which it is read, can go unnoticed: what was
  missed is in the next digest, and a withdrawal can be missed once.
- Tools are read from the Orbiters VPM listing. If that listing does not exist, the rooms that
  receive tools say so and are not posted in.
- GitHub allows a server 60 requests an hour without an account and far more with one. One reading
  of the list takes one request for every 100 releases, and one more if there is more than one page:
  four requests for 220 releases. Every look at the tab and every **Refresh** is one reading for all
  rooms together, also while the digest is off. **Send now** takes one reading to show, one to check
  and one for each room that is posted. Each scheduled digest takes one for its room, and one more
  each time it is prepared again. **Release notes** adds up to two for each new version of a tool. The
  tab says when the hour's limit is used up, and the digest waits until it starts again. When the
  list can never be read within it, the tab asks to connect GitHub for the account that owns the
  Orbiters VPM listing. Connect it before the first room.
- Only a room that an owner connected receives the digest. A room that another account
  connected cannot be taken over, not even after it was disconnected there: use another
  room. A digest that was added for such a room before is refused; remove it.

## First use

Use a private channel first, then repeat steps 2 to 8 for the real one.

1. Sign in as the owner, not through impersonation. Open **Updates** and refresh. Check that
   **Updates digest** is off and that no room is listed. Stop if a room you did not add is
   listed, if the switch is on, or if a setting does not survive a refresh.
2. Under **What a digest says** keep **Versions and links**. Set **Daily time** to a time that is
   still to come today and leaves you time for the steps below, and choose **Save time**; the button
   stays grey while the time is the saved one. Refresh and check the time and the time zone. **Do this again for every room you add**: a time that has
   passed today is due at once in a room that is tested later the same day.
3. In the platform, open the channel you mean and note its id. On Discord: **Copy Channel ID**,
   or the last number of its link. On Telegram: the number that starts with -100, from a client
   that shows ids or from a message link of that channel (the number in it, with -100 before it).
   With the digest still off, choose **Connect another room** and connect that channel. Connecting
   only makes it available. A channel that is connected already is listed without this step; an
   account can have ten connected channels.
   - Discord: a text or announcement channel. The account that connects it needs View Channel
     and Manage Channels; the bot needs View Channel, Send Messages, Embed Links, Attach
     Files, Read Message History, Create Public Threads and Send Messages in Threads.
   - Telegram: a channel your linked account administers, where the bot is an administrator
     that may post. The bot's Orbiters webhook must be registered, and if the channel has a
     linked discussion group the bot must be an administrator there too.
4. Find the row with that id under **Add a room** and choose its **Add**. Compare the whole id,
   the server and who can read it with the channel you noted. Where there is an **Open**, follow
   it: it must open that channel. A private Telegram channel has none: compare its number only.
   Stop if any of them differs, even when the name matches. The name alone never tells two
   channels apart.
5. The room's card is off and says **Not tested**. Check the id once more, its language, the kinds
   of updates and the pre-release switch, and that every other room is off. Turn on **Receives the
   daily digest**. Its **Next digest** shows the messages as they would be sent: nothing, or only
   what was published in the minutes since you turned it on. Stop if it shows older versions,
   lines of text with **Versions and links**, or an unexpected address.
6. Look at the daily time again. Turn **Updates digest** on and refresh. **Can receive the digest**
   still says 0: nothing but a test can be posted. Choose **Send a test here**, compare the id and
   read the message in the confirmation, then **Post the test**. If no answer arrives, look at the
   room first. **Post the test** in the same dialog posts no second one, it says what became of the
   first; a dialog you open again asks for another test.
7. Look at the platform. Exactly that message must be there, once, in that channel only, from the
   Orbiters bot: on Discord one message with a small card, on Telegram one line. Only then choose
   **I saw it in this room**. From that moment the room receives news; if today's time has passed and
   today's digest has not run there, it follows within minutes. **Can receive the digest** now says 1. If the test is
   missing, twice, or anywhere else: do not confirm it, and turn the digest off.
8. After something new was published, choose **Send now**. Its confirmation lists every room with
   its id and, for each, the messages exactly as they are sent. Read them, then choose **Post in N
   rooms**. If the tab says that something changed, what changed was not posted, and it says what was:
   read it again.
   Or let the daily time pass; a scheduled digest posts what is new at its time. Then check the
   message in the room, **Posted** in the tab, and that **Next digest**, after its **Refresh**, no
   longer holds it.
9. To move to the real room: turn the digest off, turn the private room off, then go through
   steps 2 to 8 for the real one, the daily time included. The private room's test says nothing
   about the real room. A test there is a real public post.

## Needs your answer

A message whose answer was lost may or may not have appeared, tests included. Orbiters does
not look for it and never sends it again by itself, on either platform. **Until you answer,
nothing else is posted in that room**: no digest, no **Send now**, no test. Other rooms go on.

1. Look at the room itself. Give the platform some minutes.
2. Choose **It appeared in the room** or **It did not appear** only when you saw which one
   it is. The wrong answer can post a message twice, or never.
   - A **scheduled digest** of the last six hours that did not appear: what is published now is read
     again and posted, not the old message. After that, what it held goes with the next digest.
   - A **scheduled digest** that did appear: its other messages are read again and posted, or go with
     the next digest, by the same six hours. They are not posted as they were prepared.
   - A **test** that did not appear is over: nothing replaces it. Send another one. A test that
     did appear does not make the room receive news by itself: after the answer choose **I saw it
     in this room** too.
   - A **Send now** that did not appear is over too. What it held is in the next digest, or in
     another **Send now** that you confirm.
3. If you cannot tell, leave the question open and the room on. The room stays silent, and the
   next digest after your answer holds what was published meanwhile and is still published. If you
   turn the room off instead, what is published until it is on again is never posted there.

A scheduled message that was **Refused** for good (a missing permission, a deleted channel)
waits for **Try again**, which reads what is published and posts it within its six hours and leaves
it to the next digest after them. It goes with the next digest either way. Repair the cause first. A test or a
**Send now** that was refused needs no answer.

A card that says it **cannot be checked right now** which bot posts there keeps its test: the bot
is not connected, or Telegram's settings cannot be read. It comes back by itself; nobody changed the
room.

A digest that says the room **has no confirmed test** was stopped because the room, its
connection or its bot changed. Send a test there and confirm it; today's scheduled digest is not
made up for, so choose **Send now** or wait for the next one. If you did not change anything,
find out who did before you test again.

## Before rolling images back

Do this before [rolling back](04-deployment-and-backups.md) to any earlier release while a
room is configured. Treat a rollback with the digest on as unsafe. Nothing in the release
tools checks this for you.

1. [Stop all posting](#to-stop-all-posting). Settle what you can under **Needs your answer**
   and note what you cannot: the earlier release does not hold a room back for it, and that
   one of 2026-11-24 may look for a Discord message and send it again by itself. Check that
   the tab shows a **Last changed** date under **Daily time**: an earlier release takes a
   switch that was never stored for on. Adding a room stores it; if there is no date, change
   the time and choose **Save time**.
2. Roll the images back.
3. In the earlier release, check that the digest is off and leave it off. The release of
   2026-11-24 (`7283db91`) would post release-note lines and AI summaries, and lets every
   administrator use the tab.
4. When the current release is back, look at each room's recent posts and at
   **Needs your answer**, and settle what you can establish, before turning the digest on.
   A date of the last change alone does not show that nothing was requested meanwhile. Rooms that
   were tested stay tested if nothing about them changed; the earlier release posts without a test
   and without showing what **Send now** posts. What
   an earlier release had prepared, approved or not, is prepared again, never sent as it was.

The tables of this release can be read and written by `7283db91`; there is nothing to
migrate back, and no table to drop. What an older release makes of a saved AI setting depends on
that release. For a release older than `7283db91`, which does not know
the AI routing fields: in **Admin > AI** remove every fallback model and choose
**Save AI settings** first, or that release refuses the whole AI setting. An override saved
for the former "Updates digest" AI feature is left out and disappears with the next
**Save AI settings**; save once before such a rollback.
