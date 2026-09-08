---
title: Find an Admin Setting
section: Administration
order: 63
audience: admin, dev
stage: beta
id: orbiters.how-to.search-admin-settings
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-09-08
---

# Find an Admin Setting

Open **Admin** and type into **Search settings, options and help…**. You can also
focus search with **Ctrl K** on Windows or **Command K** on macOS.

Prefer browsing? Start with a section card on **Overview**. See
[Admin and Documentation sections](19-browse-workspace-sections.md) for the hierarchy.

Try **PayPal**, **auto-kick**, **backup**, or **permissions**. Results appear as you
type, with matching words highlighted and a breadcrumb showing where each setting lives.
Combine words to narrow results: **Stripe PayPal** searches across both the section
name and the setting's explanation.

Select a result, or use the arrow keys and **Enter**, to open its section. A visible
matching label gets a soft, rounded background glow and is brought into view, with
the text kept sharp. For settings inside an editor
or sub-tab, first select the relevant record, server or sub-tab. Search never changes
a setting, opens a destructive confirmation, or submits a form for you.

**Escape** dismisses the results. Clear the field to start again. The search and
selected result are stored in the page URL, so browser Back/Forward restores them;
you can also copy the URL to another staff member with the necessary access.

## What is searched?

Search covers registered section names, settings labels, explanations and related
keywords in sections you can access. It does not search saved API keys, customer
records or other private values. Use each section's own filters for individual records.
Typing searches locally without loading every admin panel or contacting providers.

<audience include="dev">

## Keep search in step with settings

The frontend's `adminSearch/adminSearchCatalog.js` owns the navigation registry and
search metadata. When adding or renaming an admin setting, update its title,
description, keywords and target label there. Preserve existing entry titles/IDs
when possible so bookmarked results stay meaningful. Apply a nested permission gate
when a setting has stricter access than its section. Backend authorization remains
mandatory; hiding a search result is not an authorization boundary.

Do not add credentials or live record values to the catalogue. Target navigation
only focuses matching text; it must never click action buttons or change controls.
Run the `adminSearch` frontend tests after catalogue, access or navigation changes.

</audience>
