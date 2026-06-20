---
title: Orbiters Overview
section: Start Here
order: 10
audience: public
stage: stable
---

# Orbiters Overview

Orbiters is the service layer around creator assets. It connects Discord accounts, creator stores, asset access, Discord roles, and Unity-facing install tools into one website.

The main jobs are:

- Help users find assets, redeem licenses, and download or install versions they can access.
- Help creators publish assets, connect stores, link products, and manage Discord communities.
- Help moderators and admins handle verification, appeals, assets, users, and operational issues.
- Help developers run the backend, maintain integrations, and understand the ecosystem without reverse-engineering service code.

## Core Concepts

An **asset** is the thing a creator distributes. It can have metadata, store links, Discord role grants, supporter-tier access, and one or more downloadable or Unity-installable versions.

A **user asset** is a user's access record for an asset. It can come from a redeemed license, manual access, a creator-managed scope, or a related workflow.

A **store integration** connects one creator to one provider such as Gumroad, Jinxxy, Payhip, or Lemon Squeezy. Integrations let Orbiters import products, verify license keys, mirror sales, and receive webhooks when a provider supports them.

A **Discord integration** connects one creator to one Discord server. Orbiters can use the shared Orbiters bot or a creator's custom bot, depending on how the server is configured.

A **scope** controls release access:

- `public`: stable user-facing access.
- `beta`: beta plus public access.
- `alpha`: alpha plus beta plus public access.

## Documentation Visibility

Documentation is filtered by your account. If a page is missing from the navigation, your current account does not have access to it.

- **Public**: visible to everyone.
- **User**: visible to logged-in users.
- **Creator**: visible to creators and staff who support creators.
- **Mod**: visible to moderation staff.
- **Admin**: visible to administrators.
- **Dev**: visible to developers and owners.

The documentation switch can show stable, beta, or alpha docs. Stable mode shows current production behavior. Beta mode adds beta docs. Alpha mode adds alpha docs.

<audience include="dev">

## Documentation Implementation

The website loads documentation from the root `Documentation` repository, not from `backend/docs`. The backend recursively reads Markdown from `Documentation/docs`, parses frontmatter, filters page-level audiences and release stages, strips inline restricted blocks, and only then returns Markdown to React.

This means restricted text is not merely hidden in the browser. Unauthorized users do not receive that Markdown from `/documentation`.

</audience>

