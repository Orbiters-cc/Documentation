---
title: MCB Banner Effect
section: Reference
order: 148
audience: dev
stage: alpha
id: orbiters.mcb.banner-effect
domain: mcb
type: reference
owner: orbiters-mcb
lastVerified: 2026-10-01
relations: orbiters.tools.mcb-operating-contract
---

# MCB Banner Effect

The backend applies one effect to every MCB banner: the lower third blurs
progressively and fades into the MCB panel colour so the author row MCB draws over
it stays readable. Banners from MCB in Unity, from the website **MCB banner** tile
and from custom bases published with the website editor all go through
`writeAssetImageFile` in `backend/src/services/mcbAssetMediaService.js`. The
Photoshoot preview in Unity draws the same effect locally; this page is the
contract both sides follow.

## Version 1 parameters

The backend constant is `BANNER_EFFECT_V1` in
`backend/src/services/media/bannerEffect.js`.

| Parameter | Value | Meaning |
| --- | --- | --- |
| `version` | `1` | Stored in `Assets.mcbBannerEffectVersion`. |
| `width` × `height` | `1600` × `900` | Output size. The upload is resized to cover it, centred, after EXIF rotation. |
| `startHeight` | `1/3` | Fraction of the height, measured from the bottom edge, that the effect covers: rows 600 to 899. |
| `maxBlurSigma` | `37.4` | Gaussian sigma in output pixels at the bottom edge. |
| `blurLevels` | `6` | Blurred copies, copy k using sigma `37.4 × k / 6`. |
| `tint` | `#303030` | Colour the bottom edge fades to. |
| `strength` | `1` | Tint opacity reached at the bottom edge. |
| `webpQuality` | `85` | The banner File is WebP; a lossless PNG variant is stored next to it. |

## Per-pixel definition

For pixel row `y` (0 at the top) of an image of height `H`:

```text
t      = clamp(((y + 0.5) / H - (1 - startHeight)) / startHeight, 0, 1)
p      = t * t * (3 - 2 * t)                       // smoothstep
sigma  = maxBlurSigma * p
colour = lerp(gaussianBlur(source, sigma), tint, strength * p)
alpha  = source alpha
```

- Rows where `t` is 0 keep the resized source pixels exactly.
- Blur, blending and tint run in linear light, as in a linear-colour Unity project.
  `tint` is an sRGB colour converted to linear before blending.
- The backend approximates the continuous sigma with the blurred copies: a row
  blends the two copies whose sigma surrounds `sigma`; copy 0 is the source.
- The blur is libvips `gaussblur` as used by sharp: a Gaussian truncated where it
  drops below 20 % of its peak, about 1.79 sigma from the centre, applied to RGB
  only and extending edge pixels.

## Matching the Photoshoot preview

`PhotoshootBannerEffect.shader` in `orbiters.toolkit` uses the same lower third,
smoothstep progress and `#303030` overlay at full opacity, with
`_MaxBlurTexels = 48` on the 1600 × 900 capture. Its 24-tap kernel (taps at 0.35,
0.85 and 1.55 of the radius) has a standard deviation of 0.778 times the radius,
which gives `maxBlurSigma` 37.4. Measured against a CPU emulation of the shader on
real captures, the backend output differs by 1.3 to 1.9 levels out of 255 on
average in the lower third and is identical above it. The shader's sparse taps
leave faint streaks that the Gaussian does not; a shader that samples a Gaussian
with `sigma = 37.4 × p` texels matches the backend more closely.

Upload the raw capture. A banner that already carries the effect is blurred a
second time.

## Storage

| Column or field | Content |
| --- | --- |
| `Assets.mcbBanner` | Processed banner: public File, WebP with a `png` variant. Its metadata holds `effectVersion`, `originalFileId` and, for website page banners, `sourceFileId`. |
| `Assets.mcbBannerOriginal` | The upload as received: private File under `uploads/assets/<assetId>/mcb-banner/original/`. |
| `Assets.mcbBannerEffectVersion` | `1` for processed banners. `NULL` for banners uploaded before the backend effect: Unity had already applied it, so they are never reprocessed. |

`POST /mcb/assets/:assetId/media` and `POST /mcb/assets/custom-base` return the
processed banner as `asset.mcbBanner`, an absolute PNG URL, together with
`asset.mcbBannerEffectVersion`. `GET /assets/:id/mcb-banner` serves the processed
banner; add `format=png` for the PNG variant.

## Change the effect

1. Add `BANNER_EFFECT_V2` with the next `version` and point
   `CURRENT_BANNER_EFFECT` at it. Never change the numbers of a released version.
2. Update this page and the Photoshoot shader together.
3. With the backend deployed, run `node src/scripts/regenerateMcbBanners.js --dry-run`,
   then without `--dry-run`. Only assets with a stored original whose banner was
   made from that original are rebuilt. `--asset <id>` limits the run and `--force`
   also rebuilds banners already on the current version.
