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
    `<a(?=[^>]*href="${escapeRegExp(href)}")[^>]*>[\\s\\S]*?${escapeRegExp(label)}[\\s\\S]*?<\\/a>`,
    'i'
  );
  assert.match(navHtml, pattern, `Missing nav link ${label} -> ${href}`);
}

function assertActiveLink(navHtml: string, href: string, label: string) {
  const pattern = new RegExp(
    `<a(?=[^>]*href="${escapeRegExp(href)}")(?=[^>]*class="[^"]*\\bactive\\b[^"]*")[^>]*>[\\s\\S]*?${escapeRegExp(
      label
    )}[\\s\\S]*?<\\/a>`,
    'i'
  );
  assert.match(navHtml, pattern, `Expected ${href} to be active for ${label}.`);
}

function assertInactiveLink(navHtml: string, href: string, label: string) {
  const pattern = new RegExp(
    `<a(?=[^>]*href="${escapeRegExp(href)}")(?=[^>]*class="[^"]*\\bactive\\b[^"]*")[^>]*>[\\s\\S]*?${escapeRegExp(
      label
    )}[\\s\\S]*?<\\/a>`,
    'i'
  );
  assert.doesNotMatch(navHtml, pattern, `Did not expect ${href} to be active for ${label}.`);
}

function assertLabelOrder(navHtml: string, labels: string[]) {
  let previousIndex = -1;
  for (const label of labels) {
    const index = navHtml.indexOf(label);
    assert.notEqual(index, -1, `Expected to find ${label} in primary nav.`);
    if (previousIndex !== -1) {
      assert.ok(previousIndex < index, `Expected ${label} after previous primary nav item.`);
    }
    previousIndex = index;
  }
}

before(async () => {
  preview = await startPreviewServer();
});

after(async () => {
  await preview.close();
});

test('primary nav keeps canonical routes with free tools tab', async () => {
  const response = await fetch(`${preview.baseUrl}/docs/getting-started/welcome`);
  assert.equal(response.status, 200);
  const html = await response.text();
  const nav = getPrimaryNav(html);

  assertLink(nav, '/', 'Website');
  assertLink(nav, '/docs', 'Docs');
  assertLink(nav, '/blog', 'Blog');
  assertLink(nav, '/changelog', 'Changelog');
  assertLink(nav, '/free-tools', 'Free tools');
  assertLink(nav, 'https://app.gopromptless.ai', 'Sign in');

  assertLabelOrder(nav, ['Website', 'Docs', 'Blog', 'Changelog', 'Free tools', 'Sign in']);
  assert.doesNotMatch(nav, /href="\/blog\/all"/);
  assert.doesNotMatch(nav, /href="\/changelog\/all"/);
});

test('website/docs/blog/changelog/free tools active state is correct', async () => {
  const websiteHtml = await (await fetch(`${preview.baseUrl}/`)).text();
  const websiteDemoHtml = await (await fetch(`${preview.baseUrl}/demo`)).text();
  const websiteMeetHtml = await (await fetch(`${preview.baseUrl}/meet`)).text();
  const websitePricingHtml = await (await fetch(`${preview.baseUrl}/pricing`)).text();
  const docsHtml = await (await fetch(`${preview.baseUrl}/docs/getting-started/welcome`)).text();
  const blogHtml = await (await fetch(`${preview.baseUrl}/blog`)).text();
  const changelogHtml = await (await fetch(`${preview.baseUrl}/changelog`)).text();
  const freeToolsIndexHtml = await (await fetch(`${preview.baseUrl}/free-tools`)).text();
  const freeToolsToolHtml = await (await fetch(`${preview.baseUrl}/free-tools/broken-link-report`)).text();

  const websiteNav = getPrimaryNav(websiteHtml);
  assertActiveLink(websiteNav, '/', 'Website');
  assertInactiveLink(websiteNav, '/docs', 'Docs');
  assertInactiveLink(websiteNav, '/blog', 'Blog');
  assertInactiveLink(websiteNav, '/changelog', 'Changelog');
  assertInactiveLink(websiteNav, '/free-tools', 'Free tools');

  const demoNav = getPrimaryNav(websiteDemoHtml);
  assertActiveLink(demoNav, '/', 'Website');

  const meetNav = getPrimaryNav(websiteMeetHtml);
  assertActiveLink(meetNav, '/', 'Website');

  const pricingNav = getPrimaryNav(websitePricingHtml);
  assertActiveLink(pricingNav, '/', 'Website');

  const docsNav = getPrimaryNav(docsHtml);
  assertActiveLink(docsNav, '/docs', 'Docs');
  assertInactiveLink(docsNav, '/', 'Website');
  assertInactiveLink(docsNav, '/blog', 'Blog');
  assertInactiveLink(docsNav, '/changelog', 'Changelog');
  assertInactiveLink(docsNav, '/free-tools', 'Free tools');

  const blogNav = getPrimaryNav(blogHtml);
  assertActiveLink(blogNav, '/blog', 'Blog');
  assertInactiveLink(blogNav, '/', 'Website');
  assertInactiveLink(blogNav, '/docs', 'Docs');
  assertInactiveLink(blogNav, '/changelog', 'Changelog');
  assertInactiveLink(blogNav, '/free-tools', 'Free tools');

  const changelogNav = getPrimaryNav(changelogHtml);
  assertActiveLink(changelogNav, '/changelog', 'Changelog');
  assertInactiveLink(changelogNav, '/', 'Website');
  assertInactiveLink(changelogNav, '/docs', 'Docs');
  assertInactiveLink(changelogNav, '/blog', 'Blog');
  assertInactiveLink(changelogNav, '/free-tools', 'Free tools');

  const freeToolsIndexNav = getPrimaryNav(freeToolsIndexHtml);
  assertActiveLink(freeToolsIndexNav, '/free-tools', 'Free tools');
  assertInactiveLink(freeToolsIndexNav, '/', 'Website');
  assertInactiveLink(freeToolsIndexNav, '/docs', 'Docs');
  assertInactiveLink(freeToolsIndexNav, '/blog', 'Blog');
  assertInactiveLink(freeToolsIndexNav, '/changelog', 'Changelog');

  const freeToolsToolNav = getPrimaryNav(freeToolsToolHtml);
  assertActiveLink(freeToolsToolNav, '/free-tools', 'Free tools');
  assertInactiveLink(freeToolsToolNav, '/', 'Website');
  assertInactiveLink(freeToolsToolNav, '/docs', 'Docs');
  assertInactiveLink(freeToolsToolNav, '/blog', 'Blog');
  assertInactiveLink(freeToolsToolNav, '/changelog', 'Changelog');
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

test('website routes are canonicalized to /, /demo, /meet, and /pricing', async () => {
  const homepage = await fetch(`${preview.baseUrl}/`);
  assert.equal(homepage.status, 200);
  const homepageHtml = await homepage.text();
  assert.match(homepageHtml, /pl-site-page/);
  assert.match(homepageHtml, /How Promptless works/);

  const homeAlias = await fetch(`${preview.baseUrl}/home`, { redirect: 'manual' });
  if (homeAlias.status >= 300 && homeAlias.status < 400) {
    assert.equal(homeAlias.headers.get('location'), '/');
  } else {
    assert.equal(homeAlias.status, 200);
    assert.match(await homeAlias.text(), /Redirecting to: \//);
  }

  const demo = await fetch(`${preview.baseUrl}/demo`);
  assert.equal(demo.status, 200);
  assert.match(await demo.text(), /Demo/);

  const meet = await fetch(`${preview.baseUrl}/meet`);
  assert.equal(meet.status, 200);
  assert.match(await meet.text(), /Meet/);

  const pricing = await fetch(`${preview.baseUrl}/pricing`);
  assert.equal(pricing.status, 200);
  assert.match(await pricing.text(), /Pricing/);

  const aliases = ['/site', '/site/demo', '/video-demo', '/use-cases', '/faq', '/api-reference'];
  for (const alias of aliases) {
    const aliasResponse = await fetch(`${preview.baseUrl}${alias}`, { redirect: 'manual' });
    if (aliasResponse.status >= 300 && aliasResponse.status < 400) {
      if (alias === '/site' || alias === '/site/demo' || alias === '/video-demo') {
        assert.equal(aliasResponse.headers.get('location'), '/demo');
      } else {
        assert.equal(aliasResponse.headers.get('location'), '/');
      }
      continue;
    }
    assert.equal(aliasResponse.status, 200);
    const body = await aliasResponse.text();
    if (alias === '/site' || alias === '/site/demo' || alias === '/video-demo') {
      assert.match(body, /Redirecting to: \/demo/);
    } else {
      assert.match(body, /Redirecting to: \//);
    }
  }
});
