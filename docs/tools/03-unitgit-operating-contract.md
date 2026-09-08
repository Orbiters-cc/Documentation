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
lastVerified: 2026-09-08
relations: orbiters.general.vpm-package-contract, orbiters.tools.refit-operating-contract
---

# Unit Git Operating Contract

For the public workflow, start with [your first project checkpoint](/documentation/orbiters.tools.unitgit-get-started) and [branches, shelves, and history](/documentation/orbiters.tools.unitgit-history-and-shelves).

Unit Git operates on the Git repository at the Unity project root. Open it from
`Tools > Orbiters > Unit Git`.

It can inspect history and changes, stage and unstage, commit, fetch, pull, switch
branches, shelve work, and initialize a missing project repository with a VRChat
Unity ignore file.

Unit Git deliberately has no push action. Publishing remains an explicit external
workflow so a Unity UI action cannot silently update a remote repository.

<alpha>

## Scoped release checkpoints

The local checkpoint fix skips ignored, untracked package outputs such as generated
`.unitypackage` files and their metadata. Tracked files remain eligible even when
an ignore rule matches their name. It does not force generated archives into Git.

Staging and the scoped commit use a private copy of the index while reserving the
real index lock. Unrelated staged and unstaged changes retain their state. A failed
stage or commit leaves the original index unchanged and restores the release
metadata file. After a successful commit, the completed index replaces the original.
If that final replacement fails, the checkpoint is still reported as committed and
the completed index is retained for recovery; the Console gives its location.

The regression tests exercise ignored package outputs, mixed staged/unstaged
unrelated changes, and failed checkpoint rollback in temporary repositories.
This implementation is validated locally and has not been released.

The same index protection now covers full-project upload checkpoints and plain
full-project commits. A signing or commit failure preserves the contents you had
staged separately from later edits, leaves untracked files untracked, and restores
release metadata. An existing Git index lock is respected rather than removed.
Successful upload checkpoints still include the full pending project state.

## Diff comparison labels

The local diff-header fix updates the comparison labels when the selected file
changes between unstaged, staged, and mixed changes. For example, staging the
selected file updates its headings to `HEAD` and `Staged` as its diff refreshes.
The existing pane stays open, preserving its scroll and search state. This fix
is local and has not been released.

</alpha>

## Large change sets

Local Changes loads file diffs in the background. Selecting another file updates
the selection immediately; a loading state remains until its diff is ready.
Repeated selections replace pending reads, so an older result cannot replace the
currently selected file.

File lists, commit changed-file trees, selected-commit summaries, and diff lines
render only the visible rows. Folder folding remains available. Very long text
lines also render in horizontal sections: scroll horizontally to inspect the
full line, search to jump to a match, or right-click a diff row to copy its left
or right line.

Background refreshes preserve the Local Changes commit-message field and file
list when the status entries have not changed. Diff contents still refresh when
an already-modified file changes again. Search works on the loaded diff without
running another Git command or replacing the search field.

Selecting multiple commits loads their details in the background, then shows
the combined set of changed paths and the hashes and authors of the selected
commits. The result is the union of paths touched by those commits, including a
file changed and later reverted within the selection.

Large repositories can still take time to read from disk or process in Git.
Loading happens without a modal progress dialog from Unit Git; repository
mutations retain their existing confirmations.

<audience include="dev">

Read requests allow one active worker and one replaceable pending request per
view. Superseded diff and commit-detail Git reads are cancelled; stale results
are discarded. File sorting and row preparation also run in the background.
Commit details are cached by hash with bounded
retention. File icons use cached type icons rather than per-path asset database
lookups during list rendering.

The EditMode responsiveness tests exercise 100,000-row lists, large local
changes and diffs, long-line search, refresh equality, and rapid-selection
coalescing. Run the UI tests with a graphics device available, including when
using Unity batch mode.

</audience>

Before a release or after changing Git parsing/process behavior, run
`Tools > Orbiters > Unit Git > Health Checks > All Deterministic`. The batch hook is
`Orbiters.UnitGit.Editor.UnitGitEditorHealthChecks.RunAllBatchmode`.

The package directory is its own repository. Validate and version it independently
from the parent Unity project.
