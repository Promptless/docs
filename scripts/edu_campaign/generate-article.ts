/**
 * Automated content farm script for Promptless blog.
 *
 * Flow:
 *  1. Pick a random keyword from keywords.txt
 *  2. Run a Claude agent (with web search) to research the topic
 *  3. Write a high-quality MDX article in Promptless's voice
 *  4. Commit to a new branch and open a GitHub PR
 *  5. Post the PR link to Slack
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY      — Anthropic API key
 *   SLACK_WEBHOOK_URL      — Slack incoming webhook URL
 *
 * Usage:
 *   npx tsx scripts/content-farm/generate-article.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

// ─── helpers ──────────────────────────────────────────────────────────────────

function pickKeyword(): string {
  const keywordsPath = path.join(__dirname, "keywords.txt");
  const keywords = fs
    .readFileSync(keywordsPath, "utf-8")
    .split("\n")
    .map((k) => k.trim())
    .filter((k) => k && !k.startsWith("#"));
  if (!keywords.length) throw new Error("keywords.txt is empty");
  return keywords[Math.floor(Math.random() * keywords.length)];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function monthYear(): string {
  return new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
}

function exec(cmd: string, opts: { cwd?: string } = {}): string {
  return execSync(cmd, { cwd: opts.cwd ?? REPO_ROOT, encoding: "utf-8" }).trim();
}

// ─── research + write ─────────────────────────────────────────────────────────

async function generateArticle(keyword: string): Promise<string> {
  const client = new Anthropic();

  const systemPrompt = `You are a senior technical writer and content strategist for Promptless, an AI-powered documentation platform that helps developer-facing companies automatically keep their docs accurate, complete, and up to date.

Promptless's audience is technical writers, DevRel engineers, developer advocates, solutions engineers, and engineering managers at companies with developer-facing products. The blog is read by people who care deeply about documentation quality and developer experience.

Promptless's voice is:
- Direct and substantive — no filler, no fluff
- Grounded in concrete examples, real numbers, and cited evidence
- Opinionated but not preachy — we have a point of view
- Practical — readers should come away with something actionable
- Intellectually honest — we acknowledge trade-offs and limitations

When writing articles, follow these structural conventions:
- Use ## for H2 sections, ### for H3
- Aim for 800–1400 words
- Lead with a hook that frames the problem, not a generic intro
- Include concrete examples, data points, or anecdotes wherever possible
- End with a section that looks forward or calls for action (not a summary)
- Do NOT include a generic conclusion section that just restates what was said
- Place <BlogNewsletterCTA /> at roughly the 40–50% mark (after the first major section)
- End the article with <BlogRequestDemo />

Style guide:
- Avoid using emdash as much as possible
- Avoid using too many tricolon phrases

MDX frontmatter format (fill in all fields):
---
title: 'Article Title Here'
subtitle: Published ${monthYear()}
description: >-
  One or two sentence SEO description, 120–160 characters.
date: '${todayISO()}T00:00:00.000Z'
author: Frances
section: Technical
hidden: true
---
import BlogNewsletterCTA from '@components/site/BlogNewsletterCTA.astro';
import BlogRequestDemo from '@components/site/BlogRequestDemo.astro';

[article body starts here]`;

  const userPrompt = `I need you to research and write a high-quality blog article for Promptless on this keyword/topic: "${keyword}"

Step 1 — Research:
- Search the web for the top articles, studies, blog posts, and discussions on this topic
- Read a random sample of 5–8 of the best results thoroughly
- Take note of: what angles already exist, what data or evidence is cited, what's missing or poorly covered, what practitioners are actually struggling with
- Look for recent (2024–2026) data points, case studies, or expert commentary

Step 2 — Write the article:
- Choose the most compelling and differentiated angle (not the same generic take as every other post)
- Write a complete, publication-ready MDX article following the format and conventions in the system prompt
- Include the full frontmatter at the top
- The title should be specific and SEO-optimized for "${keyword}"
- Cite real examples, companies, or data points where relevant (you found these in your research)
- The article should feel like it was written by someone who deeply understands documentation and developer tooling

Output ONLY the complete MDX file contents — frontmatter + article body. No preamble, no explanation, no code fences around it.`;

  console.log(`\n🔍 Researching: "${keyword}"\n`);

  // Agentic loop with web search
  type Message = Anthropic.MessageParam;
  const messages: Message[] = [{ role: "user", content: userPrompt }];

  let response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 8000,
    system: systemPrompt,
    tools: [
      {
        type: "web_search_20250305" as const,
        name: "web_search",
      },
    ],
    messages,
  });

  // Run the agentic loop until we get a final text response
  while (response.stop_reason === "tool_use") {
    const assistantContent = response.content;
    messages.push({ role: "assistant", content: assistantContent });

    // Build tool results for all tool_use blocks
    const toolResults: Anthropic.ToolResultBlockParam[] = assistantContent
      .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
      .map((toolUse) => {
        console.log(`  🌐 Searching: ${(toolUse.input as { query?: string }).query ?? toolUse.id}`);
        return {
          type: "tool_result" as const,
          tool_use_id: toolUse.id,
          // For server-side tools like web_search, Anthropic handles execution
          // and injects results. We pass an empty result; the API fills it in.
          content: "",
        };
      });

    messages.push({ role: "user", content: toolResults });

    response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8000,
      system: systemPrompt,
      tools: [
        {
          type: "web_search_20250305" as const,
          name: "web_search",
        },
      ],
      messages,
    });
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  if (!text.trim()) {
    throw new Error("Claude returned an empty response");
  }

  return text.trim();
}

// ─── git + GitHub ─────────────────────────────────────────────────────────────

function createPR(articleContent: string, keyword: string): string {
  // Extract title from frontmatter to build a slug
  const titleMatch = articleContent.match(/title:\s*['"](.+?)['"]/);
  const title = titleMatch ? titleMatch[1] : keyword;
  const slug = slugify(title);
  const date = todayISO();
  const branchName = `articles/${date}-${slug}`;
  const filePath = `src/content/blog/technical/${slug}.mdx`;
  const absoluteFilePath = path.join(REPO_ROOT, filePath);

  // Use a worktree so we don't need a clean working directory
  const worktreePath = path.join(REPO_ROOT, ".worktrees", branchName.replace(/\//g, "-"));
  exec("git fetch origin main");
  exec(`git worktree add -b ${branchName} ${worktreePath} origin/main`);

  const worktreeFilePath = path.join(worktreePath, filePath);
  fs.mkdirSync(path.dirname(worktreeFilePath), { recursive: true });
  console.log(`\n📝 Writing article to ${filePath}`);
  fs.writeFileSync(worktreeFilePath, articleContent + "\n");

  exec(`git add ${filePath}`, { cwd: worktreePath });
  exec(
    `git commit -m "content: Add AI-generated article — ${title}\n\nKeyword: ${keyword}\nGenerated by content farm script on ${date}"`,
    { cwd: worktreePath }
  );
  exec(`git push -u origin ${branchName}`, { cwd: worktreePath });
  exec(`git worktree remove --force ${worktreePath}`);

  const prBody = `## AI-Generated Blog Article

**Keyword targeted:** \`${keyword}\`

**Article:** \`${filePath}\`

This article was automatically researched and written by the Promptless content farm pipeline. Please review for:

- [ ] Accuracy of technical claims
- [ ] Alignment with Promptless voice and positioning
- [ ] Any factual errors or hallucinated sources
- [ ] SEO title and description quality
- [ ] CTA placement

> Set \`hidden: false\` in frontmatter when ready to publish.

🤖 Generated with Claude Opus 4.6`;

  const bodyFile = path.join(REPO_ROOT, ".pr-body.tmp");
  fs.writeFileSync(bodyFile, prBody);
  const prUrl = exec(
    `gh pr create --title "content: ${title}" --body-file ${bodyFile} --base main --head ${branchName}`
  );
  fs.unlinkSync(bodyFile);

  console.log(`\n✅ PR created: ${prUrl}`);
  return prUrl.trim();
}

// ─── Slack ────────────────────────────────────────────────────────────────────

async function notifySlack(prUrl: string, keyword: string, title: string): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("⚠️  SLACK_WEBHOOK_URL not set — skipping Slack notification");
    return;
  }

  const payload = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `📝 *New blog article draft ready for review*`,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Title:*\n${title}` },
          { type: "mrkdwn", text: `*Keyword:*\n\`${keyword}\`` },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Review PR" },
            url: prUrl,
            style: "primary",
          },
        ],
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.warn(`⚠️  Slack notification failed: ${res.status} ${await res.text()}`);
  } else {
    console.log("📣 Slack notification sent");
  }
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const keyword = process.env.KEYWORD ?? pickKeyword();
  console.log(`🎯 Keyword: "${keyword}"`);

  const articleContent = await generateArticle(keyword);

  const titleMatch = articleContent.match(/title:\s*['"](.+?)['"]/);
  const title = titleMatch ? titleMatch[1] : keyword;
  console.log(`\n📄 Title: "${title}"`);

  const prUrl = createPR(articleContent, keyword);

  await notifySlack(prUrl, keyword, title);

  console.log("\n🎉 Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
