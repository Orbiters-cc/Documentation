---
title: Approve VPM dependency sources for the My Avatar gallery
section: Operations
order: 53
audience: admin, dev
stage: alpha
id: orbiters.operations.known-vpm
domain: operations
type: runbook
owner: orbiters-operations
lastVerified: 2026-10-05
relations: orbiters.myavatar.publish-to-gallery, orbiters.tools.myavatar-asset-gallery
---

# Approve VPM dependency sources for the My Avatar gallery

Gallery assets can need VPM packages such as VRCFury or Modular Avatar. My Avatar
installs them for the buyer, but only from repositories and packages an Orbiters
administrator approved in **Admin > Assets & products > Known VPM**. Nothing becomes a
dependency source on its own; a creator's own Orbiters VPM listing is not approved
automatically either.

**Release status:** local development implementation, not deployed.

## Before you start

- Your account has the `admin` or `owner` rank.
- Know the repository's public listing URL, usually ending in `index.json` or
  `vpm.json`. It must be HTTPS and resolve to a public address.

## Add a repository

1. Open **Known VPM** and paste the listing URL in **Repository listing URL**, or pick
   one of the **Popular listings**.
2. Leave **Approve all of its packages now** off unless you checked every package the
   listing offers.
3. Choose **Add repository**.

Orbiters downloads the listing and validates each version with the same manifest rules as
Orbiters VPM listings. Invalid versions are skipped and counted on the repository card.
The newest 40 versions of each package are kept. A listing that is not public HTTPS,
cannot be read or holds no valid package is refused with the reason.

## Review packages

Each package of a repository starts in **Review**. For each one:

- **Approved**: My Avatar may install it.
- **Disabled**: My Avatar never installs it from this repository.
- **Supported range**, such as `>=1.8.0`: only versions in this range are offered.
  Leave it as **Any version** to allow every valid version.

**Approve N waiting** approves every package still in review at once.

Unity receives approved packages of approved repositories, limited to their supported
range, through `GET /avatar-assets/known-dependencies`. The answer is cached for one
minute, so a change reaches new installs within a minute.

## Keep repositories current

Orbiters checks every approved repository once a day. **Validate now** checks one
immediately. The card shows the last successful validation and the last check.

When a listing is unreachable or invalid, the last good package list stays in use and
the card shows the error, so a short outage does not break installs. **Disable** stops
offering every package of the repository without forgetting your review;
**Remove** forgets the repository and its package decisions.

## What My Avatar does with the list

Before an installation changes any package, My Avatar computes the complete plan
(transitive dependencies and conflicts) and shows it to the user. VRChat SDK packages
(`com.vrchat.*`) and packages the asset does not need are never upgraded silently. When
a needed package is not approved here, My Avatar also looks in the repositories the
user already added to their own VPM settings; otherwise the installation stops and
names the missing package.
