---
title: VPM Package Contract
section: General knowledge
order: 40
audience: creator, dev
stage: stable
id: orbiters.general.vpm-package-contract
domain: general
type: reference
owner: orbiters-docs
lastVerified: 2026-07-12
relations: orbiters.general.vrchat-runtime-contract
---

# VPM Package Contract

A distributable VPM package needs valid Unity package metadata plus a direct
archive URL and author identity. Keep `name`, `displayName`, `version`, `url`,
`author.name`, and `author.email` present in release metadata.

## Dependency Rules

- Declare VRChat package dependencies in `vpmDependencies`.
- Use compatibility-line ranges such as `3.5.x` when depending on public SDK APIs;
  VRChat SDK versions are not strict SemVer.
- Put `zipSHA256` in repository listings, not the package's local `package.json`.
- Keep old released versions in the listing so source-controlled projects can
  resolve their recorded dependency state.

## Package Layout

- Code referencing `UnityEditor` belongs in an Editor assembly.
- Runtime assemblies must not depend on Editor assemblies.
- Use assembly definition files and package-safe asset lookup. Do not hardcode an
  `Assets/MyPackage` installation path.
- Use `legacyFolders`, `legacyFiles`, or `legacyPackages` only for deliberate
  migrations from known old installations.

Validate the package manifest, archive contents, dependency ranges, and repository
listing before publishing. A valid local folder does not prove the downloadable
archive contains the same package.
