---
title: Work with UnitGit branches, shelves, and history
section: Tools
order: 144
audience: public
stage: stable
id: orbiters.tools.unitgit-history-and-shelves
domain: unitgit
type: how-to
owner: orbiters-unitgit
lastVerified: 2026-10-03
relations: orbiters.tools.unitgit-get-started
---

# Work with UnitGit branches, shelves, and history

Start with [your first checkpoint](/documentation/orbiters.tools.unitgit-get-started) if you have not yet committed through UnitGit. Save your scenes and assets before an operation that changes working files, and review **Local Changes** so you know what you are carrying with you.

## Try an idea on a branch

A branch gives an experiment its own line of commits. In **Log**, inspect the commit where the experiment should begin, then use **New branch from here** and enter a descriptive name, such as `experiment/sleeve-fit`.

The selected commit is the starting point when one is selected; otherwise UnitGit uses the current commit. Check the active branch before making your next commit. Use the branch's checkout action to switch your working files to that branch.

Commit or shelve unfinished edits before switching. If Git refuses a checkout because files would be overwritten, resolve those edits first rather than forcing the switch.

## Set unfinished work aside

For example, you are testing a sleeve fit but need to inspect another branch. A shelf stores the unfinished changes without asking you to make a permanent commit.

1. Save the current scenes and assets.
2. Choose **Shelve changes** and name the shelf. It saves tracked changes and untracked files, then returns the working tree to the current commit. Ignored files are not included.
3. Do the other task or switch branches.
4. Open **Shelf**, select the saved entry, and choose **Apply** to keep the entry or **Unshelve** to remove it after successful restoration.
5. Review the restored changes and resolve conflicts if the destination files have changed.

Applying a shelf keeps the shelf entry. Once you have confirmed that the work is restored and safely recorded, **Delete** removes that saved entry. Dropping a shelf is deletion, so do not use it as a substitute for applying the work.

## Get remote updates

| Action | What changes |
| --- | --- |
| Fetch | Updates your local knowledge of remote branches without changing working files |
| Update | Advances the current branch and updates working files when a fast-forward is possible |
| Commit | Records staged changes locally |
| Push | Sends local commits to the configured remote |

UnitGit's Update uses fast-forward-only behavior. If your branch and the remote both gained different commits, Update stops instead of creating a merge automatically. Review the histories and use your normal Git workflow to reconcile them before trying again.

Remote repository creation, where available, is also separate from publishing commits. Creating a repository or configuring a remote does not push the project.

## Amend the last checkpoint

Use **Amend** when the last local commit needs a correction, such as a missed file or a better message. Include the correction, enable **Amend**, and use **Commit**. UnitGit confirms operations that rewrite history.

Amending rewrites the previous commit. Prefer a new follow-up commit when other people already rely on that history; coordinate any deliberate history rewrite through your existing Git workflow.

## Recover from common blockers

| Symptom | Next step |
| --- | --- |
| No root repository | Initialize the Unity project root, or open the Unity project whose repository you intended to use. |
| Commit fails because identity is missing | Configure Git's author name and email, then retry. |
| A new edit is absent from the commit | Save it in Unity, refresh, and check whether the latest file contents were staged. |
| Update refuses divergent history | Inspect local and remote commits; reconcile them in your Git workflow. |
| Applying a shelf reports conflicts | Resolve the affected files and verify the result before dropping the shelf. |
| A file has no readable text diff | Binary assets cannot be reviewed like text; inspect the asset in its appropriate editor. |
| A command fails | Read Console for the actual Git error before repeating the action. |

UnitGit operates on real project files and Git history. Review the action's confirmation, especially before deleting a shelf or rewriting a commit.

Unit Git 0.1.3 protects Rename and Squash from concurrent checkouts, refreshes
selected branch state before Update, loads older history through Next, preserves
header-like diff content and identifies all unresolved conflict states. See
[Unit Git history and My Avatar texture fixes](unity-history-and-texture-fixes.md).


<alpha>

## Compare materials visually

In the local working version, select a `.mat` file and choose **Scene view**.
The repository and current material appear on two spheres above the property
changes. Commit history shows the material before and after that commit.
Drag either preview to rotate both; scroll to zoom; double-click to reset.
Both spheres use identical lighting and framing.

Each side loads its own material settings. Referenced shaders and textures use
the current project's assets; this does not restore historical dependencies.
A missing material side or unsupported shader gets an explicit message.
The previews do not create scene objects or modify the original material.

</alpha>
