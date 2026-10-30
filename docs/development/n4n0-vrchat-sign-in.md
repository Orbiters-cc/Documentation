---
title: N4N0 VRChat sign-in eligibility
section: Development
audience: dev, admin
stage: beta
id: orbiters.development.n4n0-vrchat-sign-in
---

# N4N0 VRChat sign-in eligibility

Settings shows **VRChat account** when the member is signed into Orbiters and the current server grants `n4n0-vrchat-login`. The member then signs into VRChat in that card and completes any two-factor challenge.

The desktop uses its browser-paired Orbiters tool credential to read `GET /features/mine?names=n4n0-vrchat-login`. This endpoint accepts the shared authentication service's tool credentials and browser JWTs; feature administration remains outside the tool credential route allowance. Feature access still follows the member's server-side rank and user rules.

Earlier endpoint authentication accepted browser JWTs only, rejecting desktop credentials before checking eligibility and hiding the card even for an allowed member. The server fix requires no desktop update. Failed desktop eligibility checks retry after one minute; a successful denial is cached for three hours, so restart N4N0 after changing an access rule to check immediately. Check access on the same environment selected in N4N0.
