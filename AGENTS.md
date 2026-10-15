# Orbiters Documentation Contributor Guide

Use this guide when adding or editing documentation for Orbiters.

## Goals

- Write complete, useful pages. Do not leave placeholders, TODOs, or vague future notes.
- Prefer clear task language over marketing language.
- Keep pages focused. Split large pages before they become difficult to scan.
- Explain why a workflow exists when the reason prevents mistakes.
- Keep public, creator, moderator, admin, and developer material separated with metadata or inline audience blocks.

## Information Architecture

Use the Diataxis split as the default:

- Tutorials teach a beginner workflow from start to finish.
- How-to guides solve one practical task.
- Reference pages list facts, fields, endpoints, states, and commands.
- Explanation pages describe concepts, architecture, and tradeoffs.
- Decisions record why a meaningful choice was made.

Do not force every topic into every category. One good page in the right category is better than repeated content.

## Visibility

Set page-level visibility in frontmatter:

```md
audience: creator, admin, dev
```

Use inline blocks when only part of a page is restricted:

```md
<audience include="dev">
Implementation detail that should not be visible to creators.
</audience>
```

Never put secrets, real tokens, private keys, private customer data, or production-only credentials in docs. Show field names and safe examples only.

## Release Stages

Use `stage: stable` for current production behavior, `stage: beta` for behavior creators or staff can preview, and `stage: alpha` for developer-only or experimental work.

Inline tags are available:

```md
<beta>
This appears in beta and alpha documentation mode.
</beta>

<alpha>
This appears only in alpha documentation mode.
</alpha>
```

If a feature is not implemented, do not document it as available. Put design notes in `docs/decisions` or an alpha-only page.

## Style

- Use active voice.
- Put prerequisites before steps.
- Put warnings before the action that creates risk.
- Prefer short sections with descriptive headings.
- Use code fences for commands and payloads.
- Use `example.invalid`, fake IDs, and fake keys in examples.
- Avoid repeating the same concept across pages. Link by title when another page owns the detail.
- Keep terms consistent: creator, asset, version, scope, supporter tier, store integration, Discord integration, outbox job.

## Diagrams and readable guides

Choose a visual because it explains a relationship, a decision or a consequence.
Do not turn an ordinary ordered list into a tall flowchart, repeat the introduction
in a diagram, or put the same generic visual on every page. Prefer an example the
reader can reason about over a decorative diagram quota.

Use fenced `mermaid` blocks for meaningful branching, state or system relationships;
the backend generates and caches transparent PNGs automatically. Include `accTitle`
and a single-line `accDescr`.
Do not commit generated images or put Mermaid configuration directives in pages.
Keep the core customer task short and move creator, admin and developer details to
linked, audience-specific guides. See `docs/reference/documentation-diagrams.md`
for rendering limits, runtime prerequisites and validation.

Use short, explicitly fictional scenarios where they clarify a real product rule.
Name the surprising distinction, show a concrete example, and give the reader a
useful next action. Match the tone to the subject: privacy and payment problems
need calm precision. Link to verified primary provider guides at the point where
they help. Do not invent customer testimonials, product capabilities or prices.

The website supports bounded `orbiters` example fences, captions and annotated
product artwork. See `docs/development/09-editorial-experiences.md` for the format,
available examples, fallback requirements and visual review checklist. Essential
instructions must remain readable without interacting with an example.

## Required Frontmatter

Each website-visible Markdown page under `docs/` needs:

```md
---
title: Clear page title
section: Navigation section
order: 100
audience: public
stage: stable
id: orbiters.domain.unique-name
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-07-12
---
```

Use explicit `slug:` only when the filename cannot produce the desired URL slug.

`id` is a permanent lookup key. Do not reuse or rename it when a page moves. `domain`
identifies the product area; `type` uses the Diataxis-oriented values `tutorial`,
`how-to`, `reference`, `explanation`, `decision`, `runbook`, or `invariant`.
`owner` names the team responsible for accuracy. Update `lastVerified` only after
checking the page against current behavior.

Run `node scripts/validate-docs.js` before submitting documentation changes. The
validator rejects missing metadata, duplicate IDs or slugs, unknown audience/stage/
domain/type values, broken relative Markdown links, malformed visibility blocks,
and placeholder markers.

## Tool screenshot galleries

Each tool page on the website (`/refit`, `/my-avatar`, `/my-custom-base`, `/logger`) ends with a gallery of real Unity
screenshots read from `media/tools/<tool>/`. The tool agent that changes a tool's visible behavior keeps its gallery
current in the same change, like the tool's pages under `docs/`. A tool with no folder shows no gallery.

```text
media/tools/<tool>/gallery.json      ordered manifest (tool: refit, myavatar, mcb, logger, unitgit, xraygizmos, toolkit)
media/tools/<tool>/<kebab-name>.webp  the screenshots it lists, nothing else
```

`gallery.json`:

```json
{
  "schema": 1,
  "tool": "refit",
  "screenshots": [
    {
      "file": "clothing-picker.webp",
      "caption": "Pick the clothing to fit from the avatar’s list, the Hierarchy or a dropped prefab",
      "alt": "ReFit window in Unity: an empty preview stage on the left and the avatar’s clothing list on the right.",
      "window": "ReFit",
      "feature": "Clothing picker",
      "toolVersion": "0.5.9",
      "capturedAt": "2026-10-13",
      "translations": {
        "ja": { "caption": "…", "alt": "…" },
        "fr": { "caption": "…", "alt": "…" },
        "es": { "caption": "…", "alt": "…" },
        "pt-BR": { "caption": "…", "alt": "…" }
      }
    }
  ]
}
```

- The array order is the display order: put the most telling shot first.
- `caption`: one short English line (120 characters max) saying what the reader learns, not the window title.
  `alt`: what is visible, for someone who cannot see it (300 max). `window`: the Unity window title as written in
  Unity. `feature`: the feature shown. `toolVersion`: the package version you captured. `capturedAt`: YYYY-MM-DD.
- `stage` is optional and works like page stages: omit it for behavior in the released tool, `beta` or `alpha` for a
  feature only in that channel. The website shows stable shots unless the page URL carries `?stage=beta|alpha`.
- `translations` is optional per language; a missing caption or alt falls back to English. Translate with
  `frontend/src/i18n/GLOSSARY.md` of the Orbiters repository (fr uses tu and NBSP before `:`; Unity window and button
  names stay in English; ja uses Unity's Japanese editor names such as インスペクター).
- At most 24 screenshots per tool; each WebP at most 600 KB, longest edge 1920 px, shortest edge 240 px.

When you update a tool:

1. Capture with Orbiters Toolkit's `orbiters_editor_window` MCP tool only (see the next section): never desktop
   screenshots. Captures land in `<Unity project>/Library/OrbitersToolkit/Screenshots`, which is disposable.
2. Choose meaningful states: a realistic avatar or asset, the feature doing its job, results rather than empty forms.
   Skip loading, error, debug and blank states unless the shot explains them. Keep private data out of frame: tokens,
   emails, license keys, personal folder paths in focus, other people's unreleased work.
3. Convert each capture (run `npm install` in this repository once; it installs `sharp` for Windows and Linux):

   ```bash
   node scripts/gallery/import-screenshot.js --tool refit --name clothing-picker --source "<project>/Library/OrbitersToolkit/Screenshots/ReFitWizard-20261013-130438-190-<id>.png"
   ```

   It fits the image within 1920 px, picks lossless or lossy WebP (whichever keeps text sharp at the smaller size),
   enforces the size cap and prints the `window` and `capturedAt` it read from the capture name. It refuses to replace
   an existing file unless you pass `--overwrite`.
4. Replace outdated shots instead of piling up new ones: overwrite the file when the same view changed, or delete the
   old WebP and its manifest entry when the view no longer exists. Update the caption, alt text, translations,
   `toolVersion` and `capturedAt` of every shot you replace.
5. Run `node scripts/validate-docs.js`. It rejects missing or orphan files, oversized or animated images, unknown
   fields, overlong text, bad dates or versions and more than 24 entries, and warns about shots older than 180 days.

## Looking at Unity editor windows

When a Unity editor with a working MCP for Unity bridge is involved, look at its windows only through Orbiters
Toolkit's `orbiters_editor_window` MCP tool (skill `orbiters-toolkit`; call it with `execute_custom_tool` when the typed
tool lacks a parameter). It captures in the background without bringing Unity forward or changing the user's layout,
tabs, scrolling or selection: shown windows, inactive docked tabs, windows that are not open (`window_type` +
`open_if_missing`), long windows (`width`/`height`/`scroll_to`) and any object's Inspector without selecting it
(`inspect`). Never ask the user to open, focus or scroll a window for a screenshot, and never use desktop screenshots,
window-capture APIs or mouse/keyboard input on Unity to look at it. If a capture fails, fix the tool.
