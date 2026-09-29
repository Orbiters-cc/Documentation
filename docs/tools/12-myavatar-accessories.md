---
title: Add accessories and clothes with My Avatar
section: Tools
order: 193
audience: public, creator, dev
stage: alpha
id: orbiters.tools.myavatar-accessories
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-09-29
---

# Add accessories and clothes with My Avatar

**Accessories and clothes** is an alpha feature of the My Avatar component. Turn it on
per user in **Orbiters Settings > Features**; it adds a second drop field below the
texture field. Drop a clothing or accessory package on it and My Avatar places it on
your avatar and attaches it without changing the avatar or the package. For textures,
see [Change avatar textures with My Avatar](09-myavatar-textures.md).

## What you can drop

- A `.unitypackage` or `.zip` of the accessory, a `.prefab`, or an `.fbx` model.
- Images that come with it. They go through the same matching as the texture field.
- `.txt` documentation such as a README. Text files next to the dropped files are read
  too; they are only used as context when AI assistance is on.

You can drop several files together, such as the package and its README.

## How an accessory is attached

A package that is already set up with VRCFury is only placed under your avatar root:
its own VRCFury components do the rest at build.

Other packages are attached non-destructively:

- When every clothing bone has an avatar bone of exactly the same name, My Avatar adds a
  VRCFury **Armature Link**, when VRCFury is installed.
- Otherwise My Avatar links each clothing bone to the matching avatar bone itself. These
  links are applied only on the build copy of the avatar, never on the avatar in your scene.
- A rigid prop without its own armature, such as a hat or a watch, follows one avatar bone.
- With VRCFury installed, each accessory gets an automatic VRCFury toggle in the menu under
  `Accessories/<name>`.
- Blendshapes of the body are copied to clothing blendshapes of the same name, so a
  shrink or body-shape slider also shapes the clothing.
- Supported empty Unity constraints are wired to avatar bones by name. Constraints
  with animated settings remain Unity constraints so their shared clips keep working;
  unsupported constraint kinds remain for manual setup.

Every accessory added by one drop is a single **Undo** step. The accessory list below the
field shows what is installed; **Remove** takes an accessory off the avatar again.

## Builds without VRCFury

In the local, unreleased Toolkit 0.3.1 update, My Avatar attachments also work
without VRCFury. Toolkit places the linked objects under their avatar bones on the
build copy and rewrites private copies of their animation controllers. It adds no
VRChat parent constraints for these links, so they consume no extra constraint
slots. Bone scale follows through the hierarchy. Existing constraints supplied by
an accessory remain part of that accessory.

Original controllers, clips, masks and the avatar in your scene remain unchanged.
Offset frames preserve local motion, and copied parent animation keeps clothing
toggles and animated parent transforms affecting bones moved out of the clothing.
Matching animated body blendshapes also reach moved clothing renderers.

These hierarchy frames still have a transform cost; this is not a guarantee that
an accessory has no effect on avatar performance. A singular or sheared armature
transform stops the build with an explanation. Apply non-uniform armature scale
before retrying. If a nested Animator animates bones moved outside its root, move
those animations into the avatar playable layers first.

## Import warnings and recovery

The same local update inspects all files before importing a drop. A package with
scripts or plugins lists the code and asks for **Import anyway**; **Cancel**, Escape
and closing the warning leave the project unchanged by that drop. Malformed or
ambiguous archives are rejected. Imports are queued across Orbiters tools, including
packages with identical filenames. A script reload retains each avatar's progress
and pending texture/AI follow-up work.

Late AI results do not overwrite a manual bone choice, placement, material-slot
edit, account change or disabled AI preference. Accessory textures stay scoped to
that accessory even when a generated material becomes shared by another renderer.

## Variants

Packages often contain several prefabs of the same accessory. When the variants differ by
hand (left, right or both hands), My Avatar asks which one you want. Other variants are
picked by default: a VRCFury variant over a manual one, and PC over Quest or Android.

## Accessories that need more setup

Some accessories cannot be finished automatically, for example a VRCLens installer or an
object you have to move to the right place. Their row says the accessory **might need
further setup**; **Select** selects the object concerned so you can finish it in the
Inspector. Prefabs made for Modular Avatar prompt you to install Modular Avatar first.

## Orbiters account and AI assistance

My Avatar decides locally whenever it can, and works without an account. When it cannot
decide, for example which variant to use, which avatar bone a rigid prop belongs to,
clothing bones the local matching could not place, or objects that need manual setup, and
AI assistance is on for your account, it asks the configured Orbiters AI provider. The
robot in the corner of the drop field is the same switch as on the texture field and as
**AI-assisted features** in your website account.

The request contains the accessory's name, hierarchy paths inside the accessory,
component type names, the names and hierarchy of your avatar's bones, and up to 12,000
characters of the included `.txt` documentation. No images and no computer paths are
uploaded. The documentation is treated as untrusted text: the answer can only use IDs of
the variants, bones and objects that were sent. Bone links below 80% confidence are
ignored. Orbiters retains request status and usage, but excludes source context and model
output from AI history; provider processing follows that provider's configured data
policy.

<audience include="dev">
The endpoint is `POST /myavatar/accessory-plan` (feature `MYAVATAR_ACCESSORIES`). It
accepts at most 400 avatar bones, 400 accessory bones, 24 candidate prefabs, 80 notable
objects and 6 documentation files of 4,000 characters each (12,000 in total), and returns
`candidate`, `target`, `links`, `setup` and `warnings`. Bones are sent grouped by parent
path to keep the prompt small. The server rejects duplicate or unknown IDs in the request,
drops answers that reference IDs the request did not offer (only bones listed as
unresolved can be linked), drops links below 0.8 confidence, deduplicates links and setup
rows, and caps setup reasons at 160 and warnings at 200 characters. It allows 20 requests
per user per hour and one active request per user. The feature defaults to reasoning off;
Admin → AI → Features can override its model, prompt and reasoning.
</audience>
