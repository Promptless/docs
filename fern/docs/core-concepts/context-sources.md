# Context Sources

Context sources are integrations that connect Promptless to your organization's existing tools and data. They often contain important information that can augment the trigger events.

## How Context Sources Work

Think of context sources as Promptless's way of understanding your team's unique ecosystem. When triggered to create documentation updates, Promptless intelligently searches through your connected tools to gather the most relevant context. This creates documentation that feels like it was written by someone who truly understands your project.

<Info>
Context sources are **optional** but highly recommended. They can improve the quality and relevance of Promptless's documentation suggestions.
</Info>

## Available Context Sources

<CardGroup cols={2}>
  <Card title="Linear" icon="fa-linear" href="/integrations/linear">
    Access Linear issues, projects, and team workflows for project management context
  </Card>
  
  <Card title="Jira" icon="fa-jira" href="/integrations/zendesk">
    Query Jira tickets and project data using JQL search capabilities
  </Card>
  
  <Card title="Slack" icon="brands slack" href="/integrations/slack">
    Search Slack conversations and threads for team discussions and decisions
  </Card>
  
  <Card title="GitHub" icon="brands github" href="/integrations/github">
    Analyze code repositories, issues, and pull request discussions for technical context
  </Card>
</CardGroup>

### Linear as a Context Source

**Example Use Case**: When a GitHub PR mentions implementing a new feature, Promptless searches Linear for related issues to understand requirements, acceptance criteria, and project context. This ensures your documentation includes the "why" behind code changes, not just the "what."
  
### Jira as a Context Source

Jira integration allows Promptless to understand your project management workflow and pull relevant ticket information. For instance, if a GitHub PR references a Jira ticket (like "Fixes PROJ-123"), Promptless automatically reads that Jira ticket for additional context about the bug, feature requirements, or technical specifications. This context gets woven into the documentation update.

### Slack as a Context Source

Slack serves as a repository of team knowledge and informal documentation that can enhance your formal docs. When documenting a new API endpoint, Promptless can search Slack for discussions about previous discussions or common questions from team members.

<Note>
Slack can serve as both a trigger source and context source. When used for context, Promptless searches your Slack workspace for relevant discussions to inform documentation updates.
</Note>

### GitHub as a Context Source

When creating documentation for a new feature, Promptless analyzes related GitHub issues, PR discussions, and code comments to understand implementation details, design decisions, and potential gotchas that should be documented.

## Configuration and Setup

Context sources are configured at the project level:

<Steps>
  <Step title="Connect Integrations">
    Visit the [Integrations page](https://app.gopromptless.ai/integrations) to connect your context sources using OAuth 2.0 authentication.
  </Step>
  
  <Step title="Configure Project Settings">
    In your [project settings](https://app.gopromptless.ai/projects), select which context sources to enable and configure their search scope.
  </Step>
  
  <Step title="Set Permissions">
    Define which teams, projects, or repositories Promptless can search within each context source.
  </Step>
</Steps>

<Frame>
  <img src="https://promptless-customer-doc-assets.s3.amazonaws.com/docs-images/org_2lvkgU9erOFxYhtEVVC0ymPrPdF/80863009-2671-4d86-91d6-95633becce22-new-project-modal-updated.png" alt="Project configuration showing context sources selection" />
</Frame>

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