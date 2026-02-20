import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { GeneratedRedirectManifest, RouteManifestEntry } from '../src/lib/route-manifest';

const ROOT = process.cwd();
const LIVE_ROUTES_PATH = path.join(ROOT, 'migration', 'live-routes.json');
const ROUTE_MANIFEST_PATH = path.join(ROOT, 'migration', 'route-manifest.json');
const REDIRECTS_PATH = path.join(ROOT, 'migration', 'redirects.generated.json');
const VERCEL_CONFIG_PATH = path.join(ROOT, 'vercel.json');
const BLOG_INDEX_PATH = path.join(ROOT, 'dist', 'blog', 'index.html');
const BLOG_ALL_PATH = path.join(ROOT, 'dist', 'blog', 'all', 'index.html');
const CHANGELOG_INDEX_PATH = path.join(ROOT, 'dist', 'changelog', 'index.html');
const CHANGELOG_ALL_PATH = path.join(ROOT, 'dist', 'changelog', 'all', 'index.html');
const ROOT_INDEX_PATH = path.join(ROOT, 'dist', 'index.html');
const HOME_INDEX_PATH = path.join(ROOT, 'dist', 'home', 'index.html');
const DEMO_INDEX_PATH = path.join(ROOT, 'dist', 'demo', 'index.html');
const PRICING_INDEX_PATH = path.join(ROOT, 'dist', 'pricing', 'index.html');
const SITE_DEMO_PATH = path.join(ROOT, 'dist', 'site', 'demo', 'index.html');
const SITE_INDEX_PATH = path.join(ROOT, 'dist', 'site', 'index.html');
const VIDEO_DEMO_PATH = path.join(ROOT, 'dist', 'video-demo', 'index.html');
const USE_CASES_PATH = path.join(ROOT, 'dist', 'use-cases', 'index.html');
const FAQ_PATH = path.join(ROOT, 'dist', 'faq', 'index.html');
const API_REFERENCE_PATH = path.join(ROOT, 'dist', 'api-reference', 'index.html');

interface VercelConfig {
  redirects?: Array<{
    source: string;
    destination: string;
    permanent?: boolean;
  }>;
}

function normalizePath(input: string): string {
  if (!input) return '/';
  let value = input.trim();
  if (!value.startsWith('/')) value = `/${value}`;
  value = value.replace(/\/+/g, '/');
  if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
  return value;
}

function fail(message: string): never {
  throw new Error(message);
}

async function main() {
  const liveRaw = await readFile(LIVE_ROUTES_PATH, 'utf8');
  const routeRaw = await readFile(ROUTE_MANIFEST_PATH, 'utf8');
  const redirectsRaw = await readFile(REDIRECTS_PATH, 'utf8');
  const vercelRaw = await readFile(VERCEL_CONFIG_PATH, 'utf8');

  const livePayload = JSON.parse(liveRaw) as { routes?: string[] } | string[];
  const routeManifest = JSON.parse(routeRaw) as RouteManifestEntry[];
  const redirects = JSON.parse(redirectsRaw) as GeneratedRedirectManifest;
  const vercelConfig = JSON.parse(vercelRaw) as VercelConfig;

  const liveRoutes = Array.isArray(livePayload) ? livePayload : (livePayload.routes ?? []);

  const accepted = new Set<string>([
    ...routeManifest.map((entry) => normalizePath(entry.routePath)),
    ...redirects.redirects.map((entry) => normalizePath(entry.source)),
    ...redirects.redirects.map((entry) => normalizePath(entry.destination)),
    '/',
    '/home',
    '/docs',
    '/demo',
    '/pricing',
    '/site',
    '/site/demo',
    '/video-demo',
    '/use-cases',
    '/faq',
    '/api-reference',
    '/blog',
    '/changelog',
    '/llms.txt',
    '/llms-full.txt',
  ]);

  const missing: string[] = [];

  for (const fullUrl of liveRoutes) {
    const pathname = normalizePath(new URL(fullUrl).pathname);
    if (!accepted.has(pathname)) {
      missing.push(pathname);
    }
  }

  if (missing.length > 0) {
    console.error('Route parity check failed. Missing routes:');
    for (const route of missing) {
      console.error(`- ${route}`);
    }
    process.exit(1);
  }

  const [
    rootIndexHtml,
    homeIndexHtml,
    demoIndexHtml,
    pricingIndexHtml,
    siteDemoHtml,
    siteIndexHtml,
    videoDemoHtml,
    useCasesHtml,
    faqHtml,
    apiReferenceHtml,
    blogIndexHtml,
    blogAllHtml,
    changelogIndexHtml,
    changelogAllHtml,
  ] = await Promise.all([
    readFile(ROOT_INDEX_PATH, 'utf8'),
    readFile(HOME_INDEX_PATH, 'utf8'),
    readFile(DEMO_INDEX_PATH, 'utf8'),
    readFile(PRICING_INDEX_PATH, 'utf8'),
    readFile(SITE_DEMO_PATH, 'utf8'),
    readFile(SITE_INDEX_PATH, 'utf8'),
    readFile(VIDEO_DEMO_PATH, 'utf8'),
    readFile(USE_CASES_PATH, 'utf8'),
    readFile(FAQ_PATH, 'utf8'),
    readFile(API_REFERENCE_PATH, 'utf8'),
    readFile(BLOG_INDEX_PATH, 'utf8'),
    readFile(BLOG_ALL_PATH, 'utf8'),
    readFile(CHANGELOG_INDEX_PATH, 'utf8'),
    readFile(CHANGELOG_ALL_PATH, 'utf8'),
  ]);

  if (/^<!doctype html><title>Redirecting/i.test(rootIndexHtml.trim())) {
    fail('Astro build still treats / as a redirect. Root must render the website homepage.');
  }
  if (!rootIndexHtml.includes('pl-site-page')) {
    fail('Astro build for / must include website shell markup (pl-site-page).');
  }
  if (!/Redirecting to: \//i.test(homeIndexHtml)) {
    fail('Astro build must keep /home as a compatibility redirect to /.');
  }
  if (!demoIndexHtml.includes('Video Demo')) {
    fail('Astro build for /demo must render the website demo page.');
  }
  if (!pricingIndexHtml.includes('Pricing')) {
    fail('Astro build for /pricing must render the website pricing page.');
  }
  if (!/Redirecting to: \/demo/i.test(siteIndexHtml)) {
    fail('Astro build must keep /site as a compatibility redirect to /demo.');
  }
  if (!/Redirecting to: \/demo/i.test(siteDemoHtml)) {
    fail('Astro build must keep /site/demo as a compatibility redirect to /demo.');
  }
  if (!/Redirecting to: \/demo/i.test(videoDemoHtml)) {
    fail('Astro build must keep /video-demo as a compatibility redirect to /demo.');
  }
  if (!/Redirecting to: \//i.test(useCasesHtml)) {
    fail('Astro build must keep /use-cases as a compatibility redirect to /.');
  }
  if (!/Redirecting to: \//i.test(faqHtml)) {
    fail('Astro build must keep /faq as a compatibility redirect to /.');
  }
  if (!/Redirecting to: \//i.test(apiReferenceHtml)) {
    fail('Astro build must keep /api-reference as a compatibility redirect to /.');
  }

  if (/^<!doctype html><title>Redirecting/i.test(blogIndexHtml.trim())) {
    fail('Astro build still treats /blog as a redirect. It must be a canonical index page.');
  }
  if (/^<!doctype html><title>Redirecting/i.test(changelogIndexHtml.trim())) {
    fail('Astro build still treats /changelog as a redirect. It must be a canonical index page.');
  }
  if (!/Redirecting to: \/blog/i.test(blogAllHtml)) {
    fail('Astro build must keep /blog/all as a compatibility redirect to /blog.');
  }
  if (!/Redirecting to: \/changelog/i.test(changelogAllHtml)) {
    fail('Astro build must keep /changelog/all as a compatibility redirect to /changelog.');
  }

  const vercelRedirectMap = new Map(
    (vercelConfig.redirects ?? []).map((rule) => [normalizePath(rule.source), normalizePath(rule.destination)])
  );

  if (vercelRedirectMap.has('/blog')) {
    fail(`vercel.json must not redirect /blog, but found ${vercelRedirectMap.get('/blog')}.`);
  }
  if (vercelRedirectMap.has('/changelog')) {
    fail(`vercel.json must not redirect /changelog, but found ${vercelRedirectMap.get('/changelog')}.`);
  }
  if (vercelRedirectMap.has('/')) {
    fail(`vercel.json must not redirect /, but found ${vercelRedirectMap.get('/')}.`);
  }
  if (vercelRedirectMap.get('/blog/all') !== '/blog') {
    fail(
      `vercel.json must redirect /blog/all to /blog, found ${
        vercelRedirectMap.get('/blog/all') ?? 'none'
      }.`
    );
  }
  if (vercelRedirectMap.get('/changelog/all') !== '/changelog') {
    fail(
      `vercel.json must redirect /changelog/all to /changelog, found ${
        vercelRedirectMap.get('/changelog/all') ?? 'none'
      }.`
    );
  }
  if (vercelRedirectMap.get('/home') !== '/') {
    fail(`vercel.json must redirect /home to /, found ${vercelRedirectMap.get('/home') ?? 'none'}.`);
  }
  if (vercelRedirectMap.get('/site') !== '/demo') {
    fail(`vercel.json must redirect /site to /demo, found ${vercelRedirectMap.get('/site') ?? 'none'}.`);
  }
  if (vercelRedirectMap.get('/site/demo') !== '/demo') {
    fail(
      `vercel.json must redirect /site/demo to /demo, found ${
        vercelRedirectMap.get('/site/demo') ?? 'none'
      }.`
    );
  }
  if (vercelRedirectMap.get('/video-demo') !== '/demo') {
    fail(
      `vercel.json must redirect /video-demo to /demo, found ${
        vercelRedirectMap.get('/video-demo') ?? 'none'
      }.`
    );
  }
  if (vercelRedirectMap.get('/use-cases') !== '/') {
    fail(
      `vercel.json must redirect /use-cases to /, found ${
        vercelRedirectMap.get('/use-cases') ?? 'none'
      }.`
    );
  }
  if (vercelRedirectMap.get('/faq') !== '/') {
    fail(`vercel.json must redirect /faq to /, found ${vercelRedirectMap.get('/faq') ?? 'none'}.`);
  }
  if (vercelRedirectMap.get('/api-reference') !== '/') {
    fail(
      `vercel.json must redirect /api-reference to /, found ${
        vercelRedirectMap.get('/api-reference') ?? 'none'
      }.`
    );
  }

  console.log(`Route parity check passed for ${liveRoutes.length} live routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
