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
lastVerified: 2026-09-08
---

# Create and manage community events

**Admin → Community & moderation → Events** brings your Discord scheduled event,
VRChat calendar entry, group announcement and group instance together. Each event
belongs to its creator, who can return to edit it and check delivery status.

## Connect your communities

Open **Communities & team** before creating your first event.

1. Add a Discord server from the list or paste its server ID. Your linked Discord
   account must own it or have Administrator, Manage Server, Manage Events or Create
   Events permission. The Orbiters or creator bot must already be connected to the
   server through **Creator → Integrations** and have **Manage Events** permission.
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

Opening pages reads saved information. **Refresh groups from VRChat**, adding a
community, changing team access and publishing an event make the necessary
provider requests. Future instance creation is part of the publication you authorize.

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

Global Orbiters staff rank alone does not authorize another person's community.
Community Leader status controls who can connect a personal community-management
account; it is not required for a teammate to use an assigned community.

## Create an event

Add an optional **event banner** using Upload banner. PNG, JPEG and WebP images
up to 10 MB are supported. Orbiters removes embedded metadata and center-crops
the image to 16:9; review the preview before publishing. Replace or Remove changes
the draft, and saving a published event updates its Discord cover and VRChat
calendar/announcement image. Changing the VRChat community clears the banner so
you can choose one for the new destination. Draft uploads stay private on Orbiters.

In **The VRChat instance**, enter a world name and press **Search** or Enter.
Results show thumbnails and authors; select a card to fill the world ID. Use
**Next results** for another page, or paste a world ID or world URL directly.
Typing, choosing a result, and opening the editor do not make VRChat API requests.
Explicit searches check your community access and reuse recent matching results.

If a VRChat banner upload cannot be confirmed, replace the banner before retrying
publication. Confirmed uploads are reused for subsequent event edits.

1. Choose **Create event**. Enter a name, description and start/end times. The editor
   shows your browser's time zone; Orbiters stores the times in UTC.
2. Select the Discord server and VRChat group.
3. Paste the VRChat world ID or world page URL. Choose the region and instance
   audience: group members, Group+ or group public. Members-only instances can be
   restricted to selected group roles.
4. Choose **When I publish**, or **Before the event** and the number of minutes
   before the start, from 0 to 1,440. The backend must be running at opening time.
5. Choose a calendar category and whether the initial VRChat publication should
   notify group members. This setting covers the calendar entry and announcement.
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

Administrators without a personal Community Leader account start with the shared
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

**Retry failed steps** retries rejected actions while preserving successful
results. A lost response is different: the provider may have created the resource
without returning confirmation. Orbiters marks that step unconfirmed. Check the
provider, then either enter the existing resource ID for verification or explicitly
confirm that nothing was created before retrying. A backend restart does not
silently repeat an unconfirmed creation.

**Cancel event** asks for confirmation, then cancels the Discord event, removes
the VRChat calendar entry, marks its announcement cancelled and closes an instance
created for it. Cancellation stops pending instance creation. Active Discord events
are completed; already completed or removed records are treated as finished.
Review individual statuses if any cancellation step fails.

Provider rate limits, permission changes or disconnected accounts can delay or
block delivery. Orbiters does not claim completion until each action is confirmed.
An instance that missed the event's end time is not created later.

Account closure removes private drafts and website team assignments and stops
queued work. Already published records remain on their respective platforms.

<audience include="dev">

See [Community event delivery](../reference/community-event-delivery.md) for the
provider contracts, durable receipts and database upgrade checks.

</audience>
