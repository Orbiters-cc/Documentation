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
2. The tab answers once no message is on its way, after 30 seconds at most. If it says that
   a message was already on its way, that one may still appear: at most one per room.
3. Look at the rooms themselves.

Off stops daily digests, **Send now** and tests, in every room, whatever server process
works on them. Nothing that was waiting is posted later as it was: turning the digest on
again never brings back a test or a half-posted digest. What was published meanwhile is in
the next daily digest. To start a room from zero instead, turn that room off too: what is
published until it is on again is never posted there.

Leave the digest off while you investigate. A message that is not settled
(**Needs your answer**) is never sent again by itself.

## What a digest says

- **Versions and links** (the default): each product with its version and its official link.
  Nothing anybody wrote is posted, apart from the tool's name.
- **Release notes**: also up to four lines of the release notes, as whoever published the
  release wrote them. Links, addresses, handles and phone numbers are left out. Nobody
  checks what the lines say.

No AI writes anything in a digest. A version's suffix is left out when it holds an address
or a number. Nothing is posted on a day without news.

## Rules worth knowing

- The digest is off, and no room receives it, until an owner turns it on and adds a room.
- A room starts with what is published after it is added or turned on. A kind of update
  starts when it is turned on. Earlier history is never posted.
- A version is announced once in a room. Deleting a release and publishing it again under
  the same version does not announce it again. A pre-release that becomes a stable release
  is announced as a stable release.
- What is published is read again for every digest. A release that was withdrawn,
  turned into a draft or reclassified before that is not posted as it was. Once a digest is
  prepared its messages are fixed: a refused message is tried again for about three hours.
- GitHub lists the newest 1,000 releases of a repository. Orbiters reads all of them every
  time and never sees an older one.
- If GitHub does not answer completely, the digest waits and tries again. It never goes out
  with half of the news.
- Only rooms that an owner connected receive the digest. A room somebody else added before
  is refused with that reason: remove it and add it again as the owner.

## First use

Use a private channel first, then repeat steps 3 to 6 for the real one.

1. Sign in as the owner, not through impersonation. Open **Updates** and refresh. Check that
   **Updates digest** is off and that no room is listed. Stop if a room you did not add is
   listed, if the switch is on, or if a setting does not survive a refresh.
2. Under **What a digest says** keep **Versions and links**. Set **Daily time** to a time
   that is still to come today, so that the first scheduled digest does not fall into the
   setup, and choose **Save time**. Refresh and check the time and the time zone.
3. With the digest still off, choose **Connect another room** (or **Add** an already
   connected one) for a private Discord text or announcement channel, or a private Telegram
   channel. On Discord the account that connects it needs View Channel and Manage Channels;
   the bot needs View Channel, Send Messages, Embed Links, Attach Files, Read Message
   History, Create Public Threads and Send Messages in Threads. On Telegram your linked
   account administers the channel, and the bot is an administrator that may post.
4. Adding a room turns it on. Check its name, language, the kinds of updates and the
   pre-release switch. Every other listed room must be off. Read its **Next digest**: right
   after adding it, it is empty. Stop if it shows older versions, lines of text with
   **Versions and links**, or an unexpected link.
5. Turn **Updates digest** on and refresh. The header must count exactly one room. Choose
   **Send a test here**, read the room's name in the confirmation, then **Post the test**.
   Exactly one line must appear, in that room only, from the Orbiters bot. A test says
   that the digest will be posted there; it holds no news and changes no digest. Stop if
   there are two, none, or one somewhere else.
6. After something new was published, read **Next digest** again: product, version, link.
   Let the daily time pass, or choose **Send now**. Its confirmation lists every room it
   posts in, and it posts in no other, even if one is turned on meanwhile. Compare the list
   with the rooms you mean before you choose **Post in N rooms**. Then check the message in
   the room, **Posted** in the tab, and that **Next digest** no longer lists that version.
7. To move to the real room: turn the digest off, turn the private room off, add the real
   room, go through step 4, then turn the digest on. A test there is a real public post.

## Needs your answer

A message whose answer was lost may or may not have appeared. Orbiters does not look for it
and never sends it again by itself, on either platform. The rest of that digest waits for
your answer or goes with the next one.

1. Look at the room itself.
2. Choose **It appeared in the room** or **It did not appear** only when you saw which one
   it is. The wrong answer posts a message twice, or never.
3. If you cannot tell, leave it. Later digests do not wait for it.

A message that was **Refused** for good (a missing permission, a deleted channel) waits for
**Try again**, or goes with the next digest. Repair the cause first. What is left is read
again before it is posted. A test needs no answer: its row says what happened.

## Before rolling images back

Do this before [rolling back](04-deployment-and-backups.md) to any earlier release while a
room is configured. Treat a rollback with the digest on as unsafe.

1. [Stop all posting](#to-stop-all-posting), and check that nothing is on its way. Check
   that the tab shows a **Last changed** date under **Daily time**: an earlier release takes
   a switch that was never stored for on. Adding a room stores it; if there is no date,
   change the time and choose **Save time**.
2. Roll the images back.
3. In the earlier release, check that the digest is off and leave it off. The release of
   2026-11-24 (`7283db91`) would post release-note lines and AI summaries, and lets every
   administrator use the tab.
4. When the current release is back, look at each room's recent posts and at
   **Needs your answer**, and settle what you can establish, before turning the digest on.
   Messages the earlier release had prepared are prepared again, not sent as they were.

The tables of this release can be read and written by `7283db91`; there is nothing to
migrate back, and no table to drop. For a release older than `7283db91`, which does not know
the AI routing fields: in **Admin > AI** remove every fallback model and choose
**Save AI settings** first, or that release refuses the whole AI setting. An override saved
for the former "Updates digest" AI feature is left out and disappears with the next
**Save AI settings**; save once before such a rollback.
