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
lastVerified: 2026-09-10
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

The inspector buttons are intentionally inert at this stage. The displayed
`blackorbit`, `connected`, `dev`, `public`, and `Installed (v0.5.3)` values belong
to the supplied reference. They do not represent the visitor's account, access,
installation state, or a recommended package release. These controls do not log
out, publish, save, delete, install, or contact the backend.

## Model and blendshapes

The scene loads the supplied Ultirex FBX converted to glTF with Meshopt compression.
It retains all 243 named blendshapes and their source weights. `orbit muscles`
starts at `1`, matching the FBX. The supplied color and normal textures are
separate cached WebP derivatives; the original assets remain untouched.

`MCBPresentation` accepts a `blendshapes` object keyed by the exact exported names:

```jsx
<MCBPresentation blendshapes={{ 'orbit muscles': 0.5 }} />
```

Its optional `onSceneReady` callback receives a scene API after loading. The API
provides `blendshapes.names`, `blendshapes.get(name)`,
`blendshapes.set(name, value)`, `blendshapes.reset()`, and `frame()`.
Weights use the glTF range 0–1; divide a Unity-style 0–100 slider value by 100.
Out-of-range finite numbers are clamped; unknown names and invalid values throw.
Reset restores each mesh's exported defaults. The callback receives `null` on
unmount. A visible muscle slider is outside this first presentation step.

The account avatar was extracted from the existing MCB gallery artwork. The logo
uses the supplied SVG geometry. The banner is the supplied `banner.webp`.

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

Focused frontend tests cover named blendshape updates and camera behavior:

```sh
npm test -- --watchAll=false --runInBand --runTestsByPath src/components/mcb/presentation/blendshapes.test.js src/components/mcb/presentation/sceneControls.test.js
npm run build
```

Browser checks should include orbit, pan, zoom, flythrough, keyboard navigation,
orientation buttons, touch gestures, narrow-screen overflow, reduced motion,
navigation away during loading, and the WebGL failure/retry state. The scene renders
on changes, pauses drawing offscreen, and releases textures, geometry, controls,
observers, and its renderer on unmount. Model loading failures leave the inspector
available and expose a scene retry button.
