import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const changelog = (await getCollection('changelog', ({ data }) => !data.hidden)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'Promptless Changelog',
    description: 'New features, improvements, and bug fixes from Promptless.',
    site: context.site!,
    items: changelog.map((entry) => ({
      title: entry.data.title,
      description: entry.data.subtitle || entry.data.description,
      pubDate: entry.data.date,
      link: `/changelog/${entry.slug}`,
    })),
  });
}
