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
const FREE_TOOLS_INDEX_PATH = path.join(ROOT, 'dist', 'free-tools', 'index.html');
const FREE_TOOL_REPORT_PATH = path.join(ROOT, 'dist', 'free-tools', 'broken-link-report', 'index.html');
const SITE_DEMO_PATH = path.join(ROOT, 'dist', 'site', 'demo', 'index.html');
const SITE_INDEX_PATH = path.join(ROOT, 'dist', 'site', 'index.html');
const VIDEO_DEMO_PATH = path.join(ROOT, 'dist', 'video-demo', 'index.html');
const PAGE_INDEX_PATH = path.join(ROOT, 'dist', 'page', 'index.html');
const WTD_INDEX_PATH = path.join(ROOT, 'dist', 'wtd', 'index.html');
const HN_INDEX_PATH = path.join(ROOT, 'dist', 'hn', 'index.html');
const USE_CASES_PATH = path.join(ROOT, 'dist', 'use-cases', 'index.html');
const FAQ_PATH = path.join(ROOT, 'dist', 'faq', 'index.html');
const API_REFERENCE_PATH = path.join(ROOT, 'dist', 'api-reference', 'index.html');
const PRIVACY_INDEX_PATH = path.join(ROOT, 'dist', 'privacy', 'index.html');
const TERMS_INDEX_PATH = path.join(ROOT, 'dist', 'terms', 'index.html');
const LEGACY_BLOG_INDEX_PATH = path.join(ROOT, 'dist', 'blog', 'customer-stories-vellum', 'index.html');

interface VercelConfig {
  redirects?: Array<{
    source: string;
    destination: string;
    permanent?: boolean;
    has?: Array<{
      type: string;
      value: string;
    }>;
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
    '/page',
    '/wtd',
    '/hn',
    '/docs',
    '/demo',
    '/pricing',
    '/free-tools',
    '/free-tools/broken-link-report',
    '/site',
    '/site/demo',
    '/video-demo',
    '/use-cases',
    '/faq',
    '/api-reference',
    '/blog',
    '/blog/customer-stories-vellum',
    '/changelog',
    '/privacy',
    '/terms',
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
    freeToolsIndexHtml,
    freeToolIndexHtml,
    siteDemoHtml,
    siteIndexHtml,
    videoDemoHtml,
    pageIndexHtml,
    wtdIndexHtml,
    hnIndexHtml,
    useCasesHtml,
    faqHtml,
    apiReferenceHtml,
    privacyIndexHtml,
    termsIndexHtml,
    legacyBlogHtml,
    blogIndexHtml,
    blogAllHtml,
    changelogIndexHtml,
    changelogAllHtml,
  ] = await Promise.all([
    readFile(ROOT_INDEX_PATH, 'utf8'),
    readFile(HOME_INDEX_PATH, 'utf8'),
    readFile(DEMO_INDEX_PATH, 'utf8'),
    readFile(PRICING_INDEX_PATH, 'utf8'),
    readFile(FREE_TOOLS_INDEX_PATH, 'utf8'),
    readFile(FREE_TOOL_REPORT_PATH, 'utf8'),
    readFile(SITE_DEMO_PATH, 'utf8'),
    readFile(SITE_INDEX_PATH, 'utf8'),
    readFile(VIDEO_DEMO_PATH, 'utf8'),
    readFile(PAGE_INDEX_PATH, 'utf8'),
    readFile(WTD_INDEX_PATH, 'utf8'),
    readFile(HN_INDEX_PATH, 'utf8'),
    readFile(USE_CASES_PATH, 'utf8'),
    readFile(FAQ_PATH, 'utf8'),
    readFile(API_REFERENCE_PATH, 'utf8'),
    readFile(PRIVACY_INDEX_PATH, 'utf8'),
    readFile(TERMS_INDEX_PATH, 'utf8'),
    readFile(LEGACY_BLOG_INDEX_PATH, 'utf8'),
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
  if (!demoIndexHtml.includes('Demo')) {
    fail('Astro build for /demo must render the website demo page.');
  }
  if (!pricingIndexHtml.includes('Pricing')) {
    fail('Astro build for /pricing must render the website pricing page.');
  }
  if (!freeToolsIndexHtml.includes('Free tools')) {
    fail('Astro build for /free-tools must render the free tools index page.');
  }
  if (!freeToolIndexHtml.includes('Broken Link Report')) {
    fail('Astro build for /free-tools/broken-link-report must render the free tools page.');
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
  if (!/Redirecting to: \//i.test(pageIndexHtml)) {
    fail('Astro build must keep /page as a compatibility redirect to /.');
  }
  if (!/Redirecting to: \//i.test(wtdIndexHtml)) {
    fail('Astro build must keep /wtd as a compatibility redirect to /.');
  }
  if (!/Redirecting to: \//i.test(hnIndexHtml)) {
    fail('Astro build must keep /hn as a compatibility redirect to /.');
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
  if (!privacyIndexHtml.includes('Privacy Policy')) {
    fail('Astro build for /privacy must render the privacy page.');
  }
  if (!termsIndexHtml.includes('Terms of Use')) {
    fail('Astro build for /terms must render the terms page.');
  }
  if (!/Redirecting to: \/blog\/customer-stories\/vellum/i.test(legacyBlogHtml)) {
    fail(
      'Astro build must keep /blog/customer-stories-vellum as a compatibility redirect to /blog/customer-stories/vellum.'
    );
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
  const vercelHostRedirects = vercelConfig.redirects ?? [];

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
  if (vercelRedirectMap.get('/page') !== '/') {
    fail(`vercel.json must redirect /page to /, found ${vercelRedirectMap.get('/page') ?? 'none'}.`);
  }
  if (vercelRedirectMap.get('/wtd') !== '/') {
    fail(`vercel.json must redirect /wtd to /, found ${vercelRedirectMap.get('/wtd') ?? 'none'}.`);
  }
  if (vercelRedirectMap.get('/hn') !== '/') {
    fail(`vercel.json must redirect /hn to /, found ${vercelRedirectMap.get('/hn') ?? 'none'}.`);
  }
  if (vercelRedirectMap.get('/blog/customer-stories-vellum') !== '/blog/customer-stories/vellum') {
    fail(
      'vercel.json must redirect /blog/customer-stories-vellum to /blog/customer-stories/vellum, found '
        + `${vercelRedirectMap.get('/blog/customer-stories-vellum') ?? 'none'}.`
    );
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
  const hasPromptlessHostRedirect = (host: string): boolean =>
    vercelHostRedirects.some((rule) => {
      if (normalizePath(rule.source) !== '/:path*') return false;
      if (rule.destination !== 'https://promptless.ai/:path*') return false;
      return (rule.has ?? []).some((condition) => condition.type === 'host' && condition.value === host);
    });
  if (!hasPromptlessHostRedirect('docs.promptless.ai')) {
    fail('vercel.json must redirect docs.promptless.ai host traffic to https://promptless.ai/:path*.');
  }
  if (!hasPromptlessHostRedirect('docs.gopromptless.ai')) {
    fail('vercel.json must redirect docs.gopromptless.ai host traffic to https://promptless.ai/:path*.');
  }

  console.log(`Route parity check passed for ${liveRoutes.length} live routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
