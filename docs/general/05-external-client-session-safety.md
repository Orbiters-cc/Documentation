---
title: External Client Session Safety
section: General knowledge
order: 50
audience: creator, dev
stage: stable
id: orbiters.general.external-client-session-safety
domain: general
type: invariant
owner: orbiters-docs
lastVerified: 2026-07-12
relations: orbiters.general.vrchat-runtime-contract
---

# External Client Session Safety

VRChat API and OSC integrations must preserve user sessions and local configuration
instead of repeatedly recreating or overwriting them.

## API Sessions

- Reuse the cookie-based session. Repeated username/password authentication creates
  additional sessions and can hit undocumented limits or temporary blocks.
- Capture a newly issued `auth` cookie immediately and store session material as a
  secret.
- Model email OTP, TOTP, and recovery-code verification as explicit states. Never
  retry a two-factor code in a loop.
- Redact cookies, Basic authorization values, passwords, and two-factor codes from
  logs.
- Ask for credentials only after a stored session is missing or has been verified
  invalid.

## OSC Runtime

- Prefer OSCQuery discovery. Use `--osc=inPort:outIP:outPort` only when the user
  deliberately configures fixed endpoints.
- Treat `%UserProfile%\AppData\LocalLow\VRChat\VRChat\OSC\` as user data.
- Do not overwrite generated avatar OSC configuration unless the user explicitly
  asks for that change.
- Document that the standard launch-option workflow is not available on standalone
  Quest.
