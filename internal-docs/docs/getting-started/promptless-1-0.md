---
sidebar_position: 2
title: Introducing Promptless 1.0
---

# Introducing Promptless 1.0: Your AI Teammate for Documentation

Maintaining high-quality documentation is hard—especially for fast-moving teams. Documentation falls behind the moment you ship new features. Engineers are focused on building product. Technical writers are stretched thin.

**Promptless 1.0 changes this.** We're an AI teammate that automatically drafts documentation updates as you ship software and support customers. No more context switching, no more docs debt, no more apologizing to customers for outdated guides.

## Why Documentation Falls Behind

If you've worked on a product team, you know this pain:

A feature ships, but the docs update doesn't happen until days or weeks later. Customers ask the same questions over and over because the answer isn't documented. Screenshots become outdated the moment your UI changes.

Engineers hate switching contexts to write docs, even though they have all the context. Technical writers spend hours chasing down information from Slack threads, PRs, and Jira tickets.

The most successful companies recognize that great docs drive adoption. But even with dedicated technical writers, keeping documentation current requires constant effort from multiple teams.

## How Promptless Works

Promptless monitors your existing workflows—GitHub PRs, Slack conversations, support tickets—and automatically detects when documentation might need updating. When we spot something, we draft the update for you to review.

**We live where you work.** You don't need to learn a new tool or change your workflow. Promptless integrates with:
- GitHub, GitLab, and Bitbucket for code changes
- Slack and Microsoft Teams for conversations
- Zendesk and Intercom for support tickets
- Jira and Linear for project management
- Your docs platform—Fern, Mintlify, GitBook, ReadMe, and many more

**We understand your style.** Promptless reads your entire docs site to understand your voice, structure, and conventions. Every suggestion sounds like your team wrote it, not a generic AI bot.

**We show our work.** Every documentation update includes citations showing exactly which GitHub files, Slack threads, or customer conversations informed each change. No more hunting through history to verify accuracy.

---

## What's New in Promptless 1.0

We recently launched five major features that make Promptless more powerful than ever.

### Voice Match: Documentation that sounds like you

One of the most common complaints about AI-generated content? It sounds robotic.

Promptless Voice Match solves this by fine-tuning a custom model on your existing documentation. We ingest your docs, style guides, and Vale rules to understand how you communicate.

The results speak for themselves: Voice Match eliminates 92% of "AI-slop" and produces updates that sound authentically like your team.

If you have a particular section of your docs that best represents your ideal style, we can match that too—bringing consistency across your entire documentation set.

---

### Slack Listen: Zero-click documentation

We already made it easy to convert Slack conversations into documentation with a simple mention or shortcut. But our customers pushed us to go further: what if it required zero clicks?

Slack Listen is an optional feature that lets you deploy Promptless inside specific Slack channels. We quietly monitor conversations and automatically detect when something should be documented.

When a thread goes inactive, we prepare a documentation update for your review—no tagging, no manual work required.

This is perfect if you have multiple Slack Connect channels with customers, a dedicated docs channel, or active product discussion channels. You'll never again think "We should really document this somewhere…" and then forget about it.

---

### Citations: Know exactly where every change came from

"Where did this code snippet come from?"  
"Why did Promptless say this integration is only partially supported?"  
"Is this API response real or did the AI make it up?"

These are questions our customers asked when reviewing suggestions. Now, we proactively answer them before you even ask.

Anyone who has used AI to write documentation knows the verification pain. Generation takes seconds, but tracking down sources and verifying accuracy can take hours or days—especially when you need input from other teams.

AI hallucination is a fundamental challenge with large language models. As long as they're predicting the next token, we can't completely eliminate hallucinations. So instead of pretending they don't exist, we borrowed proven methods from academic research.

Every documentation update now comes with:
- The exact GitHub files, diffs, and commits we referenced
- Slack threads and customer conversations we analyzed
- Meeting transcripts that clarified edge cases
- A transparent rationale explaining why each line was updated

You can trace every change back to its source. No more hunting through PRs and Slack threads to verify accuracy—we show you exactly where the information came from.

---

### Screenshot Automation: Images that stay in sync

Updating screenshots is one of the most painful parts of docs work. It's so tedious that many teams avoid adding screenshots entirely—even though they know screenshots would make their docs more helpful.

Promptless Capture changes everything. It's an AI agent that navigates your product, captures screenshots, and automatically updates them when your UI changes.

Get the visual documentation your customers want without the maintenance burden. You can finally give your users a more visual docs experience, without worrying about keeping hundreds of screenshots current.

---

### Free for Open Source

If you're a CNCF, Linux Foundation, or Apache Software Foundation project, you can use Promptless for free. We're committed to helping the open-source community maintain high-quality documentation.

After attending Kubecon and talking with dozens of open-source maintainers, we learned about the unique documentation challenges large OSS projects face. Contributors are excited to ship PRs but don't always have time to write accompanying docs. Thousands of community conversations could be turned into great documentation.

If you're an open-source project associated with a company, we offer discounted pricing based on your documentation size.

---

## Real-World Impact

Here's what teams are experiencing with Promptless:

**Fast-growing startups** like Vellum and Clay use Promptless to automatically bridge the gap between their product teams' biweekly changelogs and their content teams' public guides. Documentation updates that used to take days now happen automatically.

**Fortune 500 enterprises** use Promptless to make their technical writers twice as productive by automatically assembling context from Linear, Confluence, and Slack whenever there's a PR.

**Developer platforms** with thousands of integrations use Promptless to keep troubleshooting docs in sync with their support tickets, ensuring customers can self-serve instead of reaching out for help.

Whether your documentation is developer guides and API references, product tutorials and how-tos, help center articles and FAQs, or release notes and changelogs—Promptless handles it. We infer the style and structure of your documentation by reading your entire docs site, then match that style in every suggestion.

---

## Get Started

Ready to put your docs on autopilot? We're working with fast-growing startups and Fortune 500 enterprises to eliminate documentation debt.

**Try Promptless free** at [gopromptless.ai](https://gopromptless.ai), or email us at [founders@gopromptless.ai](mailto:founders@gopromptless.ai) to learn more.

Documentation is integral to a great customer experience. With Promptless 1.0, you can finally keep it that way—without the constant manual effort.
