---
title: Context Sources
---

Context sources are integrations that connect Promptless to your organization's existing tools and data. They provide additional context that helps Promptless create more accurate and comprehensive documentation suggestions.

## How Context Sources Work

Think of context sources as Promptless's way of understanding your team's unique ecosystem. When triggered to create documentation updates, Promptless intelligently searches through your connected tools to gather the most relevant context. This creates documentation that feels like it was written by someone who truly understands your project.

<Info>
Context sources are **optional** but highly recommended. They can significantly improve the quality and relevance of Promptless's documentation suggestions.
</Info>

## Available Context Sources

<CardGroup cols={2}>
  <Card title="Linear" icon="fa-solid fa-circle" href="/docs/configuration/context-sources/linear">
    Access Linear issues, projects, and team workflows for project management context
  </Card>
  
  <Card title="Jira" icon="fa-brands fa-jira" href="/docs/configuration/context-sources/jira">
    Query Jira tickets and project data using JQL search capabilities
  </Card>
  
  <Card title="Slack" icon="brands slack" href="/docs/configuration/context-sources/slack">
    Search Slack conversations and threads for team discussions and decisions
  </Card>
  
  <Card title="GitHub" icon="brands github" href="/docs/configuration/context-sources/github">
    Analyze code repositories, issues, and pull request discussions for technical context
  </Card>
</CardGroup>

## Examples

### Linear as a Context Source

When a GitHub PR mentions a new feature, Promptless searches Linear for related issues to understand additional project context. This ensures your documentation includes the "why" behind code changes, not just the "what."
  
### Jira as a Context Source

If a GitHub PR references a Jira ticket (like "PROJ-123"), Promptless automatically reads that Jira ticket for additional context. It also proactively searches Jira using JQL for related issues and epics.

### Slack as a Context Source

When documenting a new API endpoint, Promptless can search Slack for previous discussions among team members to incorporate decisions, edge cases, or common questions.

<Note>
Slack can serve as both a trigger source and context source.
</Note>

### GitHub as a Context Source

In addition to code diffs from trigger PRs, Promptless finds related GitHub issues and PR comments when you set GitHub as a context source.

## Configuring Context Sources

Context sources are configured at the project level in your [projects page](https://app.gopromptless.ai/projects). For each project, you can:

- Select which context sources to enable
- Configure search scope (e.g., specific teams, projects, or repositories)
- Set permissions for what Promptless can access

## Data Privacy and Security

Promptless prioritizes your data privacy and security with context sources:

<AccordionGroup>
  <Accordion title="Real-time Queries Only">
    We do not store any of your organization's data from context sources. Instead, our agents query the relevant APIs in real-time when documentation updates are needed, ensuring that we only access the information required for the specific documentation task at hand.
  </Accordion>
  
  <Accordion title="Secure Authentication">
    All context source integrations use:
    - OAuth 2.0 authentication
    - Encrypted data transmission (TLS 1.2+)
    - Granular permission controls
    - Token-based access that can be revoked at any time
  </Accordion>
  
  <Accordion title="Minimal Data Access">
    Promptless only accesses the specific information needed for documentation generation and does not retain or cache this data after processing.
  </Accordion>
</AccordionGroup>

## Requesting Additional Context Sources

Need integration with other tools? Contact [help@gopromptless.ai](mailto:help@gopromptless.ai) to request additional context sources. We're continuously expanding our integration options to better serve your documentation needs.
