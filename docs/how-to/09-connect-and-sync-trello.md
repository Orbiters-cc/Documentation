---
title: Connect and Sync Trello
section: Creator Tools
order: 45
audience: creator, admin, dev
stage: alpha
id: orbiters.how-to.connect-and-sync-trello
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-07-13
relations: orbiters.development.boards-proposals-and-forecasts, orbiters.reference.api-keys-and-credentials
---

# Connect and Sync Trello

A creator can import an existing Trello Board from **Creator > Boards**, manage the
result in Idea Box, and keep its Lists and Cards synchronized in both directions.
Trello Lists become Orbiters Board columns; open Trello Cards become local Proposals
placed in those columns. The imported Orbiters Board remains a normal permissioned
Board and keeps its selected Orbiters visibility.

## Administrator Setup

Create one environment-specific **Trello application** record in **Admin > API
Keys** before creators connect:

1. Open Trello Power-Up administration, create or select the Orbiters Power-Up, and
   generate its API key.
2. Copy `setupGuide.authorizationReturnUrl` from the Orbiters setup guide and add
   its origin to the Trello API key's allowed origins. The default path is
   `/creator?tab=integrations` on the current Orbiters website.
3. Copy the exact hosted iframe connector URL shown in the Orbiters setup guide as
   `setupGuide.connectorUrl`. It ends in `/trello/power-up/connector`. Register it
   as the Power-Up iframe connector in Trello; do not enable any Power-Up
   capabilities. The adjacent `setupGuide.connectorNote` confirms that the page
   exposes no Board data and is not the synchronization transport.
4. Save `TRELLO_API_KEY` and `TRELLO_API_SECRET` in Orbiters.
5. Verify the copyable default `setupGuide.authorizationReturnUrl` and
   `setupGuide.webhookBaseUrl` values. Their
   `setupGuide.authorizationReturnNote` and `setupGuide.webhookBaseNote` identify
   the deployment settings from which they were derived.
   Trello returns the user token in the authorization URL fragment, which the page
   immediately exchanges with the backend. Webhooks use
   `/trello/webhooks/:publicId` below the displayed public API origin.
6. Normally leave `TRELLO_RETURN_URL` and `TRELLO_WEBHOOK_BASE_URL` empty. Orbiters
   derives them from `FRONTEND_URL`, then `FRONT_URL`, and from `PUBLIC_API_URL`
   respectively. Store either optional field only as an explicit override for the
   same environment. The guide continues to show the derived default, so review a
   nonblank override directly before saving it; runtime uses the stored value.

The connector is intentionally a minimal hosted page with no capabilities. Orbiters
uses its backend REST synchronization for Lists and Cards; the connector does not
run product logic inside Trello or ask for additional capability permissions.

Do not share an application secret or user token between development and production
records. The generic API Keys form includes the same provider link and numbered
micro-guide next to these fields. An override belongs to its environment-specific
record and must not point development authorization or webhooks at production.

## Connect a Creator Account

1. Sign in with a Creator account and open **Creator > Integrations**. The same
   connection control is also available from **Account > Connections**.
2. Choose **Connect Trello**.
3. Review Trello's read and write authorization. Read access is required to import
   Lists and Cards; write access is required for bidirectional synchronization.
4. Approve the connection and return to Orbiters.
5. Confirm that the Connections page shows the Trello member identity and a
   `connected` status.

The authorization requests Trello `read,write` access with a non-expiring token.
Its state is random, stored as a hash, bound to the current User and environment,
expires after ten minutes, and can be used only once. The fragment redirect stays on
the configured Orbiters origin. Orbiters validates the token against the Trello
member endpoint, encrypts it in a hidden, user-owned `TRELLO_ACCOUNT` credential,
and does not return it through connection-status responses.

Disconnecting the account removes the local synchronization links and encrypted
credential while keeping imported Orbiters Boards and Proposals. Orbiters also
attempts to remove registered webhooks and revoke the remote Trello token. Local
disconnect still completes when Trello cleanup is unavailable; the response and UI
return a safe warning that tells the creator to revoke the token manually in Trello.

## Import a Board

1. Open **Creator > Boards** and choose **Import Trello board**. Trello import is
   intentionally kept out of Idea Box.
2. Select one of the connected account's open Trello Boards.
3. Choose whether the new Orbiters Board is private or public. Public visibility
   also publishes the safe profile preview described below; review placed Card and
   issue titles before choosing it.
4. Preview the source Board link, then choose **Import board**.
5. Open the created Board and confirm its columns, Proposals, and Trello sync state.

Import copies only open Lists and open Cards. It creates a creator-owned custom
Board, maps each List to a stable unique column key, and creates a published local
Proposal and Board item for every Card. Card name becomes the Proposal title; Card
description becomes its summary and Markdown content. Public metadata is limited to
the source provider, Trello Card ID, URL, and short link. The default visibility is
private. Closed Trello Boards and Boards with no open Lists are rejected. One import
supports at most 30 open Lists and 500 open Cards, and the same Trello Board cannot
be imported twice for one connection.

A public imported Board can appear on its owner's public profile. Publishing the
Board makes the title and state of every placed Card visible as a bounded roadmap
projection, even when its local mirror is private. It never includes the Card or
Proposal body, URL, provider metadata, visibility, comments, or synchronization
credential. Choosing private removes the entire Board from the public profile
surface.

Orbiters registers a signed webhook after the local import transaction. If Trello
rejects webhook creation, the imported Board remains usable with a warning and the
creator can use **Sync Trello** manually.

## Bidirectional Synchronization

Use **Sync Trello** on a connected Board for an immediate reconciliation. A valid
Trello webhook starts the same reconciliation in the background after external
changes, and a scheduler reconciles connected Boards every five minutes by default.
Opening a Board also requests synchronization when the prior successful run is more
than one minute old. Repeated page loads inside that window reuse the current state
instead of starting duplicate work.
Only the connected account owner who can manage the Board, or Orbiters staff
performing recovery, can start or disconnect a synchronization. Database-backed
claims prevent duplicate workers and reclaim a run that remains stale after its
claim timeout.

**Add element** shows a default-on **Create a Trello card** toggle for a connected
Board. Leaving it enabled creates the local Proposal and lets synchronization create
the real Card; turning it off keeps the new element local to Orbiters.

Synchronization compares both sides with the last stored snapshot:

- a new open Trello List creates an Orbiters column, and a new local column creates
  a Trello List;
- a new open Trello Card creates a local Proposal and placement, and a new local
  Proposal card creates a Trello Card;
- List names and order, Card title and description, Card column/List, and Card
  position synchronize in both directions;
- dragging a mapped Card between Orbiters columns reconciles the real Trello List
  immediately; if Trello is temporarily unavailable, the local move remains saved,
  a warning is shown, and automatic or manual synchronization retries it;
- archiving a Trello Card removes its Board placement but preserves the local
  Proposal and product history;
- archiving a List, or removing an unchanged local List or Card placement,
  synchronizes the corresponding archive or removal without permanently deleting
  retained product history;
- when Trello and Orbiters both changed the same mapped object since the prior
  snapshot, the Trello value wins and the reconciliation counts a conflict instead
  of silently combining incompatible edits.

Orbiters preserves Trello's sparse numeric Card positions, including values above
`10^14`, so importing or synchronizing a widely spaced Board does not fail or
silently resequence its Cards.

The result reports `pulled`, `pushed`, `createdLocal`, `createdRemote`, `conflicts`,
and `archived` counts. Board responses expose a safe `trelloSync` summary with its
remote ID, name, URL, state, last sync time, last error, and whether its webhook is
active. Synchronization uses `ready`, `syncing`, `warning`, or `error`; a revoked or
expired account token moves the account to `reconnect-required`. Trello errors are
sanitized, `401` asks the creator to reconnect, and rate limiting is reported as a
temporary unavailable state.

Labels, checklists, comments, attachments, members, and Trello automation are not
mirrored in this alpha contract. Orbiters visibility, membership, comments,
decisions, forecast data, and Proposal history remain local and are never sent to
Trello.

<audience include="dev">

## API and Webhook Contract

- `GET /trello/account`, `POST /trello/account/connect`,
  `POST /trello/account/complete`, and `DELETE /trello/account` manage the creator
  connection.
- `GET /trello/boards` lists open Boards available to the connected member.
- `GET` and `HEAD /trello/power-up/connector` serve the no-capability Power-Up
  iframe connector configured by the administrator.
- `POST /trello/import` creates the local Board and initial mappings.
- `POST /trello/boards/:boardId/sync` runs manual reconciliation.
- `POST /trello/boards/:boardId/sync-on-load` starts a reconciliation only when the
  manager opens a stale connected Board.
- `DELETE /trello/boards/:boardId` removes synchronization without deleting the
  local Board.
- `HEAD` and `POST /trello/webhooks/:publicId` are the Trello callback surface. The
  public ID is an unguessable UUID rather than a database ID.

Webhook requests are accepted only when the `X-Trello-Webhook` HMAC matches the raw
request body plus the exact persisted callback URL using `TRELLO_API_SECRET`.
Orbiters-originated Trello writes carry a client identifier so their echo webhooks
do not start a loop. The callback acknowledges valid external events before running
the bounded synchronization asynchronously.

Unexpected Trello route failures keep the client response generic. The server logs
the safe error name and message plus the database code from the wrapped database
error when one exists. Shared safe serialization excludes request authorization
headers and credentials; database diagnostics and other internal details are never
copied into the JSON error response.

The periodic scheduler uses `TRELLO_SYNC_INTERVAL_MS`, defaults to five minutes, and
clamps the interval from one minute to 24 hours. `TRELLO_SYNC_BATCH_SIZE` defaults to
20 and accepts from one to 50 Boards per pass. `TRELLO_SYNC_CLAIM_TIMEOUT_MS`
controls stale-claim recovery and defaults to 15 minutes;
`TRELLO_SYNC_ENABLED=false` disables scheduled runs. API credentials are sent to
Trello in the `Authorization` header, never in request URLs. Neither the Trello
application secret nor a user token is returned to clients or written to logs.

</audience>

## Verification

1. Connect a test Creator and confirm no raw token appears in the status response.
2. Import a Board with multiple Lists and Cards and compare titles, descriptions,
   order, placement, and selected visibility.
3. Create and move one card on each side, then confirm manual sync updates the other
   side once without duplicates.
4. Use **Add element** with **Create a Trello card** enabled, then confirm the real
   Card exists and moving it in Orbiters immediately changes its Trello List.
5. Edit the same linked card on both sides and confirm Trello wins with one reported
   conflict.
6. Archive a Trello Card and confirm the placement disappears while the Proposal
   remains.
7. Reject or disable the webhook, confirm the import warning is actionable, then
   confirm manual synchronization still works.
8. Revoke the user token, confirm the account becomes `reconnect-required`, then
   reconnect without exposing either token.
9. Disconnect Trello and confirm the local Board and Proposals remain. Simulate
   remote cleanup failure and confirm the local disconnect returns manual-revocation
   guidance rather than retaining the encrypted credential.
10. Import and synchronize Cards whose sparse positions exceed `10^14`, then confirm
   their order persists without numeric overflow or accidental compaction.
11. Force an unexpected database failure in a Trello route and confirm the client
    receives only the generic route error while the server log includes the safe
    error identity and database code without credentials.
