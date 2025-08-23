# Documentation Platforms

Documentation platforms are where your docs live. Whether you're using Git-synced CMSs such as Fern, Mintlify, Docusaurus, or other platforms such as Readme, Zendesk, and Intercom, you'll need to enable Promptless integrations to read from and publish to your existing docs.

## GitHub-Synced Documentation Platforms

The most common setup uses the **Promptless GitHub App** to integrate with documentation platforms that sync content from GitHub repositories. A list of platforms supported by the github integration:
- Fern
- Mintlify
- Readme (Refactored)
- Gitbook
- Docusaurus
- Mkdocs
- Hugo
- Ghost
- Nextra
- Vocs
- Custom CMS as long as the content is in a repo

For more detailed step-by-step instructions, go to the [GitHub integrations page](/docs/integrations/github-integration).

## Direct CMS Platform Integrations

For teams using content management systems that don't sync with GitHub, Promptless offers direct integrations with popular CMS platforms.

<CardGroup cols={2}>
  <Card title="Zendesk" href="/docs/integrations/zendesk-integration">
    Help center articles and knowledge base content management
  </Card>
  
  <Card title="Intercom" href="/integrations/intercom">
    Customer support documentation and help center content
  </Card>
  
  <Card title="Webflow" href="/integrations/webflow">
    Blog posts, collection items, and marketing site content
  </Card>
  
  <Card title="ReadMe API">
    Direct API integration for ReadMe-hosted docs not synced to GitHub
  </Card>
</CardGroup>

## Multi-Platform Publishing

Promptless can publish to multiple documentation locations simultaneously, allowing you to use the same trigger events and context sources across different platforms.

<Tip title="Best Practice">
For teams using multiple platforms, create separate projects for each documentation location to maintain clear separation of content and workflows.
</Tip>

## Requesting Additional Platforms

Need integration with a platform not currently supported? We're continuously expanding our platform integrations based on user feedback. Feel free to contact [help@gopromptless.ai](mailto:help@gopromptless.ai). Also contact us if you're hoping to migrate to a new docs platform and we'll be happy to help you choose and set up!