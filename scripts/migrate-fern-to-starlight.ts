import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import {
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import type { GeneratedRedirectManifest, RedirectRule, RouteManifestEntry } from '../src/lib/route-manifest';

const ROOT = process.cwd();
const FERN_DOCS_DIR = path.join(ROOT, 'fern', 'docs');
const FERN_CONFIG_PATH = path.join(ROOT, 'fern', 'docs.yml');
const SRC_CONTENT_DOCS = path.join(ROOT, 'src', 'content', 'docs');
const SRC_CONTENT_BLOG = path.join(ROOT, 'src', 'content', 'blog');
const SRC_CONTENT_CHANGELOG = path.join(ROOT, 'src', 'content', 'changelog');
const MERMAID_DIR = path.join(ROOT, 'public', 'mermaid');
const PUBLIC_ASSETS_DIR = path.join(ROOT, 'public', 'assets');
const FERN_ASSETS_DIR = path.join(ROOT, 'fern', 'docs', 'assets');
const MIGRATION_DIR = path.join(ROOT, 'migration');

const COMPONENT_NAMES = [
  'Frame',
  'Steps',
  'Step',
  'Card',
  'CardGroup',
  'Accordion',
  'AccordionGroup',
  'ParamField',
  'Info',
  'Note',
  'Tip',
  'Warning',
  'Success',
] as const;

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const ORPHAN_POLICIES = [
  {
    sourcePath: 'fern/docs/self-hosting/index.mdx',
    routePath: '/docs/self-hosting',
  },
  {
    sourcePath: 'fern/docs/self-hosting/kubernetes-helm.mdx',
    routePath: '/docs/self-hosting/kubernetes-helm',
  },
  {
    sourcePath: 'fern/docs/core-concepts/index.mdx',
    routePath: '/docs/core-concepts',
  },
  {
    sourcePath: 'fern/docs/core-concepts/context-sources.md',
    routePath: '/docs/core-concepts/context-sources',
  },
  {
    sourcePath: 'fern/docs/core-concepts/doc-locations.md',
    routePath: '/docs/core-concepts/doc-locations',
  },
  {
    sourcePath: 'fern/docs/core-concepts/triggers.md',
    routePath: '/docs/core-concepts/triggers',
  },
] as const;

const EXACT_REDIRECT_SUGGESTIONS: Record<string, string> = {
  '/features/providing-feedback': '/docs/how-to-use-promptless/providing-feedback',
  '/self-hosting/kubernetes-helm': '/docs/self-hosting/kubernetes-helm',
  '/docs/managing-accounts': '/docs/account-management/account-management',
  '/docs/security-and-privacy/data-handling-and-classification': '/docs/security-and-privacy/data-handling',
  '/docs/core-concepts/doc-c-m-ss': '/docs/core-concepts/doc-locations',
  '/docs/integrations/microsoft-teams': '/docs/integrations/microsoft-teams-integration',
  '/docs/integrations/slack': '/docs/integrations/slack-integration',
  '/docs/integrations/linear': '/docs/integrations/linear-integration',
  '/docs/integrations/bitbucket': '/docs/integrations/bitbucket-integration',
  '/docs/integrations/zendesk': '/docs/integrations/zendesk-integration',
  '/docs/integrations/intercom': '/docs/integrations/intercom-integration-beta',
  '/docs/features/slack-interactions': '/docs/how-to-use-promptless/working-with-slack',
  '/docs/configuration/triggers/github-commits': '/docs/configuring-promptless/triggers/git-hub-commits',
  '/docs/configuration/triggers/github-prs': '/docs/configuring-promptless/triggers/git-hub-p-rs',
  '/docs/configuration/triggers/slack': '/docs/configuring-promptless/triggers/slack-messages',
  '/docs/configuration/triggers/microsoft-teams': '/docs/configuring-promptless/triggers/microsoft-teams-messages',
  '/docs/configuration/triggers/zendesk': '/docs/configuring-promptless/triggers/zendesk-tickets-beta',
  '/docs/configuration/doc-collections/github-repos': '/docs/configuring-promptless/doc-collections/git-hub-repos-docs-as-code',
  '/docs/configuration/doc-collections/intercom': '/docs/configuring-promptless/doc-collections/intercom-beta',
  '/docs/configuration/context-sources/slack': '/docs/configuring-promptless/context-sources',
  '/docs/configuration/context-sources/github': '/docs/configuring-promptless/context-sources',
  '/docs/doc-collections': '/docs/configuring-promptless/doc-collections',
  '/docs/doc-collections/git-hub-repos-docs-as-code': '/docs/configuring-promptless/doc-collections/git-hub-repos-docs-as-code',
  '/docs/triggers/git-hub-commits': '/docs/configuring-promptless/triggers/git-hub-commits',
};

const PREFIX_REDIRECT_SUGGESTIONS: Array<[string, string]> = [
  ['/docs/configuration/', '/docs/configuring-promptless/'],
  ['/docs/features/', '/docs/how-to-use-promptless/'],
  ['/how-to-use-promptless/', '/docs/how-to-use-promptless/'],
  ['/features/', '/docs/how-to-use-promptless/'],
  ['/self-hosting/', '/docs/self-hosting/'],
  ['/docs/triggers/', '/docs/configuring-promptless/triggers/'],
  ['/docs/doc-collections/', '/docs/configuring-promptless/doc-collections/'],
];

interface DocsYmlTab {
  tab: 'docs' | 'blog' | 'changelog' | string;
  layout?: unknown[];
}

interface BuildArtifacts {
  liveRoutes: string[];
  fernManifest: Record<string, unknown>;
  routeManifest: RouteManifestEntry[];
  redirectsManifest: GeneratedRedirectManifest;
  sidebar: unknown[];
  newestBlogPath: string;
  newestChangelogPath: string;
}

function hasFlag(flag: string): boolean {
  return process.argv.slice(2).includes(flag);
}

function normalizePath(input: string): string {
  if (!input) return '/';
  let value = input.trim();
  if (!value.startsWith('/')) value = `/${value}`;
  value = value.replace(/\/+/g, '/');
  if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
  return value;
}

function splitHashAndQuery(url: string) {
  const [withoutHash, hash] = url.split('#', 2);
  const [pathname, query] = withoutHash.split('?', 2);
  return {
    pathname: normalizePath(pathname),
    hash: hash ? `#${hash}` : '',
    query: query ? `?${query}` : '',
  };
}

function slugifyFern(input: string): string {
  const withWordBoundaries = input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2');

  return withWordBoundaries
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function ensureSourcePath(rawPath: string): string {
  if (!rawPath.startsWith('./docs/')) {
    throw new Error(`Unsupported path in fern/docs.yml: ${rawPath}`);
  }
  return `fern/${rawPath.slice(2)}`;
}

function sourceAbsolutePath(sourcePath: string): string {
  return path.join(ROOT, sourcePath);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fetchLiveRoutes(): Promise<string[]> {
  const response = await fetch('https://docs.gopromptless.ai/sitemap.xml');
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap.xml: ${response.status}`);
  }
  const xml = await response.text();
  const matches = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
  return matches;
}

function contentTypeForTab(tab: string): RouteManifestEntry['contentType'] {
  if (tab === 'docs') return 'docs';
  if (tab === 'blog') return 'blog';
  if (tab === 'changelog') return 'changelog';
  throw new Error(`Unsupported tab: ${tab}`);
}

function routeBaseForTab(tab: string): string {
  if (tab === 'docs') return '/docs';
  if (tab === 'blog') return '/blog';
  if (tab === 'changelog') return '/changelog';
  throw new Error(`Unsupported tab: ${tab}`);
}

async function readFrontmatter(sourcePath: string): Promise<ReturnType<typeof matter>> {
  const abs = sourceAbsolutePath(sourcePath);
  const raw = await readFile(abs, 'utf8');
  return matter(raw);
}

function parseDateFromText(text?: string): Date | undefined {
  if (!text) return undefined;
  const monthPattern = Object.keys(MONTHS).join('|');
  const regex = new RegExp(`\\b(${monthPattern})\\s+(\\d{4})\\b`, 'i');
  const match = text.match(regex);
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  const year = Number(match[2]);
  if (!month || !year) return undefined;
  return new Date(Date.UTC(year, month - 1, 1));
}

function parseDateFromFileName(filePath: string): Date | undefined {
  const base = path.basename(filePath, path.extname(filePath));
  const numericMatch = base.match(/(\d{4})-(\d{2})/);
  if (numericMatch) {
    const year = Number(numericMatch[1]);
    const month = Number(numericMatch[2]);
    if (year > 1990 && month >= 1 && month <= 12) {
      return new Date(Date.UTC(year, month - 1, 1));
    }
  }

  const tokens = base.split(/[-_]/g);
  for (let index = 0; index < tokens.length - 1; index += 1) {
    const month = MONTHS[tokens[index].toLowerCase()];
    const year = Number(tokens[index + 1]);
    if (month && year > 1990) {
      return new Date(Date.UTC(year, month - 1, 1));
    }
  }
  return undefined;
}

async function inferDate(entry: RouteManifestEntry, frontmatterData: Record<string, unknown>): Promise<Date | undefined> {
  const direct = frontmatterData.date;
  if (typeof direct === 'string' || direct instanceof Date) {
    const parsed = new Date(direct);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  if (typeof frontmatterData.subtitle === 'string') {
    const fromSubtitle = parseDateFromText(frontmatterData.subtitle);
    if (fromSubtitle) return fromSubtitle;
  }

  const fromTitle = parseDateFromText(entry.title);
  if (fromTitle) return fromTitle;

  const fromFile = parseDateFromFileName(entry.sourcePath);
  if (fromFile) return fromFile;

  return undefined;
}

async function collectSourceFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await collectSourceFiles(full)));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!/\.(md|mdx)$/i.test(entry.name)) continue;
    out.push(full);
  }
  return out;
}

function extractInternalLinks(input: string): string[] {
  const links = new Set<string>();
  const markdownPattern = /\[[^\]]*\]\((\/[^)\s]+)\)/g;
  const hrefPattern = /href=["'](\/[^"']+)["']/g;

  for (const match of input.matchAll(markdownPattern)) {
    links.add(match[1]);
  }
  for (const match of input.matchAll(hrefPattern)) {
    links.add(match[1]);
  }

  return Array.from(links);
}

function isPublicAssetPath(pathname: string): boolean {
  if (pathname === '/' || pathname.startsWith('//')) return false;

  const relativePath = pathname.replace(/^\//, '');
  if (!relativePath) return false;

  const publicRoot = path.resolve(ROOT, 'public');
  const resolvedPath = path.resolve(publicRoot, relativePath);
  if (resolvedPath !== publicRoot && !resolvedPath.startsWith(`${publicRoot}${path.sep}`)) {
    return false;
  }

  return existsSync(resolvedPath);
}

function guessCanonicalRoute(
  pathValue: string,
  routeSet: Set<string>,
  routeManifest: RouteManifestEntry[]
): string | undefined {
  const normalized = normalizePath(pathValue);
  if (routeSet.has(normalized)) return normalized;

  const exact = EXACT_REDIRECT_SUGGESTIONS[normalized];
  if (exact && routeSet.has(exact)) return exact;

  for (const [prefix, replacement] of PREFIX_REDIRECT_SUGGESTIONS) {
    if (normalized.startsWith(prefix)) {
      const candidate = `${replacement}${normalized.slice(prefix.length)}`;
      const normalizedCandidate = normalizePath(candidate);
      if (routeSet.has(normalizedCandidate)) return normalizedCandidate;
    }
  }

  if (normalized.startsWith('/docs/integrations/') && !normalized.endsWith('-integration')) {
    const candidate = normalizePath(`${normalized}-integration`);
    if (routeSet.has(candidate)) return candidate;
  }

  const lastSegment = normalized.split('/').filter(Boolean).at(-1);
  if (lastSegment) {
    const matches = routeManifest
      .map((route) => route.routePath)
      .filter((routePath) => routePath.endsWith(`/${lastSegment}`));
    if (matches.length === 1) return matches[0];
  }

  return undefined;
}

function rewriteInternalUrls(
  body: string,
  routeSet: Set<string>,
  redirectLookup: Map<string, string>,
  routeManifest: RouteManifestEntry[]
): string {
  const rewriteSingle = (rawUrl: string): string => {
    if (!rawUrl.startsWith('/')) return rawUrl;
    const { pathname, hash, query } = splitHashAndQuery(rawUrl);
    const direct = routeSet.has(pathname) ? pathname : undefined;
    const redirect = redirectLookup.get(pathname);
    const guessed = guessCanonicalRoute(pathname, routeSet, routeManifest);
    const destination = direct || redirect || guessed;
    if (!destination) return rawUrl;
    return `${destination}${query}${hash}`;
  };

  const markdownPattern = /\[([^\]]*)\]\((\/[^)\s]+)\)/g;
  const hrefPattern = /href=(["'])(\/[^"']+)\1/g;

  let transformed = body.replace(markdownPattern, (_, text: string, url: string) => {
    return `[${text}](${rewriteSingle(url)})`;
  });

  transformed = transformed.replace(hrefPattern, (_, quote: string, url: string) => {
    return `href=${quote}${rewriteSingle(url)}${quote}`;
  });

  return transformed;
}

async function renderMermaidToFile(diagram: string): Promise<string> {
  const hash = createHash('sha1').update(diagram).digest('hex').slice(0, 16);
  const fileName = `${hash}.svg`;
  const outputPath = path.join(MERMAID_DIR, fileName);

  if (!(await fileExists(outputPath))) {
    const encoded = Buffer.from(diagram).toString('base64').replace(/=+$/g, '');
    const response = await fetch(`https://mermaid.ink/svg/${encoded}`);
    if (!response.ok) {
      throw new Error(`Failed to render Mermaid diagram (${response.status})`);
    }
    const svg = await response.text();
    await writeFile(outputPath, svg, 'utf8');
  }

  return `/mermaid/${fileName}`;
}

async function replaceMermaidBlocks(content: string): Promise<string> {
  const pattern = /```mermaid\s*\n([\s\S]*?)```/g;
  const matches = Array.from(content.matchAll(pattern));
  if (matches.length === 0) return content;

  let output = content;
  for (const match of matches) {
    const fullBlock = match[0];
    const diagram = match[1]?.trim();
    if (!diagram) continue;

    try {
      const mermaidPath = await renderMermaidToFile(diagram);
      output = output.replace(fullBlock, `![Mermaid diagram](${mermaidPath})`);
    } catch {
      // Keep the original block if rendering fails.
    }
  }

  return output;
}

function injectComponentImports(content: string): string {
  const imports = COMPONENT_NAMES
    .filter((name) => new RegExp(`<${name}(\\s|>|/)`).test(content))
    .map((name) => `import ${name} from '@components/fern/${name}.astro';`);

  if (imports.length === 0) return content;
  return `${imports.join('\n')}\n\n${content.trimStart()}`;
}

function outputPathForRoute(entry: RouteManifestEntry): string {
  if (entry.contentType === 'docs') {
    const relative = entry.routePath.replace(/^\//, '');
    return path.join(SRC_CONTENT_DOCS, `${relative}.mdx`);
  }
  if (entry.contentType === 'blog') {
    const relative = entry.routePath.replace(/^\/blog\//, '');
    return path.join(SRC_CONTENT_BLOG, `${relative}.mdx`);
  }
  const relative = entry.routePath.replace(/^\/changelog\//, '');
  return path.join(SRC_CONTENT_CHANGELOG, `${relative}.mdx`);
}

function pruneUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => pruneUndefined(item)) as T;
  }
  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (nested === undefined) continue;
      output[key] = pruneUndefined(nested);
    }
    return output as T;
  }
  return value;
}

async function clearOutputDirectories() {
  await rm(SRC_CONTENT_DOCS, { recursive: true, force: true });
  await rm(SRC_CONTENT_BLOG, { recursive: true, force: true });
  await rm(SRC_CONTENT_CHANGELOG, { recursive: true, force: true });
  await rm(MERMAID_DIR, { recursive: true, force: true });

  await mkdir(SRC_CONTENT_DOCS, { recursive: true });
  await mkdir(SRC_CONTENT_BLOG, { recursive: true });
  await mkdir(SRC_CONTENT_CHANGELOG, { recursive: true });
  await mkdir(MERMAID_DIR, { recursive: true });
}

function convertYamlPathToRoute(
  tab: string,
  prefixSegments: string[],
  leafSlug?: string
): string {
  const base = routeBaseForTab(tab);
  const full = leafSlug ? [...prefixSegments, leafSlug] : [...prefixSegments];
  return normalizePath(`${base}/${full.filter(Boolean).join('/')}`);
}

async function buildArtifacts(): Promise<BuildArtifacts> {
  const docsYmlRaw = await readFile(FERN_CONFIG_PATH, 'utf8');
  const docsYml = yaml.load(docsYmlRaw) as { navigation?: DocsYmlTab[]; redirects?: RedirectRule[] };

  const routeManifest: RouteManifestEntry[] = [];
  let order = 1;

  const pushEntry = async (entry: RouteManifestEntry) => {
    const existing = routeManifest.find(
      (candidate) =>
        candidate.sourcePath === entry.sourcePath &&
        candidate.routePath === entry.routePath &&
        candidate.contentType === entry.contentType
    );
    if (existing) return;

    const frontmatter = await readFrontmatter(entry.sourcePath);
    const title = typeof frontmatter.data.title === 'string' ? frontmatter.data.title : entry.title;
    const description =
      typeof frontmatter.data.description === 'string' ? frontmatter.data.description : undefined;
    const date = await inferDate(entry, frontmatter.data);

    routeManifest.push({
      ...entry,
      title,
      description,
      date: date?.toISOString(),
    });
  };

  const walk = async (
    items: unknown[] = [],
    tab: string,
    prefixSegments: string[] = [],
    sectionTrail: string[] = []
  ): Promise<void> => {
    for (const candidate of items) {
      const item = candidate as Record<string, unknown>;

      if (typeof item.section === 'string') {
        const sectionLabel = item.section;
        const sectionSlug = slugifyFern(sectionLabel);
        const nextPrefix = [...prefixSegments, sectionSlug];
        const nextSectionTrail = [...sectionTrail, sectionLabel];

        if (typeof item.path === 'string') {
          await pushEntry({
            sourcePath: ensureSourcePath(item.path),
            contentType: contentTypeForTab(tab),
            routePath: convertYamlPathToRoute(tab, nextPrefix),
            title: sectionLabel,
            hidden: Boolean(item.hidden),
            order: order++,
            section: nextSectionTrail[0],
            tab,
          });
        }

        if (Array.isArray(item.contents)) {
          await walk(item.contents, tab, nextPrefix, nextSectionTrail);
        }
        continue;
      }

      if (typeof item.page === 'string' && typeof item.path === 'string') {
        const leafSlug =
          typeof item.slug === 'string' && item.slug.length > 0 ? item.slug : slugifyFern(item.page);

        await pushEntry({
          sourcePath: ensureSourcePath(item.path),
          contentType: contentTypeForTab(tab),
          routePath: convertYamlPathToRoute(tab, prefixSegments, leafSlug),
          title: item.page,
          hidden: Boolean(item.hidden),
          order: order++,
          section: sectionTrail[0],
          tab,
        });
      }
    }
  };

  const tabs = docsYml.navigation ?? [];
  for (const tabConfig of tabs) {
    if (!tabConfig || !Array.isArray(tabConfig.layout)) continue;
    await walk(tabConfig.layout, tabConfig.tab);
  }

  for (const orphan of ORPHAN_POLICIES) {
    if (routeManifest.some((entry) => entry.sourcePath === orphan.sourcePath)) continue;
    await pushEntry({
      sourcePath: orphan.sourcePath,
      contentType: 'docs',
      routePath: orphan.routePath,
      title: path.basename(orphan.sourcePath, path.extname(orphan.sourcePath)),
      hidden: true,
      order: order++,
      section: 'Hidden',
      tab: 'docs',
    });
  }

  routeManifest.sort((a, b) => a.order - b.order);

  const docsTab = tabs.find((tab) => tab.tab === 'docs');
  const sidebar = await buildSidebar(docsTab?.layout ?? [], routeManifest);

  const liveRoutes = await fetchLiveRoutes();
  const routeSet = new Set(routeManifest.map((entry) => entry.routePath));

  const explicitRedirects = (docsYml.redirects ?? []).map((rule) => ({
    source: normalizePath(rule.source),
    destination: normalizePath(rule.destination),
    permanent: true,
  }));

  const sourceFiles = await collectSourceFiles(FERN_DOCS_DIR);
  const generatedRedirects = new Map<string, string>();

  for (const sourceFile of sourceFiles) {
    const sourceRaw = await readFile(sourceFile, 'utf8');
    const links = extractInternalLinks(sourceRaw);

    for (const link of links) {
      const { pathname } = splitHashAndQuery(link);
      if (routeSet.has(pathname)) continue;
      const destination = guessCanonicalRoute(pathname, routeSet, routeManifest);
      if (destination && destination !== pathname) {
        generatedRedirects.set(pathname, destination);
      }
    }
  }

  for (const liveRoute of liveRoutes) {
    const pathname = normalizePath(new URL(liveRoute).pathname);
    if (routeSet.has(pathname)) continue;
    const destination = guessCanonicalRoute(pathname, routeSet, routeManifest);
    if (destination && destination !== pathname) {
      generatedRedirects.set(pathname, destination);
    }
  }

  const redirects: RedirectRule[] = [
    ...explicitRedirects,
    ...Array.from(generatedRedirects.entries()).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    })),
  ];

  const dedupedRedirects = dedupeRedirects(redirects);

  const newestBlogPath =
    routeManifest
      .filter((entry) => entry.contentType === 'blog' && !entry.hidden)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0]?.routePath ||
    '/blog/all';

  const newestChangelogPath =
    routeManifest
      .filter((entry) => entry.contentType === 'changelog' && !entry.hidden)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0]?.routePath ||
    '/changelog/all';

  const fernManifest = {
    generatedAt: new Date().toISOString(),
    source: 'fern/docs.yml',
    tabs: tabs.map((tab) => tab.tab),
    entries: routeManifest,
    orphanPolicy: ORPHAN_POLICIES,
  };

  return {
    liveRoutes,
    fernManifest,
    routeManifest,
    redirectsManifest: { redirects: dedupedRedirects },
    sidebar,
    newestBlogPath,
    newestChangelogPath,
  };
}

function dedupeRedirects(redirects: RedirectRule[]): RedirectRule[] {
  const map = new Map<string, RedirectRule>();
  for (const redirect of redirects) {
    map.set(normalizePath(redirect.source), {
      source: normalizePath(redirect.source),
      destination: normalizePath(redirect.destination),
      permanent: redirect.permanent ?? true,
    });
  }
  return Array.from(map.values()).sort((a, b) => a.source.localeCompare(b.source));
}

async function buildSidebar(items: unknown[], routeManifest: RouteManifestEntry[], prefixSegments: string[] = []) {
  const out: unknown[] = [];

  for (const candidate of items) {
    const item = candidate as Record<string, unknown>;
    if (typeof item.section === 'string') {
      const sectionSlug = slugifyFern(item.section);
      const nextPrefix = [...prefixSegments, sectionSlug];
      const groupItems: unknown[] = [];

      if (typeof item.path === 'string' && !item.hidden) {
        const route = convertYamlPathToRoute('docs', nextPrefix);
        const routeEntry = routeManifest.find((entry) => entry.routePath === route);
        groupItems.push({
          label: routeEntry?.title || item.section,
          slug: route.replace(/^\//, ''),
        });
      }

      if (Array.isArray(item.contents)) {
        const childItems = await buildSidebar(item.contents, routeManifest, nextPrefix);
        groupItems.push(...childItems);
      }

      out.push({
        label: item.section,
        items: groupItems,
      });
      continue;
    }

    if (typeof item.page === 'string' && typeof item.path === 'string' && !item.hidden) {
      const leafSlug =
        typeof item.slug === 'string' && item.slug.length > 0 ? item.slug : slugifyFern(item.page);
      const route = convertYamlPathToRoute('docs', prefixSegments, leafSlug);
      out.push({
        label: item.page,
        slug: route.replace(/^\//, ''),
      });
    }
  }

  return out;
}

async function migrateContent(
  routeManifest: RouteManifestEntry[],
  redirectsManifest: GeneratedRedirectManifest
): Promise<void> {
  const routeSet = new Set(routeManifest.map((entry) => entry.routePath));
  const redirectLookup = new Map(
    redirectsManifest.redirects.map((redirect) => [normalizePath(redirect.source), normalizePath(redirect.destination)])
  );

  await clearOutputDirectories();

  if (existsSync(FERN_ASSETS_DIR)) {
    await rm(PUBLIC_ASSETS_DIR, { recursive: true, force: true });
    await mkdir(path.dirname(PUBLIC_ASSETS_DIR), { recursive: true });
    await cp(FERN_ASSETS_DIR, PUBLIC_ASSETS_DIR, { recursive: true });
  }

  for (const entry of routeManifest) {
    const source = sourceAbsolutePath(entry.sourcePath);
    const raw = await readFile(source, 'utf8');
    const parsed = matter(raw);

    let transformedBody = rewriteInternalUrls(parsed.content, routeSet, redirectLookup, routeManifest);
    transformedBody = await replaceMermaidBlocks(transformedBody);
    transformedBody = injectComponentImports(transformedBody);

    const data = {
      ...parsed.data,
      title: entry.title,
      description: entry.description ?? parsed.data.description,
    } as Record<string, unknown>;

    // Fern-specific layout keys can be interpreted as import specifiers in Astro MDX.
    delete data.layout;

    if (entry.contentType === 'docs') {
      const existingSidebar =
        typeof data.sidebar === 'object' && data.sidebar !== null
          ? (data.sidebar as Record<string, unknown>)
          : {};

      data.slug = entry.routePath.replace(/^\//, '');
      data.sidebar = {
        ...existingSidebar,
        hidden: entry.hidden,
        order: entry.order,
      };
    }

    if (entry.contentType === 'blog') {
      if (entry.date) data.date = entry.date;
      data.section = entry.section;
      data.hidden = entry.hidden;
    }

    if (entry.contentType === 'changelog') {
      if (entry.date) data.date = entry.date;
      data.hidden = entry.hidden;
    }

    const output = matter.stringify(transformedBody, pruneUndefined(data));
    const destination = outputPathForRoute(entry);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, output, 'utf8');
  }

  await writeComponentFixture();
}

async function writeComponentFixture() {
  const fixturePath = path.join(SRC_CONTENT_DOCS, 'internal', 'component-fixtures.mdx');
  const fixtureContent = `---
title: Fern Component Fixtures
slug: docs/internal/component-fixtures
sidebar:
  hidden: true
---

import Frame from '@components/fern/Frame.astro';
import Steps from '@components/fern/Steps.astro';
import Step from '@components/fern/Step.astro';
import Card from '@components/fern/Card.astro';
import CardGroup from '@components/fern/CardGroup.astro';
import Accordion from '@components/fern/Accordion.astro';
import AccordionGroup from '@components/fern/AccordionGroup.astro';
import ParamField from '@components/fern/ParamField.astro';
import Info from '@components/fern/Info.astro';
import Note from '@components/fern/Note.astro';
import Tip from '@components/fern/Tip.astro';
import Warning from '@components/fern/Warning.astro';
import Success from '@components/fern/Success.astro';

# Fern Component Fixtures

<Info>Info block</Info>
<Note>Note block</Note>
<Tip>Tip block</Tip>
<Warning>Warning block</Warning>
<Success>Success block</Success>

<CardGroup cols={2}>
  <Card title="Card One" href="/docs/getting-started/welcome">Card one body</Card>
  <Card title="Card Two">Card two body</Card>
</CardGroup>

<Steps>
  <Step title="Step one">First step</Step>
  <Step title="Step two">Second step</Step>
</Steps>

<AccordionGroup>
  <Accordion title="Accordion item" defaultOpen={true}>Accordion body</Accordion>
</AccordionGroup>

<ParamField path="TEST_VALUE" type="string" required={true}>Param description</ParamField>

<Frame caption="Frame caption">
  <img src="/assets/logo.svg" alt="Logo" />
</Frame>
`;

  await mkdir(path.dirname(fixturePath), { recursive: true });
  await writeFile(fixturePath, fixtureContent, 'utf8');
}

async function writeArtifacts(artifacts: BuildArtifacts): Promise<void> {
  await mkdir(MIGRATION_DIR, { recursive: true });

  await writeFile(
    path.join(MIGRATION_DIR, 'live-routes.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        routes: artifacts.liveRoutes,
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  await writeFile(
    path.join(MIGRATION_DIR, 'fern-manifest.json'),
    JSON.stringify(artifacts.fernManifest, null, 2) + '\n',
    'utf8'
  );

  await writeFile(
    path.join(MIGRATION_DIR, 'route-manifest.json'),
    JSON.stringify(artifacts.routeManifest, null, 2) + '\n',
    'utf8'
  );

  await writeFile(
    path.join(MIGRATION_DIR, 'redirects.generated.json'),
    JSON.stringify(artifacts.redirectsManifest, null, 2) + '\n',
    'utf8'
  );

  await writeFile(
    path.join(ROOT, 'src', 'lib', 'generated', 'sidebar.json'),
    JSON.stringify(artifacts.sidebar, null, 2) + '\n',
    'utf8'
  );

  await writeFile(
    path.join(ROOT, 'src', 'lib', 'generated', 'navigation.json'),
    JSON.stringify(
      {
        newestBlogPath: artifacts.newestBlogPath,
        newestChangelogPath: artifacts.newestChangelogPath,
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  await writeVercelConfig(artifacts.redirectsManifest, artifacts.newestBlogPath, artifacts.newestChangelogPath);
  await migrateContent(artifacts.routeManifest, artifacts.redirectsManifest);
}

async function writeVercelConfig(
  redirectsManifest: GeneratedRedirectManifest,
  newestBlogPath: string,
  newestChangelogPath: string
) {
  const redirects = dedupeRedirects([
    { source: '/', destination: '/docs/getting-started/welcome', permanent: true },
    { source: '/docs', destination: '/docs/getting-started/welcome', permanent: true },
    { source: '/blog', destination: newestBlogPath, permanent: true },
    { source: '/changelog', destination: newestChangelogPath, permanent: true },
    ...redirectsManifest.redirects,
  ]);

  await writeFile(
    path.join(ROOT, 'vercel.json'),
    JSON.stringify(
      {
        redirects,
      },
      null,
      2
    ) + '\n',
    'utf8'
  );
}

async function validateLinks(): Promise<void> {
  const routeManifestRaw = await readFile(path.join(MIGRATION_DIR, 'route-manifest.json'), 'utf8');
  const redirectsRaw = await readFile(path.join(MIGRATION_DIR, 'redirects.generated.json'), 'utf8');

  const routeManifest = JSON.parse(routeManifestRaw) as RouteManifestEntry[];
  const redirectsManifest = JSON.parse(redirectsRaw) as GeneratedRedirectManifest;

  const validPaths = new Set<string>([
    ...routeManifest.map((entry) => normalizePath(entry.routePath)),
    ...redirectsManifest.redirects.map((entry) => normalizePath(entry.source)),
    ...redirectsManifest.redirects.map((entry) => normalizePath(entry.destination)),
    '/',
    '/docs',
    '/blog',
    '/changelog',
    '/blog/all',
    '/changelog/all',
    '/llms.txt',
    '/llms-full.txt',
  ]);

  const contentFiles = [
    ...(await collectSourceFiles(SRC_CONTENT_DOCS)),
    ...(await collectSourceFiles(SRC_CONTENT_BLOG)),
    ...(await collectSourceFiles(SRC_CONTENT_CHANGELOG)),
  ];

  const failures: Array<{ file: string; link: string }> = [];

  for (const filePath of contentFiles) {
    const raw = await readFile(filePath, 'utf8');
    for (const link of extractInternalLinks(raw)) {
      const { pathname } = splitHashAndQuery(link);
      if (validPaths.has(pathname) || isPublicAssetPath(pathname)) continue;
      failures.push({ file: path.relative(ROOT, filePath), link });
    }
  }

  if (failures.length > 0) {
    console.error('Broken internal links detected:');
    for (const failure of failures) {
      console.error(`- ${failure.file}: ${failure.link}`);
    }
    process.exit(1);
  }

  console.log(`Validated internal links across ${contentFiles.length} files with no broken paths.`);
}

async function main() {
  const writeMode = hasFlag('--write');
  const dryRun = hasFlag('--dry-run');
  const validateOnly = hasFlag('--validate-links');

  if (validateOnly) {
    await validateLinks();
    return;
  }

  if (!writeMode && !dryRun) {
    console.error('Usage: tsx scripts/migrate-fern-to-starlight.ts --write | --dry-run | --validate-links');
    process.exit(1);
  }

  const artifacts = await buildArtifacts();

  if (dryRun) {
    console.log('Dry run summary:');
    console.log(`- route entries: ${artifacts.routeManifest.length}`);
    console.log(`- redirects: ${artifacts.redirectsManifest.redirects.length}`);
    console.log(`- live routes inventory: ${artifacts.liveRoutes.length}`);
    return;
  }

  await writeArtifacts(artifacts);

  console.log('Migration artifacts written.');
  console.log(`- route entries: ${artifacts.routeManifest.length}`);
  console.log(`- redirects: ${artifacts.redirectsManifest.redirects.length}`);
  console.log(`- newest blog path: ${artifacts.newestBlogPath}`);
  console.log(`- newest changelog path: ${artifacts.newestChangelogPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
