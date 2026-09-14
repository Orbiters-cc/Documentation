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

The desktop frame uses the reference's 1054 × 867 proportions. At widths of 1100
CSS pixels and above, it occupies 61.2% of the presentation area, up to 1054 pixels,
leaving room for the handwritten-style benefits around the Install button.
Smaller windows use the full presentation width. Below 760 CSS pixels, the scene
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
two-finger pan/pinch. Scene controls below the frame explain these bindings.

The orientation gizmo projects its six cones and centre cube from the scene
camera's inverse rotation. It rotates during orbit/look controls and stays fixed
during pan, zoom, or straight fly movement. Its six axis buttons select the
corresponding view; the centre restores the reference view.

## Guided walkthrough

On arrival, an automatic three-second introduction demonstrates **1 Click apply**,
**1 Click update**, and **1 Click rollback**, one second each. These are HTML
version rows with simulated button presses, progress fills, and installed-state
changes. The supplied brush circle draws around the MCB logo while six rays
appear. After the third step, the same logo and labels shrink into the header;
the other benefits and brush arrows reveal over roughly one second as the
interactive frame appears. **Skip intro** proceeds directly to this transition.
Reduced motion starts with the finished header. The introduction timer pauses
while the document is hidden and is cleared on unmount. Tutorial replay resets
the interactive steps without replaying the introduction.

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
the fonts' OFL licenses. Narrow screens arrange the benefit text in two columns
and omit the decorative arrows so that the copy remains readable.

Outside tutorial step 4, **Install** opens the shared `MCBInstallWizard` used by
`/my-custom-base-old`. Visitors are sent to login. Signed-in users receive the
real VCC repository, package installation, Unity component, and account-sync
instructions. The expanded installer closes with its close button, Escape, or an
outside pointer press; explicit dismissal restores focus to Install. Entering
tutorial step 4 closes the installer and temporarily uses its trigger for the
preview's website sync action. After both preview sync actions, Install opens
the real wizard again.

The account row and banner author use the signed-in user's username and profile
image through the shared avatar URL helper. Login, profile changes, and logout
update them without reloading the page. Visitors use `blackorbit` and the supplied
avatar. A missing or failed signed-in image falls back to the user's initial.
The `dev` badge and **Create new version** button are absent. The version graph
starts at **0.5.3** and ends at the base node, with a short solid section followed
by fine dashes.

The guided tutorial is a browser demonstration: its sync and apply controls change only the preview state.
They do not copy authentication tokens, link an actual Unity project, download a
package into Unity, or mutate backend data. The installed/public badges describe
the demonstration, not the user's real project or package access. The Inspector's
remaining reference controls, including Edit, Logout, save/delete, and ReFit,
remain real buttons with no external action at this stage. The separate real
installer can open VCC and prepare an account token through its explicit controls,
exactly as on the old page; those actions are never run automatically by the intro
or tutorial.

## Custom-base wall

Scrolling below the scene reveals a locally adapted
[React Bits Drift Wall](https://reactbits.dev/components/drift-wall) populated
from `GET /mcb/showcase`. The endpoint is anonymous and returns at most 24 recent
public custom-base avatar listings with a non-default thumbnail and at least one
public version. Hidden, restricted, and commission listings are excluded. The
response contains only IDs, titles, thumbnail URLs, and public destination links;
it exposes no version payloads or packages and uses `Cache-Control: no-store`.
Valid store links open their listing; assets without one lead to the asset browser.

The wall fetches when it approaches the viewport, aborts abandoned requests, and
offers a retry on failure. Empty results show a publication message rather than
invented thumbnails. Drift pauses offscreen, in hidden tabs, on hover, and through
the **Pause motion** control. Reduced motion keeps it static. A separate list of
unique links provides keyboard and assistive-technology access without repeated
tab stops. The vendored component includes its upstream MIT + Commons Clause
license in `presentation/drift/LICENSE.md`.

## Model and blendshapes

The scene loads the supplied Ultirex FBX converted to glTF with Meshopt compression.
It retains all 243 named blendshapes and their source weights in the asset. The
walkthrough overrides `orbit muscles` to `0` before the first avatar render, then
animates it to `1` after Apply. The supplied color and normal textures are
separate cached WebP derivatives; the original assets remain untouched.

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

Focused frontend tests cover the intro timing, workflow reducer, ordered virtual-key input,
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
