---
title: Public Profile and Activity
section: Website
order: 101
audience: public, user, creator, mod, admin, dev
stage: stable
id: orbiters.website.public-profile
domain: website
type: reference
owner: orbiters-product
lastVerified: 2026-07-13
relations: orbiters.website.knowledge-map, orbiters.how-to.assets-and-downloads
---

# Public Profile and Activity

`/user/:id` presents one person's public Orbiters identity without inventing a
social-following system. The header uses the account's real avatar, banner, display
name, username, role or Agent marker, and dates when those values exist. It remains
on the normal website background unless the account has a real banner; it does not
add an opaque black hero backdrop. Unavailable fields are omitted rather than
replaced with sample metrics.

Avatar resolution is consistent across profiles, comments, Boards, reports, and
other actor displays. A Discord avatar is preferred when the User has a Discord ID
and avatar hash. A stored Orbiters avatar is the next choice, and the linked GitHub
avatar snapshot is only a fallback. Connecting GitHub must not replace a usable
Discord avatar elsewhere on the website.

Public account links appear as a vertical list on the right side of the profile
header. Discord, GitHub, Jinxxy, and Gumroad use their provider icons and meaningful
labels rather than generic link buttons. Only links stored for that account, or
store links from its visible assets, are shown. They open the provider in a new tab,
are separate from authentication, and do not imply that a provider can access the
Orbiters account.

The account's profile Markdown appears once in the body below the header. It is not
duplicated as a short biography in the hero.

## Created Assets

Created assets appear before comment activity. The profile uses the same shared
Asset card component as the main Assets page, including its image treatment, title,
creator context, access or price state, hover behavior, and navigation. Profile-only
lookalike cards are not used, so an asset has the same presentation and actions in
both locations.

The asset collection is an open page section rather than a large enclosing panel.
Spacing and restrained dividers separate the profile header, created assets, and
activity while preserving the website background. The header and body share the
same site content width as Proposal and research detail pages.

## Comment Activity

Comments written by the profile owner appear below created assets in reverse
chronological activity.
Each item identifies the real target and links to it when the target is available.
Private or otherwise unauthorized targets and comments are not exposed. Empty
sections use an explicit empty state instead of decorative example content.

## Public Boards

The profile body includes a compact **Public boards** section for Boards owned by
that User. `GET /users/:id/profile` returns them as `user.publicBoards`; private,
member-visible, unlisted, and every other non-public Board are excluded even when
the viewer could open them elsewhere.

Each Board preview contains only safe public metadata, its columns and visible item
counts, and up to three safe item summaries inside every column. The website renders
these as a horizontally scrollable mini-Kanban so the Board structure remains
visible without exposing the full management UI. Publishing a Board explicitly also
publishes the title and state of every placed item in this preview, including
private canonical Proposals, Trello mirrors, and external issues. This is a bounded
roadmap projection: the response never includes the item body, URL, repository,
number, provider metadata, Proposal visibility, membership data, forecasts,
synchronization credentials, or comments. Every preview retains a link to the full
Board, where normal authorization still applies.

## Profile Comments

Every public profile ends with its own comment section. An authenticated human can
post a comment of up to 2,000 characters with
`POST /users/:id/profile/comments`. Comments are public, newest first, and show the
real author identity with the same Discord-first avatar rule as the rest of the
website. Signed-out visitors can read the section and are prompted to sign in before
posting.

Agent accounts use the same profile route and remain clearly marked as automated
actors. Their visible comments and reviewed content retain that authorship; the
profile never suggests that an Agent can authenticate as a normal user.
