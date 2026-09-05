---
title: Orbiters Foundations Initialization
section: Development
order: 171
audience: dev
stage: stable
id: orbiters.reference.foundations-initialization
domain: website
type: reference
owner: orbiters-docs
lastVerified: 2026-09-05
---

# Orbiters Foundations Initialization

After database initialization, the backend independently ensures the default
Orbiters Board, creators' Creations Boards, Knowledge Base sources, and default AI
administration access rules. A failure in one step does not skip unrelated steps.
Failures include the step name, exception type, database code/constraint, validation
field names and stack frames. SQL, parameters and field values are not logged.

## Board slug upgrade

Board slugs are unique **within an owner**. Each creator may therefore have a Board
named `creations`. Earlier schemas could retain a global unique slug constraint,
causing creator Board initialization to report a generic validation error.

Before model sync, a transactional migration ensures the `(ownerId, slug)` unique
index and removes obsolete global, single-column slug uniqueness. Existing Boards
and their memberships are retained. Repeated startups do not recreate the global
constraint; duplicate slugs for the same owner remain disallowed.

The opt-in populated-schema regression in
`backend/test/commissionPaymentCheckSchemaDatabase.test.js` exercises the old
constraint with multiple creators, migration, repeated foundation initialization,
and preservation of same-owner uniqueness in a disposable database.

## Investigate a warning

Find the failing step in `Orbiters foundations initialization failed [step]`.
A running HTTP server does not mean every foundation step succeeded. Resolve the
specific constraint or validation failure, then restart and check the logs.

`EXIT_AFTER_DATABASE_INIT=true` exits before foundations are initialized. Schema
preflight tests must be supplemented by foundation tests; an empty-database boot
cannot detect conflicts between existing creators' Boards.
