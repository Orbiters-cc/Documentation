---
title: Customizable parts and variants
section: Creator Tools
order: 69
audience: public, creator, dev
stage: alpha
id: orbiters.myavatar.customizable-parts
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-26
relations: orbiters.myavatar.item-settings, orbiters.myavatar.publish-to-gallery, orbiters.tools.myavatar-asset-gallery
---

# Customizable parts and variants

A creator can mark parts of a My Avatar asset as customizable: the colours and pictures
of a menu, the model of a companion, the language of its texts. Anyone who has the asset
can then pick a **variant** of each part, or make one and share it. Each part has its own
small gallery in My Avatar, with the creator's own variants first.

A variant is data only: values, texts, pictures and, for a model, one FBX file and its
textures. It never contains scripts, prefabs, materials or shaders, so applying one never
runs anything in your project. N4N0 is the first asset with parts: its menu theme, its bot
model and its translations.

## Customize an item

1. Put the item on your avatar, then open its card under **On this avatar** in My Avatar.
2. The **Customize** section lists the item's parts. Each row shows the variant the item
   uses now, with its picture and name. An item uses the creator's first variant until
   you pick another.
3. Choose **Browse** on a row to open that part's gallery.

Your choice is kept in your project, not on the item, and stays when the item updates
from the gallery.

## Browse a part's gallery

The gallery shows each variant with its picture, name and author. The creator's own
variants come first and are marked **By the creator**. You can:

- search by name, description or author;
- sort by **Popular** (most downloaded) or **New**;
- for translations, show only one language.

Click a variant to apply it. My Avatar downloads it, checks it again (see
[What a variant may contain](#what-a-variant-may-contain)), and changes the item in your
scene. **Undo** brings the previous variant back.

You can download the variants of an asset you can download yourself: one you bought or
added with a license key, a free one, or one your supporter tier or Discord role includes.

## Make your own variant

Choose **+** in a part's gallery. The form depends on the part:

- **Values** (a theme, for example): colour pickers, numbers within their range, choices,
  and picture fields that say the size they need.
- **Texts** (a translation): a table with each text's key, the original text, your text
  and its longest allowed length, and the language you write in.
- **Model**: the FBX file, then for each material a shader from the list the creator
  allows, its colours, numbers and textures. The form checks the model while you edit:
  its triangles, the blendshapes the item's animations need, its size and its texture sizes.

Give the variant a name and an optional description. The item shows the variant live
while you edit, and My Avatar makes its picture from that preview: the item with the
variant applied, the menu page in that language and theme, or the model turning.

Then confirm that you made the variant or have the right to share it, and choose
**Post**. Orbiters checks the variant again before it joins the gallery and says which
rule it breaks when it refuses one. You can post up to 30 variants an hour.

A variant cannot use the name of one of the creator's own variants of that part, and the
same files cannot be posted twice.

### Withdraw or remove a variant

You can withdraw your own variants from their gallery. The asset's creator and Orbiters
staff can remove any variant of the asset. A withdrawn or removed variant is no longer
offered or downloadable; items that already use it keep it.

## What a variant may contain

A variant is a ZIP file with `variant.json`, which describes it, `thumbnail.png`, its
picture, and the files `variant.json` names:

| Part | Other files allowed |
| --- | --- |
| Values | the PNG or JPEG pictures its values name |
| Texts | none |
| Model | one `.fbx` file and the PNG or JPEG textures its materials name |

Nothing else is accepted: no folders, no scripts, no `.mat`, `.shader` or `.prefab`
files, no file the variant does not name. Materials are described as values (a shader
from the creator's list, colours, numbers, textures), and My Avatar makes them itself.

| Limit | Value |
| --- | --- |
| ZIP file | 16 MB, at most 48 MB once expanded |
| Files | at most 24, with names of letters, digits, spaces, dots, dashes and underscores (64 characters at most) |
| `thumbnail.png` | a 512 × 512 PNG picture |
| Pictures | PNG or JPEG, the exact size the field gives, or at most 2048 pixels a side |
| Textures | PNG or JPEG, at most the part's largest texture size |
| FBX file | 12 MB, binary or ASCII |
| `variant.json` | 256 KB |
| Name | 60 characters |
| Description | 500 characters |
| Texts | each at most its allowed length |

Why so strict: a variant comes from another member and lands in your Unity project.
Keeping it to data that My Avatar reads, with every file named and checked (pictures are
decoded, the FBX file must be one, sizes are bounded), means a variant can change how
the item looks and reads, and nothing more. My Avatar checks a variant before posting
it and again before applying a downloaded one; Orbiters checks it when it is posted.

## For creators: declare your item's parts

### Before you start

- Set up the item as a prefab, like for
  [item settings](myavatar-item-settings.md).
- Decide what may change. A part changes the item only: its materials, its meshes, or the
  pictures an Orbiters renderer draws for it. It never changes the wearer's avatar.

### 1. Create the parts file

The parts live in a JSON file named like the prefab, with `.parts.json`, in the same
folder: `N4N0.prefab` gets `N4N0.parts.json`. A file with one part looks like this:

```json
{
    "schema": 1,
    "parts": [
        {
            "key": "theme",
            "label": "Menu theme",
            "description": "Colours and look of the menu.",
            "kind": "values",
            "fields": [
                { "key": "style", "label": "Style", "type": "choice", "options": ["modern", "retro"], "default": "modern" },
                { "key": "accent", "label": "Accent", "type": "color", "default": "#00DA6D" },
                { "key": "glow", "label": "Glow", "type": "number", "min": 0, "max": 2, "default": 1 },
                { "key": "wallpaper", "label": "Wallpaper", "type": "picture", "width": 1024, "height": 576, "optional": true }
            ],
            "targets": [{ "field": "accent", "path": "Shown/Head/Screen", "property": "_Accent" }],
            "base": [
                { "name": "Modern", "file": "Parts/theme-modern.json" },
                { "name": "Retro", "file": "Parts/theme-retro.json" }
            ]
        }
    ]
}
```

Each part has a `key` that identifies it for good: variants belong to a part by its key,
so keep it from one version to the next.

### 2. Choose a kind for each part

There are three kinds, and only these three.

**Values** are named fields: a colour (`#RRGGBB` or `#RRGGBBAA`), a number between `min`
and `max`, a choice among `options`, a switch (`toggle`) or a picture (PNG or JPEG, of
the exact `width` and `height` when you give them, and `optional` when an item works
without it). `targets` put values on the item's materials: a colour or a number on a
shader property, a picture as a texture. A values part without targets only feeds its
renderer.

**Model** replaces the meshes and materials of some of the item's renderers. Each slot
names one or more objects that take the same model, such as the PC and phone versions of
the same body. A model variant brings one FBX file and its textures, and describes its
materials with a shader from your `shaders` list. List in `blendshapes` the shapes your
animations drive: a variant's mesh must have them. `maxTriangles`, `maxTextureSize` and
`maxRadius` (in the slot's own units; your model fits a radius of 1) keep variants
within what your item can carry.

```json
{
    "key": "model", "label": "Bot model", "kind": "model",
    "slots": [{ "key": "body", "label": "Body", "paths": ["Shown/Body", "Mobile/Body"] }],
    "blendshapes": ["Happy", "Blink", "Talk"],
    "maxTriangles": 3000, "maxTextureSize": 1024, "maxRadius": 1.2,
    "shaders": ["VRChat/Mobile/Standard Lite", "VRChat/Mobile/Toon Lit"],
    "base": [{ "name": "Original", "file": "Parts/model-original.json" }]
}
```

**Texts** (`"kind": "strings"`) are texts by key, such as a menu's words. `strings` names
the base file: every key with its text in your language, and optionally the longest text
a variant may give (`max`; twice the base text's length when you give none). A variant
gives every key a text and says its language. Texts reach the item only through a
renderer.

```json
{
    "key": "translation", "label": "Language", "kind": "strings",
    "strings": "Parts/strings-en.json", "renderer": "orbiters-n4n0-menu",
    "base": [
        { "name": "English", "language": "en", "file": "Parts/strings-en.json" },
        { "name": "Français", "language": "fr", "file": "Parts/strings-fr.json" }
    ]
}
```

The base strings file:

```json
{
    "schema": 1,
    "language": "en",
    "strings": {
        "home.title": { "text": "N4N0 menu", "max": 24 },
        "home.music": "Music"
    }
}
```

### Renderers

A renderer is a program that turns the current choices of every part naming it into the
item's pictures. Only Orbiters' own renderers exist, and your own code never runs on a
wearer's computer:

| Renderer | What it draws |
| --- | --- |
| `orbiters-n4n0-menu` | N4N0's menu pages in the item's theme and language, with Orbiters - N4N0 installed on the wearer's computer |

A new renderer comes with an Orbiters release. Values parts can use targets instead,
which need no renderer.

### Base variants

`base` lists the variants you ship inside the asset; their files are in your package.
They show first in each part's gallery, marked **By the creator**, and an item uses the
first one until its wearer picks another. Strings base variants also give their
`language`.

When you publish a version, the publishing window posts your base variants as your
official variants. Publishing a later version posts them again: a base variant with the
same name replaces the previous one, so keep the names of your base variants.

### 3. Publish

Publish as usual; see
[Publish clothes and accessories to the My Avatar gallery](publish-to-myavatar-gallery.md).
The publishing window sends the parts file with the version. Orbiters checks the file
against the rules below and refuses the version, saying why, when the file is wrong or
when one of the version's packages lacks the parts file or a file it names.

The parts of an asset are those of its latest published version that a member can see.
Variants stay attached to their part's key: a part you remove takes its gallery away,
and a part whose kind changes no longer shows the variants made for the old kind.

## Reference

### The file

| Field | Meaning |
| --- | --- |
| `schema` | `1`. |
| `parts` | 1 to 16 parts, in the order the card shows them. |

### A part

| Field | Meaning |
| --- | --- |
| `key` | 1 to 32 lowercase letters, digits or dashes, unique in the file. Kept across versions. |
| `label` | The name on the card, at most 60 characters. |
| `description` | Optional, at most 500 characters. |
| `kind` | `values`, `model` or `strings`. |
| `renderer` | An Orbiters renderer. Required for `strings`, not allowed for `model`; a `values` part needs targets, a renderer or both. |
| `base` | Up to 16 base variants: `name` (unique in the part, at most 60 characters), `file`, and `language` for `strings` only. |

### Values fields

| Field | Meaning |
| --- | --- |
| `key` | Letters, digits, dots, dashes or underscores, at most 64, unique in the part: `accent`, `colors.accent`. |
| `label` | At most 60 characters. |
| `type` | `color`, `number`, `choice`, `toggle` or `picture`. |
| `default` | Required, except for pictures: a colour, a number between `min` and `max`, one of the `options`, or `true`/`false`. |
| `min`, `max` | For numbers. |
| `options` | For choices: 2 to 32 different values of at most 40 characters. |
| `width`, `height` | For pictures, together, 1 to 2048 pixels. |
| `optional` | For pictures: `true` when a variant may leave it out. |

A part has 1 to 32 fields and up to 64 targets. A target has `field` (a colour, number or
picture field), `path` (an object below the item's root), an optional material `slot`
(0 to 31) and the shader `property` it sets.

### Model parts

| Field | Meaning |
| --- | --- |
| `slots` | 1 to 8 slots: `key` (like a part's key), `label`, and 1 to 8 object `paths`. |
| `blendshapes` | Up to 64 shape names a variant's mesh must have. |
| `maxTriangles` | 1 to 100000. |
| `maxTextureSize` | 16 to 4096 pixels. |
| `maxRadius` | Above 0, at most 100. |
| `shaders` | 1 to 16 shader names a variant's materials may use. |

### Strings parts

| Field | Meaning |
| --- | --- |
| `strings` | The base strings file: 1 to 2000 texts with keys like field keys, each at most 2000 characters, with an optional `max` up to 4000. |

### Paths

- **Objects** are paths below the prefab's root, as the Hierarchy shows them, with `/`
  between levels. An empty path, or `.`, is the root itself.
- **Files** are JSON files of your package: paths from the parts file's folder, such as
  `Parts/theme-modern.json` or `../Shared/theme.json`, a full `Assets/…` path, or `guid:`
  followed by the file's GUID.

### A variant's `variant.json`

My Avatar writes this file for you. For reference:

```json
{
    "schema": 1,
    "part": "theme",
    "name": "Midnight",
    "description": "Deep blue with a gold accent.",
    "values": { "style": "modern", "accent": "#FFC247", "glow": 1.2, "wallpaper": "wallpaper.png" }
}
```

A texts variant has `language` and `strings` (`{ "home.title": "Menu de N4N0" }`)
instead of `values`; a model variant has `model`:

```json
{
    "mesh": "model.fbx",
    "slots": {
        "body": {
            "object": "Body",
            "materials": [
                { "shader": "VRChat/Mobile/Standard Lite", "colors": { "_Color": "#1A1A1C" },
                  "floats": { "_Glossiness": 0.45 }, "textures": { "_MainTex": "body.png" } }
            ]
        }
    }
}
```

A variant has only the block of its part's kind, gives a value for every field (except
optional pictures), a text for every key and a model for every slot, and nothing the part
does not have.
