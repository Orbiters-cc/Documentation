---
title: MCB Presentation Preview
section: Development
order: 115
audience: dev
stage: alpha
id: orbiters.development.mcb-presentation-preview
domain: mcb
type: reference
owner: mcb-maintainers
lastVerified: 2026-09-14
---

# MCB Presentation Preview

The replacement `/my-custom-base` page contains an interactive browser scene and a
real HTML recreation of the supplied MCB Inspector reference. The preceding
presentation remains at `/my-custom-base-old`. This page describes the local
implementation; it does not establish a production deployment.

The desktop frame stays 1054 × 867 while the page has enough horizontal space.
When space runs out, its scene column narrows first while the Inspector retains
its 456-pixel width and original UI scale. At a 912-pixel frame width the columns
reach a 50/50 split; only then does the whole editor scale down. Below 760 CSS pixels, the scene
and inspector stack vertically so the inspector remains readable. The surrounding Orbiters navigation
and footer continue to work normally.

## Preview controls

The scene follows [Unity's Scene view navigation](https://docs.unity3d.com/Manual/SceneViewNavigation.html):

| Input | Action |
| --- | --- |
| Alt + left drag | Orbit the avatar |
| Middle drag, or Alt + Ctrl/Command + left drag | Pan |
| Wheel, or Alt + right drag | Zoom |
| Right drag | Look around from the current camera position |
| Hold right mouse + W/A/S/D | Fly forward, left, backward, right |
| Hold right mouse + Q/E | Fly down/up |
| Shift during flythrough | Move faster |
| Wheel during flythrough | Adjust movement speed |
| F | Frame the avatar, preserving the current view angle |
| Home | Restore the reference view |

The canvas must have focus to receive keyboard commands. Arrow keys orbit,
Shift + arrows pan, and plus/minus zoom. Escape, loss of focus, pointer cancellation,
and hiding the page stop active navigation. Touch supports one-finger orbit and
two-finger pan/pinch. The foldable **Scene controls** panel at the bottom left
inside the scene explains these bindings. Escape closes it and restores its summary focus.

The orientation gizmo projects its six cones and centre cube from the scene
camera's inverse rotation. It rotates during orbit/look controls and stays fixed
during pan, zoom, or straight fly movement. Its six axis buttons select the
corresponding view; the centre restores the reference view.

## Guided walkthrough

On arrival, the page resets to the top, including when entered through browser
history after scrolling another page. The introduction waits for the visitor to click **Apply UltiRex**,
**Update UltiRex**, and **Reset to Original Avatar** in sequence. Each action
shows loading progress and an installed-state change, then waits for the next
click. A handwritten **Click!** arrow moves gently beside the available button.
Repeated clicks while loading cannot skip a step. The supplied brush circle
draws counterclockwise from the thick upper end around the MCB logo while six
rays appear. The version-history rail connects the first and last dots even when
the update step adds the expand/collapse row. After Reset completes, the same
logo and three labels move into the header together. The other benefits and
arrows reveal quickly from their centers while the interactive frame appears.
**Skip intro** opens the final header immediately. Reduced motion retains all
three interactive actions with shorter progress feedback and no spatial motion.
Loading timers pause in hidden tabs and are cleared on unmount. Tutorial replay
resets the interactive Unity steps without replaying the introduction.

The page begins with the avatar's `orbit muscles` weight and normal-map intensity
both at zero. The Inspector initially contains the avatar object header and its
three existing components. The numbered cyan guides follow these actions:

1. Select **Add Component** to open the Unity-style component picker.
2. Type **MCB** into its search field, or click **M**, **C**, then **B** on the
   floating keyboard. Only the next letter is enabled. Physical and on-screen
   input can be mixed; matching ignores case and surrounding whitespace. Other
   text shows an empty result state, and clicking **M** starts a fresh search.
3. Select **My Custom Base (MCB)**. Enter selects the match; Arrow Down focuses it.
   Escape or clicking outside dismisses the picker without adding the component.
4. The website's single **Install** button turns into **Magic Sync**, with a brief
   glow and sheen. Click it and **Magic Sync** in the Inspector. Either order
   works, but both actions are required before the asset appears. If the website
   is clicked first, it shows **Synced** while waiting for the Inspector. After
   both clicks, the same website button returns to **Install**.
5. Select **Apply Ultirex**. The button displays a green progress fill with download,
   avatar-definition, and blendshape stages modeled on the real tool. After loading
   completes, the muscle weight and normal intensity rise together to 100%.

The final state displays **Installed (v0.5.3)** and ReFit. **Try again** clears the
walkthrough, returns both appearance values to zero, and retains camera navigation.
Guides enter and leave with restrained motion. Reduced motion removes the spatial
transitions and applies the final appearance immediately after loading. On narrow
screens, the next sync control is brought into view when needed; completion brings
the scene back into view so the result is visible.

The three-key keyboard appears only during step 2. It fades into focus while its
cable draws from the keyboard along a curved path to behind the frame's right
edge. Completing the search or dismissing the picker blurs and fades the entire
keyboard and cable together; the cable does not retract. Exiting keys are disabled.
Keyboard activation advances focus to the next key, then returns focus to the
search field after **B**. Escape still dismisses the picker. On phones the keyboard
sits near the bottom of the viewport, and the search field avoids opening the
system keyboard over it. Reduced motion uses brief opacity fades without blur,
cable drawing, or the button's attention animation.

The benefits are selectable HTML text in locally hosted Caveat, with Solitreo
and Brush Script MT fallbacks. The logo, circle, ray, and arrow SVGs retain the
supplied Figma artwork. Their provenance is recorded in
`public/assets/mcb/presentation/intro/sources.json`; the font directory includes
the fonts' OFL licenses. Narrow screens give the labels and all eight arrows
separate positions above and below the button; the arrows remain visible down
to a 320-pixel viewport.

Outside tutorial step 4, **Install** opens the shared `MCBInstallWizard` used by
`/my-custom-base-old`. Visitors are sent to login. Signed-in users receive the
real VCC repository, package installation, Unity component, and account-sync
instructions. The same mounted Dynamic Island grows from the Install button;
the surrounding labels, arrows, and Unity frame move apart to reserve its space.

On the repository step, **Or add the repo manually** displays the same repository
URL used by **Add Orbiters in VCC**. **Copy** copies that URL and confirms success;
if clipboard access fails, the selectable URL remains available. On wide screens
the guide sits to the left with a horizontal arrow pointing toward the installer.
On smaller screens it moves below the header and reserves space above the scene.
On the package step, viewports at least 1200 pixels wide show the supplied VCC
reference artwork on both sides: **Manage Project** is circled on the left and
the **+** beside MCB is circled on the right. These are visual instructions for
the desktop VCC application; the website does not operate VCC's project controls.

The island's height follows the actual step content, including wrapped text and sync feedback;
measurements are applied outside ResizeObserver delivery. Browser resizing updates
the surrounding layout without carrying over the expansion animation.
Step contents slide horizontally with a blur and fade; the outgoing and incoming
panels overlap while the island resizes. Titles and descriptions move with their
panel rather than adding a separate vertical animation. Reduced motion removes
translation and blur. An outgoing panel cannot clear the incoming panel's size observer.
There is no modal or extra card around the island. Arrow tips remain outside its
bounds. The expanded installer closes with its close button, Escape, or an
outside pointer press; explicit dismissal restores focus to Install. Entering
tutorial step 4 closes the installer and temporarily uses its trigger for the
preview's website sync action. After both preview sync actions, Install opens
the real wizard again.

## ReFit and file workflow illustrations

Below the interactive editor, the ReFit integration comparison uses the supplied
before/after hoodie images, a Caveat caption and a drawn arrow. The original
image dimensions are retained in WebP copies; provenance is recorded in
`public/assets/mcb/presentation/refit/sources.json`. Images and arrow reveal as
the section enters view. Narrow screens place the caption above the image pair.
The comparison sits directly on the page background, without a gray panel.

The file diagram illustrates the **FBX diff path**, with creator and recipient
on either side of the server. Its file, broken-file diff, XOR, binary payload,
SHA-256 and verification symbols reveal in workflow order. Narrow screens stack
creator, server and recipient; reduced motion shows the completed illustrations.
The explanatory text remains available independently of the decorative SVGs.
Its heading uses the requested ownership wording; the previous subtitle and
technical footnote are absent from the presentation.

The diagram matches `HdiffService` and the FBX output hash in
`FileManagerService`: build a diff from the original and custom FBX, XOR-wrap it
using the original bytes, then unwrap and reconstruct with the recipient's
original. The reconstructed output is checked against its SHA-256 hash.
This payload excludes the original FBX; that mechanism does not establish a
guarantee of zero security risk. SHA-256 is an integrity check, not encryption. Other delivery
formats, including native mesh payloads and full-file XOR, are outside this
simplified diagram; see [MCB Adaptive Delivery](../reference/mcb-adaptive-delivery.md).

## Video walkthroughs and documentation grid

Three video rows show customization, custom-base creation and version creation,
with a rounded poster and play icon beside each label. They use the supplied
recordings with lossless fast-start remuxing and generated WebP posters. The
source manifest is `public/assets/mcb/presentation/videos/sources.json`.
The section deliberately uses half-scale posters, labels, spacing and corner
radii so it remains a compact guide between the larger presentation sections.
Only posters load before activation. Clicking or keyboard-activating a poster
opens the shared homepage `CardPreviewDialog` from its bounds and starts the
recording with native playback controls. Closing pauses playback immediately,
collapses back to the source, unmounts the player and restores trigger focus.
Escape, outside dismissal and the inset close button remain available. Reduced
motion removes spatial expansion; playback controls are unchanged.

The final section loads its cards from `GET /knowledge?domain=mcb&stage=alpha`.
It follows every response page rather than maintaining a fixed list. Existing
audience permissions still apply; alpha includes all release stages visible to
the caller, with non-stable stages labeled on the cards and carried into reader
links. The grid refreshes every minute while visible, on tab return/focus, and
when account identity changes. Additions, edits and deletions appear after the
documentation index refreshes, without a frontend rebuild. Requests are aborted
on cleanup, and loading, empty and retry states are provided.

## Inspector profile

The account row and banner author use the signed-in user's username and profile
image through the shared avatar URL helper. Login, profile changes, and logout
update them without reloading the page. Visitors use `blackorbit` and the supplied
avatar. A missing or failed signed-in image falls back to the user's initial.
The `dev` badge, **Edit**, and **Create new version** buttons are absent. The version graph
starts at **0.5.3** and ends at the base node, with a short solid section followed
by fine dashes.

The guided tutorial is a browser demonstration: its sync and apply controls change only the preview state.
They do not copy authentication tokens, link an actual Unity project, download a
package into Unity, or mutate backend data. The installed/public badges describe
the demonstration, not the user's real project or package access. The Inspector's
remaining reference controls, including Logout, save/delete, and ReFit,
remain real buttons with no external action at this stage. The separate real
installer can open VCC and prepare an account token through its explicit controls,
exactly as on the old page; those actions are never run automatically by the intro
or tutorial.

## Custom-base wall

Scrolling below the scene reveals a locally adapted
[React Bits Drift Wall](https://reactbits.dev/components/drift-wall) populated
from `GET /mcb/showcase`. The endpoint is anonymous and returns at most 24 recent
public custom-base avatar listings with a non-default thumbnail. A public version
is not required: listings with beta versions or no uploaded versions also appear.
Hidden, restricted, and commission listings are excluded. The
response contains only IDs, titles, thumbnail URLs, and public destination links;
it exposes no version payloads or packages and uses `Cache-Control: no-store`.
Clicking a tile opens the same expanding asset preview used by homepage widgets.
The visible, raised card is the pointer target. Primary presses capture the
pointer and pause drift so movement between press and release cannot lose the
click. Drags beyond eight pixels and cancelled touch gestures do not activate a
card. The preview captures its four projected corners, morphs from the tilted
surface into the detail window, and returns to the resting perspective and
shading on close. The thumbnail stays aligned with the detail image during the
crossfade; the final pixels fade into the wall's original edge mask. Reduced
motion omits the perspective travel. Ordinary homepage previews retain their
existing rectangular transitions.
The wall pauses through the preview's exit so its source stays in place. Escape,
outside dismissal, and the close button return to the wall; keyboard focus is
restored. Modified clicks retain normal asset-page links.

`GET /mcb/showcase/:id` serves the preview to visitors as well as signed-in users.
It repeats the listing visibility checks and returns only ID, name, thumbnail,
short description, and description. Invalid or unavailable listings return 404;
temporary failures return a generic 503 with retry UI. It does not grant access
to beta versions or expose any package, ownership, or authentication data.

The wall fetches when it approaches the viewport, aborts abandoned requests, and
offers a retry on failure. Empty results show a publication message rather than
invented thumbnails. Drift pauses offscreen, in hidden tabs, on hover, and through
the **Pause motion** control. Reduced motion keeps it static. A separate list of
unique links provides keyboard and assistive-technology access without repeated
tab stops. This row is visually hidden until keyboard focus enters it. Pointer
preview dismissal restores focus to the wall's Explore link without revealing
the hidden row. The vendored component includes its upstream MIT + Commons Clause
license in `presentation/drift/LICENSE.md`.

## Model and blendshapes

The scene loads the supplied Ultirex FBX converted to glTF with Meshopt compression.
It retains all 243 named blendshapes and their source weights in the asset. The
walkthrough overrides `orbit muscles` to `0` before the first avatar render, then
animates it to `1` after Apply. The supplied color and normal textures are
separate cached WebP derivatives; the original assets remain untouched.
The color texture uses sRGB; the normal texture explicitly uses `NoColorSpace`.
Its normal scale is `(intensity, -intensity)` to compensate for the supplied
normal map's green-axis convention, including throughout the Apply animation.

`MCBPresentation` accepts a `blendshapes` object keyed by the exact exported names:

```jsx
<MCBPresentation blendshapes={{ 'EarSmall': 0.5 }} />
```

Its optional `onSceneReady` callback receives a scene API after loading. The API
provides `blendshapes.names`, `blendshapes.get(name)`,
`blendshapes.set(name, value)`, `blendshapes.reset()`, `setAppearance(value)`, and
`frame()`. `setAppearance` updates `orbit muscles` and both normal-scale components
together. The walkthrough owns this combined appearance transition; other named
blendshapes remain independently controllable.
Weights use the glTF range 0–1; divide a Unity-style 0–100 slider value by 100.
Out-of-range finite numbers are clamped; unknown names and invalid values throw.
Reset restores each mesh's exported defaults. The callback receives `null` on
unmount or loss of the WebGL context. A visible muscle slider remains outside this
walkthrough. If the context is lost during Apply or the reveal, the walkthrough
returns to Apply and waits for **Reload scene** to succeed. It does not claim an
installation completed while the scene was unavailable.

The account avatar was extracted from the existing MCB gallery artwork. The logo
uses the supplied SVG geometry. The banner is the supplied `banner.webp`.

The Inspector uses the Inter font files extracted from Unity 2022.3.22f1, including
their bundled OFL license. Toolbar and component icons use original Unity textures.
MCB's like/save/delete icons retain the exact polygon coordinates from
`MCBInteractionIconElement.cs`; the expand icon comes from `Editor/expand.png`, and
ReFit uses the exact bar dimensions in `mcb-avatar-options.uss`. The
`public/assets/mcb/presentation/editor/sources.json` manifest records each source.
The logo's translucent ellipse layers extend upward over the component headers.

## Rebuild and verify assets

Run these from the frontend directory, replacing the source directory with the
folder containing the supplied FBX, textures, and banner:

```sh
blender --background --factory-startup --python scripts/prepare-mcb-model.py -- /path/to/source public/assets/mcb/presentation
node scripts/optimize-mcb-model.mjs
python scripts/prepare-mcb-textures.py /path/to/source public/assets/mcb/presentation
node scripts/verify-mcb-model.mjs
```

Blender 3.3 was used for the FBX conversion. The texture script requires Pillow.
Use the frontend's supported Node version, 22 or later, for the optimizer and
validation. Asset validation checks every name and default against the FBX export
manifest and verifies that `orbit muscles` contains actual vertex deformation.

To re-extract the editor assets, install Python's `UnityPy` package and provide the
installed editor's resource file and the MCB package's Editor directory:

```sh
python scripts/extract-mcb-editor-assets.py "/path/to/Unity/Editor/Data/Resources/unity editor resources" "/path/to/orbiters.mcb/Editor" public/assets/mcb/presentation/editor --unity-version 2022.3.22f1
```

Focused frontend tests cover intro click gating and completion, workflow state, ordered virtual-key input,
profile updates, resize delivery, named blendshape updates, camera behavior, and
gizmo projection:

```sh
npm test -- --watchAll=false --runInBand --testPathPattern=components/mcb/presentation
npm run build
```

Browser checks should include mouse and touch entry of **M**, **C**, **B**, mixed
physical input, key focus handoff, picker dismissal, partial cable drawing, and the
non-retracting blurred exit. Check the single website button before, during, and
after sync, the real installer and its dismissal/focus behavior, the Caveat notes,
and the intermediate intro-to-header transition. Check wall loading, retry, empty
results, hover/pause, reduced motion, and actual thumbnail links. Also include the entire
walkthrough in both sync orders, the loading and intermediate appearance states,
replay, signed-in/visitor identities,
orbit, pan, zoom, flythrough, keyboard navigation, orientation buttons, touch
gestures, narrow-screen overflow, reduced motion, navigation away during loading,
and the WebGL failure/retry state. The frame uses CSS aspect ratio for its layout;
width-only scale updates and WebGL drawing-buffer changes run in animation frames
outside ResizeObserver delivery. Height-only notifications are ignored. Do not
hide ResizeObserver errors in the dev overlay as a substitute for fixing a loop.
The scene renders
on changes, pauses drawing offscreen, and releases textures, geometry, controls,
observers, and its renderer on unmount. Model loading failures leave the inspector
available and expose a scene retry button.

## Dev dependency refresh

The dev frontend uses a persistent `node_modules` volume. Its startup command runs
`npm install` before the development server so changes to `package.json` or
`package-lock.json` are reflected after a normal `frontend-dev` restart. This is
required for browser dependencies such as `three`; otherwise webpack can retain an
older volume and report that the dependency cannot be resolved even when the source
manifest already declares it.

If a running dev server reports a missing package immediately after a dependency
change, run `npm install` inside that frontend container once, then restart only
`frontend-dev`. Verify the route in a browser after webpack reports a successful
compile. Do not delete the volume as a first response: it can contain unrelated
development dependencies.
