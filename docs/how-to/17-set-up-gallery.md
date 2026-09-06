---
title: Gallery — connect a Discord room and import pictures
section: Creator Tools
order: 43
audience: creator, admin, dev
stage: stable
id: orbiters.how-to.set-up-gallery
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-06
---

# Gallery: connect a Discord room and import pictures

To add a room to the **Gallery** page, open **Creator → Galleries**. Create a named gallery, select its **Discord room**, then import earlier pictures with **Crawl Past Images**. The Gallery page itself is where you browse pictures; its sidebar does not create rooms.

## Gallery or asset showcase?

| You want pictures to appear… | Configure them here |
| --- | --- |
| Under a named room in the main **Gallery** page | **Creator → Galleries** |
| Under one asset's description, such as Ultirex | Open that asset in Creator and select **Showcase** |

These are separate configurations. Connecting a room to an asset showcase does not automatically create a room in the Gallery sidebar. The same Discord picture can appear in both places.

## Before you start

- Use an account with creator access.
- [Connect a Discord integration](06-configure-discord-integrations.md) for the server under your creator account. Gallery room choices come from your connected servers.
- Use a regular Discord **text channel**. The room picker does not list forum channels, threads, voice channels or categories.
- Give the integration's bot **View Channel** and **Read Message History** in that room, including any channel permission overrides. For a custom bot, enable **Message Content Intent** in its Discord developer settings so image attachments are available. See Discord's [message-content requirements](https://docs.discord.com/developers/events/gateway#message-content-intent).
- Choose a room whose pictures are appropriate for the gallery audience. Discord channel privacy does not automatically make an Orbiters gallery private.

## Create the gallery

1. Open **Creator → Galleries**.
2. Enter a **Gallery name**, such as `VRChat pics` (2–120 characters).
3. Search the **Discord room** picker and select the text channel from the correct server. The form selects one room per gallery; create another named gallery for another room.
4. Choose a **Gallery layout**: Masonry, Frame, Justified or Packing.
5. Choose the audience using **Public gallery**. Leave it off to preview privately.
6. Select **Create Gallery**. Your saved gallery appears below the creation form.
7. In its **Gallery Crawl** section, select **Crawl Past Images**. Watch the progress and any room-specific error. Saving the room alone does not import its history.
8. Open **Gallery**, then select the gallery's name in the sidebar. **All** combines the galleries available to your account.

The importer reads image attachments from Discord messages. A link pasted into a message is not the same as an attached picture. New image messages in configured rooms are picked up by the connected bot; the crawl brings in older messages. Imported pictures can appear while a crawl is still running.

## What public and private mean

| Setting | Who can browse it? |
| --- | --- |
| Public gallery | Signed-in Orbiters users |
| Private gallery | Its creator; privileged staff can access it for administration |

The Gallery page currently requires login, including for public galleries. A private gallery is not a Discord-role access list. Development and production have separate saved configurations: a room set up in development must also be configured in production.

## Change a room or recover an import

Edit the saved gallery's name, room, layout or public switch, then select **Save**. Changing rooms removes the old room's placements from that gallery; crawl the new room to import its history.

- **Resume** continues an interrupted crawl from its saved position when offered.
- **Restart** starts the history scan again. Repeated imports match existing attachments instead of intentionally creating duplicates.
- A failed room has its own retry action. Read the reported error and fix bot access before retrying.
- **Flush Images** removes that gallery's website placements and orphaned imported records. It does not delete the original Discord messages. Pictures used by another gallery or showcase are retained there. Use a new crawl to repopulate the gallery; flushing is not needed for routine layout or name changes.

The source author can hide their own picture across Orbiters galleries and showcases. For someone else's picture, use the image preview's content-report action. See [privacy and shared content](15-manage-privacy-and-shared-content.md).

## Set up an asset showcase

Open the asset's **Showcase** settings in Creator, select its **Showcase Rooms**, choose a layout, and select **Save Showcase**. Then use **Crawl Past Images** there. This import belongs to that asset, independently of the main Gallery configuration.

## Troubleshooting

| What you see | What to check |
| --- | --- |
| No rooms in the picker | Connect the server under this creator account, confirm the bot is connected, then reopen Galleries. Only regular text rooms are supported. |
| Room missing or unavailable to the bot | Confirm the selected server, View Channel permission and channel overrides. |
| Gallery exists but is empty | Run Crawl Past Images, inspect crawl errors, and confirm the room contains image attachments. Check Message Content Intent for a custom bot. |
| Other people cannot see the gallery | Save with Public gallery enabled and ask them to sign in. |
| Development works but production is empty | Check the production creator integration, room selection, public switch and crawl status separately. |
| One picture fails | The Discord source may have been removed or bot access may have changed. Other pictures should remain browsable; check the source before recrawling. |

<audience include="dev">

## Delivery changes awaiting application deployment

The September 6 optimization separates image-list delivery from Discord URL refreshes. Lists return stored dimensions and source endpoints without contacting Discord; visible tiles refresh expired links independently and offer retry on failure. Previews request a bounded image from Discord's media proxy, with original-image fallback; opening a picture loads the original. Discord attachment URLs expire, so a cold image still depends on Discord availability and cannot be promised instantaneous delivery. See [Discord's signed attachment URL reference](https://docs.discord.com/developers/reference#signed-attachment-cdn-urls).

Relevant ranking keeps reaction/recency weighting and author diversity, but ranks candidates in one query instead of repeatedly scanning 500-row batches. The per-author candidate limit preserves the requested result prefix. Masonry uses flexible columns capped at 240 pixels, fitting four columns at the desktop width shown in the report, with fewer columns on smaller screens.

These changes need the matching frontend and backend deployment; publishing this documentation alone does not deploy the optimization.

</audience>
