---
title: Slack
---

Slack integration provides access to your team conversations and decisions for documentation automation. When Slack is configured as a context source, Promptless can search for previous discussions to incorporate team knowledge into documentation.

## How It Works as Context Source

When Slack is enabled as a context source:

- **Conversation Search**: Promptless searches Slack for previous discussions among team members
- **Decision Context**: Find historical conversations about feature decisions, edge cases, or design choices
- **Team Knowledge**: Incorporate collective team understanding into documentation

<Note>
Slack can serve as both a trigger source and a context source. As a trigger, it initiates documentation updates. As a context source, it provides additional conversation history to enrich documentation.
</Note>

## Example

When documenting a new API endpoint, Promptless can search Slack for previous discussions among team members to incorporate decisions, edge cases, or common questions that were discussed.

## Privacy and Access

When used as a context source, Promptless only searches Slack when explicitly triggered to create documentation. The system queries conversations in real-time and does not store any of your Slack data.

Promptless can only access channels that:
- Are public, OR
- The Promptless bot has been explicitly invited to

## Configuration

Configure Slack context in your [project settings](https://app.gopromptless.ai/projects):

1. Enable Slack as a context source for your project
2. Configure search scope if needed
3. Ensure the Promptless bot is invited to relevant channels

## Setup Instructions

To connect Slack to Promptless, see the [Slack Integration](/docs/integrations/slack-integration) setup guide.
