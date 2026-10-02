---
title: Restore Scene-view interaction
section: Tools
order: 149
audience: public, creator, dev
stage: stable
id: orbiters.tools.scene-interaction-fixes
domain: xraygizmos
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-02
---

# Restore Scene-view interaction

If you can navigate the Scene view but clicks or transform handles stop working,
update XRayGizmos to **0.2.6** and Orbiters Toolkit to **0.3.7**. My Avatar **0.8.2**
requires both fixed versions. ReFit **0.5.1** also keeps its gravity wire preview
confined to repaint events and restores shared handle drawing state after drawing.

## Recover an older installation

1. Turn **Bones** off in the XRay Gizmos Scene-view toolbar, or disable **Clickable
   scene bones** in its full window.
2. Close any active photoshoot preview, then install the updated packages through
   your package manager. For manual installation, include Toolkit with XRayGizmos.
3. Let Unity finish compiling. Test selecting an ordinary scene object, dragging
   its move and rotate handles, and navigating with Alt and the right mouse button.
4. Turn Bones back on and test selecting a visible bone. Shift adds it to the
   selection; Ctrl/Cmd toggles it. Empty-space selection remains available to Unity.

XRay picking now checks Unity's nearest handle and active mouse control before
selecting. A bone crossing behind the camera is clipped at the near plane instead
of producing an invisible click target across the viewport. Scene views retain
separate hover targets. Toolkit colour, framing and dial drags release pointer
capture on cancellation, removal or capture loss.

These fixes address reproduced picking defects and drag cleanup defects. The
original report of a complete lockout surviving a restart has not been reproduced
on the reporter's project. If it persists with these versions, record the Unity
version, installed package versions, Console errors, whether Bones is enabled,
and whether disabling bone picking restores interaction.

See [XRayGizmos controls](06-xray-gizmos-controls.md) and
[My Avatar thumbnails](10-myavatar-thumbnail.md) for the affected controls.
