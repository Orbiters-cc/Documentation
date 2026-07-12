---
title: Unit Git Operating Contract
section: Tools
order: 130
audience: creator, dev
stage: stable
id: orbiters.tools.unitgit-operating-contract
domain: unitgit
type: reference
owner: orbiters-unitgit
lastVerified: 2026-07-12
relations: orbiters.general.vpm-package-contract, orbiters.tools.refit-operating-contract
---

# Unit Git Operating Contract

Unit Git operates on the Git repository at the Unity project root. Open it from
`Tools > Orbiters > Unit Git`.

It can inspect history and changes, stage and unstage, commit, fetch, pull, switch
branches, shelve work, and initialize a missing project repository with a VRChat
Unity ignore file.

Unit Git deliberately has no push action. Publishing remains an explicit external
workflow so a Unity UI action cannot silently update a remote repository.

Before a release or after changing Git parsing/process behavior, run
`Tools > Orbiters > Unit Git > Health Checks > All Deterministic`. The batch hook is
`Orbiters.UnitGit.Editor.UnitGitEditorHealthChecks.RunAllBatchmode`.

The package directory is its own repository. Validate and version it independently
from the parent Unity project.
