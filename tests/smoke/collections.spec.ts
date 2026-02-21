import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { startPreviewServer, type PreviewServer } from './preview-server';

let preview: PreviewServer;

before(async () => {
  preview = await startPreviewServer();
});

after(async () => {
  await preview.close();
});

test('/blog and /changelog are browsable canonical index pages', async () => {
  const blogResponse = await fetch(`${preview.baseUrl}/blog`);
  assert.equal(blogResponse.status, 200);
  const blogHtml = await blogResponse.text();
  assert.match(blogHtml, /<h1[^>]*>\s*Blog\s*<\/h1>/);
  assert.match(blogHtml, /class="collection-feed"/);
  assert.match(blogHtml, /class="collection-feed-item"/);
  assert.match(blogHtml, /class="collection-tag"/);

  const changelogResponse = await fetch(`${preview.baseUrl}/changelog`);
  assert.equal(changelogResponse.status, 200);
  const changelogHtml = await changelogResponse.text();
  assert.match(changelogHtml, /<h1[^>]*>\s*Changelog\s*<\/h1>/);
  assert.match(changelogHtml, /class="collection-feed"/);
  assert.match(changelogHtml, /class="collection-feed-item"/);
});

test('blog and changelog detail pages include top and bottom canonical back links', async () => {
  const blogResponse = await fetch(`${preview.baseUrl}/blog/technical/i-must-scream`);
  assert.equal(blogResponse.status, 200);
  const blogHtml = await blogResponse.text();
  const blogBackLinks = blogHtml.match(/href="\/blog">← Back to Blog<\/a>/g) ?? [];
  assert.equal(blogBackLinks.length, 2, 'Expected top and bottom blog back links.');

  const changelogResponse = await fetch(`${preview.baseUrl}/changelog/changelogs/january-2026`);
  assert.equal(changelogResponse.status, 200);
  const changelogHtml = await changelogResponse.text();
  const changelogBackLinks =
    changelogHtml.match(/href="\/changelog">← Back to Changelog<\/a>/g) ?? [];
  assert.equal(changelogBackLinks.length, 2, 'Expected top and bottom changelog back links.');
});

test('llms endpoints remain available', async () => {
  const llms = await fetch(`${preview.baseUrl}/llms.txt`);
  assert.equal(llms.status, 200);
  const llmsBody = await llms.text();
  assert.match(llmsBody, /## Website/i);
  assert.match(llmsBody, /## Docs/i);

  const llmsFull = await fetch(`${preview.baseUrl}/llms-full.txt`);
  assert.equal(llmsFull.status, 200);
  const llmsFullBody = await llmsFull.text();
  assert.match(llmsFullBody, /## Website/i);
  assert.match(llmsFullBody, /## Docs/i);
});
