# Orbiters Documentation

This repository is the canonical Markdown source for Orbiters Documentation. The
human website reader and permission-scoped Knowledge MCP server consume the same
reviewed pages while presenting them for different audiences.

## Validate changes

Run the documentation contract check before review:

```bash
node scripts/validate-docs.js
```

The command validates every Markdown page under `docs/`, including its stable ID,
domain, document type, owner, verification date, visibility metadata, and relative
links. It reports stale verification dates as warnings and exits non-zero for
contract violations.

This repository is the source of truth for the Orbiters documentation shown on the website and for contributor-facing ecosystem notes.

The Orbiters backend reads Markdown files from `docs/`, filters them by audience and release stage, and returns the rendered-safe content through `/documentation`. Restricted sections are filtered on the server before they reach the browser.

## Structure

- `docs/general`: actionable VRChat creation knowledge curated from reviewed skills.
- `docs/website`: Orbiters website workflows and category maps.
- `docs/tools`: MCB, ReFit, XRay Gizmos, and Unit Git operating knowledge.
- `docs/start-here`: orientation pages for everyone.
- `docs/tutorials`: first-run learning paths.
- `docs/how-to`: task-focused guides.
- `docs/reference`: facts, field lists, endpoint maps, and operational reference.
- `docs/explanation`: concepts and system behavior.
- `docs/operations`: moderation, deployment, backups, and incident response.
- `docs/architecture`: architecture views, runtime flows, and data model notes.
- `docs/decisions`: architecture decision records.

The website groups Documentation pages by their `section` and `domain` metadata,
not by folder name alone. The MCP surface retains structured metadata for agents.
Keep stable IDs unchanged when reorganizing navigation.

## Frontmatter

Every website page should start with frontmatter:

```md
---
title: Page title
section: Start Here
order: 10
audience: public
stage: stable
id: orbiters.start.example
domain: general
type: explanation
owner: orbiters-docs
lastVerified: 2026-07-12
---
```

Supported audiences are `public`, `user`, `creator`, `mod`, `admin`, and `dev`.

Supported stages are `stable`, `beta`, and `alpha`. Stable is the default. A beta page is visible when the website documentation switch is set to beta or alpha. An alpha page is visible only when the switch is set to alpha.

Inline audience blocks:

```md
<audience include="dev">
Developer-only implementation detail.
</audience>
```

Inline release blocks:

```md
<beta>
Beta-only note.
</beta>

<alpha>
Alpha-only note.
</alpha>
```

## Local Use

In the main Orbiters repo, the backend reads this repository from `Documentation/docs` at the repo root. Docker Compose mounts it at `/usr/src/documentation` and sets `DOCUMENTATION_ROOT=/usr/src/documentation/docs`.

Run the backend documentation tests from the main repo:

```bash
cd backend
npm run test:docs
npm run test:integration
```

No documentation workflow should require remote store APIs, Discord, or production infrastructure.
