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
    '/docs',
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

  const [blogIndexHtml, blogAllHtml, changelogIndexHtml, changelogAllHtml] = await Promise.all([
    readFile(BLOG_INDEX_PATH, 'utf8'),
    readFile(BLOG_ALL_PATH, 'utf8'),
    readFile(CHANGELOG_INDEX_PATH, 'utf8'),
    readFile(CHANGELOG_ALL_PATH, 'utf8'),
  ]);

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

  console.log(`Route parity check passed for ${liveRoutes.length} live routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
