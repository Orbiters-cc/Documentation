---
title: Find a time, world and movie together
section: Community
order: 156
audience: user, creator, mod, admin, dev
stage: beta
id: orbiters.community.event-planning
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-09-20
---

# Find a time, world and movie together

Open **Community → Events → Create event**. Connect Discord and VRChat first using
[Create and manage community events](manage-community-events.md). Planning requires
the matching application release; documentation does not enable an older deployment.

## Ask for availability

Choose **Set a date & time** when the schedule is known. Otherwise select
**Get people’s availabilities** and specific dates or days of a typical week.
Select up to 31 dates, an earliest/latest time, timezone, slot size and expected
duration. A latest time earlier than the earliest ends the following day.

An optional voting deadline closes responses at that instant. It does not publish
automatically: the organizer chooses the final plan. Typical-week polls show their
reference week because daylight-saving offsets depend on dates.

Enable **Let people vote for the world** to add 2–12 named worlds. Participants can
vote for several. **Who can join** chooses Group members, Group+ or Group public;
member-only events can also restrict access to selected group roles.

**Create shareable poll** moves the event into planning and gives it a website
link. Discord/VRChat calendar publication, announcements and instance creation wait
until the organizer confirms the plan. A saved draft stays private.

## Respond from the shared link

Sign in, then drag across the availability grid to mark or clear a rectangle.
Keyboard users move with arrow keys and toggle with Space. Touch users drag cells
and scroll at the grid's edges. Change **Display timezone** without changing the
stored instants. Repeated daylight-saving hours remain distinct; nonexistent times
are omitted.

Vote for worlds and movies, then expand **Invite me** to choose event steps.
An unlinked account shows VRChat linking steps in place. Member-only events show
the group name/code, a join link and **Check again** when joining is required.
Role requirements still apply. Be friends with the community account to receive
its in-game invitations.

**Save response** saves availability, votes and invite choices together. Your name
and votes are visible to signed-in people with the link. Invite choices stay private.
**Discard edits & reload my response** restores the saved version; **Withdraw my
response** removes it from results and withdraws pending invites. Concurrent edits
from another window produce a conflict instead of overwriting the newer response.

## Compare and confirm

**Group results** refreshes while the page is visible and preserves unsaved edits.
Darker cells indicate more participants. Select names to compare a subset, inspect
a cell to see names/copy its time, or download CSV responses. Each event supports
up to 2,000 participants.

The organizer chooses the final start, duration, world and movie for each poll.
A start selected from the heatmap pre-fills the decision form. **Confirm choices &
publish** closes voting and starts ordinary event delivery. Responses remain visible
and invite preferences carry over. If publication fails after choices save,
**Publish confirmed event** continues from those saved choices.

The shared availability range, first-step poll questions and audience stay fixed.
Create another event when those need replacing. Normal published-event delivery
and retry rules continue to apply.

## Add or change later steps

Open **Edit event → The itinerary → Add a step**, even after sharing a poll or
publishing the event. Every later step supports its own world and movie polls.
Choose a fixed world/title or add multiple options, then save. The same planning
link collects the new votes. For a published event, its confirmed first step stays
unchanged; pending later steps wait for their final choices before an instance can open.

Removing a step that has votes asks for confirmation. The removal takes effect
only when you save. Its votes and invite choices are removed together; availability
and votes on other steps remain. If more votes arrive during editing, saving asks
for a fresh confirmation. Removing choices from an unopened step drops votes for
those choices while preserving votes for choices that remain. Removing the last
poll closes voting while preserving the shared page and remaining invite options.

An open instance's step cannot be removed or have its world, movie or start time
changed. Resolve any unconfirmed delivery before editing its step. These checks
keep the itinerary consistent with instances and invitations already sent.

## Movie sessions

Enable **Movie session** on the first step or an itinerary step. Search movies,
series or anime; a series opens a season/episode picker. One selection fixes the
title; two or more create a poll for that step, up to 12 choices.

An administrator must configure a global **The Movie Database** API Read Access
Token in **API Keys**. The catalog supplies metadata, posters and episode details;
it does not supply a film stream or playback rights. Check TMDB's terms for your
application use. The interface includes TMDB attribution.

[TMDB API setup](https://developer.themoviedb.org/docs/getting-started)

## Read everyone's choices while voting

The shared page shows the event banner above numbered steps. Availability colors
and vote counts include your unsaved choices, so you can compare your answer with
the group immediately. **Save response** is still required to share them. Expand
**Compare participants** to inspect individual responses. World and movie polls
allow multiple choices where indicated; available movie or episode runtimes appear
alongside the title.

**Display timezone** opens an interactive map with your detected timezone selected.
Hover or focus a region to inspect it; click or press Enter to select it. Zoom for
small regions, reset with **World**, or select **Use my timezone**. This changes
display only, never the stored availability instants. The selected date determines
the daylight-saving offset.

Signed-in users can find eligible polls in homepage **Events waiting for votes**
widgets and open them in a desktop window. Public-group polls can be discovered;
private-group polls appear to their organizer and previous respondents. A shared
link still supports new participants under the poll's normal access rules. Closed
or resolved polls leave the discovery feed.

The availability grid grows to show all of its rows, using the page or modal's
main vertical scroll. Very wide multi-day tables can still scroll horizontally.
The event window's blurred banner extends to its top edge; the clear image retains
its proportions and rounded corners.

Poll widgets support 1×1, 2×1, 2×2 and 3×2 sizes. Compact cards prioritize the
event title, responses and voting action over the event artwork. Larger cards show
proposed world thumbnails and movie posters, with a fuller description when there
is room. The event banner is used when available; polls without images retain a
clear voting action.

Closing a homepage voting window with unsaved choices replaces its contents with a visible confirmation. **Keep editing** restores your choices and scroll position; **Discard and close** closes without saving. The same protection applies when editing Sonas through their homepage widget.
