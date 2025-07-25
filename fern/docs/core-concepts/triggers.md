# Triggers

Triggers are events that initiate automated documentation updates in Promptless. They're designed to integrate seamlessly into your existing workflow, minimizing friction when creating and maintaining documentation.

## Supported Triggers

<CardGroup cols={2}>
  <Card title="GitHub/Bitbucket/Gitlab" icon="brands github">
    Automatically triggered when PRs/MRs are opened in your source repositories
  </Card>
  
  <Card title="Slack Integration" icon="brands slack">
    Trigger updates from Slack conversations and support threads
  </Card>
</CardGroup>

### GitHub / Bitbucket / Gitlab

Promptless automatically monitors your specified source repositories for new pull requests. When a PR/MR is opened, the system analyzes the changes to determine if documentation updates are needed.

<AccordionGroup>
  <Accordion title="Auto-publish Mode">
    When auto-publish is enabled for your project:
    - Promptless automatically creates a new PR with suggested documentation changes
    - The documentation PR is linked in a comment on the original code PR
  </Accordion>

  <Accordion title="Follow-on Requests (Github-Only)">
    During the review process, you can request additional changes:
    - By leaving a single comment tagging @Promptless
    - By creating comments as part of a review and tag Promptless in the final submission comment
  </Accordion>
</AccordionGroup>

<Note>
Promptless automatically skips draft pull requests. Documentation updates are only triggered when the pull request is marked as ready for review.
</Note>

### Slack Integration

Slack integration enables documentation updates directly from your team conversations, particularly useful for support conversations or internal discussions that may result in a doc change.

**Trigger methods:**
- **Message Action**: Use the Promptless message shortcut on any Slack message
- **Mentions**: Tag @Promptless in a channel to request documentation updates

<Tip>
This feature is especially valuable in Slack Connect support channels where customer questions reveal documentation gaps.
</Tip>

#### Image Processing in Slack Threads

Promptless can analyze both text and images from Slack threads to create comprehensive documentation updates.

**Image processing capabilities:**
- Analyzes images shared in threads when Promptless is triggered
- Includes relevant images in documentation updates when they provide valuable context
- Securely stores images in a Promptless-managed S3 bucket
- Formats images appropriately for your documentation platform

<AccordionGroup>
  <Accordion title="How Image Processing Works">
    1. Tag @Promptless or use "Update docs" message action in a thread with images
    2. Promptless analyzes both text content and images in the thread
    3. Relevant images are included in the documentation suggestions
    4. During review, you can approve or modify the images before publishing
  </Accordion>
</AccordionGroup>

<Note>
Need a trigger type that isn't currently supported? Contact us at [help@gopromptless.ai](mailto:help@gopromptless.ai) - we regularly add new trigger types based on user feedback.
</Note>