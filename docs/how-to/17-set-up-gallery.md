---
title: Gallery — connect a Discord room and import pictures
section: Website
order: 43
audience: user, creator, mod, admin, dev
stage: stable
id: orbiters.how-to.set-up-gallery
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-10-08
---

# Gallery: connect a Discord room and import pictures

To add a room to the **Gallery** page, open **Community → Galleries**. Create a named gallery, select its **Discord room**, then import earlier pictures with **Crawl Past Images**. The Gallery page itself is where you browse pictures; its sidebar does not create rooms.

## Gallery or asset showcase?

| You want pictures to appear… | Configure them here |
| --- | --- |
| Under a named room in the main **Gallery** page | **Community → Galleries** |
| Under one asset's description, such as Ultirex | Open that asset's settings: **Page** tab → **Showcase gallery** |

These are separate configurations. Connecting a room to an asset showcase does not automatically create a room in the Gallery sidebar. The same Discord picture can appear in both places.

## Before you start

- Choose a community you own or administer. Creator status is not required. Community moderators cannot change galleries.
- [Connect a Discord integration](06-configure-discord-integrations.md) for the server under **Community → Connections**. The community owner manages connections; admins use those connected servers for galleries.
- Use a regular Discord **text channel**. The room picker does not list forum channels, threads, voice channels or categories; a forum can feed [Topic galleries](#topic-galleries) instead.
- Give the integration's bot **View Channel** and **Read Message History** in that room, including any channel permission overrides. For a custom bot, enable **Message Content Intent** in its Discord developer settings so image attachments are available. See Discord's [message-content requirements](https://docs.discord.com/developers/events/gateway#message-content-intent).
- Choose a room whose pictures are appropriate for the gallery audience. Discord channel privacy does not automatically make an Orbiters gallery private.

Existing galleries are available under their owner’s community. If you have not created a community yet, create one from **Community** first. Asset showcase galleries remain managed from their asset settings. Website staff status alone does not grant permission to edit a community gallery.

## Create the gallery

1. Open **Community**, select the community, then choose **Galleries**.
2. Enter a **Gallery name**, such as `VRChat pics` (2–120 characters).
3. Search the **Discord room** picker and select the text channel from the correct server. The form selects one room per gallery; create another named gallery for another room.
4. Choose a **Gallery layout**: Masonry, Frame, Justified or Packing.
5. Choose who can see it with **Private**, **Members** or **Public**. Keep **Private** to preview it yourself first.
6. Select **Create Gallery**. Your saved gallery appears below the creation form.
7. In its **Gallery Crawl** section, select **Crawl Past Images**. Watch the progress and any room-specific error. Saving the room alone does not import its history.
8. Open **Gallery**, then select the gallery's name in the sidebar. **All** combines the galleries available to your account.

The importer reads image attachments from Discord messages. A link pasted into a message is not the same as an attached picture. New image messages in configured rooms are picked up by the connected bot; the crawl brings in older messages. Imported pictures can appear while a crawl is still running.

## Who can see a gallery

| Setting | Who can browse it? |
| --- | --- |
| Public | Signed-in Orbiters users |
| Members | Signed-in users who are members of the gallery room's Discord server |
| Private | Community owner and admins; privileged website staff retain read access for administration |

The Gallery page requires login for every gallery. **Members** galleries do not
appear in the gallery list, the **All** feed or homepage gallery widgets for
people outside the server. A link to one shows **Server members only** with the
server's name instead of the pictures; people without a linked Discord account
are asked to link it first. Image addresses are only handed out after the same
check, and an image pinned to someone's homepage shows the same locked message
after they leave the server.

Membership comes from the Discord server records Orbiters already keeps: the
bot updates them when people join or leave, and signing in with Discord adds the
servers you belong to. Someone who joins the server can see the gallery once that
record exists (sign in with Discord again, or select **Sync with Discord** in
**Account**). Members is not a role-based access list, and staff can still open
every gallery for administration. Development and production have separate
saved configurations: a room set up in development must also be configured in
production.

## Topic galleries

A **Topic gallery** source turns every topic (thread) of a Discord forum, such as a
`📷-event-gallery` forum with one topic per event, into its own gallery named after
the topic.

1. In **Community → Galleries**, find **Topic galleries** and search the **Discord
   forum** picker.
2. Choose who can see the topic galleries, then select **Add forum**.
3. Orbiters imports the forum's open and archived topics, then each topic's pictures,
   starter post included. The topics appear as chips under the forum; select one to
   open its gallery.

New topics become galleries as soon as they are posted, and renamed topics rename
their gallery. Archived topics keep their gallery and pictures. A deleted topic
closes its gallery, and deleting the forum switches the source off. The audience
and layout of a source apply to all of its topic galleries; the refresh button
imports the topics again and the close button removes the source, hiding its
galleries until the forum is added again. Topic galleries are listed with their
forum rather than among the galleries below, and appear on the Gallery page like
any other gallery. The bot needs **View Channel** and **Read Message History** in
the forum.

## Change a room or recover an import

Edit the saved gallery's name, room, layout or audience, then select **Save**. Changing rooms removes the old room's placements from that gallery; crawl the new room to import its history.

- **Resume** continues an interrupted crawl from its saved position when offered.
- **Restart** starts the history scan again. Repeated imports match existing attachments instead of intentionally creating duplicates.
- A failed room has its own retry action. Read the reported error and fix bot access before retrying.
- **Flush Images** removes that gallery's website placements and orphaned imported records. It does not delete the original Discord messages. Pictures used by another gallery or showcase are retained there. Use a new crawl to repopulate the gallery; flushing is not needed for routine layout or name changes.

The source author can hide their own picture across Orbiters galleries and showcases. For someone else's picture, use the image preview's content-report action. See [privacy and shared content](15-manage-privacy-and-shared-content.md).

## Set up an asset showcase

Open the asset's settings and find **Showcase gallery** in the **Page** tab. Choose **Set up showcase**, add its **Rooms** (grouped by Discord server), choose a **Layout**, and select **Save**. Saving new rooms starts importing their earlier images automatically; progress appears in the earlier-images row, and **Crawl past images** runs the import again. This import belongs to that asset, independently of the main Gallery configuration.

## Troubleshooting

| What you see | What to check |
| --- | --- |
| No rooms in the picker | Connect the server under this creator account, confirm the bot is connected, then reopen Galleries. Only regular text rooms are supported. |
| Room missing or unavailable to the bot | Confirm the selected server, View Channel permission and channel overrides. |
| Gallery exists but is empty | Run Crawl Past Images, inspect crawl errors, and confirm the room contains image attachments. Check Message Content Intent for a custom bot. |
| Other people cannot see the gallery | Save it as **Public**, or as **Members** for people in its Discord server, and ask them to sign in. |
| A server member sees **Server members only** | They must sign in with the Discord account that is in the server. Ask them to select **Sync with Discord** in **Account**. |
| Development works but production is empty | Check the production creator integration, room selection, audience and crawl status separately. |
| One picture fails | The Discord source may have been removed or bot access may have changed. Other pictures should remain browsable; check the source before recrawling. |

<audience include="dev">

## Members-only access

`Galleries.membersOnly` (boolean, default false) stores the Members audience; a
members-only gallery keeps `isPublic` false, so any check that only reads
`isPublic` fails closed. The API accepts `visibility: private | members | public`
(legacy `isPublic` still works) and returns `visibility` on every gallery.
Management requests use `/community/:communityId/galleries` and require that community’s owner or admin. Gallery records use the community owner’s existing partition; imported images are retained.

`services/discordImages/galleryAccess.js` is the single policy used by the gallery
list, the per-gallery and combined feeds, single images (homepage pins), image
sources, `GET /galleries/:id`, social-post imports and content reports. A viewer
needs an active `UserDiscordServerPresence` row for every guild of the gallery's
active rooms; the creator and admin, dev and owner ranks always pass. Non-members
receive `403` with `code: GALLERY_MEMBERS_ONLY` and `locked.servers` (guild id,
name, icon), never the gallery name. Public and private galleries need no extra
queries. `GET /files/serve/:id` no longer serves `discord_image` file pointers, so
image URLs only leave through these checks. Run
`node --test test/galleryMembersOnly.test.js`; the populated schema upgrade is
covered by the opt-in `test/visibilityUpgradeDatabase.test.js`.

## Delivery changes awaiting application deployment

The September 6 optimization separates image-list delivery from Discord URL refreshes. Lists return stored dimensions and source endpoints without contacting Discord; visible tiles refresh expired links independently and offer retry on failure. Previews request a bounded image from Discord's media proxy, with original-image fallback; opening a picture loads the original. Discord attachment URLs expire, so a cold image still depends on Discord availability and cannot be promised instantaneous delivery. See [Discord's signed attachment URL reference](https://docs.discord.com/developers/reference#signed-attachment-cdn-urls).

### Scrolling, duplicates and failed images

- **All** returns one card per imported Discord image, even when several accessible galleries share that image. Separate uploads of similar-looking pictures are still separate sources; this is not visual similarity detection.
- Supported image MIME types or image filename extensions determine eligibility. Video dimensions no longer qualify an attachment as a picture. The same rule filters existing imported records at read time, so no destructive flush or recrawl is required to remove video slots.
- A failed source refresh or failed image decode removes the card from the current view and closes its space. **Retry skipped images** tries those sources again. This does not delete or globally hide the pictures. Network failures are bounded rather than leaving indefinite loading tiles.

The skipped-image count deliberately has no matching gray error frames: those
cards have been removed from the current gallery layout. A homepage widget keeps
its saved footprint and offers **Retry image** and **Open galleries** instead.

The September 20 fix makes expired Discord attachment refreshes bypass the
Discord.js message cache. A cached message can still contain an expired signed
URL even after the database row has been updated. Refreshing through Discord's
REST API obtains the new signature; simultaneous attachments from one message
still share one in-flight request. The fix needs a backend deployment, and the
homepage retry button needs a frontend deployment.
- Masonry positions come from stored dimensions and available width. Loading another page does not recompute earlier positions from recycled DOM measurements. Tilts fit within each card's allocated space, including very tall images. Four columns fit the reported desktop width, with fewer columns on phones.

### Stable relevance while browsing

The first page ranks eligible, deduplicated image IDs once. Relevant still combines reactions (75% weight, capped logarithmic score) and recency (25% weight), with an author diversity window of ten slots where alternatives exist. A source author's Discord identity supplies diversity even when there is no linked Orbiters profile.

Later pages use the same ordered snapshot, so new pictures, reaction changes or the passage of time do not move page boundaries underneath a reader. Date and Reactions use snapshots too. Reloading or changing the sort creates a fresh order. Current gallery access, active placements and source visibility are checked again for each page; hidden or removed records can reduce a page's visible count without stopping pagination.

Cursors are opaque, bound to the user, accessible gallery set and sort. Clients send `0` for the first page and return `nextCursor` unchanged afterwards. The frontend also suppresses repeated source IDs and ignores responses belonging to an earlier sort or gallery. A `410` response offers **Reload gallery** while retaining the current view; it never silently inserts a fresh first page into the existing list.

### Deployment and verification

Snapshots are held in backend memory for 30 minutes of inactivity, with a shared budget of 500,000 image IDs and at most 128 sessions. Eviction or a backend restart can require Reload gallery. A collection over 500,000 eligible images must be narrowed before browsing. The current Compose deployment has one backend per environment; multiple backend workers would need session affinity or a shared snapshot store before scaling this feature.

Run `node --test test/galleryDelivery.test.js test/galleryFeed.test.js` from the backend for delivery and ordering checks. `src/scripts/galleryBrowserQa.cjs` exercises a production frontend build against local mocked APIs on port 4296: four pages, duplicates, a broken image, scroll-back, image bounds and mobile width. It never calls the live gallery or Discord. The optional `galleryRankingDatabase.test.js` requires an explicitly isolated local PostgreSQL fixture and checks populated ranking, video exclusion, shared placements and reaction changes between pages.

These changes need the matching frontend and backend deployment; publishing this documentation alone does not deploy the optimization.

</audience>

## Open a picture, its replies and its author

Pictures on Gallery and homepage gallery widgets use the same expanding image viewer. The loaded thumbnail stays visible while the full image loads. Close with the inset button, Escape or a click outside; the viewer returns to its source picture, including the grid picture's angle, scale and smaller corners, and restores keyboard focus. Reduced motion removes the spatial expansion.

Select the author’s avatar or name to open Gallery with an author filter across the galleries available to you. You can select a particular gallery while retaining that filter, change sorting or load further pages. **Show all authors** clears it. Private galleries and hidden images retain their existing access rules. Filtered pagination is bound to the author as well as the viewer, gallery set and sort.

### Replies from Discord

Messages that reply to a gallery picture in its Discord room appear under the
picture's details as chat bubbles, oldest first: the author's Discord name and
avatar, the time, and the text with mentions, custom emoji, spoilers, code and links.
Authors with an Orbiters account link to their public profile. Edits and deletions
on Discord are reflected, and replies to pictures imported earlier are collected in
the background. Replies are shown only to people who can see the picture, so a
members-only gallery's replies stay with its server members. The Discord button next
to the reply count opens the picture's message; very long threads show the first 200
replies with a link to the rest on Discord.

<audience include="dev">

Replies live in `GalleryReplies` (one row per Discord reply message, keyed by channel
and message ID, linked to the picture message by `parentMessageId`). Only replies in
the picture's own channel to a stored `DiscordImage` message are kept; authors are
stored by Discord ID and resolved to Orbiters profiles on read. Live listeners handle
`messageCreate`, `messageUpdate`, `messageDelete` and `messageDeleteBulk`. The
`gallery.replies.backfill` outbox job pages a channel newest first, five pages of 100
messages per job, stopping at the channel's oldest stored picture; it runs after each
completed gallery crawl and once for every active room (marker
`gallery-replies-backfill-2026-10`). `GET /galleries/images/:placementId/replies`
applies the same access checks as the picture; feed items carry `replyCount`.

Topic sources live in `GalleryTopicSources` and `GalleryTopics`. Each topic gallery
is an ordinary gallery whose single `GalleryChannels` row is the thread; creation runs
under a per-thread advisory lock and adopts an event's existing gallery for the same
thread. `gallery.topics.sync` imports active, then archived topics (100 per page,
five pages per job). Event galleries are recorded in `CommunityEventGalleries`; the
`gallery` event delivery creates them on publication.

</audience>
