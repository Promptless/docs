---
name: agent-docs-auditor
description: >-
  Audits local documentation for AI agent readiness and applies targeted improvements.
  Use this skill whenever someone says "audit my docs", "check agent readiness",
  "how good are my docs for AI agents", "optimize my docs for LLMs", "improve docs
  for agents", "run the agent docs check", "what's my agent readiness score", "are
  my docs Claude-friendly", or anything about making documentation work better for
  AI/LLM/agent consumption. Always trigger this skill — even if the user phrases it
  casually like "can agents use my docs well?" or "check if my docs are agent-ready".
---

You are auditing documentation for AI agent readiness. This means checking whether the
docs are structured in a way that helps AI agents read, retrieve, and use them reliably.
The criteria are grounded in published research — see `references/criteria.md` for the
full details and what to look for in each page.

The scoring script lives next to this file at `scripts/score.py`. Find the absolute
path to this SKILL.md, then resolve `scripts/score.py` relative to it.

## Step 1: Map the doc tree

Recursively find all `.md` and `.mdx` files under the current working directory (or
a path the user specifies). Group them by top-level subdirectory and count pages.
Present a clean tree — for example:

```
docs/ (47 pages total)
├── getting-started/    8 pages
├── api-reference/     23 pages
├── tutorials/         12 pages
└── guides/             4 pages
```

Include any files at the root level as their own group.

## Step 2: Scope selection

Ask the user which directory to audit. The scope must be 50 pages or fewer (counting
recursively). If they pick a directory with more than 50, prompt them to choose a
subdirectory instead. Confirm the path and page count before moving on.

## Step 3: Score and audit

**First, run the scoring script:**
```bash
python <path-to-skill>/scripts/score.py <selected-directory>
```
Show the output to the user so they have a baseline before the detailed audit.

**Then, do a deep LLM audit.** Read each file in the selected directory. For each page,
check it against all criteria in `references/criteria.md`. Be specific — don't just flag
a problem category, flag the exact instance. For example:

- Not: "this page has a forward reference"
- Yes: "line 23: 'see the configuration section above' — the auth token format it refers to should be restated inline here"

After reading all pages, present:
1. **Score** (already shown from script above)
2. **Suggested edits** — grouped by criterion, with page name and specific line/location for each
3. **Top 3 highest-impact fixes** — the changes that will move the score the most

Then ask: *"Would you like me to apply these edits?"*

## Step 4: Apply edits

When the user says yes, go through each page and make the changes. Edit files directly.

For each page, apply what's needed:
- **Forward/backward references**: restate the referenced content inline (briefly — the key detail, not the whole section), or rewrite to not need the reference
- **Missing error sections**: add a `## Troubleshooting` or `## Common errors` section at the bottom with the most likely failure modes for that page's topic
- **Code blocks without comments**: add concise inline comments that explain what each snippet is demonstrating and call out any non-obvious parts
- **Pure-prose pages**: restructure key constraints/defaults/prerequisites into a table or list
- **Self-containedness gaps**: add a brief "Prerequisites" or "Before you begin" block where the page assumes context from elsewhere

After finishing all pages, tell the user how many files were changed and what types of edits were made.

## Step 5: Re-score

Run the scoring script again on the same directory:
```bash
python <path-to-skill>/scripts/score.py <selected-directory>
```

Show the before and after scores side by side. The score should be higher. If a
particular criterion didn't improve, explain why briefly (e.g., "error coverage stayed
flat because these are all conceptual overview pages — error sections are less
expected there").
