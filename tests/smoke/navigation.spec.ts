import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { startPreviewServer, type PreviewServer } from './preview-server';

let preview: PreviewServer;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getPrimaryNav(html: string): string {
  const nav = html.match(/<nav[^>]*aria-label="Primary"[^>]*>[\s\S]*?<\/nav>/i)?.[0];
  assert.ok(nav, 'Primary nav was not rendered.');
  return nav;
}

function assertLink(navHtml: string, href: string, label: string) {
  const pattern = new RegExp(
    `<a(?=[^>]*href="${escapeRegExp(href)}")[^>]*>\\s*${escapeRegExp(label)}\\s*</a>`,
    'i'
  );
  assert.match(navHtml, pattern, `Missing nav link ${label} -> ${href}`);
}

function assertActiveLink(navHtml: string, href: string, label: string) {
  const pattern = new RegExp(
    `<a(?=[^>]*href="${escapeRegExp(href)}")(?=[^>]*class="[^"]*\\bactive\\b[^"]*")[^>]*>\\s*${escapeRegExp(
      label
    )}\\s*</a>`,
    'i'
  );
  assert.match(navHtml, pattern, `Expected ${href} to be active for ${label}.`);
}

function assertInactiveLink(navHtml: string, href: string, label: string) {
  const pattern = new RegExp(
    `<a(?=[^>]*href="${escapeRegExp(href)}")(?=[^>]*class="[^"]*\\bactive\\b[^"]*")[^>]*>\\s*${escapeRegExp(
      label
    )}\\s*</a>`,
    'i'
  );
  assert.doesNotMatch(navHtml, pattern, `Did not expect ${href} to be active for ${label}.`);
}

before(async () => {
  preview = await startPreviewServer();
});

after(async () => {
  await preview.close();
});

test('primary nav uses canonical blog/changelog routes', async () => {
  const response = await fetch(`${preview.baseUrl}/docs/getting-started/welcome`);
  assert.equal(response.status, 200);
  const html = await response.text();
  const nav = getPrimaryNav(html);
  assertLink(nav, '/docs', 'Docs');
  assertLink(nav, '/blog', 'Blog');
  assertLink(nav, '/changelog', 'Changelog');
  assert.doesNotMatch(nav, /href="\/blog\/all"/);
  assert.doesNotMatch(nav, /href="\/changelog\/all"/);
});

test('docs/blog/changelog active state is correct', async () => {
  const docsHtml = await (await fetch(`${preview.baseUrl}/docs/getting-started/welcome`)).text();
  const blogHtml = await (await fetch(`${preview.baseUrl}/blog`)).text();
  const changelogHtml = await (await fetch(`${preview.baseUrl}/changelog`)).text();

  const docsNav = getPrimaryNav(docsHtml);
  assertActiveLink(docsNav, '/docs', 'Docs');
  assertInactiveLink(docsNav, '/blog', 'Blog');
  assertInactiveLink(docsNav, '/changelog', 'Changelog');

  const blogNav = getPrimaryNav(blogHtml);
  assertActiveLink(blogNav, '/blog', 'Blog');
  assertInactiveLink(blogNav, '/docs', 'Docs');
  assertInactiveLink(blogNav, '/changelog', 'Changelog');

  const changelogNav = getPrimaryNav(changelogHtml);
  assertActiveLink(changelogNav, '/changelog', 'Changelog');
  assertInactiveLink(changelogNav, '/docs', 'Docs');
  assertInactiveLink(changelogNav, '/blog', 'Blog');
});

test('/blog/all and /changelog/all remain compatibility redirects', async () => {
  const blogAll = await fetch(`${preview.baseUrl}/blog/all`, { redirect: 'manual' });
  if (blogAll.status >= 300 && blogAll.status < 400) {
    assert.equal(blogAll.headers.get('location'), '/blog');
  } else {
    assert.equal(blogAll.status, 200);
    const body = await blogAll.text();
    assert.match(body, /Redirecting to: \/blog/);
  }

  const changelogAll = await fetch(`${preview.baseUrl}/changelog/all`, { redirect: 'manual' });
  if (changelogAll.status >= 300 && changelogAll.status < 400) {
    assert.equal(changelogAll.headers.get('location'), '/changelog');
  } else {
    assert.equal(changelogAll.status, 200);
    const body = await changelogAll.text();
    assert.match(body, /Redirecting to: \/changelog/);
  }
});
