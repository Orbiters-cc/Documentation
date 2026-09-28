---
title: Unit Git history and My Avatar texture fixes
section: Tools
order: 196
audience: creator, dev
stage: alpha
id: orbiters.tools.unity-history-and-texture-fixes
domain: myavatar
type: reference
owner: orbiters-engineering
lastVerified: 2026-09-28
---

# Unit Git history and My Avatar texture fixes

These fixes are implemented locally and are unreleased. The currently published
package versions do not establish that they include this behavior. This page covers
Unit Git history and My Avatar textures and thumbnails; earlier storage, reporting,
physics and photoshoot changes are covered in
[Unity package safety and avatar workflow fixes](unity-package-safety-fixes.md).

## Unit Git branches and history

- **Rename and Squash:** the operation captures the current branch and commit before
  preparing the replacement history. If another Git client checks out a different
  branch while it runs, only the originally captured branch is updated. The newly
  checked-out branch, working files and index are left intact. If the original
  branch itself advances, the rewrite fails instead of overwriting that change.
  Check out a branch before rewriting; detached HEAD is rejected.
- **Update selected branch:** Unit Git reads the selected branch and upstream again,
  checks out that branch, then pulls with fast-forward-only behavior. Stale selection
  flags no longer decide which branch is pulled. A deleted branch or missing
  upstream produces an actionable error.
- **Older commits:** history initially loads 300 commits and displays 100 per page.
  Next loads another 300 when needed. A count such as `300+ commits` means more
  history is available, not that the repository ends there. Search examines older
  history in cancellable chunks until it has enough matching results or reaches
  the end. A newer search replaces the old one.
- **Diff content:** changed lines that resemble file headers, including `--- ` and
  `+++ `, remain visible inside a diff hunk. Actual file headers stay excluded.
- **Conflicts:** all Git unmerged status pairs show as conflicts, including add/add,
  delete/delete and modify/delete. Resolve them before recording the next checkpoint.

History rewrites remain local. No fix pushes commits automatically.

## Thumbnail Undo and Redo

Each capture creates a distinct PNG under the avatar's managed thumbnail folder.
Unity Undo restores the previous asset and its pixels; Redo restores the later
capture. The component points to the current choice. Previous capture files remain
available because Undo and scene references can still need them; capturing again
no longer overwrites those pixels.

## AI cancellation and preference changes

Local texture matches still apply before optional AI work. Turning AI off
immediately invalidates any pending answer. Turning it back on does not revive an
old answer. Closing the Inspector cancels import work and prevents the final
completion delay from queuing another AI request. Already applied local matches
remain in place.

The robot responds immediately to a toggle. Preference writes from My Avatar
inspectors are sent in order, and an older response or failure cannot replace the
latest choice. If the latest preference write fails, local AI stays paused and an
inline message explains that the account setting was not saved. Check the
connection and retry to synchronize the account.

## Remembered texture choices

Manual choices use the source identity, not just the filename. For example,
`Body/Albedo.png` and `Hair/Albedo.png` retain independent material choices.
Project textures use their asset GUID; external images use a hash of their full
source path. This does not read or hash the image contents, and the source identity
is not sent in the AI request. Renaming or moving an external source creates a new
identity, so choose its slot again if needed.

## Save when nothing changed

Save still saves the scene and assets first. If the selected checkpoint files are
unchanged, Unit Git reports success without creating an empty commit, and My Avatar
shows **Saved · no new changes to checkpoint.** Unrelated staged changes remain
untouched. If Git encounters a real error, the feedback states that the scene and
assets were saved but the Git checkpoint failed.

<audience include="dev">

## Verification and implementation

Focused EditMode regressions exercise concurrent checkouts during Rename and
Squash, concurrent branch advancement, stale branch selections, a 602-commit
history, header-like diff content, all seven conflict pairs and an unchanged save
with unrelated staged files. My Avatar regressions exercise thumbnail pixel
restoration through Undo/Redo, independent texture mappings, delayed AI responses,
Inspector disposal during the completion delay, and ordered preference writes.
The focused regressions and existing Unit Git suite passed all 63 selected
EditMode tests in Unity 2022.3.22f1. Git fixtures use temporary local repositories.
AI tests use controlled responses and do not send requests to the production service.

The branch rewrite uses an explicit reference and expected old commit with
[Git update-ref](https://git-scm.com/docs/git-update-ref), so Git rejects a concurrent
change to that reference. Conflict labels follow the unmerged pairs in
[Git status](https://git-scm.com/docs/git-status).

</audience>
