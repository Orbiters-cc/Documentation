---
title: Make your first project checkpoint with UnitGit
section: Tools
order: 143
audience: public
stage: stable
id: orbiters.tools.unitgit-get-started
domain: unitgit
type: tutorial
owner: orbiters-unitgit
lastVerified: 2026-09-07
relations: orbiters.tools.unitgit-history-and-shelves
---

# Make your first project checkpoint with UnitGit

UnitGit brings Git status, commits, branches, history, and shelves into Unity. Open **Tools > Orbiters > Unit Git** to work with the repository at the root of the current Unity project.

A commit is a named checkpoint of selected files on disk. It lets you inspect what changed and build a history of your project. **A local commit is not a remote backup:** UnitGit has no Push action. Uploading commits to a remote is a separate step in your usual Git client or command-line workflow.

## Before you start

Use a Unity 2022.3 project with the **Unit Git** package installed and Git available to the editor. If the window reports **Git unavailable**, install/configure Git and restart Unity so it can see the updated environment. Git also needs an author name and email configured before it can create commits.

Save your Unity scenes and assets before making a checkpoint. Unsaved Inspector or scene changes are not yet files that Git can record.

## Prepare the repository

If the project already has a root Git repository with commits, continue to Local Changes.

For a new repository, review the project contents first: initialization stages the current project and creates its first commit. Keep credentials and files you do not want recorded out of the staged project using appropriate ignore rules.

1. Click **Initialize Project Git**. If a root repository exists but has no commits, the button is **Create First Commit**.
2. Review the initialization confirmation. UnitGit ensures Unity/VRChat ignore rules, stages the project, and creates the initial checkpoint. Large projects can take several minutes.
3. If you use **Do not include the project-root Package folder in the first commit**, understand that this applies to the singular `Package` folder, including lowercase `package`. It does not exclude Unity's `Packages` folder.

UnitGit operates on the project-root repository. A separate repository inside an embedded package has its own history and is not automatically managed as another UnitGit workspace.

## Record one meaningful change

Try a small edit, such as changing a material, and save it in Unity.

1. Open **Local Changes** and click **Refresh** if needed.
2. Select changed files to inspect their differences. Include the relevant Unity `.meta` files when recording asset additions, moves, or removals.
3. When all listed changes belong in this checkpoint, click **Stage All**. It includes tracked changes, deletions, and new untracked files. To commit only a subset, stage that subset in your usual Git client instead; selecting a file in UnitGit opens its diff and does not stage it.
4. Write a message describing the outcome, such as `adjust sleeve material roughness`.
5. Leave **Amend** off for a new checkpoint and click **Commit Staged**.
6. Open **Log** and confirm that the new commit and its changed files match your intention.

Staging chooses the next commit's contents. **Unstage All** removes files from that selection while keeping your working edits. If you change a file again after staging it, stage the newer changes too when you want them included.

## Read the workspace

| Tab | Use it for |
| --- | --- |
| Local Changes | Review edits, stage or unstage files, and commit |
| Shelf | Store unfinished work temporarily and apply it later |
| Log | Browse commits, branches, and changed files |
| Console | Inspect Git command results and errors |
| Settings | Configure available project integrations |

The branch and ahead/behind indicators help you compare local history with known remote history. **Fetch** refreshes remote information; it does not publish your commits or update your working files.

Continue with [branches, shelves, and recovery](/documentation/orbiters.tools.unitgit-history-and-shelves) before switching branches, pulling updates, or amending history.
