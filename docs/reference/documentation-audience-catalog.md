---
title: Documentation Audience Catalog
section: Reference
order: 70
audience: admin, dev
stage: stable
id: orbiters.reference.documentation-audience-catalog
domain: website
type: reference
owner: orbiters-docs
lastVerified: 2026-09-06
---

# Every page's audience, in one place

Use this catalog to audit the documentation split. A check means the base profile matches at least one page audience. The selected release mode must also include the page's stage.

Admin and moderator profiles here have no creator flag; adding that flag grants creator-audience access. Developer and owner share the final column. Source and token restrictions can reduce access. Page titles appear here for auditing; listing a title does not make its body readable.

For inline boundaries and application resources, read [Who sees what](/documentation/orbiters.reference.visibility-atlas). Open an allowed page and enable its inspection switch to see the boundaries inside the content.

Regenerate this catalog with `node scripts/generate-audience-catalog.js` after changing page metadata. Do not edit its tables by hand.

## Account

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Manage Privacy and Shared Content | public | beta | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Verify your community age status | user, creator, mod, admin, dev | beta | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage a VRChat community | user, creator, admin, dev | beta | — | ✓ | ✓ | ✓ | ✓ | ✓ |

## Alpha

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Alpha Implementation Notes | dev | alpha | — | — | — | — | — | ✓ |

## Architecture

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| The platform at a glance | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Runtime Flows | dev | stable | — | — | — | — | — | ✓ |
| Data Model Notes | dev | stable | — | — | — | — | — | ✓ |
| Storage and Files | admin, dev | stable | — | — | — | — | ✓ | ✓ |

## Beta

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Beta Documentation Notes | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |

## Creator Tools

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Build an asset people can actually use | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Connect Store Integrations | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Configure Discord Integrations | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Supporter Tiers | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Connect and Sync Trello | creator, admin, dev | alpha | — | — | ✓ | — | ✓ | ✓ |
| Request a Manual ReFit Commission | user, creator, admin, dev | stable | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Accept ReFit Commissions | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Understand Platform Payment Revenue | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Manage Your Commission Workspace | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Announce Commission Assets in Your Channels | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Set Your Seller Information and Commission Terms | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |

## Decisions

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ADR 0001 - Documentation Repository | dev | stable | — | — | — | — | — | ✓ |
| ADR 0002 - Server-Side Documentation Visibility | dev | stable | — | — | — | — | — | ✓ |
| ADR 0003 - MCB Custom Base Adoption And Path Identity | dev | alpha | — | — | — | — | — | ✓ |
| ADR 0004 - Knowledge Base and MCP | dev | alpha | — | — | — | — | — | ✓ |
| ADR 0005 - Separate GitHub Identity and Project Connections | dev | alpha | — | — | — | — | — | ✓ |
| ADR 0006 - Boards and Proposals | dev | alpha | — | — | — | — | — | ✓ |
| ADR 0007 - Product Steward Identity and Local Execution Security | dev | alpha | — | — | — | — | — | ✓ |
| ADR 0008 - Structured Deployment Evidence | dev | alpha | — | — | — | — | — | ✓ |
| ADR 0009 - Codebase Memory Context Provider | dev | alpha | — | — | — | — | — | ✓ |

## Developer Reference

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Privacy and Credential Security Architecture | admin, dev | alpha | — | — | — | — | ✓ | ✓ |
| Commission Reliability | admin, dev | stable | — | — | — | — | ✓ | ✓ |

## Development

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Make a change you can explain and verify | dev | stable | — | — | — | — | — | ✓ |
| Test the failure that would hurt a user | dev | stable | — | — | — | — | — | ✓ |
| Documentation System | dev | stable | — | — | — | — | — | ✓ |
| Local Setup | dev | stable | — | — | — | — | — | ✓ |
| Documentation and Knowledge MCP | dev | alpha | — | — | — | — | — | ✓ |
| GitHub Connections and Board Sync | dev | alpha | — | — | — | — | — | ✓ |
| Boards, Proposals, and Forecasts | dev | alpha | — | — | — | — | — | ✓ |
| Product Steward Agents | dev | alpha | — | — | — | — | — | ✓ |
| Write a guide worth exploring | dev | stable | — | — | — | — | — | ✓ |
| Community age verification reference | dev, admin | beta | — | — | — | — | ✓ | ✓ |
| Mermaid Documentation Diagrams | dev | stable | — | — | — | — | — | ✓ |
| Orbiters Foundations Initialization | dev | stable | — | — | — | — | — | ✓ |

## Explanation

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| How the pieces fit together | public | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| License Resolution | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Why your role can arrive after your access | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |

## General knowledge

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| VRChat Runtime Contract | public, user, creator, mod, admin, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Avatar Performance Decision Order | public, user, creator, mod, admin, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Udon Network State | creator, dev | stable | — | — | ✓ | — | — | ✓ |
| VPM Package Contract | creator, dev | stable | — | — | ✓ | — | — | ✓ |
| External Client Session Safety | creator, dev | stable | — | — | ✓ | — | — | ✓ |

## How To

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Turn a purchase into Orbiters access | public, user | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Find the version that belongs in your project | public, user | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Account Login and Connections | public, user | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Moderation

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Manage community age verification | mod, admin, dev | beta | — | — | — | ✓ | ✓ | ✓ |

## Operations

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Admin and Moderation | mod, admin, dev | stable | — | — | — | ✓ | ✓ | ✓ |
| Verification and Appeals | creator, mod, admin, dev | stable | — | — | ✓ | ✓ | ✓ | ✓ |
| Webhook Troubleshooting | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Deployment and Backups | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Structured Deployment Reports | admin, dev | alpha | — | — | — | — | ✓ | ✓ |
| Recover Background Jobs | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Privacy and Compliance Operations | mod, admin, dev | beta | — | — | — | ✓ | ✓ | ✓ |
| Local Development and OAuth | admin, dev | stable | — | — | — | — | ✓ | ✓ |

## Reference

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Who Sees What | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| API Reference | dev | stable | — | — | — | — | — | ✓ |
| Documentation Audience Catalog | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Access is several decisions, not one rank | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Store Provider Reference | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| API Keys and Credentials | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Board Data and Route Reference | dev | alpha | — | — | — | — | — | ✓ |
| GitHub Connection Setup Reference | dev | alpha | — | — | — | — | — | ✓ |
| Steward API and Token Reference | dev | alpha | — | — | — | — | — | ✓ |
| ReFit Validation and Performance | dev | alpha | — | — | — | — | — | ✓ |
| Telegram Login Setup | admin, dev | beta | — | — | — | — | ✓ | ✓ |

## Start Here

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A field guide to making things with Orbiters | public | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pick a path through the documentation | public | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Tools

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MCB and Unity Tools | public, user, creator, admin, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MCB Operating Contract | creator, dev | stable | — | — | ✓ | — | — | ✓ |
| ReFit Operating Contract | creator, dev | stable | — | — | ✓ | — | — | ✓ |
| Unit Git Operating Contract | creator, dev | stable | — | — | ✓ | — | — | ✓ |
| XRay Gizmos Operating Contract | creator, dev | stable | — | — | ✓ | — | — | ✓ |

## Tutorials

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Your first asset, from receipt to download | public, user | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Website

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Find the right part of Orbiters | public, user, creator, mod, admin, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Public Profile and Activity | public, user, creator, mod, admin, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Art Commissions and Sonas | public, user, creator, admin, dev | beta | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
