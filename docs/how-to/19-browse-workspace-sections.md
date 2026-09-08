---
title: Navigate Admin and Documentation Sections
section: Start Here
order: 64
audience: public
stage: beta
id: orbiters.how-to.workspace-sections
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-08
---

# Navigate Admin and Documentation Sections

Start at **Overview**, choose a section card, then open a topic or tool. The sidebar
expands the current section instead of showing every page at once. On small screens,
use **Browse documentation** or **Browse admin areas** above the page.

## Documentation: start with your task

| Section | What you will find |
| --- | --- |
| Start here | Orientation and first steps |
| Account & community | Profiles, connected accounts, communities and privacy |
| Assets & commissions | Licences, downloads, commission requests and Sonas |
| Creator workspace | Publishing, versions, commissions, galleries and announcements |
| Unity tools | My Custom Base, ReFit, XRayGizmos and UnitGit |
| Administration | Staff workflows, payments, integrations and operations |
| Developer resources | Architecture, APIs, documentation, AI and technical reference |

Only sections with pages available to your account and selected **Release stage**
appear. Page counts describe accessible documentation, not the whole private repository.
Choose a topic card to see its pages. Use **Document type** to narrow that list to
tutorials, how-to guides, references or another format; **Clear type filter** restores it.

Search still works across documentation. Opening a result keeps the search and
release stage in the URL. Back and Forward restore your section, topic and filters.
While reading, the sidebar shows nearby pages in the current topic. Large topics
offer **Browse all pages** instead of an endless sidebar list.

<audience include="admin, dev">

## Admin: choose the responsibility

| Section | Tools |
| --- | --- |
| People & access | Users, roles, features and session security |
| Assets & products | Assets, avatar bases and user ownership |
| Creators & payments | Creator applications and Stripe |
| Community & moderation | Reports, privacy requests, appeals, verification, Discord, VRChat and issues |
| Connections | API keys and GitHub |
| Knowledge & AI | Knowledge Base, AI, Product Stewards and MCP |
| System & operations | Background jobs, MCB performance, deployment, storage, backups, notifications and redirects |

Section pages show their purpose, scope notes and cards for tools you can access.
Live operational data loads only when you open its tool. Opening the overview does
not fetch every deployment, storage or backup panel.

Existing individual tab links still open their tool. The former **Developer** link
opens **System & operations**; choose the dedicated tool there. Search can find both
section names and individual settings. It never changes a setting for you.

</audience>

<audience include="dev">

## Maintaining navigation

Admin group membership lives in `adminSearch/adminHierarchy.js`; permission gates and
search labels live in `adminSearch/adminSearchCatalog.js`. Every tool belongs to one
group. The five operations pages retain the existing Developer feature permission.

Documentation membership lives in `knowledge/documentationHierarchy.js`, using the
existing section, domain, type and document identity. Check that classification when
adding a guide; reader-oriented exceptions, such as requesting ReFit work, must not
end up in creator management just because of their historical section metadata.
Document IDs, Markdown paths and audience/stage policies are unchanged.

`GET /knowledge?navigation=true` includes an unpaginated, metadata-only `navigation`
array. It is filtered by the same source, audience and release-stage policy as the
document list, before search and pagination. It contains no document bodies or
credentials. Responses are private and not shared-cacheable. Search results remain
separate from navigation so a query cannot hide unrelated sections.

Frontend and backend must be released together for the new navigation response.
Run hierarchy, history, access and Knowledge navigation tests when changing this flow.

</audience>
