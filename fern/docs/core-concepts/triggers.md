# Triggers

Triggers are events that initiate automated documentation updates in Promptless. They're designed to integrate seamlessly into your existing workflow, minimizing friction when creating and maintaining documentation.

## Supported Triggers

<CardGroup cols={2}>
  <Card title="GitHub/Bitbucket/GitLab" icon="fa-code-pull-request">
    Automatically triggered when PRs/MRs are opened in your source repositories
  </Card>
  
  <Card title="Slack Integration" icon="brands slack">
    Trigger updates from Slack conversations and support threads
  </Card>
</CardGroup>

{/* TODO: Include screenshot of trigger configuration in Promptless dashboard when creating/editing a project */}

### GitHub / Bitbucket / GitLab

Promptless automatically monitors your specified source repositories for new pull requests. When a PR/MR is opened, the system analyzes the changes to determine if documentation updates are needed.

During analysis, Promptless processes information such as the code diff, PR title, and PR description to understand the context and scope of changes. This information is used solely for generating documentation suggestions and is not stored by Promptless.

You can configure specific directories to monitor, focusing documentation efforts on relevant parts of your codebase.

{/* TODO: Include screenshot of a GitHub PR that triggered Promptless, showing the PR with Promptless analysis */}

<AccordionGroup>
  <Accordion title="Auto-publish Mode">
    When auto-publish is enabled for your project:
    - Promptless automatically creates a new PR with suggested documentation changes
    - The documentation PR is linked in a comment on the original code PR
    
    {/* TODO: Include screenshot of documentation PR created by Promptless with comment linking back to original code PR */}
  </Accordion>
</AccordionGroup>

<Warning>
Promptless automatically skips draft pull requests. Documentation updates are only triggered when the pull request is marked as ready for review.
</Warning>

### Slack Integration

Slack integration enables documentation updates directly from your team conversations. This is particularly useful for support conversations or internal discussions where questions arise that could be better addressed in your documentation.

**Trigger methods:**
- **Message Action**: Use the Promptless message shortcut on any Slack message to trigger documentation analysis
  {/* TODO: Include screenshot of Slack message with message actions menu showing Promptless shortcut */}
  
- **Mentions**: Tag @Promptless in a channel to request documentation updates based on the conversation context
  {/* TODO: Include screenshot of Slack channel with @Promptless mention in a message */}
  
- **Passive Listening** (optional): Enable automatic monitoring of specific channels for hands-free documentation updates. You can configure it in product-releases channel, or customer-support channels.
  {/* TODO: Include screenshot of Promptless dashboard showing passive listening channel configuration */}

#### Image Processing in Slack Threads

When triggered in threads containing images, Promptless analyzes both text and visual content. Relevant images are automatically included in documentation updates, securely stored, and formatted for your documentation platform.

{/* TODO: Include screenshot of Slack thread with images and how Promptless processes them in documentation suggestions */}

<Note>
Need a trigger type that isn't currently supported? Contact us at [help@gopromptless.ai](mailto:help@gopromptless.ai) - we regularly add new trigger types based on user feedback.
</Note>