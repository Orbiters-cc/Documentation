---
title: Publish a community page
section: Community
order: 150
audience: public, user, creator, admin, dev
stage: beta
id: orbiters.community.public-page
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-10-02
---

# Publish a community page

A community page presents your community to everyone at
`orbiters.cc/community/<address>`: banner, icon, name, description, member and
online counts, a **Join Discord** link, the VRChat group, upcoming public events,
the team, its creations, rules and languages. It uses information your VRChat group
and Discord server already show publicly.

## Set up the page

Only the community owner can change the page. Open **Community → Public page**:

1. Choose **Public**. Pages start **Private**.
2. Keep the suggested address or type your own: 3 to 40 lowercase letters,
   numbers or single hyphens, with at least one letter. Words such as `events`
   are reserved, and `orbiters` belongs to the official community.
3. Choose the **Discord server** to feature if the community has several. By
   default the first connected server is used.
4. Paste a **Discord invite** link. When the server has a vanity link, it is used
   if you leave this empty. Without either, the page shows the server without a
   join button.
5. Turn sections on or off: Discord, VRChat, Events, Team, Creations, Rules and
   Languages.
6. Select **Save**. The copy and open buttons beside the address share the page.

Saving or **Refresh** reads the latest group and server details. Visitors only see
that saved copy, which Orbiters updates in the background every few hours.

## Banner and description

The settings preview and public page use the selected Discord server's banner
and description by default. After choosing a different server, save to load its
details. If Discord has no banner or description, the corresponding area stays
empty until you add your own.

Click the banner preview or drop a still PNG, JPEG or WebP image up to 5 MB.
Drag and zoom to frame it, then choose **Use image** and **Save**. The original
must be at most 25 megapixels. **Use Discord banner** restores the server banner
after saving. Uploaded banners are public image files.

Turn off **Use Discord description** to write your own text, up to 2,000
characters. A blank custom description hides the About text. Turn the switch
back on and save to follow Discord again. Refreshing server details preserves
your manual banner and description. Unsaved edits disable Refresh so they cannot
be overwritten accidentally.

## What appears, and what never does

| Section | Source |
| --- | --- |
| Name | The community's name on Orbiters |
| Icon | The public VRChat group first, then the Discord server |
| Banner, description | Your manual override, otherwise the selected Discord server |
| Discord | Server name, icon, member and online counts, Verified or Partnered badge |
| VRChat | Group name, code, join state, member and online counts, group links |
| Events | Published events with a public audience that have not started yet |
| Team | The owner, Community Admins and Moderators with active accounts |
| Creations | Public listings by creators in the team |
| Rules, languages | The VRChat group's rules and languages, and a Discord community's language |

A private VRChat group never appears: its details, rules and languages stay off
the page whatever the sections say. Members-only events, drafts, hidden listings,
closed accounts and restricted profiles are left out. Member lists, roles,
moderation data and Discord channels are never shown.

While the page is private, the address answers *This community page isn't
available*. The owner and management team see a **Private preview** with a link to
the settings instead.

## Community cards on profiles

A public page adds a card to the owner's public profile: icon, name, a short
description and member counts, linking to the page. Admins and Moderators get the
card too while the **Team** section is shown.

Related: [Use the creator and community overviews](creator-and-community-overviews.md),
[Manage a VRChat community](manage-vrchat-community.md),
[Configure Discord Integrations](06-configure-discord-integrations.md).
