---
title: Sync avatar edits from Blender
section: Tools
order: 45
audience: creator, dev
stage: alpha
id: orbiters.how-to.mcb-blender-sync
domain: mcb
type: how-to
owner: mcb-maintainers
lastVerified: 2026-09-23
---

# Sync avatar edits from Blender

Use the MCB Blender connector to edit a creator avatar and preview the exported meshes in Unity. This page describes the updated connector under local validation; it does not imply that an installed released package already contains the fix.

## Connect and edit

1. Open the Unity scene containing the intended avatar and select its custom base in MCB creator tools.
2. Choose **Modify with Blender** to prepare and open the linked Blender project.
3. Edit the body in Blender and use its **Sync** export action for the intended mesh.
4. Return to Unity and wait for the export result. Save the Unity scene when you want to keep the preview.

If connecting an already open Blender project, use **Sync with Unity MCB** in Blender and **Sync with Blender** in Unity. Reconnecting the same avatar retains its session and renderer mappings, including the linked project export folder when one was established by **Modify with Blender**.

Saving the `.blend` file preserves the Blender project. Unity's **Import .blend** progress alone does not confirm that MCB applied the exported body. Check the connector's export result and the avatar in the scene.

## Understand the status

The Unity connection label updates while the panel is open:

- **waiting for Blender**: the session has not received a heartbeat.
- **connected**: Blender's heartbeat file was updated within the last four seconds.
- **disconnected**: the last heartbeat is older than four seconds. A long Blender operation can temporarily cause this state.

Connected describes the link. The export result separately reports whether meshes were applied or an import failed.

## Advanced mesh previews

With the advanced Blender link enabled, each export is converted into persistent native mesh assets and applied to the mapped avatar renderers. Unity temporarily imports the exported FBX for conversion, then removes that temporary import. The preview retains its own mesh assets after that cleanup.

The original target FBX remains unchanged. MCB also retains the external export for creator submission. Repeated exports update the preview; earlier generated mesh assets remain available for Undo and existing scene references. Syncing a preview does not publish a version.

## Choose which models belong in a version

A row with no custom FBX, external Blender FBX, or custom Avatar is unchanged and is skipped by **Build Version**. Use **Use original** to clear all three assignments for that model. This excludes its changes from the version; it does not delete the Blender export file.

A full Blender export can populate several model rows even when you intended to change only the body. Leave the body export assigned and choose **Use original** on unchanged accessory rows. A populated external path counts as a supplied replacement; an empty imported-FBX field does not cancel it.

MCB matches incoming exports to the target FBX path and preserves those associations when detection or asset selection reorders the source list. A supplied replacement still needs the mapped skinned meshes and skin bindings. A static hair export is not a valid replacement for a skinned hair renderer: exclude it when unchanged, or correct its Blender export when intentionally modified.

An empty optional Avatar field stays empty during packaging; **Build Version** does not generate an Avatar replacement automatically.

## Optional Avatar definition

**Custom Base Avatar (Transformed, Optional)** is required if you modified the armature. For mesh-only changes, leave this field empty to keep using the original FBX Avatar definition.

**Generate** accepts either an imported custom FBX or the existing **External Blender FBX** export. The generated humanoid Avatar is saved as a separate Unity asset and assigned to the avatar's Animator. **Update** refreshes that generated asset while preserving its reference. A manually assigned original Avatar definition is not overwritten.

For an external Blender export, **Apply** assigns the selected Avatar definition to the scene Animator without replacing the original FBX or its imported Avatar definition. The external FBX is imported temporarily for generation; the saved Avatar remains valid after that temporary import is removed.

## If the body does not update

Keep the intended avatar scene open, reconnect the two tools, and export the body again. Read any MCB sync error in the Unity Console. Missing renderer mappings or unresolved skin bones must be corrected before applying the export; MCB reports those failures rather than claiming an unchanged avatar was updated.

See [MCB and Unity Tools](08-mcb-and-unity-tools.md) for the creator and version workflow.
