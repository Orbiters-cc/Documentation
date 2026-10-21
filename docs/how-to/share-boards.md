---
title: Share a Board with a Public Link
section: Creator Tools
order: 50
audience: creator, admin, dev
stage: stable
id: orbiters.how-to.share-boards
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-10-21
---

# Share a Board with a Public Link

A board stays private to its members until you turn on its public link. Anyone who
has the link can then read the board and its public cards without an account, but
cannot change it.

Use a link to show clients or followers where work stands. Use a board's
**Private**/**Public** visibility in **Creator > Boards** when the board should be
listed on your profile instead.

## Turn the link on

Prerequisites: you own the board. Board admins and staff can turn a link off, but
only the owner can turn it on or replace it.

1. Open the board and select **Share** in its toolbar.
2. Turn on **Public link**.
3. Use the buttons next to the link to copy it or open the public page.

The link works whatever the board's visibility. Turning it off stops it at once.
Turning it on again creates a new link; the old one never comes back. Closing your
account stops the links of all your boards.

To stop a link you have already sent without turning sharing off, select **New
link** and confirm. The previous link stops working immediately.

## What visitors see

The public page shows the board name, description, owner and last update, its
columns and, on each card: title, labels, cover image, start and due dates,
checklist progress and the stage of a linked commission. Opening a card adds its
description and checklist items.

Only public cards appear. Private, board-members, pending-publication, unlisted and
staff cards never do, whoever placed them. Cards Orbiters creates for commission
requests are private, so a board of commission cards shows its columns without them.

The page never shows board members, card authors, comments, attachments other than
the cover, visibility, payments or the clients behind a commission. Cards hidden by
a privacy request, and GitHub issues that are not public, are left out. A commission
chip appears only for your own commissions. Search engines are asked not to index
the page.

<audience include="dev">

## Implementation

- `Boards.shareToken` holds the token (32 URL-safe characters, unique index
  `Boards_share_token_key`). The `Board` default scope excludes it, so ordinary board
  payloads never carry it; `backend/src/services/boards/boardShareService.js` reads it
  unscoped. Turning the link off clears the token; **New link** replaces it. Neither
  touches the board's `updatedAt`.
- `GET /board-shares/:token` returns the view built by
  `backend/src/services/boards/publicBoardView.js` from an explicit allow-list (up to
  1,000 cards). It keeps only the cards `canViewProposal` shows a signed-out viewer
  (`visitorProposals`: public, and not hidden by a privacy request), and its last
  update counts only those cards. `GET /board-shares/:token/covers/:proposalId` serves
  the resized Trello cover image of one card the view shows. Both need no account,
  answer with `X-Robots-Tag: noindex, nofollow`, and are limited to 60 and 240
  requests per minute.
  The page lives at `/boards/share/:token` (`frontend/src/components/pages/PublicBoardPage.jsx`).
- `GET /board-shares/boards/:id` and `PUT /board-shares/boards/:id`
  (`{ "enabled": true, "regenerate": false }`) read and change the link for a board
  manager (30 changes per minute). An unknown board and a board the caller cannot
  manage both answer `404`. Turning the link on or replacing it is owner-only; a board
  admin or staff member gets `403` and can only send `{ "enabled": false }`.
- Account closure clears `Boards.shareToken` on the closed account's boards (silently,
  so their last update stays), and `findShared` refuses a board whose owner is deleted.

</audience>

## Choose your commission board

Your commission board is where new commission requests land, and the board your
public profile can show. In the **Share** popover of a board you own, turn on
**Commission board**. This sets the same board as **Default Board** in
**Creator > Commissions**; new cards go to its saved starting column, or its first
column. It also lets your profile show that board. Turning the switch off on that
board clears both.

Choosing a **Default Board** in **Creator > Commissions** alone does not show it on
your profile. If you choose another Default Board there later, your profile stops
showing the board until you turn **Commission board** on for the new one.

Your profile's boards widget shows the commission board as a compact kanban only
while its public link is on: visitors see each public card's title and commission
stage and can open a card. With the switch or the link off, the widget lists your
public boards instead.

<audience include="dev">

The commission board is `CreatorCommissionProfile.defaultBoardId`, set through
`PUT /board-shares/boards/:id/commission` (`{ "enabled": true }`, board owner with
creator access). The same call stores the board as
`CreatorCommissionProfile.metadata.profileBoardId`, the opt-in to show it; `false`
clears both for that board. The profile activity payload returns it as
`commissionBoard` (without descriptions or checklist items) only while `profileBoardId`
equals `defaultBoardId` and its `shareToken` is set. There is no fallback board.

</audience>

## Attach requests to cards

To track a website commission request on a card you already have, see
[Edit Board Cards and Link Existing Commissions](/documentation/orbiters.how-to.link-board-commissions).
While the board has a public link, you get a **View board** link on the request page.
Clients never get it.
