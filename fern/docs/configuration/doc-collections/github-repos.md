---
title: GitHub Repos (Docs as Code)
---

The most common documentation setup uses GitHub repositories to store documentation content that syncs to hosting providers. This "docs as code" approach allows you to version control your documentation alongside your code.

<Info>
**Prerequisite**: Before creating a GitHub-based doc collection, you must first [connect GitHub](/docs/integrations/github-integration) on the integrations page. Without an active GitHub connection, you won't see any repositories in the dropdown when setting up your doc collection.
</Info>

## Supported Platforms

When your documentation lives in GitHub, Promptless can publish to any of these platforms:

- **Fern**
- **Mintlify**
- **ReadMe** (Refactored)
- **GitBook**
- **Docusaurus**
- **MkDocs**
- **Hugo**
- **Ghost**
- **Nextra**
- **Vocs**
- **Custom platforms** (as long as the content is in a repo)

## How It Works

1. **Repository Setup**: Your documentation files live in a GitHub repository
2. **Promptless Integration**: The Promptless GitHub App has write access to your docs repository
3. **Automatic PRs**: When documentation updates are needed, Promptless creates pull requests in your docs repo
4. **Platform Sync**: Your documentation platform automatically syncs changes from GitHub

## Project Setup and Permissions

After setting up the GitHub integration, you'll create a project in the [projects page](https://app.gopromptless.ai/projects). When creating a project, you'll select:

- **Trigger repositories**: Repositories that initiate documentation updates (read-only access)
- **Documentation repositories**: Repositories where documentation is stored (write access)

<Frame>
  <img src="../../assets/github-project.png" alt="Project Setup showing trigger and documentation repository selection" />
</Frame>

In the example above, Promptless can read the `promptless` and `promptless-dashboard` repos, but can read and write to the `promptless-docs` repo.

## Auto-publish Mode

When auto-publish is enabled for your project:

- Promptless automatically creates a new PR in your documentation repository with suggested changes
- For GitHub PR triggers, the documentation PR is linked in a comment on the original code PR
- For [commit triggers](/docs/configuration/triggers/github-commits), you can enable auto-merge to automatically merge documentation PRs as soon as they're created (nested checkbox under auto-publish in project settings)

## Automated CI Check and Build Issue Resolution

When Promptless opens a documentation PR, it monitors for quality issues. If CI checks fail, linting errors appear, Vale rules trigger warnings, or your documentation platform detects broken links or build problems, Promptless analyzes the issues and pushes fixes directly to the PR branch.

Promptless only fixes issues caused by the current suggestion. If a CI failure is pre-existing or unrelated, the suggestion stays unchanged. When Promptless finds documentation issues outside the suggestion's scope, it creates a separate suggestion to address them.

This automated issue resolution works seamlessly with your existing GitHub workflow—no additional configuration needed.

## Trigger Events in Pull Request Descriptions

When Promptless creates a pull request for documentation updates, it automatically includes a list of the trigger events that led to those changes in the PR description. This provides valuable context for reviewers and creates clear traceability between documentation updates and their originating events.

The trigger events section in the PR description includes:
- Links back to the original source (e.g., Slack threads, GitHub PRs, support tickets)
- Brief descriptions of what triggered the documentation update
- Easy navigation to review the context that prompted the changes

## Setup Instructions

To connect GitHub to Promptless, see the [GitHub Integration](/docs/integrations/github-integration) setup guide.

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="I don't see any repositories in the dropdown when creating a doc collection">
    If the repository dropdown shows "No options" when creating a doc collection, you need to connect GitHub first. Go to the [integrations page](https://app.gopromptless.ai/integrations) and click "Connect GitHub" to install the Promptless GitHub App. Once GitHub is connected, return to creating your doc collection and your repositories will appear in the dropdown.
    
    If you've already connected GitHub but still don't see your repositories, you may need to grant Promptless access to those specific repositories. Visit your GitHub organization settings, find the Promptless GitHub App under "Third-party Access" → "GitHub Apps", and add the repositories you need.
  </Accordion>
</AccordionGroup>
