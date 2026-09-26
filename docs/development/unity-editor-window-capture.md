---
title: Capture Unity editor windows through MCP
section: Development
order: 91
audience: dev, admin
stage: alpha
id: orbiters.development.unity-editor-window-capture
domain: operations
type: how-to
owner: orbiters-engineering
lastVerified: 2026-09-26
---

# Capture Unity editor windows through MCP

The local `orbiters.toolkit` package adds `orbiters_editor_window` to MCP for
Unity. It captures the rendered content of an editor window, including UI Toolkit
controls. The implementation is local and has not been published as a package.

## Requirements

Use a graphical Unity editor with MCP for Unity 9.7.1 installed, then import
`orbiters.toolkit` and wait for compilation and custom-tool discovery. The toolkit
references the MCP editor assembly; install MCP for Unity through its documented
Git URL before installing this package. A separate MCP server or fork is not needed.

If discovery is stale, rescan tools in MCP for Unity or reconnect the MCP client.

## Capture ReFit

Call `execute_custom_tool` with `tool_name` set to `orbiters_editor_window` and
these parameters:

```json
{
  "action": "capture",
  "window_type": "Orbiters.ReFit.Editor.ReFitWizard"
}
```

Capture focuses the selected Unity window and waits for repaint. Opening a closed
window requires explicit `open_if_missing: true`; the tool uses Unity's generic
window creation API. For tools that require menu-specific initialization, execute
their menu first. Capture does not press controls or run the window's operation.

Use `action: list` to get window IDs and types. When several instances share a
type, select one with `window_id` instead of `window_type`. With `focus: false`,
the target must already be Unity's focused window. The selected window stays open.

The server polls pending work automatically. Clients can also request
`action: status` with the returned `job_id`. Domain reload clears jobs; request a
new capture after reload. The toolkit serializes capture requests and retains
up to 16 recent results in memory.

The result includes `fullPath`, source and output dimensions, window identity,
project path and Unity version. Open the returned PNG with the client's image
viewer. Images use unique filenames under `Library/OrbitersToolkit/Screenshots`;
they are not imported into Assets and are disposable with the project's Library.
Use `max_resolution: 0` for native pixels or 64–4096 to limit the longest edge.

## Verified behavior and limits

Live testing on Windows with Unity 2022.3.22f1 captured the ReFit window at 620 × 767
pixels and at 310 × 384 pixels with a 384-pixel limit. The native image was visually
inspected for orientation and content. Both images matched ReFit's stylesheet
background colors exactly: body `#2d2d2d` and header `#383838`. Window listing,
missing-window rejection and invalid-resolution rejection also passed through MCP.

The tool reads Unity's view framebuffer with the internal `GUIView.GrabPixels`
API. It avoids applying a second sRGB conversion to display-encoded editor pixels.
It does not read the desktop or render a scene camera. The capture covers window
content, not the operating-system title bar or separate popups.

Internal Unity API changes can break capture; unsupported APIs produce an error.
Other Unity versions, mixed-DPI monitors, minimized windows, hidden windows and
headless rendering have not been verified. A successful pixel read is not a
substitute for inspecting the image before declaring UI appearance correct.
