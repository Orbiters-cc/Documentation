---
title: Documentation System
section: Development
order: 62
audience: dev
stage: stable
---

# Documentation System

The documentation system separates content from the website code. Markdown lives in the `Documentation` repo, while the Orbiters backend controls visibility and the frontend renders the allowed Markdown.

## Read Path

1. Backend receives `/documentation` or `/documentation/:slug`.
2. `documentationService` recursively reads Markdown files from `DOCUMENTATION_ROOT`.
3. Frontmatter sets title, section, order, audience, slug, and release stage.
4. The service filters pages by user audience and selected release stage.
5. Inline `<audience>`, `<beta>`, `<alpha>`, `<stage>`, and `<release>` blocks are stripped when not visible.
6. The frontend renders the returned Markdown with `react-markdown`, GFM, highlighting, and sanitization.

## Page Metadata

Required frontmatter:

```md
---
title: Store Integrations
section: Creator Tools
order: 41
audience: creator, admin, dev
stage: stable
---
```

`slug` is optional. If omitted, the filename becomes the slug after removing an optional leading number.

## Inline Blocks

Audience block:

```md
<audience include="dev">
Internal implementation detail.
</audience>
```

Release-stage blocks:

```md
<beta>
Visible in beta and alpha mode.
</beta>

<alpha>
Visible in alpha mode only.
</alpha>
```

## Docker

Compose mounts the docs repo into backend containers:

```yaml
DOCUMENTATION_ROOT=/usr/src/documentation/docs
./Documentation:/usr/src/documentation:ro
```

Without that mount, the backend would start but return an empty docs list.

