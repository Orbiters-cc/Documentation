---
title: Publish clothes and accessories to the My Avatar gallery
section: Creator Tools
order: 67
audience: creator, admin, dev
stage: alpha
id: orbiters.myavatar.publish-to-gallery
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-09
relations: orbiters.tools.myavatar-asset-gallery, orbiters.how-to.connect-store-integrations
---

# Publish clothes and accessories to the My Avatar gallery

Creators publish clothes and accessories to the My Avatar asset gallery from Unity, or
from the asset's settings on the website (see [Publish from the website](#publish-from-the-website)).
Buyers then add them to their avatar in one click; see
[Add clothes and accessories from the My Avatar asset gallery](../tools/14-myavatar-asset-gallery.md)
for what buyers see.

**Release status:** local development implementation (My Avatar 0.9.0, Orbiters
Toolkit 0.3.12 and the matching Orbiters backend). These changes have not been published
or deployed. This guide does not announce a release.

## Before you start

- Your Orbiters account has creator tools turned on, and you are signed in at the top
  of My Avatar.
- To sell the asset, connect your stores in **Creator > Integrations** on the website,
  so license keys and purchases add the asset to the buyer's library. See
  [Connect Store Integrations](05-connect-store-integrations.md).
- Have the item set up in your project as a prefab, or as a `.unitypackage` you exported.

Open **Asset gallery** in My Avatar and choose **Publish** or **Publish an asset**. The
form opens in its own **Publish to the gallery** window, so you can select prefabs and
other objects in the project while you fill it in. What you enter is kept across script
reloads until you publish. The form has four steps.

## 1. Asset

Choose one of your existing clothing or accessory assets, or **New asset** with a name,
type (**Accessory** or **Clothing**), descriptions, price and store pages. The price is
shown in the gallery; buyers pay in your store.

**Preferred store** is the store buyers see first, marked as the one that supports you
best (usually the one leaving you the best split). It is your default for every asset;
the website has the same setting under **Creator > Integrations**.

## 2. Version

Each upload belongs to a version, such as `1.0.0`, with an optional title and **What
changed**. **Who gets it** works like MCB versions:

- **Public**: everyone with access to the asset.
- **Beta** and **Alpha**: only testers you add by username, and staff.

A published version keeps its number. Publish a new version to change a package.

## 3. Packages

A version holds one package per platform or avatar base that needs its own setup. A PC
package and a Quest package can share the same version number.

For each package:

- **From**: prefabs in this project, or a `.unitypackage` file.
- **Platforms**: PC, Android (Quest) or iOS.
- **Avatar bases**: **Any avatar**, or **Specific bases** registered on Orbiters.
  Buyers on another base see the asset as made for other bases.
- **Setups**: the prefabs to place, for example a VRCFury and a Modular Avatar variant.
  Buyers choose a setup when there are several. Each prefab attaches automatically,
  with its own setup, by merging armatures, or following one bone.

**Build package** prepares the upload and reports its size, parameter cost, the
packages it needs and whether it contains code. It leaves out:

- **Poiyomi Pro** shaders. Pro is paid: switch the materials to the free Poiyomi Toon
  before publishing, because buyers may not own Pro.
- Source files such as `.blend`, `.spp` and `.psd`. Export textures as PNG to include
  them.
- VPM packages and anything under `Packages/`. They become declared dependencies
  that My Avatar installs for the buyer instead.

A package can be at most 300 MB. A package with scripts is marked **Contains code**:
buyers are asked before it is imported, unless Orbiters marked you a trusted creator.

**Test on** installs the built package on the avatar you have selected, the same way
a buyer would, so you can check the result before publishing.

## 4. Pictures

<alpha>

With My Avatar 0.9.4 and Orbiters Toolkit 0.3.16 (not released yet), put the asset on your avatar and take its
pictures here:

- The step shows the **gallery card** buyers will see, with your name and price.
- **Take pictures** opens the photoshoot on the avatar this window was opened from. The card follows the live camera,
  and you can frame the avatar right on it. Each **Capture** adds a picture: the first goes on the card, the next ones
  open on the asset's page (on the website and in My Avatar's details).
- **Create ref sheet**, under the buttons, shows the avatar wearing it from the front, the back and the side on one
  1920×1080 sheet; each capture adds the sheet to the page's pictures.
- **Add a picture file…** adds a PNG or JPEG of your own (a wide one goes to the page, not the card).
- In the strip, click a picture to put it on the card; hover one to save a copy or remove it.
- For an asset already on Orbiters, the new pictures go before its current ones, or replace them with **Replace its
  current previews**. Without new pictures, the asset keeps its own.

Pictures are optional: a new asset without one gets a picture of its first prefab, as before. They are sent when you
publish, up to eight page pictures at a time.

</alpha>

## 5. Publish

Confirm that you own the rights to everything the version distributes, or have
permission to share it. Publishing is refused without this confirmation. **Also
publish its listing on Orbiters** makes the asset page public on the website too; leave
it off to keep the listing private.

Uploads are checked again by Orbiters: the package must be a readable Unity package that
writes only inside `Assets` and `Packages`, and it must contain the prefabs its setups
declare.

<alpha>

Orbiters also holds every upload, from Unity or the website, to the rules of **Build package**: it refuses a package
with source files (`.blend`, `.spp`, `.psd`…), with Poiyomi Pro shader files, or without a prefab under `Assets`. Files
under `Packages` are never imported; an upload that does not declare its dependencies gets one for each package they
belong to. Orbiters cannot tell from the files alone which shader a material uses: switch Poiyomi Pro and locked
materials before exporting a package by hand.

</alpha>

## After publishing

- The asset appears in the gallery for buyers whose platform and base it fits. Your own
  drafts are visible only to you.
- To fix a mistake, publish a new version. To take a version out of the gallery, open
  your asset's **More info**: each of your published versions has **Withdraw**, which
  asks once more before acting. A withdrawn version leaves the gallery; copies already
  installed keep working.

## Publish from the website

<alpha>

The asset's settings on the website (`/assets/<id>/config`) have a **My Avatar** tab that does what the Unity window
does, without Unity. It is there for accessories and clothing, and for products, textures and other assets that can
join the gallery.

1. **Add to the gallery**: choose **Accessory** or **Clothing**. Switch between the two at any time. The tab lists what
   the gallery still needs: a published public version with a package, a published asset page, and a visible asset.
2. **New version**: its number (the next one after your latest release is proposed), title, **What changed** and
   **Who gets it**, as in step 2 above.
3. **Add a package** to the draft: name it, tick its platforms and avatar bases, then drop or choose the
   `.unitypackage` (up to 300 MB). It uploads at once.
4. Open the package's **Settings**. Orbiters proposes one setup placing the outermost prefab of the package,
   attached automatically, and lists the VPM packages it needs. Add setups, place other prefabs of the package, choose
   how each attaches (**Automatic**, **Its own setup**, **Merge armature** or **Follow a bone**), adjust the package
   versions and enter its **Parameter memory**, then **Save settings**. Settings stay open until the version is
   published.
5. Confirm that you own the rights to everything the version distributes and choose **Publish**. When the asset page
   is not published yet, **Also publish the asset page on Orbiters** publishes it along with the version.

The website cannot try a package on an avatar or measure its parameter memory: My Avatar does both in Unity. To try a
package from the website, publish it as a **Beta** or **Alpha** version first: only you, your testers and staff get it.

**Card** shows the gallery card buyers see. Its name, descriptions, thumbnail and price are the asset page's: **Edit
name and descriptions** opens the asset editor.

**Withdraw** takes one published version out of the gallery and **Publish again** brings it back. **Remove from the
gallery** withdraws every published version at once. Copies already installed keep working.

</alpha>

## Publish with an AI assistant (MCP)

With MCP for Unity connected, an assistant can prepare and publish through the
`myavatar_gallery` tool. It edits the same draft as the window, so you can watch and
correct it there:

1. `inspect` shows the draft, the avatars in the scene and the Orbiters server it
   publishes to.
2. `configure` fills in the asset, version and packages (prefabs by their project path).
3. `build` packages them with the same rules as the window; `test` installs one on an
   avatar of your scene.
4. `preview_publish` returns a summary, the rights statement and a single-use code. The
   assistant must show them to you; it can only publish with `confirm_publish` and that
   code once you agree. Withdrawing a version works the same way.

<audience include="admin, dev">
My Avatar installs the packages a gallery asset depends on from repositories admins
approved in **Known VPM**, or from repositories the buyer already added to their own VPM
settings. A creator's own Orbiters VPM listing is not approved automatically. See [Approve VPM dependency sources for the My Avatar gallery](../operations/known-vpm-dependency-sources.md).
</audience>
