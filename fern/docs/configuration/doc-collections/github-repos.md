---
title: GitHub Repos (Docs as Code)
---

The most common documentation setup uses GitHub repositories to store documentation content that syncs to hosting providers. This "docs as code" approach allows you to version control your documentation alongside your code.

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
- Optionally enable auto-merge to automatically merge documentation PRs as soon as they're created (nested checkbox under auto-publish in project settings)

## Automated CI Check and Build Issue Resolution

When Promptless opens a documentation PR, it automatically monitors the pull request for quality issues. If CI checks fail, linting tools report errors, Vale rules trigger warnings, or your documentation hosting provider detects broken links or build problems, Promptless will automatically analyze the issues and push fixes directly to the PR branch.

This automated issue resolution works seamlessly with your existing GitHub workflow - there's no additional configuration needed. Quality problems get resolved in the background while you focus on content rather than troubleshooting technical issues.

## Trigger Events in Pull Request Descriptions

When Promptless creates a pull request for documentation updates, it automatically includes a list of the trigger events that led to those changes in the PR description. This provides valuable context for reviewers and creates clear traceability between documentation updates and their originating events.

The trigger events section in the PR description includes:
- Links back to the original source (e.g., Slack threads, GitHub PRs, support tickets)
- Brief descriptions of what triggered the documentation update
- Easy navigation to review the context that prompted the changes

## Setup Instructions

To connect GitHub to Promptless, see the [GitHub Integration](/docs/integrations/github-integration) setup guide.
