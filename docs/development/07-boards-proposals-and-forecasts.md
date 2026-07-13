---
title: Boards, Proposals, and Forecasts
section: Development
order: 66
audience: dev
stage: alpha
id: orbiters.development.boards-proposals-and-forecasts
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-07-13
relations: orbiters.decision.boards-and-proposals, orbiters.development.github-connections, orbiters.development.product-steward-agents, orbiters.how-to.connect-and-sync-trello
---

# Boards, Proposals, and Forecasts

The alpha product-planning model separates the idea itself from where it is shown.
A `Proposal` is durable Markdown product context. A `Board` is an independently
permissioned planning view. A `BoardItem` places a Proposal or synchronized GitHub
issue in a column without merging their source-of-truth rules.

The user-facing action may still say **Submit an idea**. The underlying general
product term is **Board**, and the canonical idea object is **Proposal**.

The website groups these concepts under `/idea-box`. Its default workspace uses the
full available page width. The page title, active Board selector, and proposal search
share the top command row; filters and permissioned Board actions remain nearby.
The Kanban columns are the workspace surfaces, with no enclosing card around the
whole Board.

Opening Idea Box does not preselect a card. The selected-item side preview appears
only after the visitor explicitly chooses an idea or issue, and closing it returns
the full width to the Kanban. Search and filter changes do not silently select the
first result. Product research remains available as a secondary Idea Box view, while
`/boards/:id`, `/proposals/:id`, and `/research/:id` remain focused detail routes.
Internal navigation uses React Router so switching between these surfaces does not
reload the development bundle or repeat authentication refreshes.

The top navigation presents **Board**, the administrator-only **Forecast**, and
**Research** as one underlined Idea Box view set instead of unrelated page controls.
Research lists and report details keep that navigation, and report or Proposal
details provide clickable Idea Box breadcrumbs plus an explicit return to the Board.
After a card is selected, its preview opens as a flush, square-edged right split pane
separated from the Kanban by one divider. It is not rendered before selection and is
not a floating island. Profile, Proposal, and research detail bodies use the same
site content rail so moving between them does not change the readable page width.

On desktop, each Kanban column stays within the available viewport height and
scrolls its own cards with a visually hidden scrollbar. The Board header and other
columns remain in place while one long column scrolls. Smaller screens retain the
page flow and horizontal Board scrolling needed to reach every column.

Users with submission permission receive a visible **Add idea** or **Submit an
idea** action in the workspace and at the bottom of appropriate columns. Board
settings, export, move, remove, and overflow controls appear only when they perform
the labeled action and the current user has permission. Column menus and card
overflow buttons are not decorative.

Editors and Board administrators can move a local Proposal by dragging its card to
another Kanban column. The card exposes a drag handle for pointer and touch input,
the destination column highlights while it can accept the card, and the overflow
menu remains an explicit move fallback. A successful drop persists through
`PATCH /boards/:boardId/items/:itemId`; a failed request reports the error rather than
leaving a false local position. GitHub-backed issue cards remain read-only and do
not expose a drag action.

## Data Model

`Board` owns name, slug, description, type, visibility, columns, owner, and optional
GitHub Project snapshot. `BoardMembership` grants `viewer`, `contributor`, `editor`,
`admin`, or `owner`. `BoardSubmissionPolicy` controls who can submit, whether review
is required, the default visibility, and allowed account types.

A viewer can read a member-visible Board but cannot submit. Contributor is the
minimum membership role accepted by `members` and `owner-approved` submission
policies. Editor can also move local cards; admin and owner manage membership and
policy.

`BoardItem` references exactly one supported object type:

- `proposal`, owned by Orbiters;
- `github-issue`, read from the connected delivery Project;
- a future commission item can be added without changing Proposal identity.

One Proposal can appear on multiple Boards. Moving or removing its placement does
not rewrite its Markdown, comments, decisions, or forecast assumptions. A Proposal
may also link to one synchronized GitHub issue without becoming a copy of that issue.

## Default Boards

The default public `Orbiters` Board is created for the first human owner account. It
accepts authenticated human submissions without mandatory moderation and defaults
them to `public`. Product Steward submissions use their separate Agent API contract
and always begin as private candidates.

Every current creator is backfilled with a public `Creations` Board at startup, and
the Board is also repaired lazily when that creator lists Boards. It uses
owner-approved submission, moderation, and `pending-publication` defaults. This is
the planning rail for future creation and commission workflows; the current alpha
does not implement a full commission marketplace.

Users can create private, unlisted, member-visible, or public custom Boards. The
owner can edit columns, submission policy, allowed account types, and membership;
search candidates and assign roles; remove local Proposal cards; and delete a custom
Board. The default Orbiters Board cannot be deleted, and the owner membership cannot
be removed. Column updates remap existing items transactionally so a renamed column
does not orphan cards.

The **Creator > Boards** tab is the ownership view. It lists only Boards owned by
the signed-in creator through `GET /boards?owned=true`, shows the source and sync
state, opens the Board in Idea Box, and gives the owner a deliberate **Private** or
**Public** visibility choice. The change persists through
`PATCH /boards/:id { "visibility": "public" }` or the private equivalent. Public
owner Boards receive a simplified, safe preview on the owner's public profile;
private Boards do not appear there.

The **Public** choice is an explicit publication action, not only a Board access
toggle. Its profile preview can publish the title and state of a placed external
issue even when the source issue credential and full issue record are staff-only.
The serializer loads and returns no issue body, URL, repository, issue number, or
provider metadata, and it excludes every private or pending Proposal. Owners should
review placed issue titles before publishing a Board; changing it back to
**Private** removes the whole Board from the public-profile response.

## Trello Boards

A Creator can connect GitHub and Trello from **Creator > Integrations**; the same
personal connection status is also available from **Account > Connections**. After
connecting Trello, choose **Import Trello board** in **Creator > Boards**. Import is
not offered in Idea Box. The importer creates a custom Orbiters Board, maps open
Trello Lists to columns, and maps open Cards to local Proposals and Board items. The
creator chooses private or public visibility; Trello never decides local access.

An imported Board shows the connected Trello Board, last synchronization time, an
external source link, and a **Sync Trello** action for its manager. Trello-sourced
cards participate in normal Idea Box search and filtering. Their title, Markdown
content, placement, and order synchronize in both directions, while Orbiters-only
comments, decisions, visibility, membership, and forecasts remain local. See
`orbiters.how-to.connect-and-sync-trello` for account setup, limits, conflict rules,
webhook security, and disconnect behavior.

## Visibility

Proposal and Board visibility uses explicit states rather than one Boolean:

- `private`;
- `board-members`;
- `staff`;
- `unlisted`;
- `pending-publication`;
- `public`.

An unlisted Proposal is available only through a direct authorized read and is not
returned by normal listings. Public submissions by non-staff are held as
`pending-publication` only when the target Board policy requires moderation. Staff
can change a Proposal's visibility; publication time is recorded only when it
becomes public.

Board owners and `admin` members manage policy and membership. Editors can change
Board layout and local item placement. Administrators and developers receive staff
access, while the Idea Box Forecast view is limited to Orbiters administrators.

## Proposal Content and Product Memory

A Proposal stores Markdown content and can also retain:

- parent and descendant relationships;
- cluster and source-profile labels;
- novelty, viability, fit, and weighted scores;
- ranking rationale, trap flag, pin, and priority;
- unit revenue and recurrence assumptions;
- comments with optional sentiment metadata;
- accepted, rejected, or deferred decisions with human rationale.

Lists can filter by cluster and prioritize pinned, high-priority, and scored entries.
Visible Proposals can be exported as JSON or Markdown. Render Markdown as untrusted
user content and sanitize it at the presentation boundary.

## Board and Proposal Routes

The alpha REST surface includes:

- `/boards` for listing and creating Boards;
- `/boards/:id` for the Board, permissions, and visible items;
- `/boards/:id/items` for placement and `/boards/:id/items/:itemId` for removal;
- `/boards/:id/submission-policy`, `/boards/:id/members`, member search, and
  `/boards/:id/members/:userId` for management;
- `/proposals` for filtered listing, creation, and export;
- `/proposals/:id` for content, updates, comments, and product decisions;
- `/proposals/:id/github-link` for a staff-managed link to one synchronized issue.

Creator-facing Trello routes live under `/trello` for account connection, source
Board listing, import, manual synchronization, disconnect, and signed webhook
callbacks. They create ordinary local `proposal` Board items rather than a new
Trello-only item type.

The Kanban workspace uses only fields returned by these routes. Scores, comments,
visibility, author, placement, GitHub state, dates, and forecast values must never be
filled with decorative sample data. The proposal detail page may rearrange those
real fields into summary, activity, context, and related-information panels, but an
unavailable metric is omitted rather than invented.

GitHub-backed items are read-only. A request that changes their Project column is
rejected until a separately reviewed write-sync phase exists. Linking a Proposal to
an issue lets the issue card carry the Proposal context without deleting the local
Proposal placement. The Board serializer deduplicates the visible cards while the
link exists; unlinking or removing the Project item makes the local card visible
again.

## Forecasts

Forecasts are private saved scenarios available only to Orbiters administrators.
The **Forecast** tab is omitted for every other account rather than displaying
private projection controls that will later fail authorization.
Each `ForecastScenario` records its optional Board, author, title, duration, bucket,
totals, and line items. A line item snapshots the selected Proposal title and revenue
assumptions so a later Proposal edit does not silently rewrite historical output.
Forecast input may select a direct Proposal card or a GitHub issue card linked to a
Proposal, but every root Proposal must be represented on the selected Board.

Supported demand curves are `flat`, `linear`, `slow_build`, `fast_plateau`,
`late_step`, `launch_spike`, and `custom`. Custom curves contain two to nine clamped
multiplier points. Targets can be daily, weekly, or monthly. Recurrence can be weekly,
monthly, or yearly. A request can include Proposal descendants in one scenario.

`POST /forecasts/preview` computes output without persistence. `/forecasts` lists and
saves scenarios. Only the author or an administrator can delete a scenario.

Forecast values are planning projections, not accounting records. Preserve inputs,
curve, horizon, and inclusion choices whenever presenting totals.

## Ideas-Vault Migration

The migration uses a schema-version-2 JSON bundle with source `ideas-vault`, a
SHA-256 checksum of the canonical payload, and matching counts for `ideas`,
`feedback`, `forecasts`, and `forecast_items`. The exporter opens SQLite read-only,
backs it up into memory for one coherent snapshot across the database and WAL, and
canonicalizes numbers identically to the Node validator. The importer verifies the
checksum, unique legacy IDs, all feedback and forecast references, and the complete
parent graph before writing anything.

Export from the main Orbiters repository before importing:

```bash
python scripts/migrations/export-ideas-vault.py --database "C:\safe\ideas.sqlite" --output "C:\safe\ideas-vault-v2.json"
```

Run a dry validation first from the backend directory:

```bash
node src/scripts/importIdeasVault.js --input C:\safe\ideas-vault-v2.json --user-id 1 --dry-run
```

After checking checksum and counts, run the same command without `--dry-run`. The
import is idempotent by legacy source and ID for Proposals, comments, forecasts, and
forecast lines. It reports processed, created, and updated counts and preserves
proposal hierarchy, clusters, source profiles, scores, traps, pinning, priority,
feedback sentiment, revenue and recurrence assumptions, saved forecasts, and custom
curves. Imported Proposals and forecasts remain private for human review.

The importer does not read the SQLite database directly and does not infer missing
parents. Keep the source export and reported checksum as migration evidence.

## Verification

1. Boot the backend twice after schema changes.
2. Confirm public, member, staff, unlisted, and pending visibility separately.
3. Add one Proposal to two Boards and verify the object is not duplicated.
4. Confirm the Orbiters Board publishes a normal human submission and the Creations
   Board applies moderation defaults.
5. Drag a local Proposal between columns with both the card and drag handle, then
   reload the Board and confirm the persisted column.
6. Confirm a GitHub issue item cannot be dragged or moved locally.
7. Confirm the Forecast tab and forecast endpoints are available to administrators
   and absent or forbidden for every other rank.
8. Compare preview and saved forecast totals for every curve.
9. Dry-run and import the same version-2 migration bundle twice; the second import
   must update existing legacy identities without duplicating them.
10. Import a Trello Board, reconcile one change in each direction, and confirm the
    selected local visibility and Orbiters-only product history never leave Orbiters.
