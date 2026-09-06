---
title: Access is several decisions, not one rank
section: Reference
order: 71
audience: creator, admin, dev
stage: stable
id: orbiters.reference.access-model
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-09-06
---

# Access is several decisions, not one rank

Use the table matching the resource you are diagnosing. Documentation audiences, asset release scopes and commission participation solve different problems.

## Documentation audiences

| Base profile | Public | User | Creator | Mod | Admin | Dev |
| --- | --- | --- | --- | --- | --- | --- |
| Visitor | Yes | — | — | — | — | — |
| Signed-in member | Yes | Yes | — | — | — | — |
| Creator member | Yes | Yes | Yes | — | — | — |
| Moderator | Yes | Yes | With creator flag | Yes | — | — |
| Admin | Yes | Yes | With creator flag | Yes | Yes | — |
| Developer or owner | Yes | Yes | Yes | Yes | Yes | Yes |

A page listing several audience tags accepts **any** matching audience. Its release stage must also fit the selected mode. Source or token audience ceilings can reduce these rights.

## Asset release scopes

| Granted scope | Public version | Beta version | Alpha version |
| --- | --- | --- | --- |
| Public | Yes | No | No |
| Beta | Yes | Yes | No |
| Alpha | Yes | Yes | Yes |

The access record must remain enabled. Supporter-tier access grants public scope only. Refunds or revocations can disable matched records; role removal separately checks for other enabled assets granting the same role.

## Commission and Board boundaries

A customer sees their request. A ReFit candidate sees limited offer information and permitted attachments while its offer is active. The accepted creator receives full request context. Private Board access is checked separately; being an editor does not make someone a commission participant.

Staff interfaces may require feature access as well as rank. A documentation label never authorizes an application endpoint.

<audience include="admin, dev">

Use [Who sees what](/documentation/orbiters.reference.visibility-atlas) for the visual map and [the audience catalog](/documentation/orbiters.reference.documentation-audience-catalog) for every page's declared audience and stage.

</audience>
