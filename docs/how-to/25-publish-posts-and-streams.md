---
title: Publish posts and stream announcements
section: Creator Tools
order: 62
audience: creator, admin, dev
stage: beta
id: orbiters.how-to.publish-posts-and-streams
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-24
---

# Publish posts and stream announcements

These workflows are prepared for the next release. Provider application setup is required before the corresponding Connect action becomes available.

## Schedule a post

1. Open **Creator → Posts**, or **+ Post → Socials** on Home. Use **+ Connect an account** inside the composer to connect X, TikTok, a Bluesky-hosted account, or a Telegram channel you manage.
2. For Bluesky, create an app password in Bluesky settings. Orbiters retains encrypted session tokens rather than that password. For Telegram, use **Link Telegram account** if needed. Linking opens a new tab so your post stays in place; return to the composer, then follow **Verify & connect** using this deployment's bot.
3. Write your post or use **Start from an asset**. Drop or paste photos into the writing area, use **Add photos**, or **Choose from gallery**. Up to four PNG, JPEG or WebP photos are supported, 20 MB each. Gallery choices come from accessible images attributed to your linked Discord account; choosing one creates an owned media copy. Add photo descriptions for Bluesky alt text.
4. Select destination cards by their service icons and account names. Connected Discord/Telegram announcement channels and enabled self-promotion channels in communities you own are available too. Discord posting requires your linked account and the bot to have access and posting permission. Choose **Customize** beside a destination when its wording should differ.
5. For TikTok, select visibility explicitly and complete the comment, commercial-content, AI-content and upload-consent choices. This integration publishes photo posts. Your app's approval and account permissions determine whether public posting is available.
6. Use **Post now**, or enable **Schedule for later** and choose a date in the calendar and a time in the time field, up to 90 days ahead. The form displays your local time zone; the saved job uses an absolute time.
7. Check **Scheduled & recent posts** for each destination's result.

When connecting X or TikTok, the composer keeps your text, photos, destination choices and schedule in this browser session so you can resume from Creator → Posts after authorization. Review the destination and TikTok consent choices again before publishing.

Provider limits are checked before submission, including X's weighted character count, Bluesky's grapheme and byte limits, and Telegram's shorter photo-caption limit, and Discord's 2,000-character limit. The shared caption may need shortening or a destination-specific version.

**Cancel remaining** stops destinations that have not begun sending. It does not remove already published posts. **Retry failed destinations** retries definite failures. An **uncertain** result means a service may have accepted the post before its response was lost: check that service before posting again. Completed destinations are preserved independently.

## Announce a Twitch stream

1. Open **Creator → Streams → Connect Twitch** and authorize your channel.
2. Enable **Automatic stream announcements** and choose connected Discord or Telegram destinations.
3. Enable **Show my live stream on Orbiters** if you want it in the homepage Streams widget.
4. Customize the announcement with `{name}`, `{title}`, `{game}` and `{url}`, then save.

Orbiters checks signed Twitch online/offline events and refreshes live status in the background. Offline or stale streams leave the website display. Brief reconnects within five minutes reuse the broadcast's announcement history to avoid repeat messages. Recent channel deliveries appear beneath your setup.

Disconnecting stops future announcements and schedules removal of subscriptions and token access. Reconnect if the channel reports that authorization expired.

If **Connect Twitch** is disabled, the message identifies missing credentials,
invalid callback URLs or an invalid EventSub signing secret. Correct the active
**Twitch creator streams** API-key entry for this environment, then select
**Check again**. X and Bluesky commission channels are separate from stream
destinations; streams currently use Discord and Telegram.

## Continue from Discord

A community can offer **Pssst, I have an idea !** after eligible self-promotion posts. The public invitation lasts ten seconds with a countdown. Only the original author can use its **what ?** button to receive the private follow-up.

**Verify and post** opens a private asset draft. A stream offer opens **Set up stream announcements**. Sign-in preserves the destination. If you are not a creator yet, **Become a creator and continue** enables the tools immediately, without administrator approval. Existing moderation controls still apply.

Community owners and administrators configure the channel, promotion categories, wording and cooldown in **Community → Self promotion**. **Events** is a normal Community tab using the same navigation style as Creator.

Related: [Create, publish and measure an asset](24-create-and-measure-assets.md), [Configure creator-growth integrations](../operations/13-creator-growth-integrations.md).
