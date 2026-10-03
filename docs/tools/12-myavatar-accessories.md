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
lastVerified: 2026-10-03
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
hand (left, right or both hands), My Avatar asks which one you want. Other variants of the
same item prefer VRCFury over manual setup, and PC over Quest or Android.

In My Avatar 0.8.2, a drop containing different items shows a picture and **Add** button
for each item. **Add both** or **Add all** installs them together; **Done** dismisses
the remaining choices. Items named as extras or add-ons are offered alongside the main
item. AI assistance can simplify their names, while the item choice stays yours.

If the same prefab is already worn, My Avatar offers replacement or another copy. An
existing copy added by hand can be taken over instead of duplicated. Clothing from a
different body can be resized and aligned to matching armature bones; **Cancel** restores
the transforms that still match the fit, preserving subsequent manual edits.

## Clothing while posing

The local Clothing preview update follows the anatomical bone matches used to fit
installed garments and accessories. This includes fitted items with a creator's
VRCFury setup whose arm names differ from the target avatar. Enabling **Posing >
Clothing** preserves the fitted pose; later avatar bone edits carry the item along.
Hood strings and other unmatched extra bones inherit their matched parents.
Clothing also follows edits from tools that do not emit Undo property notifications. The preview refreshes rendered skinning matrices so the visible mesh follows its bones. Switching Clothing off restores the item transforms and renderer settings. The creator's build components
remain intact in the editable scene. On the play/upload copy, fitted anatomical
links replace a recursive creator link that would realign those same bones. This
keeps sleeves attached when the garment and avatar use different bone names or
extra chest bones. The fitted position, rotation and size stay intact; clothing
toggles and unrelated creator features remain available. This fix is local and
unreleased. Play Mode was checked with the Fishing Outfit on UltiPaw, at 0% and
100% muscles and in a crouch. Small waist and shoulder intersections still need
pose-specific garment refinement.

## Pose fitting and texture controls

The local update also fits clothing when its pose differs but its size already
matches. Matched bones rotate toward the corresponding limb segments, so a
T-pose sleeve follows a lowered arm while retaining the clothing rig's bone axes.
Unmatched extra bones follow their parents. This armature fit does not reshape
cloth around a different body; use ReFit when the garment still needs body fitting.
**Cancel** restores the fitted transforms unless you edited them afterward.

Each installed item's card lists its assigned **Textures**, grouped by material,
with the shader slot, texture name and thumbnail. Collapse the list when you do
not need it. **Remove** beside a map clears that slot on this item only. The
original material and image stay intact, and Unity **Undo** restores the assignment.
Removing a Standard shader emission map also turns off its emission color and
keyword, so the material stops glowing. Other shader-specific effects may have
separate controls in their material Inspector.

## Repairing imported materials

The local, unreleased update detects missing or unsupported shaders and embedded
model materials whose solid white emission hides their color texture. On a new
drop, My Avatar rebuilds those materials with **VRChat/Mobile/Toon Standard**
before matching the supplied textures. Existing affected items show **Repair
material** on their card. The VRChat SDK must provide that shader; otherwise the
card explains what is missing.

Repair keeps compatible texture maps, tiling and offsets, enables the Toon shader's
normal-map features, and clears the broken import's white emission. It creates a
material copy for that item: source assets and other items sharing them remain
unchanged. Unity **Undo** restores the original assignment. Authored materials
with intentional glow are not classified as broken just because they are bright.
Toon Standard is opaque; effects requiring transparency or a custom shader still
need their creator's material setup.

When clothing and its texture folder are dropped together, automatic matching
fills missing primary maps while preserving textures already assigned by the
creator or material repair. Optional color variants and decal patterns cannot
replace an existing base-color map, become emission, or fill an extra detail layer
through a local or AI guess. To apply a variant deliberately, drop the texture on
its own or choose its material slot manually. Previously confirmed choices remain
available. This protection is part of the local, unreleased update.

## When the fit question appears

On a recognized custom base with an available original base, an armature-fitted
item still gets the fit question even when no nearby custom blendshape is missing.
Matching bone placement and size does not establish a surface fit. Choose whether
it already fits or needs ReFit. Explicit creator metadata for this custom base,
an existing ReFit result and a previously dismissed question remain respected.
The proximity check measures the worn mesh at its actual scale.

## Reviewing a completed refit

The local, unreleased update keeps **Ask a creator** and **Cancel refit** in the
item's card after ReFit finishes. You can ask for a commission even when ReFit
reported no warning: inspect the result from several sides and try your body
sliders before deciding. The actions remain available after closing the Inspector
or reloading Unity because the completed fit is recorded on the clothing.

**Ask a creator** opens ReFit's commission preparation window with the fitted
clothing. It does not send a commission automatically. **Cancel refit** restores
the clothing mesh and pose from before ReFit and asks about fitting again. It is
separate from the armature-alignment **Cancel** action.

## Coverage for clothing from another base

The local, unreleased update requests additional coverage repair for pants,
shorts, trousers, hoodies, jackets, shirts and underwear when recorded armature
fitting changed the rig dimensions, or creator metadata identifies the original
base. A different pose or placement alone does not trigger it. Recognition checks
the garment objects and meshes inside an outfit pack as well as a standalone
item's name. Bundled props do not opt in just because a neighboring mesh is clothing.

After normal ReFit, the pass expands clipped fabric and spreads its movement
through neighboring vertices. It checks both cloth vertices and triangle
interiors, lets cuffs and waistbands expand with the surrounding fabric, and
relaxes folded triangles without pulling their outward movement back into the
body. Small closed details retain their shape; the head region stays outside
this body-clothing pass. Small open fabric panels can still deform; they are not
treated as rigid buttons just because they are separate pieces. Source meshes,
topology and skin weights are preserved.

For a cross-base garment skinned to both thighs, fitting with the existing
armature uses a temporary star stance on hidden copies. This separates the inner
thigh surfaces while the crotch is fitted. The generated movement is converted
back into the clothing's original pose; the scene avatar's stance is not changed.

Recognized outer layers, such as a jacket over a shirt, are fitted after the
inner garments. Their coverage checks include those fitted inner surfaces and
their body blendshapes, so expanding the shirt does not simply push it through
the jacket. Each transferred shape preserves the achieved base clearance instead
of repeating the same base repair in every additive shape. Cached results include
the inner garments' meshes and poses.

Inspect the result with the poses and body shapes you use. Coverage has movement
and geometry limits, and complex layering or very different garment construction
can still need a creator's adjustments. Existing generated meshes are not
rewritten automatically; refit them again or restore and re-add the clothing.
These changes are local and have not been published as package releases.

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
