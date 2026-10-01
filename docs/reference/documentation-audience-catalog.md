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
| Use Orbiters from ChatGPT and Codex | user, creator, mod, admin, dev | beta | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage Privacy and Shared Content | public | beta | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Understand and control AI use | public | beta | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Verify your community age status | user, creator, mod, admin, dev | beta | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage a VRChat community | user, creator, admin, dev | beta | — | ✓ | ✓ | ✓ | ✓ | ✓ |

## Administration

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Choose Stripe Payment Methods | admin, dev | beta | — | — | — | — | ✓ | ✓ |
| Find an Admin Setting | admin, dev | beta | — | — | — | — | ✓ | ✓ |

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

## Commissions

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Order and fulfill custom stickers | public | beta | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Community

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Configure Discord Integrations | user, creator, admin, dev | stable | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage community roles | user, creator, admin, dev | beta | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create and manage community events | user, creator, mod, admin, dev | beta | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Community event delivery | dev | beta | — | — | — | — | — | ✓ |
| Find a time, world and movie together | user, creator, mod, admin, dev | beta | — | ✓ | ✓ | ✓ | ✓ | ✓ |

## Creator Tools

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Build an asset people can actually use | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Connect Store Integrations | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Gallery — connect a Discord room and import pictures | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Supporter Tiers | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Connect and Sync Trello | creator, admin, dev | alpha | — | — | ✓ | — | ✓ | ✓ |
| Request a Manual ReFit Commission | user, creator, admin, dev | stable | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Accept ReFit Commissions | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Grant assets through Discord roles | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Understand Platform Payment Revenue | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Manage Your Commission Workspace | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Announce Commission Assets in Your Channels | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Edit Board Cards and Link Existing Commissions | creator, admin, dev | alpha | — | — | ✓ | — | ✓ | ✓ |
| Connect Notion Task Boards | creator, admin, dev | alpha | — | — | ✓ | — | ✓ | ✓ |
| Write formatted content | creator, admin, dev | alpha | — | — | ✓ | — | ✓ | ✓ |
| Create, publish and measure an asset | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Set Your Seller Information and Commission Terms | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Publish posts and stream announcements | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Configure Discord access to an asset | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Publish a Monthly Orbiters magazine | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Publish and manage a VPM listing | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Edit releases in the version workspace | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |

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
| Board Card Editing and Imported Commissions | dev | alpha | — | — | — | — | — | ✓ |
| Notion Board Integration | dev | alpha | — | — | — | — | — | ✓ |
| VPM migration runbook | dev, admin | beta | — | — | — | — | ✓ | ✓ |
| Creator features production release handoff | dev, admin | beta | — | — | — | — | ✓ | ✓ |
| Publish Unity package releases | dev, admin | stable | — | — | — | — | ✓ | ✓ |
| Capture Unity editor windows through MCP | dev, admin | stable | — | — | — | — | ✓ | ✓ |
| My Avatar integration contract | dev, admin | beta | — | — | — | — | ✓ | ✓ |
| Stripe integration review, September 2026 | dev | alpha | — | — | — | — | — | ✓ |
| Navbar logo motion | dev | alpha | — | — | — | — | — | ✓ |
| MCB Presentation Preview | dev | alpha | — | — | — | — | — | ✓ |
| Community age verification reference | dev, admin | beta | — | — | — | — | ✓ | ✓ |
| Mermaid Documentation Diagrams | dev | stable | — | — | — | — | — | ✓ |
| Orbiters Foundations Initialization | dev | stable | — | — | — | — | — | ✓ |
| Homepage Widgets | dev | alpha | — | — | — | — | — | ✓ |

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
| Support Several Original Base Versions | creator, dev | alpha | — | — | ✓ | — | — | ✓ |

## How-to

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Connect shipping estimates for France and Europe | admin, creator, dev | beta | — | — | ✓ | — | ✓ | ✓ |
| Personalize your creator pages | creator, admin, dev | beta | — | — | ✓ | — | ✓ | ✓ |

## Moderation

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Manage community age verification | mod, admin, dev | beta | — | — | — | ✓ | ✓ | ✓ |

## Operations

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Admin and Moderation | mod, admin, dev | stable | — | — | — | ✓ | ✓ | ✓ |
| Verification and Appeals | creator, mod, admin, dev | stable | — | — | ✓ | ✓ | ✓ | ✓ |
| Test accounts and use the updated staff workspace | mod, admin, dev | beta | — | — | — | ✓ | ✓ | ✓ |
| Webhook Troubleshooting | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Deployment and Backups | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Structured Deployment Reports | admin, dev | alpha | — | — | — | — | ✓ | ✓ |
| Recover Background Jobs | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Privacy and Compliance Operations | mod, admin, dev | beta | — | — | — | ✓ | ✓ | ✓ |
| Local Development and OAuth | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Configure creator-growth integrations | admin, dev | beta | — | — | — | — | ✓ | ✓ |
| Configure AI models, prompts and usage | admin, dev | beta | — | — | — | — | ✓ | ✓ |
| Recover provider maintenance and shipping estimates | admin, dev | beta | — | — | — | — | ✓ | ✓ |

## Reference

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Who Sees What | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| API Reference | dev | stable | — | — | — | — | — | ✓ |
| Documentation Audience Catalog | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Access is several decisions, not one rank | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| Store Provider Reference | creator, admin, dev | stable | — | — | ✓ | — | ✓ | ✓ |
| API Keys and Credentials | admin, dev | stable | — | — | — | — | ✓ | ✓ |
| Notion Connection Setup | admin, dev | alpha | — | — | — | — | ✓ | ✓ |
| Board Data and Route Reference | dev | alpha | — | — | — | — | — | ✓ |
| GitHub Connection Setup Reference | dev | alpha | — | — | — | — | — | ✓ |
| Steward API and Token Reference | dev | alpha | — | — | — | — | — | ✓ |
| ChatGPT plugin MCP and OAuth reference | dev | beta | — | — | — | — | — | ✓ |
| ReFit Lower-Body Surface Coverage | dev | alpha | — | — | — | — | — | ✓ |
| ReFit Validation and Performance | dev | alpha | — | — | — | — | — | ✓ |
| Telegram Login Setup | admin, dev | beta | — | — | — | — | ✓ | ✓ |
| MCB Version Pipeline Benchmarks | dev | alpha | — | — | — | — | — | ✓ |
| MCB Adaptive Version Delivery | admin, dev | alpha | — | — | — | — | ✓ | ✓ |
| MCB First Apply Optimization Research | dev | alpha | — | — | — | — | — | ✓ |
| Website icons and shared-link previews | admin, dev | beta | — | — | — | — | ✓ | ✓ |

## Start Here

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A field guide to making things with Orbiters | public | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pick a path through the documentation | public | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Navigate Admin and Documentation Sections | public | beta | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Tools

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MCB and Unity Tools | public, user, creator, admin, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sync avatar edits from Blender | creator, dev | alpha | — | — | ✓ | — | — | ✓ |
| MCB Operating Contract | creator, dev | stable | — | — | ✓ | — | — | ✓ |
| ReFit Operating Contract | creator, dev | stable | — | — | ✓ | — | — | ✓ |
| Unit Git Operating Contract | creator, dev | stable | — | — | ✓ | — | — | ✓ |
| XRay Gizmos Operating Contract | creator, dev | stable | — | — | ✓ | — | — | ✓ |
| Inspect an avatar with XRayGizmos | public | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| XRayGizmos controls and troubleshooting | public | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Make your first project checkpoint with UnitGit | public | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Work with UnitGit branches, shelves, and history | public | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change avatar textures with My Avatar | public, creator, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create a VRChat thumbnail with My Avatar | public, creator, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pose, physics and parameters with My Avatar | public, creator, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Add accessories and clothes with My Avatar | public, creator, dev | alpha | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Unity package safety and avatar workflow fixes | creator, dev | beta | — | — | ✓ | — | — | ✓ |
| Unit Git history and My Avatar texture fixes | creator, dev | beta | — | — | ✓ | — | — | ✓ |
| Unity safety verification follow-up | creator, dev | alpha | — | — | ✓ | — | — | ✓ |

## Tutorials

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Your first asset, from receipt to download | public, user | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Website

| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Find the right part of Orbiters | public, user, creator, mod, admin, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Public Profile and Activity | public, user, creator, mod, admin, dev | stable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Customize Your Homepage | public, user, creator, admin, dev | alpha | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Art Commissions and Sonas | public, user, creator, admin, dev | beta | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Use the creator and community overviews | creator, mod, admin, dev | beta | — | — | ✓ | ✓ | ✓ | ✓ |
| Open avatar tools and your public profile | public | beta | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
