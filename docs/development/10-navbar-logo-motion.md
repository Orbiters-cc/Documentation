---
title: Navbar logo motion
section: Development
order: 110
audience: dev
stage: alpha
id: orbiters.development.navbar-logo-motion
domain: website
type: reference
owner: orbiters-docs
lastVerified: 2026-09-09
---

# Navbar logo motion

The frontend implements the Gremlin Takeover reveal on the small navbar mark. This page describes the local implementation; deployment is a separate release step.

The reveal plays once per browser document. Following website links, opening menus, signing in without a full document navigation, and using in-app Back/Forward do not restart it. Even if the navbar remounts, it shows the static mark. Browser reload creates a new document and plays the reveal again. A new tab or another full document load also starts a new reveal.

The animation settles on the normal logo after 4.2 seconds. Only the eye at the viewer's right winks. Reduced-motion preferences load the static asset immediately; enabling reduced motion during playback also stops the animation. The animation adds no interaction and does not change the home link's accessible name.

## Implementation

`NavbarLogo.jsx` owns a module-lifetime playback claim, with an instance ref to handle React StrictMode's effect replay. No local storage, session storage, cookies, router keys, or pathname-dependent animation state are used. The animated SVG plays once and holds its last frame. Subsequent mounts use the matching static SVG; a failed animation request also falls back to it.

The mark retains its 34px width. Transparent padding around the artwork extends beyond its layout box to leave room for the entrance, colored echoes, and motion. The assets live in `frontend/src/assets/brand/` and receive build-generated filenames.

## Verification

Four focused component regressions pass: initial playback in StrictMode with route transitions and Back, remount suppression, new-document playback, reduced-motion asset selection, and the static error fallback. The production frontend build passes. Headless Chromium checks against that build confirm that navigation and Back preserve the image element, reload restarts playback, and reduced motion remains static. Desktop (1280px) and mobile (390px) layouts were visually reviewed. External requests were blocked during these checks; backend integrations and deployment were outside this validation.
