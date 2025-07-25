# Triggers

Triggers are events that automatically initiate documentation updates in Promptless. They integrate seamlessly into your existing workflow to minimize friction when creating and maintaining documentation.

<Info>
Triggers detect when documentation updates might be needed and can either create suggestions for review or automatically publish changes based on your project settings.
</Info>

## How Triggers Work

<Steps>
  <Step title="Event Detection">
    Promptless monitors configured platforms for relevant events (PR creation, Slack messages, etc.)
  </Step>
  
  <Step title="Analysis">
    When triggered, Promptless analyzes the content to determine if documentation updates are warranted
  </Step>
  
  <Step title="Action">
    Based on your settings, Promptless either creates suggestions for review or auto-publishes documentation changes
  </Step>
</Steps>

## Available Triggers

<CardGroup cols={2}>
  <Card title="GitHub Pull Requests" icon="brands github" href="/integrations/github">
    Automatically triggered when PRs are opened in monitored repositories
  </Card>
  
  <Card title="Bitbucket Pull Requests" icon="brands bitbucket" href="/integrations/bitbucket">
    Monitors Bitbucket repositories for PR activity and code changes
  </Card>
  
  <Card title="Slack Messages" icon="brands slack" href="/integrations/slack">
    Triggered via @mentions or message actions in Slack channels
  </Card>
  
  <Card title="Intercom Conversations" icon="regular comments" href="/integrations/intercom">
    Monitors customer conversations for documentation opportunities
  </Card>
</CardGroup>

## Trigger Details

<AccordionGroup>
  <Accordion title="GitHub & Bitbucket Pull Requests">
    **When it triggers:** New pull requests in configured repositories
    
    **What it does:**
    - Analyzes code changes for documentation impact
    - Creates documentation suggestions or auto-publishes updates
    - Adds comments to PRs with results and links
    
    **Key features:**
    - Directory-specific monitoring
    - Auto-publish or draft mode options
    - Follow-on request support for additional changes
    
    <Note>
    Bitbucket automatically skips draft pull requests - only ready-for-review PRs trigger documentation updates.
    </Note>
  </Accordion>

  <Accordion title="Slack Integration">
    **How to trigger:**
    - Use the "Update docs" message action on any message
    - Tag @Promptless in a channel or thread
    
    **Best for:** Support channels where customer questions reveal documentation gaps
    
    **Image processing:** Automatically includes relevant images from Slack threads in documentation updates, with secure S3 storage and proper formatting.
    
    <Tip>
    Particularly useful in Slack Connect channels with customers to capture common questions for documentation.
    </Tip>
  </Accordion>

  <Accordion title="Intercom Conversations">
    **Automatic triggers:**
    - When customer conversations are closed
    - When team members add notes to conversations
    
    **Purpose:** Identifies patterns in customer support to improve documentation and reduce future tickets.
  </Accordion>
</AccordionGroup>

## Follow-on Requests

<Info title="Iterative Improvements">
After any trigger creates documentation suggestions, you can provide additional feedback or request specific changes. Promptless will process your follow-on requests and update the documentation accordingly.
</Info>

---

Need a trigger type that isn't supported? Contact us at [help@gopromptless.ai](mailto:help@gopromptless.ai) - we regularly add new trigger types based on user feedback.