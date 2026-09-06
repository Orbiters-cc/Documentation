---
title: Board Data and Route Reference
section: Reference
order: 79
audience: dev
stage: alpha
id: orbiters.reference.board-data-and-routes
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-07-14
relations: orbiters.decision.boards-and-proposals, orbiters.development.github-connections, orbiters.development.product-steward-agents, orbiters.how-to.connect-and-sync-trello
---

# Board Data and Route Reference

Use this reference while changing a Board endpoint or a persisted relation. For the user journey and visibility model, return to [Boards, proposals and forecasts](/documentation/orbiters.development.boards-proposals-and-forecasts).

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

`BoardItem.position` is `DECIMAL(30,8)`. External Boards can use sparse numeric
ordering values above `10^14`; retaining that width prevents Trello import or sync
from overflowing the database or collapsing distinct Card positions. Do not narrow
the column or coerce remote ordering into a smaller integer representation.

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
- `/github/issues/:id` and `/github/issues/:id/comments` for a complete visible
  issue and paginated discussion;
- `/github/boards/:boardId/issues` for permissioned issue creation with a separate
  repository-write credential.

Creator-facing Trello routes live under `/trello` for account connection, source
Board listing, import, manual synchronization, disconnect, and signed webhook
callbacks. They create ordinary local `proposal` Board items rather than a new
Trello-only item type.

Proposal and GitHub issue reads also return permission-filtered mention locations.
The preview and dedicated pages expose **Copy link**. When that internal Proposal or
issue URL appears in a Markdown surface, the renderer replaces the plain URL with a
compact element card containing its title, short excerpt, and author avatar.
Published Blog posts are part of the same backlink index, so a Proposal or issue
detail lists a Blog post that contains its canonical URL under **Mentioned in**.

The Kanban workspace uses only fields returned by these routes. Scores, comments,
visibility, author, placement, GitHub state, dates, and forecast values must never be
filled with decorative sample data. The proposal detail page may rearrange those
real fields into summary, activity, context, and related-information panels, but an
unavailable metric is omitted rather than invented.

GitHub Project placement remains read-only. A request that changes a synchronized
issue's Project column is rejected until a separately reviewed write-sync phase
exists. Linking a Proposal to
an issue lets the issue card carry the Proposal context without deleting the local
Proposal placement. The Board serializer deduplicates the visible cards while the
link exists; unlinking or removing the Project item makes the local card visible
again.
