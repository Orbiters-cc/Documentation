---
title: Follow members and creators
section: Website
order: 166
audience: public, user, creator, admin, dev
stage: beta
id: orbiters.how-to.follow-members
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-10-09
---

# Follow members and creators

Follow a member to hear about their new assets and blog posts and to see their
gallery pictures first on your homepage. Following is public: the member's
profile shows how many people follow them, and anyone can open the list.

## Follow or unfollow

You need to be signed in. Use **Follow** in any of these places:

- next to the name on a public profile (`/user/<id>`);
- next to the creator's name on an asset page;
- next to the author on a blog post.

The button changes to **Following** at once. Hover or focus it to see
**Unfollow**, then select it to stop following. You cannot follow yourself,
and you can follow up to 2,000 members.

On a profile, select **followers** or **following** under the name to open
both lists. The switch at the top of the window moves between them.

## What followers receive

Followers get one notification when a member:

- publishes an asset, a commission listing, or a hidden listing they make visible;
- publishes a blog post.

Editing, saving a draft, or publishing the same asset or post again does not
send another notification. If the asset or post is no longer public when the
notification is sent, nobody is notified.

To stop these notifications, open **Account > Notifications** and turn off
**People you follow**. Members who turned on push notifications also receive
them as browser notifications.

## Pictures on your homepage

When you are signed in, recent gallery pictures (from the last 30 days) by the
members you follow appear first in your homepage feed, newest first, right after
any status cards. The rest of the feed follows as usual. Only pictures from
galleries you can already open appear there, and pictures their author hid stay
hidden. Visitors who are not signed in see the usual homepage.

<audience include="dev">
## Implementation notes

- Follows live in `UserFollows` (one row per pair, unique index
  `UserFollows_pair_key`). `GET/PUT/DELETE /users/:id/follow` returns
  `{ followers, following, isFollowing, canFollow }`;
  `GET /users/:id/followers|following?offset=` pages 24 members.
- Publishing writes a `FollowAnnouncements` row (unique per `kind` and
  `targetId`) and queues a `follow.announce` outbox job in the same transaction.
  The worker re-checks visibility, writes the notifications with category
  `following`, skips members already notified about the same page, then sends
  web push.
- `GET /galleries/images/following` returns the followed members' pictures;
  matches use the picture's Orbiters author and the author's Discord ID.
- Account export includes `UserFollow` (both directions) and
  `FollowAnnouncement`; account closure deletes both, and account merge drops
  follows between the two merged accounts.
</audience>
