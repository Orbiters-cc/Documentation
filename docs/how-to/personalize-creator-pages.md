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
and full-page product, sticker and art/YCH asset pages. Sticker widgets show your artist name and a lightweight miniature of your chosen
background palette. Other homepage widgets and detail windows keep the Orbiters
appearance. The miniature uses static gradients rather than another graphics renderer.

1. Start with Aurora, Ember, Lagoon or Daydream, or keep your existing palette.
2. Select a rounded color swatch to open the custom picker. Drag its color field,
   adjust hue, or enter a six-digit hex color. Arrow keys adjust the color field;
   hold Shift for larger steps. Buttons use contrasting foreground text automatically.
3. Choose an atmosphere using the visual cards: **Orbiters**, **Aero Shards**,
   **Grainient** or **Gradient Waves**.
4. Tune the Base, Glow and Highlight colors in the live preview.
5. Choose **Save appearance**. Changes in the preview are private until saved.

**Discard changes** returns to the saved appearance. **Reset to default** prepares
the default colors and background; choose **Save appearance** to publish the reset.

If an animation cannot download, the editor keeps your static background and unsaved
colors. It retries briefly, then offers **Retry animation** without discarding edits.

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

Development containers keep dependencies in their own volume. After changing the
frontend lockfile, install dependencies inside the development frontend service
and restart its bundler. A host-only install cannot fix a missing `vgpu` or `ogl`
module in that container. Production images must install the updated lockfile.

</audience>
