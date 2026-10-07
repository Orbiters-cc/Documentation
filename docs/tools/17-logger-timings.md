---
title: See what slows Unity down with Logger timings
section: Tools
order: 201
audience: public, creator, dev
stage: alpha
id: orbiters.tools.logger-timings
domain: logger
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-07
relations: orbiters.tools.logger
---

# See what slows Unity down with Logger timings

The Logger times each **script reload**, each **entry into Play Mode** and each **avatar build and upload**, and shows
what each package took. When a reload suddenly takes twice as long, you see which package started costing more.

**Release status:** Logger 0.2.0, not released yet.

## Read a timing

Each timing is a log under the **Timings** source, such as "Script reload took 6.6 s", "Entered Play Mode in 9.1 s" or
"Built and uploaded Rexouium in 2 min 13 s".

- **In the list**, its row shows the time as a stacked bar, one colour per package and Unity's own part in grey at the
  end. Bars are scaled to the slowest timing of their kind, so rows compare at a glance.
- **In the details**: the total, how it compares with the usual time, each package's share (click one for its parts:
  which startup method, which build step), and the same kind of timing over the session as stacked columns.
- **On the timeline**, a lane has one mark per timing, stacked by package. Click a mark to show its log.

## What is measured

| Timing | From | Parts |
| --- | --- | --- |
| Script reload | Unity's own reload profile | Each type and method that runs on load, each before- and after-reload callback, each window restored, given to the package its code belongs to |
| Entering Play Mode | Leaving Edit Mode to the first frames | Leaving Edit Mode, the script reload by package, each tool's avatar build step (VRCFury runs them on each avatar of the scene), the scene load |
| Avatar build and upload | Build & Publish or Build & Test, to the end of the upload | Each tool's VRChat SDK build step (VRCFury, MCB, My Avatar, ReFit, Orbiters Toolkit, the SDK's own…), the asset bundle, the upload |

Avatar builds and uploads need the VRChat Avatars SDK; the Logger adds its timing there only when the SDK is in the
project.

## Turn timings on or off

All three are on by default. In the Logger's settings, **Timings** has one switch for script reloads, one for Play
Mode and one for avatar builds and uploads.

<audience include="dev">
Script reload parts come from the "Domain Reload Profiling" tree Unity writes to Editor.log after each reload. Unity
lists types and methods only while its `EnableDomainReloadTimings` diagnostic switch is on, so the Logger turns that
switch on while reloads are measured and off when you turn measuring off. Unity then posts a "Diagnostic switches are
active" notice after each reload; the Logger hides it while that switch is the only one on. Builds are timed by probes
placed in front of each group of build steps in the SDK's callback list, without touching the steps themselves.
</audience>
