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

Only an owner, signed in as themselves, can open or use that tab. Other administrators,
and anybody impersonating an owner, are refused by every one of its requests.

## To stop all posting

1. Turn **Updates digest** off at the top of the tab, and refresh the page. It must still
   be off.
2. Read the top of the tab. If it says that a message was requested and nobody knows yet
   whether it appeared, that message may still appear, also after Off.
3. Look at the rooms themselves, and at **Needs your answer**.

What Off does: from the moment the tab has answered, Orbiters asks Discord and Telegram for
nothing more, in any room, for daily digests, **Send now** and tests, whichever server
process works on them. Nothing that was waiting is posted later as it was: turning the
digest on again never brings back a test or a half-posted digest.

What Off cannot do: call back a message that Orbiters had already requested. A platform may
have accepted it without its answer reaching Orbiters, and may show it late. Orbiters
cannot see that, and "no request is under way" does not exclude it. This is bounded:
while it is not known what became of a message, tests included, Orbiters posts nothing else
in that room. So one message per room, at most, can still appear, and it is counted at the
top of the tab until somebody answers for it. The bound ends with the answer: a message that
was answered with **It did not appear**, or whose room was removed, can still appear late.
Messages that an earlier release left without an answer count too; there may be several.

What was published while the digest was off is in the next daily digest. To start a room
from zero instead, turn that room off too: what is published until it is on again is never
posted there. Leave the digest off while you investigate.

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

- The digest is off, and no room receives it, until an owner adds a room, turns that room on
  and turns the digest on.
- Connecting a room and adding it post nothing. An added room is off. It starts with what is
  published after it is turned on, and a kind of update after that kind is turned on. Earlier
  history is never posted.
- Two rooms can have the same name. The tab shows, wherever a room is added, listed or
  confirmed: its platform, its server, who can read it as far as the platform says, the id
  that messages are sent to, and a link that opens it. The id is what decides.
- A version is announced once in a room. Deleting a release and publishing it again under
  the same version does not announce it again. A pre-release that becomes a stable release
  is announced as a stable release.
- What is published is read again each time a digest is prepared, and once more for
  **Try again** and after **It did not appear**. A release that was withdrawn, turned into a
  draft or reclassified before that is not posted as it was. Between preparation and posting
  nothing is read: a message that is refused for the moment is tried again by itself for
  about three hours, as it was prepared.
- The whole list of desktop releases is read, through every page GitHub links to. If a page
  fails, takes too long, or the list has more than 100 pages, the digest of that room waits,
  tools included, says why under **Recent posts**, and tries again. It never goes out with
  half of the news.
- Only a room that an owner connected receives the digest. A room that another account
  connected cannot be taken over, not even after it was disconnected there: use another
  room. A digest that was added for such a room before is refused; remove it.

## First use

Use a private channel first, then repeat steps 3 to 7 for the real one.

1. Sign in as the owner, not through impersonation. Open **Updates** and refresh. Check that
   **Updates digest** is off and that no room is listed. Stop if a room you did not add is
   listed, if the switch is on, or if a setting does not survive a refresh.
2. Under **What a digest says** keep **Versions and links**. Set **Daily time** to a time
   that is still to come today, so that the first scheduled digest does not fall into the
   setup, and choose **Save time**. Refresh and check the time and the time zone.
3. In the platform, open the private channel you mean and note its id. On Discord: **Copy
   Channel ID**, or the last number of its link. With the digest still off, choose **Connect
   another room** and connect that channel. Connecting only makes it available.
   - Discord: a text or announcement channel. The account that connects it needs View Channel
     and Manage Channels; the bot needs View Channel, Send Messages, Embed Links, Attach
     Files, Read Message History, Create Public Threads and Send Messages in Threads.
   - Telegram: a channel your linked account administers, where the bot is an administrator
     that may post. The bot's Orbiters webhook must be registered, and if the channel has a
     linked discussion group the bot must be an administrator there too.
4. Find the row with that id under **Add a room** and choose its **Add**. Compare the id, the
   server and who can read it with the channel you noted, and follow **Open**: it must open
   that channel. Stop if any of them differs, even when the name matches. The name alone
   never tells two channels apart.
5. The room's card is off. Check the id once more, its language, the kinds of updates and the
   pre-release switch, and that every other room is off. Turn on **Receives the daily
   digest**. Its **Next digest** is empty. Stop if it shows older versions, lines of text with
   **Versions and links**, or an unexpected link.
6. Turn **Updates digest** on and refresh. **Receiving the digest** must say 1; **Rooms**
   also counts the rooms that are off. Choose **Send a test here**, compare the id in the
   confirmation with the one you noted, then **Post the test**. Exactly one message must
   appear, in that channel only, from the Orbiters bot: on Discord one message with a small
   card, on Telegram one line. A test says that the digest will be posted there; it holds no
   news and changes no digest. Stop if there are two, none, or one somewhere else.
7. After something new was published, read **Next digest** again: product, version, link.
   Let the daily time pass, or choose **Send now**. Its confirmation lists every room it
   posts in, with its id, and it posts in no other, even if one is turned on meanwhile.
   Compare the ids before you choose **Post in N rooms**. Then check the message in the room,
   **Posted** in the tab, and that **Next digest** no longer lists that version.
8. To move to the real room: turn the digest off, turn the private room off, then go through
   steps 3 to 7 for the real one. A test there is a real public post.

## Needs your answer

A message whose answer was lost may or may not have appeared, tests included. Orbiters does
not look for it and never sends it again by itself, on either platform. **Until you answer,
nothing else is posted in that room**: no digest, no **Send now**, no test. Other rooms go on.

1. Follow **Open** and look at the room itself. Give the platform some minutes.
2. Choose **It appeared in the room** or **It did not appear** only when you saw which one
   it is. The wrong answer posts a message twice, or never. After **It did not appear** what
   is published now is read again, and that is posted: not the old message.
3. If you cannot tell, leave it, or turn the room off. The room stays silent until you
   answer; nothing is lost, the next digest there holds what was published meanwhile.

A message that was **Refused** for good (a missing permission, a deleted channel) waits for
**Try again**, or goes with the next digest. Repair the cause first. A refused test needs no
answer.

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
   A date of the last change alone does not show that nothing was requested meanwhile. What
   an earlier release had prepared, approved or not, is prepared again, never sent as it was.

The tables of this release can be read and written by `7283db91`; there is nothing to
migrate back, and no table to drop. For a release older than `7283db91`, which does not know
the AI routing fields: in **Admin > AI** remove every fallback model and choose
**Save AI settings** first, or that release refuses the whole AI setting. An override saved
for the former "Updates digest" AI feature is left out and disappears with the next
**Save AI settings**; save once before such a rollback.
