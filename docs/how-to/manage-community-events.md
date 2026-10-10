---
title: Create and manage community events
section: Community
order: 155
audience: user, creator, mod, admin, dev
stage: beta
id: orbiters.community.events
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-10-09
---

# Create and manage community events

**Community → Events** brings your Discord scheduled event,
VRChat calendar entry, group announcement and group instance together. Each event
belongs to its creator, who can return to edit it and check delivery status.
If you help manage events without owning a managed community, use **Events** in
the navbar. The standalone workspace is `/community/events`; no website staff rank is
required.

A **Community Admin** can create events using the owner's already registered
Discord server and selected VRChat group. For the official Orbiters community,
this includes its shared VRChat service account. No separate account connection,
server registration or event-team invitation is needed. **Communities & team**
shows these choices as **Community admin** and replaces the connection setup forms
with a ready state. Publication rechecks the appointment, active connections and
the owner's current platform permissions. Removing the appointment or connection
removes this inherited access. Community Moderators still need their own event
permissions; managing the event team remains separate.

The **Create event** button opens the editor from the button's position, using the
same window transition as asset and role creation. Closing returns to the button
and restores keyboard focus. Escape, clicking outside and the close button dismiss
the editor without saving; with unsaved changes the action bar first asks
**Discard your changes?** (**Keep editing** or **Discard**). Saving or publishing
remains an explicit action. The editor uses one scrolling window, adapts to mobile,
and respects reduced motion.

The editor puts the essentials first: the event name, **When**, **Where** (Discord
server and VRChat group), the program (world, movie and steps), **Who can join** and
**About**. A new event starts at the next 20:00 that is at least two hours away, lasts
two hours, uses your first saved Discord server and VRChat group, and picks the VRChat
region closest to your timezone. Your timezone, the end time and how far away the
event is stay visible under the start. Cover image, Discord announcement, event
staff, prizes, voting and VRChat instance & calendar settings open as sections; each
collapsed section shows a one-line summary.

A live preview beside the form (or under **Preview** on a phone) shows the Discord
event, the Discord announcement and the VRChat calendar entry as you type. Problems
appear next to their field once you leave it, and all of them when you save: the
action bar counts them and **Show** opens the right section and focuses the field.

## Connect your communities

To collect availability, world votes or movie/episode choices before publication,
follow [Find a time, world and movie together](plan-event-availability.md).

Owners open **Communities & team** before creating their first event. Community
Admins use the owner's existing connections and do not repeat these steps.

1. Add a Discord server from the list or paste its server ID. Your linked Discord
   account must own it or have Administrator, Manage Server, Manage Events or Create
   Events permission. The Orbiters or creator bot must already be connected to the
   server through **Community → Connections** and have **Manage Events** permission.
2. Connect a dedicated VRChat account in [Manage a VRChat community](manage-vrchat-community.md).
   In Events, the community group selected in the VRChat tab is available and
   preselected from saved information. Click **Add group** to enable events and
   check current permissions. To choose another group, refresh the group list explicitly.
   Website administrators can select the shared Orbiters account instead.

The VRChat account needs permission to manage the group's calendar and
announcements, create the selected kind of instance, and link an instance to a
calendar event. Group ownership supplies these permissions. A moderator can use
an already connected group through their linked personal VRChat identity or a
website team assignment.

Browsing communities and events reads saved information. Opening **Manage team**
or searching its members checks your current authority with the provider.
**Refresh groups from VRChat**, adding a
community, changing team access and publishing an event make the necessary
provider requests. Future instance creation is part of the publication you authorize.

## Restrict an event to adults

In the creation form, enable **18+ event**. The selected VRChat community must
already have 18+ features enabled and its safe **18 Plus** role configured under
**Community → VRChat**. Orbiters selects that exact role automatically and forces
members-only group access; public/plus access and manual role selection are disabled.

Every created instance, including additional itinerary steps, is restricted to
that role. Announcements identify the event as 18+. The restriction is checked
again before provider delivery, so a disabled setup, changed group or unsafe role
stops delivery instead of opening an unrestricted instance. Resolve the group
configuration before retrying. The adult-only choice cannot change once the draft
has been shared or published.

## Frame Discord and VRChat covers

In **Cover image**, **Use the same image for Discord and VRChat** is on by default.
Turn it off for separate **Discord cover** and **VRChat cover** pickers. Each image
has its own framing. Dropping or choosing a PNG, JPEG or WebP opens an editor:

1. Drag the image, or focus it and use the arrow keys, to reposition it.
2. Use **Zoom** to enlarge it. **Fill frame** resets the crop; **Fit whole image**
   keeps the whole picture with dark padding where needed.
3. Choose **Use image** to upload the framing, or **Cancel** to keep the previous cover.
4. Save the event to retain both uploads. Unused uploads are reclaimed after 24 hours.

Images must be still files up to 10 MB and 25 megapixels. Discord/shared images
use a 16:9 frame; separate VRChat images use a 2:1 frame. The VRChat preview shows
the calendar date, category, group icon, shortened title and local time on a
transparent backdrop. Closing the cover controls keeps both previews loaded.

## Create instances yourself

Under **VRChat instance & calendar → Open the instance**, choose **I’ll create
instances**. Orbiters still publishes the calendar and announcements, but does not
create or close instances for this event or its steps. Create rooms in the selected
VRChat group, using the step’s world and the event’s access and role restrictions.
Instance-creation and calendar-link permissions are not required in this mode.
Once any step has an open automatically created instance, its creation mode stays
locked for the event.

When **Auto Invites** is enabled and members have opted in, Orbiters checks after
the step starts, at most every two minutes, for a matching active group instance.
Unscheduled steps wait until you select **Start step** in My events. That action
selects the step; it does not open a room or send an organizer invite in this mode.
An attendance threshold, when selected, still applies. Invites stop at the step’s
end, while it is paused, or when Auto Invites is disabled.

If several rooms match the same group, world and access rules, Orbiters waits
instead of choosing one. Use a unique matching room for the event. Rooms in other
groups, other worlds, or with different role restrictions are not selected.
Manually created rooms remain under your control when you cancel the event.

## Optional Discord announcement and opt-in invites

In the event editor, turn on **Discord announcement**, choose a text or
announcement channel, and write the message. The live preview's Discord tab shows
the message with markdown, the bot identity, mentioned roles, steps, movies, event
staff and prizes. Turning the announcement off and on again keeps your draft.
**Refresh channels** explicitly reloads channel information; ordinary browsing
uses saved Discord information. Both you and the bot need Send Messages and
View Channel, and the bot needs Embed Links. Select **Mention roles** to notify
specific roles above the announcement. Only selected roles can ping; typing a
mention in the message does not notify anyone. Non-mentionable roles require
Mention Everyone permission for both you and the bot in that channel. The role
selector includes the server's saved roles; **Refresh channels** also refreshes roles.

The event banner appears inside the Discord announcement and its preview. The
bot needs **Attach Files** to include it. Selected roles are notified on first
publication only: edits, step switches and cancellation do not ping them again.

With a banner selected, **Use banner on VRChat** controls whether it also appears
on the VRChat calendar and group announcement. New gallery uploads require
VRChat+ on the connected community account, as described in
[VRChat's group requirements](https://help.vrchat.com/hc/en-us/articles/11706395001875-Creating-a-Group).
Group management permissions alone do not grant gallery upload access.

If VRChat denies gallery access, those entries publish without the optional image
and show a warning. Discord keeps its banner. Orbiters attempts a denied upload
only once within that publication attempt. Other upload errors still require
attention. Resolve gallery access before retrying an image update.

The message is sent when you publish, and subsequent edits update that same
message in its original channel. For automatically created rooms, the instance join button appears once the
instance opens. Cancelling the event disables the invite and join buttons.

Enable **Auto Invites** in More options to let members opt in. New events have it enabled. Turning it off hides Invite me buttons on announcements and polls, closes sign-ups and stops pending attendee invites for every step. Choose either
**At the start** or **Above attendance**, with a **More than** threshold, directly
in the Auto Invites section. These controls do not depend on a Discord announcement.
Attendance checks run at most every two minutes while people are waiting, only
after an instance exists. If the threshold is never reached before the event
ends, no invites are sent. Invitations are delivered gradually in small batches.

The invite button opens the website. Members already signed in with VRChat linked
are added immediately and see **You’re on the invite list**. Otherwise, the same page offers Discord
or Telegram login, then the usual VRChat linking frame. Their selected step survives
the sign-in journey. Members must be friends with the selected VRChat community
account; the success page offers **Ok** to open the event overview at `/events/<id>`
and **Don’t invite me** to withdraw. The overview does not sign them up again.
Group membership and role restrictions still apply. Changing the linked
VRChat account withdraws the old opt-in. One confirmed invite is sent per member
per step; unconfirmed sends are never automatically repeated.

The event card shows waiting, sent, failed, unconfirmed and withdrawn counts.
After fixing a connection or friendship problem, a member can click the button
again to retry a failed invite. Disabling invites or cancelling/ending the event
stops pending deliveries. Unconfirmed invites require checking VRChat; withdrawing
and signing up again does not resend them. An invite already being sent cannot be
recalled, so **Don’t invite me** keeps its delivery history instead of promising
that it was cancelled.

## Plan an event in steps

A simple event is a single step: its world, movie and invite settings sit directly
in the form. Choose **Add a step** to split the event, for example Game 1, Game 2,
then Chill. The form then shows numbered steps; **Step 1** is the event itself and
has the same fields as every other step: name, start, world (or a world vote),
movie or movie vote, and invites. Step 1 starts with the event. Up to five steps
are supported. Removing steps until only one remains returns to the simple form.

Additional steps wait for the organizer by default. Turn on **Schedule a start
time** only when you want automatic opening. Scheduled times must be in
chronological order inside the event's start/end times.

With automatic instance creation, every step gets its own group instance, using the event's audience, region and
chosen audience settings. Enabling Discord invite buttons adds one website link
per step to the announcement. Members can subscribe to several steps independently;
withdrawing from one does not withdraw from the others. Invites stop when that
step ends. The event card shows each instance's delivery status separately.

Published steps cannot be removed or reordered. An open step cannot change its
world or start time. Cancel the event to cancel all its remaining deliveries.

## Run the meetup at your own pace

During a published meetup, open **My events → Run your meetup** and choose
**Start step** on any step. You can skip ahead or return to an earlier step.
With automatic instance creation, Orbiters queues that instance and sends an invite to your linked personal VRChat
account once it exists. The first step has its own name and controls too.

For automatic instance creation, your personal VRChat account must be linked in **Connections** and able to receive
invites from the community account. Your earlier instance stays available: join
the new one, then place a portal yourself for the group. Portal placement is not
automated. Switching to an already created step reuses its instance.

Taking manual control pauses other steps, including their scheduled openings,
until you select them. Pending attendee sign-ups stay saved, including for steps
that have not started yet. No attendee invites are sent while a step is paused,
even if its instance is already open. Selecting it resumes those sign-ups without
asking members to register again. People who received an invite are not sent another
automatically. The selected step's start-triggered invites become eligible when
its instance exists; attendance-triggered invites still wait for their threshold.

The card reports instance and organizer-invite outcomes separately. **Invite me
again** is an explicit new request. Unconfirmed sends are not repeated; use
**Open instance** to join directly if your invite could not be confirmed. Controls
are available only between the meetup's start and end times.

## Give your team access

Open **Manage team** on the relevant community. Search for an Orbiters member by
name, member ID or Discord ID, then assign a role:

| Website role | Access in this community |
| --- | --- |
| Moderator | Create, publish and manage their own events |
| Admin | The same event tools, plus managing the website team |

Discord server owners and VRChat group owners or administrators with Manage Roles
can establish team access. Website admins can delegate further under that native
authority. Removing a website role does not revoke permissions the person already
has on Discord or VRChat. Website assignments do not change native platform roles.
If the original grantor loses native authority, their delegated access stops working.
That includes viewing the team and searching for members: an old website assignment
does not keep those lists accessible after its authority is revoked.

Global Orbiters staff rank alone does not authorize another person's community.
Creating a managed community enables its owner to connect a dedicated community-management
account; it is not required for a teammate to use an assigned community.

## Event staff and prizes

Open **Event staff** to name the people running the event. Add a role from the
presets (Main host, Judges, Performers, Sound manager, Moderators) or a **Custom
role**, set how many people it needs, and search Orbiters members to fill it. Once a
role is full, further people become ordered backups (**Backup 1**, **Backup 2**, up
to ten) who step in if someone can't make it; the arrow buttons move people between
the role and its backups. **Based on a Discord role** uses one of the event server's
roles as the pool of candidates: when the bot can see the server, the search lists
linked members holding that role; otherwise all members are shown with a note.

Open **Prizes** to list what can be won. **1st · 2nd · 3rd** adds a podium; **Add a
prize** adds any other place or label, such as Crowd favourite. Each prize has a
title, optional details and an optional image (PNG, JPEG or WebP up to 10 MB,
cropped to 16:9).

Staff and prizes save with the event and appear on the event's page, its invite
pages and in the Discord announcement. Besides the organizer, the owner, Community
Admins and Community Moderators of the community behind the event's Discord server
or VRChat group can edit them: **Community → Overview** lists coming events with a
staff and prizes button, and the event page shows **Edit staff & prizes**. Changes
to a published event update its Discord announcement. Closed accounts are removed
from staff lists. Cancelled events can't be edited.

## Event gallery

Turn on **Event gallery** in the editor to collect the event's pictures in a
gallery of the community behind the event's Discord server:

- **Text room**: pictures posted in an existing room. If one of the community's
  galleries already collects that room, the event uses it; otherwise a new gallery
  named after the event is created.
- **Forum**, **New topic**: Orbiters opens a forum topic named after the event,
  with a short post linking the event page, and creates its gallery.
- **Forum**, **Existing topic**: the gallery of a topic you pick. Topics of a
  [Topic Gallery](17-set-up-gallery.md#topic-galleries) forum reuse that topic's gallery.

Nothing is created while the event is a draft: the gallery (and the new topic) is
created when you publish, or when you save a published event that had none. It is
created once; its status appears with the other deliveries under **Event gallery**.
New galleries are visible to members of the Discord server and import the room or
topic history; change their audience in **Community → Galleries**. The bot needs
**View Channel** and **Read Message History**, and **Send Messages** in the forum to
open a topic.

To show another gallery later, the organizer and the community's managers can use
**Attach a gallery** on the event page, or **Existing** in the editor's gallery
section. The small close button detaches it. The event page shows the gallery's
latest pictures to everyone who can see that gallery; people outside a members-only
gallery's server see which server to join instead.

## Create an event

Add an optional **event banner** in **Cover image**: click or drop a PNG, JPEG or
WebP image up to 10 MB. Frame the image with the crop controls described above. Orbiters removes embedded metadata and saves
the selected framing; review the preview before publishing. Replace or Remove changes
the draft, and saving a published event updates its Discord cover, Discord
announcement attachment and VRChat calendar/announcement image. Changing the VRChat community clears the banner so
you can choose one for the new destination. Draft uploads stay private on Orbiters.

**Trying a few covers? Save a draft when you find the right one.** Uploads that
are at least 24 hours old and are not used by any saved event are cleaned up
automatically. Saved drafts keep their banners, as do published and cancelled
events. Replaced or removed covers become eligible once no saved event uses them.
An abandoned editor cannot keep an upload indefinitely; upload it again if needed.

In **World**, enter a world name and press **Search** or Enter. Results show
thumbnails and authors; select a card to choose the world, and use the pencil
button to change it later. Use **Next results** for another page, or paste a world
ID or world URL directly.
Typing, choosing a result, and opening the editor do not make VRChat API requests.
Explicit searches check your community access and reuse recent matching results.

If a VRChat banner upload cannot be confirmed, replace the banner before retrying
publication. Confirmed uploads are reused for subsequent event edits.

Events without a banner omit the optional VRChat image field. If a provider step
fails, **Retry failed steps** retries only those steps; a synced Discord event
is kept. A VRChat validation error shows the HTTP status and, when available,
which fields to check. Validation errors do not put the account into a cooldown;
rate limits and network failures still do.

1. Choose **Create event**. Enter a name, then the start and a length (1–4 hours or
   **Custom** for any end time). The editor shows your browser's time zone; Orbiters
   stores the times in UTC.
2. Select the Discord server and VRChat group.
3. Choose the VRChat world, and optionally a movie. Choose the instance audience:
   **Members**, **Group+** or **Public**. Members-only instances can be limited to
   selected group roles. Describe the event in **About**.
4. In **VRChat instance & calendar**, choose the region, then **When I publish** or
   **Before the start** and the number of minutes before the start, from 0 to 1,440.
   The backend must be running at opening time.
5. In the same section, choose a calendar category and whether the initial VRChat
   publication should notify group members. This setting covers the calendar entry
   and announcement.
6. **Save draft** keeps the event on the website. **Publish event** starts delivery
   to both platforms and schedules the instance.

For example, a fictional Saturday meetup can publish its announcement on Monday
and open its instance 15 minutes before the meetup. When the instance exists,
Orbiters adds its join link to the existing Discord event description and group
announcement. Discord's location field keeps the group link when the full instance
URL is too long for that field.

## Edit, retry or cancel

### If the page cannot load

An empty event list is normal before your first event. A **Could not load** message
is a server or connection problem, not a requirement to connect more communities.
Use **Retry loading**. This reads saved information without contacting Discord or
VRChat.

If the message says **Events setup is incomplete**, an administrator needs to
restart the updated backend so its database upgrade can finish, then retry the
page. Existing community records and role settings are preserved. For other
persistent load failures, ask an administrator to check the backend logs.

Administrators without a personal managed community start with the shared
Orbiters VRChat account selected. Choose its group from the saved list, or refresh
the group list explicitly if it has not been loaded yet.

### Manage an existing event

**My events** shows a separate status for the Discord event, VRChat calendar,
announcement and instance. Changes to a published event update the saved provider
records. They do not publish a second announcement or resend its notification.

Destinations and instance audience cannot change after publication. After an
instance opens, its world, region, roles and opening settings also stay fixed.
Create another event when you need a different destination or room configuration.
Rescheduling requires a future start time. Existing times can stay unchanged when
you edit an ongoing event's description or title, subject to provider restrictions.

If the editor saves your draft but cannot confirm publication, your saved draft
is retained. Retry in the editor to check whether publication succeeded before
sending another change. If it succeeded, the editor returns to your event list;
otherwise you can retry using the saved draft. If another window changed the
draft, close and reopen it to review those changes first.

**Retry failed steps** retries rejected actions while preserving successful
results. A lost response is different: the provider may have created the resource
without returning confirmation. Orbiters marks that step unconfirmed. Check the
provider, then either enter the existing resource ID for verification or explicitly
confirm that nothing was created before retrying. A backend restart does not
silently repeat an unconfirmed creation.

Use the provider record for this exact occurrence of the event. Recovery checks
the title and scheduled times and rejects a record already linked to another
Orbiters event, including another week of a recurring meetup.

**Cancel event** asks for confirmation, then cancels the Discord event, removes
the VRChat calendar entry, marks its announcement cancelled and closes an instance
created for it. Cancellation stops pending instance creation. Active Discord events
are completed; already completed or removed records are treated as finished.
Review individual statuses if any cancellation step fails.

Cancellation checks permissions for the remaining actions. If no instance was
created, instance-management permission is not required; closing an existing
instance still requires it. Completed cancellation steps do not require renewed
access to their provider.

### End an event

An event becomes **Ended** by itself once its end time passes. To close it early,
use **End event** on its card in **My events** or on its event page, once it has
started. Before the start, cancel it instead.

An ended event is read-only. Invite sign-ups close, waiting invites are withdrawn
and nothing more is sent to Discord or VRChat: the Discord event, calendar entry and
announcements stay as they were. The event page, poll responses, staff, prizes and
gallery stay available, but the event leaves upcoming lists. Ended events cannot be
cancelled; delete one from its card menu to remove it from Orbiters.

Provider rate limits, permission changes or disconnected accounts can delay or
block delivery. Orbiters does not claim completion until each action is confirmed.
An instance that missed the event's end time is not created later.

Account closure removes private drafts and website team assignments and stops
queued work. Already published records remain on their respective platforms.
Closure also invalidates active delivery leases so workers stop before subsequent
steps. A provider request already in flight may still complete.

<audience include="dev">

See [Community event delivery](../reference/community-event-delivery.md) for the
provider contracts, durable receipts and database upgrade checks.

</audience>


## Send an announcement again

In **Community → Events**, each published event has separate **Send Discord
announcement again** and **Send VRChat announcement again** buttons. Confirm the
selected service to post a new announcement there. Discord mentions the selected
roles again; VRChat requests a new notification for group members. The calendar,
scheduled Discord event and instances are unchanged. Previous announcement IDs
remain in delivery history. A pending or unconfirmed delivery must finish or be
resolved before another announcement can be sent.

If VRChat denies gallery uploads, the calendar entry and group announcement publish
without the optional banner. Their delivery cards explain the missing banner;
Discord keeps its own image. Other upload failures still require attention.
For an event already marked **failed**, use **Retry failed steps** after the fix is
available, or use the relevant announcement button to retry just that announcement.
