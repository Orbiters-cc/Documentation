---
title: Read Unity's logs with the Mixer console
section: Tools
order: 232
audience: public, creator, dev
stage: alpha
id: orbiters.tools.mixer-console
domain: mixer
type: how-to
owner: orbiters-engineering
lastVerified: 2026-10-24
relations: orbiters.tools.mixer-console-timings, orbiters.tools.mixer-git-get-started
---

# Read Unity's logs with the Mixer console

The **Mixer console** replaces Unity's Console. It shows every log of the editor session grouped, searchable and explained,
says where each one comes from (VRChat SDK, VRCFury, MCB, ReFit, Unity, the compiler…), and since which commit a
message keeps coming back.

**Release status:** part of Mixer 0.2.0, which is not released yet.

## Get started

1. Install **Mixer** from the Orbiters VPM repository: the Mixer console comes with it.
2. Open **Tools › Orbiters › Mixer console** (Ctrl+Alt+L) and dock it where the Console was.

It shows everything logged since Unity started, also what was logged before it was installed. Its code depends on
nothing, so it keeps working while other packages fail to compile.

## Find what matters

- **Levels**: the error, warning and log pills show or hide each level. Alt+click shows only one.
- **Search** (Ctrl+F): text anywhere in the message. **Aa** matches case, **.\*** reads a regular expression, the stack
  button searches stack traces too.
- **Sources**: show or hide where logs come from, or **Only** one of them.
- **Groups / List**: one row per message with how many times it happened and when (the default, newest first), or every
  log in time order.
- **Timeline**: every visible log over the session, with Play Mode, compile and reload marks, and your Mixer Git commits
  and releases. Click to jump there, drag to keep only that time range.

## Understand a message

Select a log to see its details on the right:

- the full message and its stack trace, with links to each file and line;
- **an explanation** when the Mixer console knows the message: what it means, whether it matters and how to fix it. A bulb on
  the row marks the messages it knows;
- how often it happens, as a chart over the session;
- **Appearing since**, for a message that keeps coming back: the commit the project was at when it was first seen, its
  subject, when that was and how many commits ago. Click the hash to copy it. The Mixer console keeps the first and last time
  of each message across editor sessions and clears, and reads the commit from Git's own history of the project, so
  no Git command runs.

### Where explanations come from

The Mixer console ships about 300 explanations for the messages of a typical VRChat creator project. Between releases it
also downloads the latest list from Orbiters every few hours; members signed in through Orbiters Toolkit get the
entries reserved for members too. Turn this off in the settings (**Explanations from Orbiters**) to use only the ones
the package ships. Other tools can add their own explanations (see the package README).

## Timings

Script reloads, entering Play Mode and avatar builds and uploads become logs with what each package took. See
[See what slows Unity down with Mixer console timings](33-mixer-console-timings.md).

## Undo history timeline (beta)

Off by default: turn on **Undo history timeline** under **Beta** in the settings. A strip under the activity chart
shows Unity's undo steps like a video's progress bar: one tick per step (selections smaller), the steps already done
filled, the playhead where the project is.

- **Hover** a step for a small picture of the Scene view right after it, its name and when it happened.
- **Click or drag** to go there: the Mixer console undoes or redoes one step at a time until the project is as it was right
  after that step.
- **Scroll** over the strip for one step back or forward.

The picture is taken once the step is done: when nothing has been recorded for a moment and no drag is going on. It
comes from the Scene view window, or from its camera when another tab hides it. Steps made before the timeline was
turned on have no picture. The last 600 pictures are kept; they survive script reloads but not a Unity restart.

## Settings

The sliders button opens the settings: Unity's console options (Clear on Play, Build and Recompile, Error Pause), group
similar messages, compact rows, monospace font, how many logs to keep, the timings, the explanations from Orbiters and
the beta undo timeline.
