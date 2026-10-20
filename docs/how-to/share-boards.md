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
lastVerified: 2026-10-20
---

# Share a Board with a Public Link

A board stays private to its members until you turn on its public link. Anyone who
has the link can then read the board without an account, but cannot change it.

Use a link to show clients or followers where work stands. Use a board's
**Private**/**Public** visibility in **Creator > Boards** when the board should be
listed on your profile instead.

## Turn the link on

Prerequisites: you own the board or are one of its admins.

1. Open the board and select **Share** in its toolbar.
2. Turn on **Public link**.
3. Use the buttons next to the link to copy it or open the public page.

The link works whatever the board's visibility. Turning it off stops it at once.
Turning it on again creates a new link; the old one never comes back.

To stop a link you have already sent without turning sharing off, select **New
link** and confirm. The previous link stops working immediately.

## What visitors see

The public page shows the board name, description, owner and last update, its
columns and, on each card: title, labels, cover image, start and due dates,
checklist progress and the stage of a linked commission. Opening a card adds its
description and checklist items.

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
  1,000 cards). `GET /board-shares/:token/covers/:proposalId` serves the resized Trello
  cover image of one card. Both need no account, answer with
  `X-Robots-Tag: noindex, nofollow`, and are limited to 60 and 240 requests per minute.
  The page lives at `/boards/share/:token` (`frontend/src/components/pages/PublicBoardPage.jsx`).
- `GET /board-shares/boards/:id` and `PUT /board-shares/boards/:id`
  (`{ "enabled": true, "regenerate": false }`) read and change the link for a board
  manager (30 changes per minute). An unknown board and a board the caller cannot
  manage both answer `404`.

</audience>

## Choose your commission board

Your commission board is where new commission requests land, and the board your
public profile shows. In the **Share** popover of a board you own, turn on
**Commission board**. This sets the same board as **Default Board** in
**Creator > Commissions**; new cards go to its saved starting column, or its first
column. Turning the switch off on that board clears the default.

Without a chosen board, Orbiters uses the board you own that holds the most
commission cards.

Your profile's boards widget shows the commission board as a compact kanban only
while its public link is on: visitors see each card's title and commission stage and
can open a card. With the link off, the widget lists your public boards instead.

<audience include="dev">

The commission board is `CreatorCommissionProfile.defaultBoardId`, set through
`PUT /board-shares/boards/:id/commission` (`{ "enabled": true }`, board owner with
creator access). The profile activity payload returns it as `commissionBoard` (without
descriptions or checklist items) only while its `shareToken` is set.

</audience>

## Attach requests to cards

To track a website commission request on a card you already have, see
[Edit Board Cards and Link Existing Commissions](/documentation/orbiters.how-to.link-board-commissions).
A client of a request whose board has a public link gets a **View board** link on the
request page.
