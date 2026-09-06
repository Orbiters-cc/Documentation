---
title: Why your role can arrive after your access
section: Explanation
order: 82
audience: creator, admin, dev
stage: stable
id: orbiters.explanation.discord-role-automation
domain: website
type: explanation
owner: orbiters-engineering
lastVerified: 2026-09-06
---

# Why your role can arrive after your access

Orbiters saves an access decision before asking Discord to change a role. A temporary Discord outage should not erase a valid website access record.


```mermaid
flowchart TD
  accTitle: Access and role delivery
  accDescr: A saved access change creates background work. Discord completion is recorded separately.
  A[Access decision saved] --> B[Role job queued]
  B --> C[Check current user and role]
  C --> D{Discord operation succeeds?}
  D -->|Yes| E[Role state recorded]
  D -->|Temporary failure| F[Retry later]
  F --> C
  D -->|Cannot continue| G[Staff attention]
```

## Grants and removals have different checks

A grant needs the account's Discord identity, a configured role and a member present in the server. A removal first checks whether another enabled asset still grants the same role. Revoking one purchase must not remove access supplied by another valid asset.

Discord can reject an operation when the bot lacks permission, the role is unavailable or the member has left. Those are distinct from a temporary network error.

<audience include="admin, dev">

Repeated errors or interrupted attempts appear in [Background jobs](/documentation/orbiters.operations.background-jobs). Repair the underlying configuration before retrying a failed job. A queued role job is not proof that Discord already applied the change.

</audience>
