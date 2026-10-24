---
title: Give your asset settings on its My Avatar card
section: Creator Tools
order: 68
audience: public, creator, dev
stage: stable
id: orbiters.myavatar.item-settings
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-24
relations: orbiters.myavatar.publish-to-gallery, orbiters.tools.myavatar-asset-gallery
---

# Give your asset settings on its My Avatar card

When a buyer puts your clothing or accessory on their avatar, My Avatar shows it under
**On this avatar** with a card. Item settings add a small menu to that card, like the one
N4N0 has: switches and choices the buyer sets before uploading, such as a hood on or off,
a long or short version, a colour or a slimmer fit. You describe them in one file beside
your prefab. Nothing runs in the buyer's project: My Avatar changes the item in their scene,
with Undo, and reads the current choice back from the item.

## Before you start

- Set up the item as a prefab in your project.
- Give each part that a setting changes its own object, material slot or blendshape. A
  setting can only change the item itself, never the buyer's avatar.
- Use Orbiters Toolkit 0.4.4 and My Avatar 0.9.14 or later, so you can test the settings.

## 1. Create the settings file

The settings live in a JSON file named like the prefab, with `.settings.json`, in the same
folder: `Jacket.prefab` gets `Jacket.settings.json`.

In the **Publish to the gallery** window, each prefab of a package has **Add settings**. It
creates the file beside the prefab with a first switch for the prefab's first child, then
opens it. Once the file exists, the button reads **Edit settings**. You can also create the
file yourself in any text editor.

## 2. Describe the settings

A first file looks like this. It gives the jacket a switch for its hood:

```json
{
    "schema": 1,
    "settings": [
        {
            "label": "Hood",
            "type": "toggle",
            "on": { "show": ["Hood"] }
        }
    ]
}
```

`Hood` is the hood's object below the prefab's root. When the buyer turns the switch off,
My Avatar hides the hood, because the off position hides what the on position shows.

### A choice between versions

A choice shows one option at a time. Each option lists what it shows; what another option
shows is hidden:

```json
{
    "label": "Length",
    "type": "choice",
    "choices": [
        { "label": "Long", "show": ["Coat Long"] },
        { "label": "Short", "show": ["Coat Short"], "picture": "Pictures/short.png" }
    ]
}
```

A `picture` appears on the card under the choice, and changes while the buyer points at
another option. Small PNG pictures work best, for example 256 × 144.

### Colours and fits

An option can also put a material in a renderer's slot and set blendshapes:

```json
{
    "label": "Colour",
    "type": "choice",
    "choices": [
        { "label": "Red", "materials": [{ "renderer": "Jacket", "slot": 0, "material": "Materials/Red.mat" }] },
        { "label": "Blue", "materials": [{ "renderer": "Jacket", "slot": 0, "material": "Materials/Blue.mat" }] }
    ]
},
{
    "label": "Fit",
    "type": "choice",
    "choices": [
        { "label": "Regular", "blendshapes": [{ "renderer": "Jacket", "name": "Slim", "weight": 0 }] },
        { "label": "Slim", "blendshapes": [{ "renderer": "Jacket", "name": "Slim", "weight": 100 }] }
    ]
}
```

Put the settings one after another in the `settings` list, separated by commas.

## 3. Test them

Choose **Build package**: the report lists the settings it found, and says what is wrong
with the file, for example an object that does not exist or a material that cannot be found.
A package with problems in its settings cannot be published until they are fixed.

Then choose **Test on** to install the built package on your avatar as a buyer would. The
item's card under **On this avatar** shows your settings: try each one and check the
result in the Scene view.

## 4. Publish

Publish as usual; see
[Publish clothes and accessories to the My Avatar gallery](publish-to-myavatar-gallery.md).
The package takes the settings file and the materials and pictures it names, even those the
prefab does not use yet, and declares the Orbiters Toolkit version that reads settings, so
buyers' My Avatar installs it with your package. When you publish a package from a
`.unitypackage`, put the settings file in it beside the prefab yourself. My Avatar takes it as
written: build the package from the prefabs in your project once to have the file checked.

Keep the labels of your settings and options the same from one version to the next: when a
buyer updates the item, My Avatar finds each setting by its label and keeps what they chose.

## Reference

### The file

| Field | Meaning |
| --- | --- |
| `schema` | `1`. |
| `settings` | The settings, in the order the card shows them. |

### A setting

| Field | Meaning |
| --- | --- |
| `label` | The name on the card. Unique in the file, and kept across versions. |
| `type` | `toggle` for a switch, `choice` for a choice between options. |
| `tooltip` | Optional text shown when the buyer points at the setting. |
| `on`, `off` | For a switch: what it does when on, and when off. `off` can be left out. |
| `choices` | For a choice: two or more options. A few options read best on the card. |

### An option

| Field | Meaning |
| --- | --- |
| `label` | The option's name. For a choice, unique within the setting. A switch's options are named On and Off. |
| `tooltip` | Optional text for the option. |
| `show` | Objects to show. The setting's other options hide them. |
| `hide` | Objects to hide as well. |
| `materials` | Material changes: `renderer` (an object with a renderer), `slot` (its material slot, from 0) and `material`. |
| `blendshapes` | Blendshape values: `renderer` (an object with a skinned mesh), `name` and `weight` (0 to 100). |
| `picture` | Optional picture of the option, shown on the card. |

### Paths

- **Objects** are paths below the prefab's root, as the Hierarchy shows them, with `/`
  between levels: `Hood`, `Coat/Hood`. An empty path, or `.`, is the root itself.
- **Assets** (materials and pictures) are paths from the settings file's folder, such as
  `Materials/Red.mat` or `../Shared/Red.mat`. A full `Assets/…` path or `guid:` followed by
  the asset's GUID also works.

### Good to know

- My Avatar reads the current choice from the item. If the buyer changes a part by hand so
  that no option matches, the choice shows no option until they pick one.
- Use settings on parts that no VRCFury toggle of your prefab animates: in VRChat, a toggle's
  animation decides how its parts look, whatever the setting left.
- Avoid blendshapes the avatar's body also has: My Avatar lets the body's shapes drive
  same-named shapes on clothing, which would override the setting.
