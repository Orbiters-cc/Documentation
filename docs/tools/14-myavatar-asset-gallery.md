---
title: Add clothes and accessories from the My Avatar asset gallery
section: Tools
order: 195
audience: public, creator, dev
stage: alpha
id: orbiters.tools.myavatar-asset-gallery
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-05
relations: orbiters.tools.myavatar-accessories, orbiters.myavatar.publish-to-gallery
---

# Add clothes and accessories from the My Avatar asset gallery

The **Asset gallery** in My Avatar lists clothes and accessories that Orbiters creators
published for Unity. It shows what fits your avatar, and **Add** downloads the asset and
puts it on the avatar in one click.

**Release status:** local development implementation (My Avatar 0.9.0, Orbiters
Toolkit 0.3.12 and the matching Orbiters backend). These changes have not been published
or deployed. This guide does not announce a release.

## Before you start

- Select an avatar with the **My Avatar** component.
- Sign in to Orbiters at the top of My Avatar to see what your account can add. Without
  an account the gallery still lists assets, but **Add** needs a signed-in account.
- **Clothes and accessories** is on by default from My Avatar 0.9.0. The gallery entry
  appears on the main page under the avatar results.

## Find what fits your avatar

Open **Asset gallery** from the main page. The gallery recognises the avatar's base in
this order: the base you chose, the custom base or original base reported by MCB or
ReFit, the model fingerprint, then project paths and names. The **Avatar base** field
shows what was recognised; choose another base there when it is wrong. Your choice is
remembered for this avatar.

Each card says what you can do:

| Card | Meaning |
| --- | --- |
| **Add** | Free, owned or included: download and put it on this avatar. |
| **Buy · price** | Paid and not owned yet. |
| **Included with your …** | Your supporter tier, a Discord role or tester access gives it to you. You do not buy it. |
| **Installed** / **Update** | On this avatar, or a newer version exists. |
| **Other platform** / **Other bases** | No package for the platform the project builds for, or only for other avatar bases. **More info** lists them. |

The platform is the one in **File > Build Settings**. A creator can publish the same
version number for PC and for Quest with different packages; the gallery picks the one
for your platform and, when the creator made one, the package for your avatar base.

**More info** shows the description, versions with their changes, the setups a
package offers (for example VRCFury or Modular Avatar), the packages it needs and its
parameter cost.

## Buy an asset

**Buy** lists every store selling the asset. The creator's preferred store is first and
marked as the one that supports them best; every other store stays available.

1. Choose a store. Its page opens in your browser.
2. Finish your purchase there. In Unity, the button turns into a license key field.
3. Orbiters adds the purchase to your library on its own when the store reports a sale
   to the email address on your Orbiters account, your Gumroad emails or your linked
   Jinxxy account. While the store sheet is open, the gallery checks every 8 seconds.
4. If the purchase is not recognised, paste the license key from the store receipt.

You can also use **Add a license key** at the top of the gallery for anything you
bought elsewhere, like the license field of the Assets page on the website. When a key
cannot be identified automatically, pick the creator who sold it.

## What happens when you press Add

My Avatar checks before it changes anything:

- **Parameters**: the asset's synced parameters must fit with the avatar's in VRChat's
  256-bit budget.
- **Platform**: the package must exist for the platform the project builds for.
- **Packages it needs**: missing VPM packages are listed with the complete plan of what
  would be installed or upgraded, conflicts included. Nothing is installed until you
  confirm. VRChat SDK packages and tools the asset does not need are never upgraded
  silently. Packages come from repositories Orbiters approved for gallery dependencies,
  or from repositories already added to your own VPM settings.
- **Code**: a package with scripts from a creator who is not trusted lists the code and
  waits for your answer.
- **Replaced files**: when the import would overwrite files already in your project,
  the gallery lists them first with **OK** and **Cancel**.

The download is kept in the project's `Library` folder, outside `Assets`, and checked
against the checksum Orbiters recorded. The package is then imported, the declared
prefabs are attached like a dropped accessory (see
[Add accessories and clothes with My Avatar](12-myavatar-accessories.md)), and the
avatar is checked again. The card says **Installed** only after that last check.

### Interruptions, retries and cancelling

Each step is recorded in the project's `Library` folder. After a script reload, a crash
or reopening the project, My Avatar checks the avatar again and continues from the last
completed step. **Retry** never adds a second copy of the same asset.

Unity's importer cannot be interrupted: **Cancel** during an import stops once Unity
finishes it, and says so. A cancelled installation tells you whether its files were
imported but nothing was added to the avatar; **Cleanup** can remove those files.

An installation is not atomic. Unity **Undo** takes the attachment off the avatar in the
scene; imported project files stay until you clean them up.

## Update or remove

Gallery items show their version in **Clothes and accessories**. **Update** installs the
newer version and removes the old one once the new one is verified.

**Remove** takes the item off the avatar and keeps its imported files, so another avatar
or scene that uses them is not broken.

## Clean up unused gallery files

Open **Orbiters Settings > My Avatar · Asset gallery files > Cleanup…**, or **Cleanup
unused gallery files…** at the bottom of the gallery. The window
scans the whole project and every open scene, then shows how much space can be freed.

A file is kept, with the reason, when it is:

- used by an installed gallery asset, another avatar, a scene, a prefab or any other
  project asset;
- modified since the gallery installed it;
- in the project before the gallery imported it;
- owned by a package (VPM) or another tool, or a script.

When usage cannot be determined, the file stays. **Clean up** moves files to a
quarantine in the project's `Library` folder rather than deleting them. **Earlier
cleanups** lists each quarantine with **Restore**, which puts the files back, and
**Delete for good**, which asks before deleting.

<audience include="dev">
Installation stages, the receipt stored on `OrbitersAttachment` and the server routes are
listed in [My Avatar gallery API and installation contract](../reference/myavatar-gallery-api.md).
</audience>
