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
lastVerified: 2026-09-23
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

AutoFill asset imports retain submitted source text, instructions, selected image IDs and model answers in AI history, including malformed or truncated answers. Creators can inspect their own draft's request and response; authorized AI administrators can inspect history. Older redacted records cannot be reconstructed. Other operations explicitly configured not to retain content still store only placeholders, usage and safe diagnostics. Provider credentials and private model reasoning are not stored in these diagnostic records.

AutoFill streams model output and reports received tokens to the draft editor. Counts marked as estimates use streamed character length until provider usage is available. DeepSeek extraction disables thinking mode to avoid spending its output budget on reasoning for structured field extraction. The configured output limit still applies; a `length` or `MAX_TOKENS` finish exposes the partial answer and suggests shorter sources or an administrator-reviewed limit change. Sources are consumed when queued and are not reused automatically; failed requests require a new explicit submission.
AutoFill requests use structured JSON output for Gemini and JSON mode for DeepSeek and Z.ai, followed by local schema validation. AutoFill uses a larger default output budget for compatible providers to reduce truncation; an explicit administrator output-token limit takes precedence. Valid fields are applied to the private draft as soon as extraction finishes; edits made while extraction runs are not overwritten. The creator still reviews the draft before publishing. The default prompt interprets bare dollar prices as USD unless contradicted and maps ordered commission price ranges to slider options. Invalid or unsupported fields are not applied; a response with no applicable fields shows a warning.
Asset extraction normalizes presentation text before schema validation: null text
becomes blank or absent, string lists become lines, and ambiguous non-text values
are omitted with review warnings. Numeric fields, IDs, enums and the response
envelope remain strict. The required prompt contract explains required empty
strings and source-provided duration units even when an administrator has saved a
custom pre-prompt. History retains the original answer alongside normalized data.

Sticker extraction then adds editable starter defaults for missing setup values:
3 mm border, 0.2 mm preview/parcel thickness, vinyl, made-to-order availability,
and production/shipping confirmation wording. Starter size, quantity, design count
and finish default to 50 mm, 50 copies, one design and glossy only when absent.
The required prompt instead chooses the smallest source-provided options when
available and uses the advertised minimum price for a single assumed starter
combination. It preserves the remaining options and price range in the description.
Default application is reported in draft warnings. It never manufactures a price,
overwrites supplied values, or fills seller/legal information. Existing sticker
configuration is untouched when the model omits the sticker section entirely.

Account export includes attributable retained interactions. Account closure removes
personal content and attribution while preserving anonymous usage totals; an answer
arriving after erasure cannot restore the removed content.

Provider references: [DeepSeek JSON output](https://api-docs.deepseek.com/guides/json_mode/),
[Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output),
[Z.ai structured output](https://docs.z.ai/guides/capabilities/struct-output).
