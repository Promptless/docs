# Agent Readiness Audit Criteria

Use this reference when doing the deep LLM audit of each page. For each criterion,
the research basis is noted so you can explain tradeoffs to the user if asked.

---

## 1. Self-contained sections (25 pts)

**Why it matters:** When an agent retrieves a chunk via RAG, it often gets that chunk
without the surrounding context. A sentence like "use the object from above" leaves the
agent guessing — and agents that can't resolve a reference will hallucinate rather than
admit it. Multiple documents in a RAG context can also reduce performance by up to 20%,
so each section should minimize how much chasing it forces the agent to do.

**What to flag:**
- "see above", "as described above", "mentioned earlier", "as noted above", "shown above"
- "previous section / page / step", "refer to the previous"
- Implicit references: "the same format as before", "similar to the last example"
- "see below" when the referenced content is critical and not re-stated — forward refs to
  supplemental info are okay, forward refs to required prerequisites are not

**What good looks like:**
- Key constraints, defaults, and prerequisites are restated at the point of use — briefly,
  not duplicated in full
- "Before you begin" or "Prerequisites" blocks at the top of pages that depend on earlier setup
- Kubernetes does this well: every procedural page opens with a short "Before you begin" block

**How to fix:**
- Replace "see above" with a one-line restatement of the critical fact
- Add a collapsible "Prerequisites" block at the top for longer setup requirements
- If an entire section is just "same as X", merge or inline it

---

## 2. Code coverage (25 pts)

**Why it matters:** Stripping code examples from API docs collapses LLM pass rates from
66–82% down to 22–39%. Code is more signal-dense than prose for agents. Diverse examples
generalize better (+10.7% on hard tasks vs. +5.1% on easy ones). Inline comments inside
code blocks reduce contamination between examples and instructions, and help the agent
distinguish "this is a correct example" from "this is a near-miss."

**What to flag:**
- Pages with zero code blocks (especially how-to and reference pages — explanation pages
  without code are more acceptable)
- Code blocks with no inline comments — the reader has to rely entirely on surrounding
  prose to understand what the snippet shows
- Code blocks where all examples are nearly identical (low diversity)
- Negative examples not paired with a positive counterpart

**What good looks like:**
- At least one code block per how-to or reference page
- Comments inside snippets that say what's happening, especially at non-obvious steps
- A small, curated set of examples that cover diverse cases, not many that all look the same
- If negative examples exist, they're paired with a correct version and labeled clearly

**How to fix:**
- Add a minimal working example if none exists
- Add `# this shows X` or `// note: this triggers the Y behavior` comments to existing blocks
- If there are 5 nearly identical examples, cut to 2–3 and make sure they cover different cases

---

## 3. Error and failure documentation (25 pts)

**Why it matters:** Agents with access to structured failure information perform
significantly better than those reasoning from general knowledge. Vague guidance like
"consider edge cases" underperforms explicit structured instructions by 10–37%. Agents
also burn through their step budget when error handling isn't documented — they retry
blindly rather than reading a resolution path.

**What to flag:**
- Pages (especially tutorials, how-to guides, API reference) with no troubleshooting or
  error section at all
- Error codes mentioned in passing but not explained (what does `AUTH_EXPIRED` actually mean?)
- Known limitations or gotchas buried in prose rather than called out
- Pages that describe a happy path only, with no mention of what can go wrong

**What good looks like:**
- A dedicated `## Troubleshooting` or `## Common errors` section, even if short
- Error codes quoted exactly as they appear in the product (not paraphrased)
- Stripe/Twilio pattern: each error has a description + possible causes + resolution steps
- Known limitations in a clearly labeled section, not buried mid-paragraph

**How to fix:**
- Add a `## Troubleshooting` section at the bottom of the page with the 2–3 most common
  failure modes for that topic. Use GitHub issues, support tickets, or changelogs as sources.
- Quote error strings exactly: `"invalid_api_key"` not "an authentication error"
- Move inline caveats into a `> **Note:**` callout or a dedicated limitations section

---

## 4. Structured content (25 pts)

**Why it matters:** When agents run low on context and trigger summarization, LLMs
discard repetitive prose, verbose logs, and formatting tokens — but structured formats
(tables, YAML, must/should/must-not callouts) survive better than equivalent narrative
descriptions. Signaling importance explicitly ("required", "optional", "forbidden") helps
agents distinguish high-value from low-value content.

**What to flag:**
- Pages where constraints, defaults, and parameter options are described only in prose
  sentences — these are prime candidates for tables
- Pages with no lists or tables at all (especially reference and how-to pages)
- Pages where "Note", "Warning", or "Important" content is just a regular paragraph with
  no visual distinction
- Pages where a comparison ("X vs Y", "when to use A vs B") is written as flowing text
  instead of a table

**What good looks like:**
- Parameters, options, or constraints in a table with columns for name / type / default / description
- Prerequisites and step-by-step actions as numbered lists
- Notes and warnings in callout blocks (`> **Note:**`, or the doc platform's callout component)
- Comparison tables for "when to use X" decisions

**How to fix:**
- Convert prose parameter descriptions into a markdown table
- Convert a paragraph of "you should do X, you should also do Y" into a bulleted list
- Wrap important caveats in a callout: `> **Warning:** ...`
- Add a comparison table for any "X vs Y" or "when to use" content

---

## Applying edits: general principles

- **Be surgical.** Edit only what's flagged — don't rewrite prose style or restructure
  pages beyond what the criterion requires.
- **Preserve voice.** Match the existing tone and terminology of the page.
- **Don't invent facts.** For error sections and troubleshooting content, add a `<!-- TODO: fill in actual error codes -->` placeholder rather than guessing at product-specific details.
- **Prioritize by impact.** If a page has multiple issues, fix the highest-scoring ones first (self-containedness and code coverage tend to have the most impact).
- **Expandable blocks for long additions.** If adding a troubleshooting section would make a page significantly longer, suggest wrapping it in a `<details>` block — the content is present for agents parsing the raw HTML, but doesn't interrupt human readers.
