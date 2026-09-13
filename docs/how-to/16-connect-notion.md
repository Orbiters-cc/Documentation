---
title: Connect Notion Task Boards
section: Creator Tools
order: 51
audience: creator, admin, dev
stage: alpha
id: orbiters.how-to.connect-notion
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-13
---

# Connect Notion Task Boards

Connect your Notion workspace to use a task database in your Orbiters boards and
homepage commission board. Imported tasks use the same expandable card window,
description editor and commission controls as other board cards.

## Connect and choose a database

1. Open **Creator → Integrations → Notion → Connect workspace**.
2. Authorize the workspace and share the source databases that contain your tasks.
3. Select **Import database**, or **Import Notion database** under Creator → Boards.
4. Choose a database, then all its tasks or a saved board, table, list or gallery view.
5. Choose the **Status** or **Select** property used for columns. A board view grouped
   by status groups uses those groups as columns.
6. Optionally choose a **Files** property to receive images added from Orbiters.
7. Select **Import privately**, then **Open board**.

Imports run in the background. A selection can contain up to 500 tasks and 30 status
values. Use a filtered Notion view to narrow a larger database. A creator can connect
one workspace, and each data source can have one connected Orbiters board.

If a database is missing, select **Update page access** in connection settings and
share its original source database. Sharing a linked view alone may not grant access
to that source. An administrator must configure the
[Notion application](../reference/notion-connection-setup.md) before the first connection.

## Work with tasks

- Move a card between columns to update its Notion status. For a grouped column,
  Orbiters chooses its first status option. Saved Notion filters and ordering are
  reapplied on sync; moving within a column does not change Notion's manual order.
- Select **Add element** to create a Notion task. A task excluded by the selected
  view's filters can leave the board on its next sync.
- Click a card's title or description to edit, then **Save changes**. Drop or paste
  images into the description. The full proposal page has the same editor.
- Advanced Notion blocks use a Markdown editor so their structure is retained.
  If Notion returns incomplete content, editing is disabled; use **Open in Notion**.
- **Task properties**, **Notion attachments** and **Open in Notion** are available
  in the detail window. Notion-hosted file links refresh when the detail opens.

Uploaded images stay in the description and the Orbiters attachment list. If you
selected a Files property, saving also appends them there, retaining existing files.
These images use Orbiters-hosted capability links that anyone holding the link can
open. Removing an inline image does not delete its attachment.

## Track an existing commission

Use **Link commission asset** in a task's card window to select your commission
asset, clients, agreed price, payment received, configured options, sliders and
freeform extras. Clients then receive the existing Orbiters commission progress view.
See [Link existing commissions](15-link-board-commissions.md).

Commission agreements, payment records and progress controls belong to Orbiters;
they do not become Notion database properties. Update commission progress with the
card's commission controls. A Notion status-column move changes the task status.

## Sync, pause and recover

Connected boards sync about every five minutes. **Sync now** queues an earlier pass;
the scheduler checks queued work every 30 seconds. Large initial imports take longer
because Notion requests are paced. **Pause** stops further processing; an operation
already in flight may finish. **Resume sync** queues the board again.

If a page is trashed or leaves a filtered view, its board placement is removed only
after a complete successful sync. Its Orbiters proposal and commission remain.
Manage task removal in Notion or through the selected view's filters; a connected
board does not offer a local remove action that synchronization would undo.

An edit conflict keeps your draft. Reopen the card to read the newer version before
applying your changes. After an uncertain task creation, Orbiters keeps the draft
without creating another page automatically. Check Notion, then paste the existing
task URL into **Link existing task**. If sync already imported that page, use the
imported card instead. A definitively failed creation can be submitted as a new task
after fixing the reported issue.

**Disconnect board** keeps its cards as editable Orbiters proposals and preserves
commission links. It does not delete Notion pages. Disconnect a board before deleting
the Orbiters board. **Disconnect workspace** pauses its boards and revokes access;
reconnect the same workspace to resume them. Remove board connections and disconnect
the account before choosing a different workspace.

Imports start private. Board visibility and individual proposal visibility remain
separate controls; making a board public does not publish its private task descriptions.
