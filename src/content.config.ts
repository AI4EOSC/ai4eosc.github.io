import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    type: z.string(),
    date: z.date(),
    excerpt: z.string(),
    icon: z.string().optional(),
    gradient: z.enum(['primary', 'secondary', 'dark']).optional()
  })
});

export const collections = { stories };
