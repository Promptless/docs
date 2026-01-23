# Triggers

Triggers are events that initiate automated documentation updates in Promptless. They're designed to integrate seamlessly into your existing workflow, minimizing friction when creating and maintaining documentation.

## Supported Triggers

<CardGroup cols={2}>
  <Card title="GitHub/Bitbucket/GitLab" icon="fa-code-pull-request">
    Automatically triggered when PRs/MRs are opened or commits are pushed to your source repositories
  </Card>
  
  <Card title="Slack Integration" icon="brands slack">
    Trigger updates from Slack conversations and support threads
  </Card>
</CardGroup>

### GitHub / Bitbucket / GitLab

Promptless automatically monitors your specified source repositories for new pull requests or direct commits. When a PR/MR is opened or a commit is pushed to your default branch, the system analyzes the changes to determine if documentation updates are needed.

During analysis, Promptless processes information such as the code diff, PR title, and PR description to understand the context and scope of changes. This information is used solely for generating documentation suggestions and is not stored by Promptless.

You can configure specific directories to monitor, focusing documentation efforts on relevant parts of your codebase.

<AccordionGroup>
  <Accordion title="GitHub Commit Triggers">
    In addition to monitoring pull requests, GitHub can be configured to trigger on direct commits to your default branch. This is useful for teams that commit directly to main/master without using pull requests.
    
    When you create or edit a project, select "GitHub Commit" as your trigger type and choose which repository to monitor. Promptless will analyze commits to your default branch and automatically skip commits that originated from pull requests we already processed.

<Frame>
  <img src="https://promptless-customer-doc-assets.s3.amazonaws.com/docs-images/org_2lvkgU9erOFxYhtEVVC0ymPrPdF/github-commit-trigger-project-config.png" alt="GitHub Commit trigger project configuration showing branch monitoring" />
</Frame>
  </Accordion>
  
  <Accordion title="Auto-publish Mode">
    When auto-publish is enabled for your project:
    - Promptless automatically creates a new PR with suggested documentation changes
    - The documentation PR is linked in a comment on the original code PR
  </Accordion>
</AccordionGroup>

<Warning>
Promptless automatically skips draft pull requests. Documentation updates are only triggered when the pull request is marked as ready for review.
</Warning>

### Slack Integration

Slack integration enables documentation updates directly from your team conversations. This is particularly useful for support conversations or internal discussions where questions arise that could be better addressed in your documentation.

**Trigger methods:**
- **Message Action**: Use the Promptless message shortcut on any Slack message to trigger documentation analysis
- **Mentions**: Tag @Promptless in a channel to request documentation updates based on the conversation context
- **Passive Listening** (optional): Enable automatic monitoring of specific channels for hands-free documentation updates. You can configure it in product-releases channel, or customer-support channels.

#### Image Processing in Slack Threads

When triggered in threads containing images, Promptless analyzes both text and visual content. Relevant images are automatically included in documentation updates, securely stored, and formatted for your documentation platform.

<Note>
Need a trigger type that isn't currently supported? Contact us at [help@gopromptless.ai](mailto:help@gopromptless.ai) - we regularly add new trigger types based on user feedback.
</Note>
