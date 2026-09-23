---
title: Personalize your creator pages
section: How-to
order: 266
audience: creator, admin, dev
stage: beta
id: orbiters.creator.personalization
domain: website
type: how-to
owner: orbiters-platform
lastVerified: 2026-09-23
---

# Personalize your creator pages

Open **Creator → Personalization** to choose the appearance of your public profile
and full-page product, sticker and art/YCH asset pages. Homepage widgets and their
detail windows keep the Orbiters appearance.

1. Choose a primary color. Buttons use contrasting foreground text automatically.
2. Select **Orbiters default**, **Aero Shards**, **Grainient** or **Gradient Waves**.
3. For an animated background, adjust its three colors in the live preview.
4. Choose **Save appearance**. Changes in the preview are private until saved.

**Discard changes** returns to the saved appearance. **Reset to default** prepares
the default colors and background; choose **Save appearance** to publish the reset.

Motion stops when the browser tab is hidden. Reduced-motion preferences use a static
color background. Unsupported WebGL/WebGPU devices also retain a static background,
so profile information and ordering controls remain available. Aero Shards requires
WebGPU for its animated version. Grainient and Gradient Waves use WebGL.

The backgrounds are adapted from [React Bits](https://reactbits.dev/). Their
MIT + Commons Clause license is included in the application at
`/licenses/react-bits.txt`.

<audience include="dev">

Appearance is stored in the nullable `Users.creatorAppearance` JSON column.
`PUT /creator-tools/personalization` is creator-authenticated and always writes the
current user's record. The public `GET /creator-tools/personalization/:id` returns
only validated appearance settings. Background identifiers and six-digit hex
colors are allowlisted. No creator-supplied CSS, HTML, script or remote background
URL is accepted. Page-scoped CSS variables do not change the document theme.

</audience>
