import type { APIRoute } from 'astro';
import { sortByManifestOrder } from '@lib/content-order';
import type { RouteManifestEntry } from '@lib/route-manifest';

function absoluteUrl(site: URL | undefined, path: string) {
  const base = site?.toString() || process.env.SITE_URL || 'https://docs.gopromptless.ai';
  return new URL(path, base).toString();
}

export const GET: APIRoute = async ({ site }) => {
  const lines: string[] = ['# Promptless | Documentation', '', '## Docs', ''];

  for (const route of sortByManifestOrder('docs')) {
    if (route.hidden) continue;
    lines.push(
      `- [${route.title}](${absoluteUrl(site, route.routePath)})${route.description ? `: ${route.description}` : ''}`
    );
  }

  lines.push('', '## Blog', '');
  for (const route of sortByDescendingDate(sortByManifestOrder('blog'))) {
    if (route.hidden) continue;
    lines.push(
      `- [${route.title}](${absoluteUrl(site, route.routePath)})${route.description ? `: ${route.description}` : ''}`
    );
  }

  lines.push('', '## Changelog', '');
  for (const route of sortByDescendingDate(sortByManifestOrder('changelog'))) {
    if (route.hidden) continue;
    lines.push(`- [${route.title}](${absoluteUrl(site, route.routePath)})`);
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

function sortByDescendingDate(entries: RouteManifestEntry[]) {
  return entries.slice().sort((a, b) => {
    const aDate = a.date || '';
    const bDate = b.date || '';
    if (aDate !== bDate) return bDate.localeCompare(aDate);
    if (a.order !== b.order) return a.order - b.order;
    return a.routePath.localeCompare(b.routePath);
  });
}
