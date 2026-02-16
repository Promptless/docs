import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { APIRoute } from 'astro';
import matter from 'gray-matter';
import { sortByManifestOrder } from '@lib/content-order';
import type { RouteManifestEntry } from '@lib/route-manifest';

function absoluteUrl(site: URL | undefined, path: string) {
  const base = site?.toString() || process.env.SITE_URL || 'https://docs.gopromptless.ai';
  return new URL(path, base).toString();
}

export const GET: APIRoute = async ({ site }) => {
  const blocks: string[] = [];
  blocks.push('# Promptless | Documentation');

  const byType = {
    docs: sortByManifestOrder('docs'),
    blog: sortByDescendingDate(sortByManifestOrder('blog')),
    changelog: sortByDescendingDate(sortByManifestOrder('changelog')),
  } as const;

  for (const type of ['docs', 'blog', 'changelog'] as const) {
    blocks.push('', `## ${type[0].toUpperCase()}${type.slice(1)}`);

    for (const route of byType[type]) {
      if (route.hidden) continue;
      const routePath = normalizeRoutePath(route.routePath);
      const body = await readRouteBody(route);

      blocks.push(
        '',
        '***',
        '',
        `title: ${route.title}`,
        `url: ${absoluteUrl(site, routePath)}`,
        route.description ? `description: ${route.description}` : '',
        '---',
        '',
        body
      );
    }
  }

  return new Response(blocks.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

function normalizeRoutePath(pathname: string): string {
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

function contentPathFromRoute(route: RouteManifestEntry): string {
  if (route.contentType === 'docs') {
    return path.join(process.cwd(), 'src', 'content', 'docs', `${route.routePath.replace(/^\//, '')}.mdx`);
  }
  if (route.contentType === 'blog') {
    return path.join(
      process.cwd(),
      'src',
      'content',
      'blog',
      `${route.routePath.replace(/^\/blog\//, '')}.mdx`
    );
  }
  return path.join(
    process.cwd(),
    'src',
    'content',
    'changelog',
    `${route.routePath.replace(/^\/changelog\//, '')}.mdx`
  );
}

async function readRouteBody(route: RouteManifestEntry): Promise<string> {
  const filePath = contentPathFromRoute(route);
  try {
    const raw = await readFile(filePath, 'utf8');
    return matter(raw).content.trim();
  } catch {
    return '';
  }
}

function sortByDescendingDate(entries: RouteManifestEntry[]) {
  return entries.slice().sort((a, b) => {
    const aDate = a.date || '';
    const bDate = b.date || '';
    if (aDate !== bDate) return bDate.localeCompare(aDate);
    if (a.order !== b.order) return a.order - b.order;
    return a.routePath.localeCompare(b.routePath);
  });
}
