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
lastVerified: 2026-09-11
---

# MCB Presentation Preview

The replacement `/my-custom-base` page contains an interactive browser scene and a
real HTML recreation of the supplied MCB Inspector reference. The preceding
presentation remains at `/my-custom-base-old`. This page describes the local
implementation; it does not establish a production deployment.

The desktop frame uses the reference's 1054 × 867 proportions. It scales down to
fit smaller desktop windows. Below 760 CSS pixels, the scene and inspector stack
vertically so the inspector remains readable. The surrounding Orbiters navigation
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

The page begins with the avatar's `orbit muscles` weight and normal-map intensity
both at zero. The Inspector initially contains the avatar object header and its
three existing components. The numbered cyan guides follow these actions:

1. Select **Add Component** to open the Unity-style component picker.
2. Type **MCB** into its search field. Matching is case-insensitive and ignores
   surrounding whitespace. Other text shows an empty result state.
3. Select **My Custom Base (MCB)**. Enter selects the match; Arrow Down focuses it.
   Escape or clicking outside dismisses the picker without adding the component.
4. Click **Magic sync** on the website and **Magic Sync** in the Inspector. Either
   order works, but both actions are required before the asset appears.
5. Select **Apply Ultirex**. The button displays a green progress fill with download,
   avatar-definition, and blendshape stages modeled on the real tool. After loading
   completes, the muscle weight and normal intensity rise together to 100%.

The final state displays **Installed (v0.5.3)** and ReFit. **Try again** clears the
walkthrough, returns both appearance values to zero, and retains camera navigation.
Guides enter and leave with restrained motion. Reduced motion removes the spatial
transitions and applies the final appearance immediately after loading. On narrow
screens, the next sync control is brought into view when needed; completion brings
the scene back into view so the result is visible.

The account row and banner author use the signed-in user's username and profile
image through the shared avatar URL helper. Login, profile changes, and logout
update them without reloading the page. Visitors use `blackorbit` and the supplied
avatar. A missing or failed signed-in image falls back to the user's initial.
The `dev` badge and **Create new version** button are absent. The version graph
starts at **0.5.3** and ends at the base node, with a short solid section followed
by fine dashes.

This is a browser demonstration: sync and apply change only the preview state.
They do not copy authentication tokens, link an actual Unity project, download a
package into Unity, or mutate backend data. The installed/public badges describe
the demonstration, not the user's real project or package access. Install and
the remaining reference controls, including Edit, Logout, save/delete, and ReFit,
remain real buttons with no external action at this stage. The old page's installer
is still available at `/my-custom-base-old`.

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

Focused frontend tests cover the workflow reducer, profile updates, resize delivery,
named blendshape updates, camera behavior, and gizmo projection:

```sh
npm test -- --watchAll=false --runInBand --testPathPattern=components/mcb/presentation
npm run build
```

Browser checks should include the entire walkthrough in both sync orders, the
loading and intermediate appearance states, replay, signed-in/visitor identities,
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
