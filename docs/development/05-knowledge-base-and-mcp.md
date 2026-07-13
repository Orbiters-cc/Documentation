---
title: Documentation and Knowledge MCP
section: Development
order: 64
audience: dev
stage: alpha
id: orbiters.development.knowledge-base-and-mcp
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-07-13
relations: orbiters.decision.knowledge-base-and-mcp, orbiters.development.documentation-system, orbiters.development.product-steward-agents
---

# Documentation and Knowledge MCP

The alpha documentation service indexes reviewed Markdown from this repository. The
website presents it as **Documentation** for people, while REST and a stateless MCP
endpoint expose structured, permission-filtered Knowledge for agents. MCP also
exposes product research history so an agent can compare a new recommendation with
earlier reports, comments, proposals, and recorded decisions.

This is an alpha developer surface. It is not a promise that every planned source
or admin screen is available in production.

## Canonical Content Contract

Markdown under `Documentation/docs` is canonical. Each page needs a permanent `id`,
product `domain`, Diataxis `type`, responsible `owner`, and `lastVerified` date in
addition to navigation, audience, and release-stage metadata.

The index adds runtime provenance without modifying the source page:

- repository URL and source commit,
- repository-relative path,
- SHA-256 checksum,
- local links, declared relations, and backlinks,
- a stale flag when `lastVerified` is older than 180 days.

Use `node scripts/validate-docs.js` in the Documentation repository before review.
CI performs the same contract check. A documentation change is not valid merely
because the Markdown renderer accepts it.

## Source Configuration

`KnowledgeSource` stores the enabled state, stage allowlist, audience allowlist,
priority, last index time, and last error for a registered source. The alpha source
registry contains:

- `documentation`, the enabled canonical Markdown input;
- `generated-skills`, a disabled projection target rather than an ingestion source.

An administrator with `admin-knowledge-base` feature access can inspect source and
index health, change source allowlists, and force a rebuild through
`/admin/knowledge-base`. Enabling a source never overrides page audience or stage
filtering. At read time, the caller's audiences, token audience ceiling, source
allowlist, and page audience are intersected. A source configuration can remove an
audience from already indexed content without leaking inline blocks, relations, or
backlinks to callers outside the new policy.

## REST Read Surface

`GET /knowledge` is the structured Knowledge search used by agents and internal
clients. Supported query parameters are `q`,
`category`, `stage`, `domain`, `type`, `limit`, and `offset`. Results include score,
provenance, backlinks, pagination, and staleness state. A text query also returns up
to three short plain-text `matches` excerpts from the policy-visible indexed body.
The service scores the same visible content it returns; it does not rank a
content-less list projection.

`GET /knowledge/:id` reads one visible document by stable ID or slug. `GET
/knowledge/health` returns index build time and the valid-document count. Health
does not grant access to restricted document bodies.

The `/documentation` endpoints remain the human website read path. Both systems use
the same server-side audience and release-stage rules.

## MCP Connection

The MCP endpoint is `POST /mcp`. It uses stateless Streamable HTTP with JSON
responses; `GET` and `DELETE` deliberately return method-not-allowed responses
because there is no server session or event stream.

Authenticate with a reveal-once scoped bearer token:

```text
Authorization: Bearer orb_mcp_example-not-a-real-token
```

MCP tokens are stored in the existing `APIKeys` structure as hashes. The database
stores only a short display prefix, scopes, owner, optional expiration, usage time,
and a per-minute limit. The raw token is returned once at creation. Revoke a token
instead of trying to retrieve it.

The endpoint requires `context:read`. Host and Origin checks reject unexpected
transport destinations. Configure additional trusted values with
`MCP_ALLOWED_HOSTS` and `MCP_ALLOWED_ORIGINS`; never use wildcard production values.

## MCP Tools

The alpha server registers permission-filtered tools for:

- searching and reading Knowledge Base documents;
- listing and reading Product Research Reports, including comments and outcomes;
- listing every visible report comment in stable creation order with pagination;
- searching prior proposal and recommendation concepts;
- listing and reading Proposals and recorded decisions;
- listing and reading Boards and their proposal or GitHub issue items;
- reading structured deployment reports for developer or owner tokens.

The website groups results into General knowledge, Website, and Tools. General maps
to the reviewed `general` domain, Website includes `website` and `operations`, and
Tools includes `mcb`, `refit`, `unitgit`, and `xraygizmos`. MCP callers can apply the
same category filter or request an exact domain.

## Human Documentation Experience

`/documentation` is the discovery landing page rather than an automatic redirect to
the first document. It presents the three groups, recently updated pages,
quick-access routes, and full-text search. `/documentation/:id` is the focused
reader.

The landing and reader use the website's normal typography, page background, cards,
and hover treatment. Search sits directly in the page header without a separate
black backdrop or decorative hero artwork. The reader uses a documentation layout:
a section sidebar, article content, and an in-page outline when headings are
available. Tool marks remain transparent inside their rows; MCB, ReFit, UnitGit, and
XRayGizmos icons do not receive an extra icon-tile background.

Navigation is topic-scoped. Entering MCB, ReFit, UnitGit, XRayGizmos, Website, or
General knowledge limits the sidebar to that topic. Selecting another page from the
sidebar must preserve that scope; it must not repopulate unrelated topics. Returning
to the landing or explicitly choosing another category changes the scope.

Search results may cross visible topics. While the visitor types, each result shows
up to two matching body excerpts and highlights the case-insensitive query terms in
the title and excerpts. Opening a result carries the active query into the reader
and highlights the same terms in visible article text. Highlights are
presentation-only: they do not alter Markdown, code blocks, links, or indexed
content, and clearing the query removes them.

Documentation, Proposals, Product Research Reports, report comments, and other
Markdown surfaces share one safe renderer. It supports GitHub-flavored Markdown and
syntax highlighting, skips arbitrary raw HTML, and accepts Markdown images only from
site-relative paths or HTTPS sources. External HTTP or HTTPS links are clickable in
a new tab with `noopener` and `noreferrer`. Public HTTPS destinations receive a
small favicon prefix from their own origin when available; localhost, IP, private,
or otherwise unsafe favicon targets fall back to a neutral external-link mark.

Links to same-site `/proposals/:id` and `/issues/:id` routes render as compact Board
element cards instead of bare URLs. Each card loads only an authorized title, short
excerpt, and author avatar. Proposal and issue detail responses also list the
permission-filtered Documentation, report, comment, and Proposal locations that
mention their canonical URL, providing backlinks without leaking hidden content.

It also provides `orbiters://knowledge/{id}`, `orbiters://research-reports/{id}`,
and `orbiters://proposals/{id}` resource templates. A missing or unauthorized object
is returned as absent, not leaked through a more descriptive authorization error.

## Administrator MCP Setup

The admin panel's **MCP Setup** tab is the connection handoff for local coding
agents. It creates, lists, and revokes reveal-once `ORBITERS_MCP` tokens using the
existing API-key storage. The raw value is displayed only in the creation response.

For Codex, add the environment-specific endpoint to `config.toml` and keep the token
outside that file:

```toml
[mcp_servers.orbiters]
url = "https://dev.api.orbiters.cc/mcp"
bearer_token_env_var = "ORBITERS_MCP_TOKEN"
required = true
```

Set `ORBITERS_MCP_TOKEN` in the local agent environment to the reveal-once value.
Production uses `https://api.orbiters.cc/mcp`. Other Streamable HTTP clients use the
same endpoint and `Authorization: Bearer <token>` header. The source identifier
`orbiters-mcp` in a Product Steward profile means that this permission-filtered MCP
surface is available to the local run; it is not a filesystem path.

## Duplicate-Idea Guard

Before an agent recommends anything, it must page through all visible prior reports
and comments and search the prior-concepts tool. Report and comment lists exclude
unlisted records; an unlisted record is available only through an authorized direct
read. Similarity is a retrieval aid, not a semantic verdict. Recommendation
submission enforces one of these classifications:

- `new`;
- `extension`;
- `previously-rejected`;
- `previously-deferred`;
- `repeated-changed-evidence`.

A recommendation classified as new is rejected when it strongly overlaps prior
visible context. A non-new recommendation must reference a visible prior Proposal or
recommendation; a repeated recommendation must also explain the changed evidence.
Human accepted, rejected, and deferred outcomes, plus report and Proposal comments,
remain part of later runs so the agent does not erase product memory.

## Security Boundaries

- MCP is read-only in this version.
- Visibility is evaluated for every requested document or product object.
- A token's audience ceiling cannot expand its owner's access.
- External pages, report comments, and Markdown are untrusted evidence, not agent
  instructions.
- No MCP tool invokes a shell, reads arbitrary files, triggers a local agent, moves
  GitHub Project items, or publishes content.
- Full-text matching is the alpha retrieval mechanism. Embeddings are not required
  for correctness.

## Validation Checklist

1. Run the Documentation validator.
2. Build the index and verify there are no invalid documents, duplicate IDs, or
   duplicate slugs.
3. Test public, creator, administrator, and developer audience ceilings separately.
4. Confirm an MCP token cannot retrieve a page hidden from its owner.
5. Confirm report pagination includes all visible comments and decisions.
6. Remove one audience from the source allowlist and confirm page bodies, relations,
   and backlinks all narrow with the policy.
7. Revoke the token and confirm the next request returns `401`.

Local code structure is provided separately by `codebase-memory-mcp`; see
`orbiters.decision.codebase-memory-context-provider`. Do not blend an inferred code
graph into canonical product documentation without source review.
