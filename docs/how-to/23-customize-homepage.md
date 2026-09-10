---
title: Customize Your Homepage
section: Website
order: 102
audience: public, user, creator, admin, dev
stage: alpha
id: orbiters.how-to.customize-homepage
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-10
---

# Customize Your Homepage

The widget homepage is an alpha feature. It brings your workspace, characters and
discoveries into one continuous page. Pinned widgets come first; the discovery
feed follows immediately, including space in the final pinned row when it fits.

## Pin something you want to keep

Hover over a feed widget and select the pin in its top-right corner. The same
control appears when you focus the widget with the keyboard and stays visible on
touch screens. The widget moves into your pinned collection. Use **Undo** in the
confirmation if you change your mind.

Your initial pins are **Sona catalog**, **Latest blog post** and **Age verification**.
Creators with a configured default commission board also start with **Commission
board**. You can remove any of these. Removing all pins keeps the homepage empty
of pins; it does not restore the defaults.

## Arrange your widgets

1. Select **Customize** at the top of Home. You can also hold the pointer still
   on a non-interactive part of a widget for two seconds. A progress indicator
   confirms the hold; moving, releasing or scrolling cancels it. Buttons, links,
   form fields and the commission board's controls keep their normal behavior.
2. Drag a pinned widget by its **Move** handle. Neighbors preview the new placement
   as you move. Release to place it. Dropping beyond the pinned widgets moves it
   to the end of that collection, ahead of the feed.
3. On touch, use the same handle. You can also select one widget, then select a
   destination. Keyboard users can focus a handle and use the arrow keys, or use
   the **Move earlier** and **Move later** controls.
4. Use the corner removal button to unpin a widget. **Undo** in the bottom toolbar
   reverses your most recent change.
5. Select **Done** to save and return to normal interaction.

The grid compacts widgets automatically. It does not store empty cells. Some
combinations of fixed widget sizes cannot fill every cell: in that case, keeping
all pinned widgets before the feed takes priority. Resizing the window repacks the
same collection for the new column count.

## Add from the catalog

In customization mode, select **Add widget** in the floating bottom toolbar. It
expands into a compact, searchable catalog, starting on **Highlights**: a scrollable
gallery of widget previews. Drag a preview to place it, or select **Options** to
choose its content and size. The homepage stays visible and
scrollable without a blurred background. Select a widget type, choose its content
and size when offered, then drag its preview directly onto the homepage. The
catalog folds away as you lift the preview. Release over a pinned widget to place
it there, or over the feed to add it after your existing pins.

Dropping outside the homepage or pressing **Escape** during a drag cancels it and
returns to the catalog. You can also select **Add widget** to append the selection
without dragging; the catalog stays open so you can add another widget.

| Widget | Width × height in cells | Content |
| --- | --- | --- |
| Commission board | Full width × 3 | Your configured board, with its normal task controls |
| Sona catalog | 2 × 2 | Your characters and reference images |
| Latest blog post | 3 × 2 | Automatically follows the newest published post |
| Age verification | 1 × 1 | Your current verification status |
| Gallery image | 1 × 1, 2 × 1, 1 × 2, 2 × 2, 3 × 1 or 3 × 2 | A selected image; open it for a larger preview |
| Discover an asset | 1 × 1 | A selected asset |
| From the blog | 3 × 2 | A selected older post |
| Documentation update | 3 × 1 | A selected guide with its latest recorded change date |
| Creator card | 2 × 1 or 1 × 1 | A selected creator and profile link |
| Commissions in progress | 2 × 1 or 1 × 1 | Your active requests and progress |

Gallery images, assets, older posts, documentation pages and creators can each have
multiple pins with different content. The same selection can only be pinned once.
You can keep up to 64 pinned widgets. The catalog explains when a widget requires
sign-in or a configured default board.

To resize a pinned image, creator or progress widget, use its size control between
the movement arrows. You can also select the same content in the catalog, choose
a different size and select **Update size**. This updates the existing pin in
place. **Undo** also reverses size changes.

## How the page adapts

Home keeps 24 pixels of space at each side and 16 pixels between widgets. Rows are
200 pixels high. Columns start at a minimum width of 200 pixels and stretch equally
to fill the available width. Wider widgets include the gaps between their cells.
On narrow screens, a widget's width reduces to the available columns while its
content adapts. For example, a 3 × 2 blog widget becomes one column wide on a phone
and keeps its two-row height.

The feed adds content as you scroll. Loading another page keeps already displayed
widgets in place. Older blog posts are mixed through the feed; the latest post has
its own widget. Asset discoveries exclude assets already in your collection.

Motion springs give rearranging, opening the catalog and pressing controls a
consistent response. The floating toolbar and catalog share a refracting glass
frame, with a small bounce as it expands or contracts. Their contents fade and
blur during the transition. The homepage respects your system's reduced-motion
setting. The glass follows live page content. Refraction is available in
Chromium browsers such as Chrome and Edge; other browsers keep a translucent
frame with the same controls and layout.

## Verify your age from Home

Select **Verify** on the Age verification widget (or **View status** if already
verified). The dialog offers **VRChat linking**, **Trusted server role** and
**Verify with an administrator**. VRChat opens the existing friend-request linking
flow directly in the dialog; you do not need to visit Account or enter a password.
The linked VRChat profile must have a verified 18+ status to supply age evidence.

For Discord, connect the account holding a qualifying role from a trusted server.
An existing connection is recognized. Joining a server alone does not grant
verification. **Check status** reads the currently recorded result; staff can check
role synchronization if evidence is missing. Manual verification opens Orbiters
Discord so you can arrange a private ID check with an administrator. Do not post
identity documents in public channels or upload them to the homepage.

You can return to the methods list or close the dialog without leaving Home.
Staff review holds must be resolved by staff, even when another source confirms
18+ status. Verification updates refresh the homepage widget.

## Saved layouts and unavailable content

Signed-in layouts follow your account across devices. Pins added outside
customization save automatically; **Done** saves edits made inside customization.
Background saves do not insert a status message or move the widget grid.
Without signing in, your changes last for the current visit.

If saving fails, your changes stay on the page and **Retry save** appears. If another
tab saved a different layout first, **Reload saved layout** loads that version and
discards this tab's unsaved changes. Orbiters never silently overwrites the other
tab's newer layout.

Pins keep references to content, not permanent copies. Removed content or a change
in your access can make a pin unavailable. You can unpin it and choose something
else. Pinning does not grant additional access or change what other people see.

Creators can configure their board in
[Manage Your Commission Workspace](/documentation/orbiters.how-to.manage-commission-workspace).
Developers can find the persistence and layout contracts in
[Homepage Widgets](/documentation/orbiters.development.homepage-widgets).
