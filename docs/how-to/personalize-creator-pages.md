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
lastVerified: 2026-09-25
---

# Personalize your creator pages

Open **Creator → Personalization** to choose the appearance of your public profile
and full-page product, sticker and art/YCH asset pages. Sticker widgets show your
artist name and a still rendered from the same background and palette. The still
is cached and its graphics renderer is released after capture. Other homepage
widgets and detail windows keep the Orbiters appearance.

1. Start with Aurora, Ember, Lagoon or Daydream, or keep your existing palette.
2. Select a rounded color swatch to open the custom picker. Drag its color field,
   adjust hue, or enter a six-digit hex color. Arrow keys adjust the color field;
   hold Shift for larger steps. Buttons use contrasting foreground text automatically.
3. Choose an atmosphere using the visual cards: **Orbiters**, **Aero Shards**,
   **Grainient** or **Gradient Waves**.
4. Tune the Base, Glow and Highlight colors in the live preview.
5. Adjust **Surface blur** from 0 to 24 px. It softens the background behind page
   cards without blurring artwork or text. Set it to 0 to turn blur off. The live
   preview includes a card so you can judge the effect.
6. Choose a **Profile and asset font**: Solitreo, Caveat, Montserrat, Roboto Mono, Roboto Slab, Libre Baskerville, Cormorant Garamond or Amiri. **Orbiters default** uses the website font. Fonts load from Google Fonts when selected.
7. Choose **Card corners**: Rounded, Squircle, Bevel, Rabbet or Sharp. Browser support determines the native corner rendering; bevel and rabbet have CSS clipping fallbacks, while squircle falls back to rounded corners.
8. Add and arrange your profile links in **Your links**. Give each link a title and an HTTP/HTTPS URL; up to 20 links are supported, including services Orbiters does not integrate with.
9. Choose **Save appearance** above the live preview, in the right-hand column on wide screens. Changes in the preview are private until saved.

**Discard changes** returns to the saved appearance. **Reset to default** prepares
the default colors, background, font and shape while preserving your links; choose **Save appearance** to publish the reset.

An untouched empty link row is omitted when saving. A partially filled or invalid
link must be completed or removed; your unsaved appearance remains available if
validation fails. Only HTTP/HTTPS links without embedded credentials are accepted.

**Your links** shows measured profile visits and clicks on each link over the last
30 days. These are event counts, not unique visitors. Your own visits and visitors
who disable measurement are excluded. Reordering a link preserves its statistics.
The profile header stays transparent over a custom background.

## Customize the bot in your server

In your community's connected **Discord Servers**, select **Customize bot profile**
on an active server. Enter a nickname, upload a PNG/JPEG/WebP photo or choose
**Use default photo**, then **Save server profile**. An empty nickname restores the
bot's default name. These changes apply only in that server, including when using
the shared Orbiters bot.

You must own the connection and still manage the Discord server. The bot must be
connected and have permission to change its nickname. If Discord rejects the
update, correct permissions and retry; other servers keep their own profiles.

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
colors, fonts and shapes are allowlisted. Link IDs are stable, unique 16-character
hex identifiers; URLs reject executable protocols and embedded credentials.
`GET /creator-tools/profile-metrics` returns only the authenticated creator's
30-day view and outbound-link aggregates. Outbound tracking validates that the
link belongs to the target creator and respects measurement preferences. `surfaceBlur` is an integer from 0 to 24 (default 8). No creator-supplied CSS, HTML, script or remote background
URL is accepted. Page-scoped CSS variables do not change the document theme.

Development containers keep dependencies in their own volume. After changing the
frontend lockfile, install dependencies inside the development frontend service
and restart its bundler. A host-only install cannot fix a missing `vgpu` or `ogl`
module in that container. Production images must install the updated lockfile.

</audience>
