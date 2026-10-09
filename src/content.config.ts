import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const schema = z.object({
  title: z.string(),
  description: z.string(),
  // Draft pages show a "Draft, not yet in force" banner and are hidden from search engines.
  draft: z.boolean().default(false),
  // Shown under the title, e.g. "Last updated 9 October 2026".
  updated: z.coerce.date().optional(),
});

// Company pages written in Markdown, e.g. the website privacy notice at /privacy/.
// Always published, whatever the app's feature flag says.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema,
});

// App pages written in Markdown: support, privacy and terms.
// The file name becomes the URL, e.g. privacy.md -> /digest/privacy/
// Only published when PRODUCT.enabled is true in src/config/site.ts.
const product = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/product' }),
  schema,
});

export const collections = { pages, product };
