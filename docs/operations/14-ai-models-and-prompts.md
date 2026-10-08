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
lastVerified: 2026-10-01
---

# Configure AI models, prompts and usage

This guide describes the implemented administration screens. Application release and
live provider validation remain separate from publishing this documentation.

## Connect a provider

In **Admin â†’ API Keys**, create a global key for the current environment: **Gemini**,
**DeepSeek**, **Z.ai (GLM)** or **Groq**. Creator-owned keys are not used for website AI.
All four provider forms are restricted to administrators and save global keys
automatically. After saving, reopen **AI** to refresh availability in Models and
Playground. A key must be active and belong to the current environment. If an
earlier Gemini key was saved as personal, an administrator must change its scope
to global before website AI can use it.
Open **Admin â†’ AI â†’ Models** to inspect the seeded models or register a provider's
model ID. Initial options are Gemini Flash Lite, DeepSeek V4.1 Flash
(`deepseek-flash`), GLM-5.3, image-capable GLM-5.3-Flash, and Groq's text-only
GPT-OSS 120B (`openai/gpt-oss-120b`) and GPT-OSS 20B (`openai/gpt-oss-20b`). Providers that
send the model ID in the request body accept namespaced IDs such as `openai/gpt-oss-120b`.

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
auto-fill and community self-promotion. Asset draft auto-fill and community
self-promotion read images only when a request has them, so they can run on a text-only
model such as GPT-OSS. Their requests with images then go to the model chosen under
**Requests with images**; **Automatic** uses the website default when it reads images,
otherwise Gemini Flash Lite. A text-only model never receives images, and History notes
when a request with images skipped it. Settings that would leave images without a model
that reads them are refused with the reason, and a model serving image requests cannot
be disabled or lose image support until another model takes over.
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

GPT-OSS on Groq always reasons: Off sends `reasoning_effort: low`, and its model settings
offer low, medium or high (Groq's default is medium). The reasoning text is never returned.

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
see its initiator and the pre-prompt used for each request. Self-promotion records the
actual Discord post author; someone without an Orbiters account appears by Discord ID.
Feature histories are read-only. The open icon on a request whose text was kept starts a
new playground chat with its system prompt, messages, attachments that still exist,
model, settings and logged answer.

## Use the playground

**Playground** keeps each administrator's chats; the list shows the newest first, and a
chat can be renamed or deleted. Deleting a chat keeps the history records of its requests
and the files they recorded.

- **Chat** sends each message to one model; **Compare** sends it to up to four targets at
  once (the same model may appear twice with other settings). Answers stream side by side
  when they fit and one at a time with a switcher on narrow screens. **Continue with this**
  chooses the answer the conversation continues from.
- Each target sets its maximum output tokens (up to the provider limit), temperature and
  reasoning level. **Auto** keeps the model configuration from **Models**.
- Messages are markdown with a preview. Answers stream over a WebSocket at
  `/admin/ai/playground/socket` (authenticated like the API) and show the model's
  reasoning when the provider returns it, time to first token, total time, input,
  output, reasoning and cached tokens, and output speed. Escape or the stop button ends
  a running answer and keeps its partial text.
- Editing a message or an answer, or asking again, adds a version instead of replacing
  anything; **‹ ›** switches between versions.
- Answers keep running on the server when the connection drops and reappear when it
  returns. An answer interrupted by a server restart is marked as interrupted.

Only administrator playground conversations retain request and response text in AI history, including malformed or truncated answers. Every other feature, including AutoFill, stores placeholders instead of source text and model answers, alongside instructions, selected image IDs, usage and safe diagnostics. Creators can inspect those records for their own draft; authorized AI administrators can inspect history. Records written before this rule keep their existing content. Provider credentials and private model reasoning are not stored in these diagnostic records; playground reasoning stays with its chat.

AutoFill streams model output and reports received tokens to the draft editor. Counts marked as estimates use streamed character length until provider usage is available. DeepSeek extraction disables thinking mode to avoid spending its output budget on reasoning for structured field extraction. DeepSeek AutoFill uses a minimum 32,768-token output budget; higher administrator settings take priority. One submission makes at most three provider calls. A DeepSeek `length` finish is retried at once with a 65,536-token budget. Connection failures, provider 408/429/5xx responses, streams that end early and responses that fail the output format are retried after 1.5 and then 4 seconds; a format retry adds a reminder of the required JSON schema to the prompt. Truncation that the larger budget cannot fix, unsupported images, AI disabled for the account and missing provider keys are not retried. Retries stop when the draft is published or a newer AutoFill replaces the job. Every attempt is billed by the provider and recorded in history, with combined live token feedback and the attempt number in the draft's progress. Sources are consumed when queued and are not reused by later submissions. A retry within that submission uses the same selected inputs. The maximum request duration defaults to 180 seconds per attempt and remains bounded by `AI_REQUEST_TIMEOUT_MS` when configured. In **Models → Maximum output tokens**, DeepSeek settings support up to 393,216 and Groq up to 65,536; other providers keep their existing limits.
AutoFill requests use structured JSON output for Gemini and JSON mode for DeepSeek, Z.ai and Groq, followed by local schema validation. GPT-OSS uses Groq's strict JSON schema output when a feature's schema allows it (all fields required, closed objects), as for My Avatar texture matching.

Groq does not stream structured output, so GPT-OSS AutoFill shows the generating stage without live token counts. Groq counts the prompt plus the maximum output tokens against the tokens-per-minute limit (8,000 for GPT-OSS on the free plan); a single larger request is retried once with an output limit that fits. A 429 is retried after Groq's Retry-After when that is at most 20 seconds, and a JSON validation failure is retried like a format failure. From `backend/`, `npm run smoke:groq` with `GROQ_API_KEY` in the environment runs texture matching and AutoFill against Groq once; it is not part of `npm test` and never prints the key. DeepSeek extraction uses the AutoFill minimum budget described above; other operations keep their configured limits. Valid fields are applied to the private draft as soon as extraction finishes; edits made while extraction runs are not overwritten. The creator still reviews the draft before publishing. The default prompt interprets bare dollar prices as USD unless contradicted and maps ordered commission price ranges to slider options. Invalid or unsupported fields are not applied; a response with no applicable fields shows a warning.
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
[Z.ai structured output](https://docs.z.ai/guides/capabilities/struct-output),
[Groq structured outputs](https://console.groq.com/docs/structured-outputs),
[Groq reasoning](https://console.groq.com/docs/reasoning),
[Groq rate limits](https://console.groq.com/docs/rate-limits).
