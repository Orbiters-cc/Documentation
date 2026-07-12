# Orbiters Documentation Contributor Guide

Use this guide when adding or editing documentation for Orbiters.

## Goals

- Write complete, useful pages. Do not leave placeholders, TODOs, or vague future notes.
- Prefer clear task language over marketing language.
- Keep pages focused. Split large pages before they become difficult to scan.
- Explain why a workflow exists when the reason prevents mistakes.
- Keep public, creator, moderator, admin, and developer material separated with metadata or inline audience blocks.

## Information Architecture

Use the Diataxis split as the default:

- Tutorials teach a beginner workflow from start to finish.
- How-to guides solve one practical task.
- Reference pages list facts, fields, endpoints, states, and commands.
- Explanation pages describe concepts, architecture, and tradeoffs.
- Decisions record why a meaningful choice was made.

Do not force every topic into every category. One good page in the right category is better than repeated content.

## Visibility

Set page-level visibility in frontmatter:

```md
audience: creator, admin, dev
```

Use inline blocks when only part of a page is restricted:

```md
<audience include="dev">
Implementation detail that should not be visible to creators.
</audience>
```

Never put secrets, real tokens, private keys, private customer data, or production-only credentials in docs. Show field names and safe examples only.

## Release Stages

Use `stage: stable` for current production behavior, `stage: beta` for behavior creators or staff can preview, and `stage: alpha` for developer-only or experimental work.

Inline tags are available:

```md
<beta>
This appears in beta and alpha documentation mode.
</beta>

<alpha>
This appears only in alpha documentation mode.
</alpha>
```

If a feature is not implemented, do not document it as available. Put design notes in `docs/decisions` or an alpha-only page.

## Style

- Use active voice.
- Put prerequisites before steps.
- Put warnings before the action that creates risk.
- Prefer short sections with descriptive headings.
- Use code fences for commands and payloads.
- Use `example.invalid`, fake IDs, and fake keys in examples.
- Avoid repeating the same concept across pages. Link by title when another page owns the detail.
- Keep terms consistent: creator, asset, version, scope, supporter tier, store integration, Discord integration, outbox job.

## Required Frontmatter

Each website-visible Markdown page under `docs/` needs:

```md
---
title: Clear page title
section: Navigation section
order: 100
audience: public
stage: stable
id: orbiters.domain.unique-name
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-07-12
---
```

Use explicit `slug:` only when the filename cannot produce the desired URL slug.

`id` is a permanent lookup key. Do not reuse or rename it when a page moves. `domain`
identifies the product area; `type` uses the Diataxis-oriented values `tutorial`,
`how-to`, `reference`, `explanation`, `decision`, `runbook`, or `invariant`.
`owner` names the team responsible for accuracy. Update `lastVerified` only after
checking the page against current behavior.

Run `node scripts/validate-docs.js` before submitting documentation changes. The
validator rejects missing metadata, duplicate IDs or slugs, unknown audience/stage/
domain/type values, broken relative Markdown links, malformed visibility blocks,
and placeholder markers.
