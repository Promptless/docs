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

### GitHub / Bitbucket / GitLab

Promptless automatically monitors your specified source repositories for new pull requests. When a PR/MR is opened, the system analyzes the changes to determine if documentation updates are needed.

During analysis, Promptless processes information such as the code diff, PR title, and PR description to understand the context and scope of changes. This information is used solely for generating documentation suggestions and is not stored by Promptless.

**How it works:**
- By default, suggestions are available in the Promptless dashboard for review
- If no documentation changes are needed, Promptless leaves a comment indicating this
- You can configure specific directories to monitor, focusing documentation efforts on relevant parts of your codebase

<AccordionGroup>
  <Accordion title="Auto-publish Mode">
    When auto-publish is enabled for your project:
    - Promptless automatically creates a new PR with suggested documentation changes
    - The documentation PR is linked in a comment on the original code PR
    - This streamlines the documentation process by integrating directly into your code review workflow
  </Accordion>

  <Accordion title="Follow-on Requests (GitHub-Only)">
    During the review process, you can request additional changes or provide specific feedback:
    - Leave a single comment tagging @Promptless with your instructions
    - Create comments as part of a review and tag Promptless in the final submission comment
    - Promptless will process your request and suggest updated changes based on your input
  </Accordion>
</AccordionGroup>

<Warning>
Promptless automatically skips draft pull requests. Documentation updates are only triggered when the pull request is marked as ready for review.
</Warning>

### Slack Integration

Slack integration enables documentation updates directly from your team conversations. This is particularly useful for support conversations or internal discussions where questions arise that could be better addressed in your documentation.

**Common use cases:**
- Slack Connect support channels where customers ask questions about your product
- Internal team discussions that reveal documentation gaps
- Support threads where your team provides answers that should be documented

**Trigger methods:**
- **Message Action**: Use the Promptless message shortcut on any Slack message to trigger documentation analysis
- **Mentions**: Tag @Promptless in a channel to request documentation updates based on the conversation context

<Tip>
This feature is especially valuable in Slack Connect support channels where customer questions reveal documentation gaps that need to be addressed.
</Tip>

#### Image Processing in Slack Threads

Promptless can process images shared in Slack threads when triggered, enhancing documentation with visual context.

**How it works:**
- When you tag @Promptless or use the "Update docs" message action in a thread containing images, Promptless analyzes both text and images
- If an image provides valuable context, Promptless includes it in the documentation updates
- Images are securely stored in a Promptless-managed S3 bucket and properly formatted for your documentation platform
- During review, you can see and approve the images that Promptless has added to the documentation

<Tip>
This feature requires the latest version of the Slack integration with appropriate permissions. See the [Slack Integration](/integrations/slack) page for more details.
</Tip>

<Note>
Need a trigger type that isn't currently supported? Contact us at [help@gopromptless.ai](mailto:help@gopromptless.ai) - we regularly add new trigger types based on user feedback.
</Note>