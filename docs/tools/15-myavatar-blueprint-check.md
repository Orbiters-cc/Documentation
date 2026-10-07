---
title: Avoid uploading over another account's avatar with the blueprint ID check
section: Tools
order: 196
audience: public, creator, dev
stage: alpha
id: orbiters.tools.myavatar-blueprint-check
domain: myavatar
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-07
relations: orbiters.tools.myavatar-thumbnail
---

# Avoid uploading over another account's avatar with the blueprint ID check

An avatar's **blueprint ID** (on its Pipeline Manager) tells VRChat which avatar an upload updates. A prefab often
still carries its creator's ID: Build & Publish then builds and uploads the whole avatar, and only VRChat's server
refuses it at the end, because the avatar belongs to another account. My Avatar checks the ID before the build
starts.

**Release status:** My Avatar 0.9.3 with the matching Orbiters server, not released yet.

## What happens

1. Press **Build & Publish** in the VRChat SDK panel as usual.
2. Before anything is built, My Avatar asks Orbiters who owns the avatar with that blueprint ID.
3. If it belongs to another VRChat account, the build stops and a window says so:
   - **Clear the blueprint ID** empties it, so the avatar uploads as a new avatar of yours. The window then offers
     **Show the SDK panel**, and **Put the ID back** if you change your mind.
   - **Keep it** leaves the ID as it is (the build stays stopped).

The avatar shown in the SDK panel is checked in the background while you look at it, so the check usually answers at
once. **Build & Test** is never stopped: it doesn't upload.

## Before you start

- Sign in to Orbiters in Orbiters Toolkit, with your VRChat account linked to your Orbiters account.
- The check compares the owner with the account signed in to the VRChat SDK panel, or with your linked VRChat account
  when the SDK isn't signed in.

## When the check can't answer

If Orbiters can't be reached, you aren't signed in, or the answer takes more than a few seconds, the build goes on as
usual: the check never blocks an upload it can't confirm. A blueprint ID VRChat doesn't know (a deleted avatar) is not
stopped either; VRChat makes a new avatar.

<audience include="dev">
The editor asks `GET /vrchat/avatars/:avatarId/owner` (signed in, 30 requests a minute). The server reads the avatar's
author through Orbiters' VRChat service account and caches answers for 10 minutes. The check runs as an
`IVRCSDKBuildRequestedCallback` for Build & Publish only, with a 6 second limit.
</audience>
