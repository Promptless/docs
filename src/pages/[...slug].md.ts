import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { APIRoute, GetStaticPaths } from 'astro';
import matter from 'gray-matter';
import { routeEntries } from '@lib/content-order';
import type { RouteManifestEntry } from '@lib/route-manifest';

function stripMdxImports(body: string): string {
  return body
    .split('\n')
    .filter((line) => !line.startsWith('import ') && !line.startsWith('export '))
    .join('\n');
}

function contentPathFromRoute(route: RouteManifestEntry): string {
  if (route.contentType === 'docs') {
    return path.join(
      process.cwd(),
      'src',
      'content',
      'docs',
      `${route.routePath.replace(/^\//, '')}.mdx`,
    );
  }
  if (route.contentType === 'blog') {
    return path.join(
      process.cwd(),
      'src',
      'content',
      'blog',
      `${route.routePath.replace(/^\/blog\//, '')}.mdx`,
    );
  }
  return path.join(
    process.cwd(),
    'src',
    'content',
    'changelog',
    `${route.routePath.replace(/^\/changelog\//, '')}.mdx`,
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return routeEntries
    .filter((entry) => !entry.hidden)
    .map((entry) => ({
      params: { slug: entry.routePath.replace(/^\//, '') },
      props: { entry },
    }));
};

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as RouteManifestEntry;
  const filePath = contentPathFromRoute(entry);

  try {
    const raw = await readFile(filePath, 'utf8');
    const body = stripMdxImports(matter(raw).content).trim();

    const lines: string[] = [`# ${entry.title}`];
    if (entry.description) lines.push('', entry.description);
    lines.push('', body);

    return new Response(lines.join('\n'), {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
