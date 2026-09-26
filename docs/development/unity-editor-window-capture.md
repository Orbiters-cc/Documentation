---
title: Capture Unity editor windows through MCP
section: Development
order: 91
audience: dev, admin
stage: stable
id: orbiters.development.unity-editor-window-capture
domain: operations
type: how-to
owner: orbiters-engineering
lastVerified: 2026-09-26
---

# Capture Unity editor windows through MCP

The `orbiters.toolkit` package adds `orbiters_editor_window` to MCP for Unity.
It captures the rendered content of an editor window, including UI Toolkit
controls. [Toolkit 0.1.0](https://github.com/Orbiters-cc/Toolkit/releases/tag/0.1.0)
is published with a package ZIP and `package.json`.

## Requirements

Use a graphical Unity editor with MCP for Unity 9.7.1 installed, then import
`orbiters.toolkit` and wait for compilation and custom-tool discovery. The toolkit
references the MCP editor assembly; install MCP for Unity through its documented
Git URL before installing this package. A separate MCP server or fork is not needed.

If discovery is stale, rescan tools in MCP for Unity or reconnect the MCP client.

## Install the assistant skill

Open **Tools > Orbiters > Toolkit**, select **Codex**, **Claude Code**, or both,
and click **Install / update AI integration**. The window displays installation
status for each client and adds instructions to this Unity project:

- Codex: `.agents/skills/orbiters-toolkit/SKILL.md`
- Claude Code: `.claude/skills/orbiters-toolkit/SKILL.md`

The skill teaches discovery, window selection, background capture, polling and
image inspection. It preserves the user's control over foreground activation.
It does not install MCP for Unity or configure a client's MCP connection. Start a
new chat or reload skills if the assistant has not discovered the new instructions.

The installer records ownership and a content hash beside each installed skill.
Unchanged installations are skipped; toolkit-owned copies can be updated. If a
user has edited the skill or another file already occupies the destination,
the installer preserves it and reports the conflict before writing either client.
It does not follow linked destination directories into another workspace.

## Package releases

The [Toolkit repository](https://github.com/Orbiters-cc/Toolkit) uses the same
**Build Release** workflow as ReFit. `PACKAGE_NAME` is `Toolkit`, and `master` is
the automatic-release branch. Push a new unused version in `package.json` to
publish the package, or dispatch the workflow manually.

The [first release run](https://github.com/Orbiters-cc/Toolkit/actions/runs/36257978449)
succeeded for commit `10801a4`. The downloaded `Toolkit-0.1.0.zip` passed the
archive validator, and all eight files matched that commit exactly, including
the bundled skill. The installer passed live Unity checks for both clients,
repeat installation, owned updates and preservation of custom edits. Its window
was inspected through the toolkit's background capture tool.

## Capture ReFit

Call `execute_custom_tool` with `tool_name` set to `orbiters_editor_window` and
these parameters:

```json
{
  "action": "capture",
  "window_type": "Orbiters.ReFit.Editor.ReFitWizard"
}
```

Capture defaults to `focus: false`: it repaints the selected view and reads its
framebuffer while Unity stays in the background. It does not call window focus,
switch applications or restore focus afterward. Explicit `focus: true` permits
bringing Unity forward and selecting a tab.

Opening a closed window requires both `open_if_missing: true` and `focus: true`,
since opening can activate Unity. The tool uses Unity's generic window creation
API. For tools that require menu-specific initialization, execute their menu first.
Capture does not press controls or run the window's operation.

Use `action: list` to get window IDs and types. When several instances share a
type, select one with `window_id` instead of `window_type`. In background mode,
the target must be the selected tab within its own dock, but it does not need
keyboard focus. An inactive tab returns an error instead of silently selecting it
or capturing the dock's other tab. The selected window stays open.

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

A subsequent ReFit capture passed with Unity in the background. A Windows
foreground-window monitor sampled every 20 ms during the capture and observed
the same other application throughout; Unity reported unfocused before and after.
The PNG was visually inspected. An inactive Game tab correctly returned an error
without being selected.

The tool reads Unity's view framebuffer with the internal `GUIView.GrabPixels`
API. It avoids applying a second sRGB conversion to display-encoded editor pixels.
It does not read the desktop or render a scene camera. The capture covers window
content, not the operating-system title bar or separate popups.

Internal Unity API changes can break capture; unsupported APIs produce an error.
Other Unity versions, mixed-DPI monitors, minimized windows and
headless rendering have not been verified. A successful pixel read is not a
substitute for inspecting the image before declaring UI appearance correct.
