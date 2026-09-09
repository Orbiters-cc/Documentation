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

## MCB Resolver Dependency

<alpha>
MCB's local package manifest now declares `com.vrchat.core.vpm-resolver` with
the range `>=0.1.29 <0.2.0`. Its dependency installer uses the library supplied
by this package, so the resolver must be installed in the Unity project; the
VCC desktop application does not need to be installed or running.

When this manifest is published, VPM-compatible managers such as VCC and ALCOM
can resolve the dependency while installing MCB. Copying the MCB folder manually
does not install its dependencies. For an existing project missing the resolver,
install **VRChat Package Resolver Tool** through the package manager before
opening MCB, since the missing library prevents its Editor code from compiling.
This declaration is implemented locally and has not yet been released.
</alpha>

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
