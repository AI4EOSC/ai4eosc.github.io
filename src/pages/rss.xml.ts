import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const stories = await getCollection('stories');

  const internal = stories
    .filter(s => !s.data.externalUrl)
    .sort((a, b) => +b.data.date - +a.data.date);

  return rss({
    title: 'AI4EOSC Stories',
    description: 'News, case studies and research highlights from across the AI4EOSC ecosystem.',
    site: context.site!,
    items: internal.map(s => ({
      title: s.data.title,
      pubDate: s.data.date,
      description: s.data.excerpt,
      link: `/stories/${s.id}`,
      ...(s.data.image ? { enclosure: { url: s.data.image, length: 0, type: 'image/jpeg' } } : {}),
    })),
    customData: `<language>en</language>`,
  });
}
