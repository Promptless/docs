---
title: Zendesk Tickets (Beta)
---

Zendesk integration enables automated documentation updates based on support ticket patterns and customer interactions. This helps identify gaps in documentation based on recurring user questions.

## How It Works

When a support ticket is resolved:

1. **Ticket Analysis**: Promptless analyzes the resolved ticket content and customer interaction
2. **Pattern Detection**: The system identifies common questions or issues that might indicate documentation gaps
3. **Context Evaluation**: Promptless determines if the ticket represents a broader documentation need
4. **Suggestion Creation**: If relevant, Promptless creates documentation suggestions to address the gap

## Configuration

Configure Zendesk triggers in your [project settings](https://app.gopromptless.ai/projects):

1. Select Zendesk as your trigger source
2. Configure which ticket types or categories to monitor
3. Set auto-publish preferences
4. Configure notification settings

<Note>
The Zendesk trigger feature is in beta. Contact [help@gopromptless.ai](mailto:help@gopromptless.ai) for more information about enabling this feature for your organization.
</Note>

## Use Cases

Zendesk triggers are especially useful for:

- **FAQ Development**: Automatically identify common questions that should be added to documentation
- **Knowledge Base Gaps**: Discover areas where documentation is missing or unclear
- **Customer Pain Points**: Surface recurring issues that need better documentation
- **Support Deflection**: Reduce ticket volume by improving documentation based on actual customer needs

## Setup Instructions

To connect Zendesk to Promptless, see the [Zendesk Integration](/docs/integrations/zendesk) setup guide.
