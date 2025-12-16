---
title: GitHub
---

GitHub integration provides access to your code repositories, issues, and pull request discussions for documentation automation. When GitHub is configured as a context source, Promptless can analyze your codebase and find related issues to enhance documentation accuracy.

## How It Works as Context Source

When GitHub is enabled as a context source:

- **Code Analysis**: Deep understanding of your codebase structure and recent changes
- **Issue Searches**: Find related GitHub issues that provide context about features or bugs
- **PR Discussions**: Access comments and reviews from related pull requests
- **Repository History**: Understand how features evolved over time

## Example

In addition to code diffs from trigger PRs, Promptless finds related GitHub issues and PR comments when you set GitHub as a context source. This provides comprehensive technical context for documentation updates.

## What's Analyzed

When GitHub is a context source, Promptless can access:

- Repository structure and file organization
- Issue titles, descriptions, and comments
- Pull request discussions and reviews
- Code comments and documentation
- Commit messages and history

## Configuration

Configure GitHub context in your [project settings](https://app.gopromptless.ai/projects):

1. Enable GitHub as a context source for your project
2. Select which repositories Promptless can search within
3. Promptless will have read-only access to selected repositories

<Note>
GitHub access is controlled through repository permissions you grant when installing the Promptless GitHub App. Promptless can only access repositories you explicitly grant access to.
</Note>

## Data Privacy

Promptless processes repository data in real-time and does not store your source code. Information is accessed only when needed for documentation generation and is not retained after processing.

## Setup Instructions

To connect GitHub to Promptless, see the [GitHub Integration](/docs/integrations/github-integration) setup guide.
