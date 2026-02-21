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

test('homepage, demo, meet, and pricing render website content', async () => {
  const homeResponse = await fetch(`${preview.baseUrl}/`);
  assert.equal(homeResponse.status, 200);
  const homeHtml = await homeResponse.text();
  assert.match(homeHtml, /pl-site-page/);
  assert.match(homeHtml, /AI agent for your/);
  assert.match(homeHtml, /How Promptless works/);
  assert.match(homeHtml, /Demo/);
  assert.match(homeHtml, /Pricing/);
  assert.doesNotMatch(homeHtml, /Getting Started/i);
  assert.match(homeHtml, /data-site-icon="home"/);
  assert.match(homeHtml, /data-site-icon="video"/);
  assert.match(homeHtml, /data-site-icon="pricing"/);
  assert.match(homeHtml, /data-site-icon="meet"/);

  const demoResponse = await fetch(`${preview.baseUrl}/demo`);
  assert.equal(demoResponse.status, 200);
  const demoHtml = await demoResponse.text();
  assert.match(demoHtml, /Demo/);
  assert.match(demoHtml, /Introducing Promptless 1\.0/);
  assert.match(demoHtml, /tella\.tv/);

  const meetResponse = await fetch(`${preview.baseUrl}/meet`);
  assert.equal(meetResponse.status, 200);
  const meetHtml = await meetResponse.text();
  assert.match(meetHtml, /Meet/);
  assert.match(meetHtml, /15-minute discovery call/i);

  const pricingResponse = await fetch(`${preview.baseUrl}/pricing`);
  assert.equal(pricingResponse.status, 200);
  const pricingHtml = await pricingResponse.text();
  assert.match(pricingHtml, /Pricing/);
  assert.match(pricingHtml, /Startup/);
  assert.match(pricingHtml, /Growth/);
  assert.match(pricingHtml, /Enterprise/);
  assert.match(pricingHtml, /\$500\s*\/\s*mo/);
  assert.match(pricingHtml, /All plans include a 30-day free trial\./);
  assert.match(pricingHtml, /200 Pages\*/);
  assert.match(pricingHtml, /Pages are normalized/);
  assert.match(pricingHtml, /name=\"growth_bundle\"/);
  assert.match(pricingHtml, /200-500 articles/);
  assert.match(pricingHtml, /500-1,000 articles/);
  assert.match(pricingHtml, /1,000-2,000 articles/);
  assert.match(pricingHtml, /2,000-5,000 articles/);
  assert.match(pricingHtml, /Slack \+ GitHub integrations/);
  assert.match(pricingHtml, /Open-source, non-commercial project\?/);
  assert.match(pricingHtml, /href=\"https:\/\/promptless\.ai\/oss\"/);
  assert.match(pricingHtml, /Book demo/);
  assert.doesNotMatch(pricingHtml, /<h3>Compare plans<\/h3>/);
});

test('website header renders expected CTAs and search control', async () => {
  const response = await fetch(`${preview.baseUrl}/`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /href="https:\/\/accounts\.gopromptless\.ai\/signup"[^>]*>\s*Sign up/i);
  assert.match(html, /href="https:\/\/cal\.com\/promptless\/demo"[^>]*>\s*Book demo/i);
  assert.match(html, /aria-label="Search"/i);
});

test('free tool page renders form fields and explanatory copy', async () => {
  const indexResponse = await fetch(`${preview.baseUrl}/free-tools`);
  assert.equal(indexResponse.status, 200);
  const indexHtml = await indexResponse.text();
  assert.match(indexHtml, /Free tools/i);
  assert.match(indexHtml, /Broken Link Report/i);

  const response = await fetch(`${preview.baseUrl}/free-tools/broken-link-report`);
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Broken Link Report/);
  assert.match(html, /Paste your site URL and email/i);
  assert.match(html, /name="url"/);
  assert.match(html, /name="email"/);
  assert.match(html, /Show advanced options/i);
  assert.match(html, /name="check_external"/);
  assert.match(html, /name="check_anchors"/);
  assert.match(html, /name="max_pages"/);
  assert.doesNotMatch(html, /name="concurrency"/);
  assert.doesNotMatch(html, /name="timeout_seconds"/);
  assert.match(html, /name="website"/);
  assert.match(html, /Send me the report/);

  assert.doesNotMatch(html, /data-website-sidebar="true"/);
});

test('website compatibility routes redirect to canonical destinations', async () => {
  const rootAliases = ['/home', '/use-cases', '/faq', '/api-reference'];
  for (const alias of rootAliases) {
    const response = await fetch(`${preview.baseUrl}${alias}`, { redirect: 'manual' });
    if (response.status >= 300 && response.status < 400) {
      assert.equal(response.headers.get('location'), '/');
      continue;
    }
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.match(body, /Redirecting to: \//);
  }

  const siteAliases = ['/site', '/site/demo', '/video-demo'];
  for (const alias of siteAliases) {
    const response = await fetch(`${preview.baseUrl}${alias}`, { redirect: 'manual' });
    if (response.status >= 300 && response.status < 400) {
      assert.equal(response.headers.get('location'), '/demo');
      continue;
    }
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.match(body, /Redirecting to: \/demo/);
  }
});
