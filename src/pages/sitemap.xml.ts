import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { PRODUCT, SITE, productPath } from '../config/site';

// Lists every public page. Draft pages are left out until they are final.
export const GET: APIRoute = async () => {
  const docs = PRODUCT.enabled
    ? await getCollection('product', (doc) => !doc.data.draft)
    : [];
  const paths = [
    '/',
    '/privacy/',
    ...(PRODUCT.enabled ? [productPath()] : []),
    ...docs.map((doc) => productPath(doc.id)),
  ];

  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, SITE.url).href}</loc></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
