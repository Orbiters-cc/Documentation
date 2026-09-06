---
title: Write a guide worth exploring
section: Development
order: 69
audience: dev
stage: stable
id: orbiters.development.editorial-experiences
domain: website
type: how-to
owner: orbiters-docs
lastVerified: 2026-09-06
---

# Write a guide worth exploring

A page earns a reader's attention by making something clearer. A large picture of four sequential steps usually does less work than four short sentences. An interactive example that lets someone discover why their public purchase does not unlock a beta can do much more.

## Begin with the point of confusion

“Configure the asset, then publish it” repeats the task. “Mika bought the jacket, but the beta is locked” gives the reader a question worth answering. Explain the relationship, then provide the exact steps needed in the real product.

Fictional people and amounts must be recognizable as examples. Never imply a testimonial, a real support case or a typical artist price. Keep sensitive subjects direct and calm.

## Pick the smallest visual that teaches the lesson

| Reader's question | Useful treatment | Why |
| --- | --- | --- |
| What changes for another account? | Release-access example | Changes availability while keeping the asset fixed |
| Which amount moved? | Commission receipt | Separates a provider hold from an artist payment |
| Why did moving my task not notify the client? | Board and delivery example | Lets readers change independent states |
| Why can't the bot assign a role? | Repairable role stack | Makes hierarchy and permission independently testable |
| What am I looking at in this UI? | Numbered product-image tour | Connects a real visual cue to its meaning |
| What should I do in this situation? | Explained choice | Teaches the reasoning behind both answers |
| Who talks to whom, or what can branch? | Small Mermaid diagram | Makes relationships visible without copying prose |

Do not attach an interaction to every section. Reference tables, exact commands and concise prose often are the right final form.

## Add an interactive example

The reader recognizes a fenced block whose language is `orbiters`. Its contents are JSON, never executable code. The following four-backtick example shows the authoring syntax:

````markdown
```orbiters
{"kind":"release-access"}
```
````

Available fixed kinds: `release-access`, `commission-receipt`, `workspace-states`, `discord-roles`, `audience-lens`, `mcb-version-tour`.

For a page-specific question, use `kind: "challenge"`, a `title`, a `question`, and two to four `options`. Each option has a short `label`, a boolean `correct`, and an `explanation`. Exactly one answer is correct. Explain the tempting wrong answer kindly and concretely; avoid trivia that merely repeats a nearby heading.

The registry lives in `DocExperience`; each concept has a small component. Components use local state and make no account, provider or payment requests. Motion occurs in response to interaction and honors reduced-motion preferences. Inputs work with keyboard and touch. Results use live regions.

Unknown kinds or invalid JSON show a readable fallback. `scripts/validate-docs.js` rejects malformed examples before publication. Both the validator and the frontend parser must be updated when adding a new kind.

## Keep the text useful on its own

State the rule in ordinary prose next to the example. GitHub, exports and text-only clients can show the fence as source rather than an interaction. They must still deliver the lesson. Audience and release blocks wrap interactive fences just like any other content; server filtering happens before the reader renders them.

Images use descriptive alt text and optional Markdown title captions. Existing MCB product artwork is labeled as an illustration with sample versions, not as a current screenshot. Original explanatory artwork belongs in frontend public assets; rendered Mermaid cache images are not committed.

## Review the page as a reader

1. Read the first screen at a phone width. Does it offer a useful question or merely a wall of setup?
2. Use every control with keyboard and touch-sized targets. Verify the visible outcome and the explanation.
3. Check the regular member view and staff inspection view. A demo must not bypass page permissions.
4. Read with reduced motion. Every conclusion should still be understandable.
5. Follow internal links and verify external sources. Link where the source helps, not as an unrelated bibliography.
6. Try a different page. If every page feels like the same template, reconsider the editorial choice.

Validate metadata, links and examples, then build the frontend and inspect the actual reader. A passing JSON parser cannot tell you whether a page is enjoyable.
