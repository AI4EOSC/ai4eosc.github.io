import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildPageOgElement,
  renderOgPng,
  renderStoryPhotoOg,
} from '../../../lib/og-helpers';

export const getStaticPaths: GetStaticPaths = async () => {
  const stories = await getCollection('stories');
  return stories
    .filter(s => !s.data.externalUrl)
    .map(story => ({ params: { slug: story.id }, props: { story } }));
};

export const GET: APIRoute = async ({ props }) => {
  const { story } = props as any;

  let png: Buffer;

  if (story.data.image) {
    try {
      const imgBuffer = story.data.image.startsWith('/')
        ? readFileSync(join(process.cwd(), 'public', story.data.image))
        : Buffer.from(await fetch(story.data.image).then(r => r.arrayBuffer()));

      png = await renderStoryPhotoOg(imgBuffer);
    } catch {
      png = await renderOgPng(
        buildPageOgElement(story.data.title, story.data.excerpt),
        'teal'
      );
    }
  } else {
    png = await renderOgPng(
      buildPageOgElement(story.data.title, story.data.excerpt),
      'teal'
    );
  }

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
