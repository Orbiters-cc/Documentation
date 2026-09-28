---
title: Configure AI models, prompts and usage
section: Operations
order: 140
audience: admin, dev
stage: beta
id: orbiters.operations.ai-models-prompts
domain: website
type: how-to
owner: orbiters-platform
lastVerified: 2026-09-28
---

# Configure AI models, prompts and usage

This guide describes the implemented administration screens. Application release and
live provider validation remain separate from publishing this documentation.

## Connect a provider

In **Admin â†’ API Keys**, create a global key for the current environment: **Gemini**,
**DeepSeek**, or **Z.ai (GLM)**. Creator-owned keys are not used for website AI.
All three provider forms are restricted to administrators and save global keys
automatically. After saving, reopen **AI** to refresh availability in Models and
Playground. A key must be active and belong to the current environment. If an
earlier Gemini key was saved as personal, an administrator must change its scope
to global before website AI can use it.
Open **Admin â†’ AI â†’ Models** to inspect the seeded models or register a provider's
model ID. Initial options are Gemini Flash Lite, DeepSeek V4.1 Flash
(`deepseek-flash`), GLM-5.3 and image-capable GLM-5.3-Flash.

Check provider capabilities before changing **Model supports image input**.
Declaring support does not add it to a text-only model. Model identity cannot
change in place because historical requests must retain their meaning. Add a new
model for a different provider/model ID. Configured limits and disabled models
survive application restarts.

## Choose defaults and feature prompts

1. Open **Features & usage** and choose **Website default**.
2. Expand a feature to keep that default or choose its own model.
3. Read the default pre-prompt, supplied input description and mandatory data
   handling rules. Enable **Use a custom pre-prompt** to replace the editable instruction.
4. Save AI settings. New requests use saved routing; an existing playground
   conversation keeps its chosen model and prompt snapshot.

The registry covers the admin playground, MCB version metadata, asset draft
auto-fill and community self-promotion. Image features require an image-capable
model. Move their overrides first if choosing a text-only website default.
Switching off a custom prompt restores the built-in instruction. Required output
schemas, validation, private drafting and the rule against inventing missing
listing facts remain enforced regardless of custom wording.

Each feature has a **Model reasoning** switch. Off skips or reduces the model's
thinking step: answers arrive faster and use fewer output tokens, but complex
decisions may be less reliable. On keeps the model's default thinking. For Gemini,
Off sends the lowest thinking setting the model supports:

- Gemini 3 and later use a thinking level. Off uses `minimal` where the model
  accepts it. Gemini 3 Pro, 3.1 Pro, 3.7 Flash and 3.8 Flash cannot go below `low`,
  so their thinking is reduced, not switched off. Unrecognized newer models also get `low`.
- Gemini 2.5 models use a thinking budget. Off sets 0 on Flash models; 2.5 Pro
  cannot go below its 128-token minimum.
- Earlier Gemini models do not think, so the switch has no effect.

When reasoning is off and the feature's model cannot switch it off, the feature
shows a note under the switch that Off uses the model's lowest reasoning level.

**Image limits** sets the maximum image edge and count for imports. Oversized images
are proportionally reduced; smaller images are not enlarged. This bounds input
size but does not guarantee a fixed token cost across providers.

## Investigate requests

**Features & usage** totals retained history by feature and model, including earlier
Gemini requests. It reports request/error counts and provider-reported input,
output, cached-input and total tokens. Missing or malformed historical usage is
unavailable rather than invented. These are token totals, not billing estimates.

The token graph in **Features & usage** plots daily provider-reported totals by
model over 30 days, 90 days or one year. Filter it by feature and by user; the
user picker is ordered by each user's reported total. All-users totals retain
unattributed usage after account deletion; deleted users do not appear in the
picker. The graph includes provider-reported usage from both successful and failed responses in the selected period and shows
how many lack provider token counts. It does not estimate missing usage or cost.

**History** filters by feature, model and initiating user ID. Select a session to
see its initiator and the pre-prompt used for each request. Another administrator
continuing a playground session has their user ID recorded on that request.
Self-promotion records the actual Discord post author; someone without an Orbiters
account appears by Discord ID. Feature histories are read-only; use **Playground**
for new tests.

Only administrator playground conversations retain request and response text in AI history, including malformed or truncated answers. Every other feature, including AutoFill, stores placeholders instead of source text and model answers, alongside instructions, selected image IDs, usage and safe diagnostics. Creators can inspect those records for their own draft; authorized AI administrators can inspect history. Records written before this rule keep their existing content. Provider credentials and private model reasoning are not stored in these diagnostic records.

AutoFill streams model output and reports received tokens to the draft editor. Counts marked as estimates use streamed character length until provider usage is available. DeepSeek extraction disables thinking mode to avoid spending its output budget on reasoning for structured field extraction. DeepSeek AutoFill uses a minimum 32,768-token output budget; higher administrator settings take priority. One submission makes at most three provider calls. A DeepSeek `length` finish is retried at once with a 65,536-token budget. Connection failures, provider 408/429/5xx responses, streams that end early and responses that fail the output format are retried after 1.5 and then 4 seconds; a format retry adds a reminder of the required JSON schema to the prompt. Truncation that the larger budget cannot fix, unsupported images, AI disabled for the account and missing provider keys are not retried. Retries stop when the draft is published or a newer AutoFill replaces the job. Every attempt is billed by the provider and recorded in history, with combined live token feedback and the attempt number in the draft's progress. Sources are consumed when queued and are not reused by later submissions. A retry within that submission uses the same selected inputs. The maximum request duration defaults to 180 seconds per attempt and remains bounded by `AI_REQUEST_TIMEOUT_MS` when configured. In **Models → Maximum output tokens**, DeepSeek settings support up to 393,216; other providers keep their existing limits.
AutoFill requests use structured JSON output for Gemini and JSON mode for DeepSeek and Z.ai, followed by local schema validation. DeepSeek extraction uses the AutoFill minimum budget described above; other operations keep their configured limits. Valid fields are applied to the private draft as soon as extraction finishes; edits made while extraction runs are not overwritten. The creator still reviews the draft before publishing. The default prompt interprets bare dollar prices as USD unless contradicted and maps ordered commission price ranges to slider options. Invalid or unsupported fields are not applied; a response with no applicable fields shows a warning.
Asset extraction normalizes presentation text before schema validation: null text
becomes blank or absent, string lists become lines, and ambiguous non-text values
are omitted with review warnings. Numeric fields, IDs, enums and the response
envelope remain strict. The required prompt contract explains required empty
strings and source-provided duration units even when an administrator has saved a
custom pre-prompt.

Sticker extraction returns independent `stickerOptions` lists and creates one
variant per finish. Sizes, copies per design and design counts remain selectable
options; they are never expanded into a Cartesian product of variants. Seven
designs at quantity 200 means 1400 copies. The supplied price range is converted into
an editable price curve (start price per size and up to eight curve points) with
a +25% surcharge for holographic/glitter and none for glossy/matte. When no valid
curve reproduces the range, the listing keeps the two-price interpolation over
printed area × total copies × finish weight. The backend computes prices and
validates selections; the browser uses the same formulas with parity regressions. Captured request snapshots contain the resolved dimensions and price.
Draft warnings identify estimates; missing price evidence stays missing.
No automatic single-starter fallback remains. The required contract prioritizes
complete useful information, including when an administrator has saved a custom
pre-prompt. Editable production defaults still fill missing vinyl/material, border,
preview thickness and confirmation wording. Supplied facts and seller/legal details
are not overwritten. Existing sticker configuration remains untouched when no
sticker information is returned.

Account export includes attributable retained interactions. Account closure removes
personal content and attribution while preserving anonymous usage totals; an answer
arriving after erasure cannot restore the removed content.

Provider references: [DeepSeek JSON output](https://api-docs.deepseek.com/guides/json_mode/),
[DeepSeek request limits](https://api-docs.deepseek.com/api/create-chat-completion/),
[Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output),
[Z.ai structured output](https://docs.z.ai/guides/capabilities/struct-output).
