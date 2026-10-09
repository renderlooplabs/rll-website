// Sanity checks on the built site in dist/. Run with `npm run check` after `npm run build`.
//  - expected pages and files exist
//  - no em dashes in page text
//  - no requests to third-party hosts (scripts, styles, fonts, images)
//  - every internal link points at a page that exists
//  - no unreplaced {{TOKENS}}

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const problems = [];

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

if (!existsSync(dist)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const files = walk(dist);
const html = files.filter((f) => f.endsWith('.html'));
const rel = (f) => path.relative(dist, f);

// Read the product feature flag and slug from src/config/site.ts.
const siteConfig = readFileSync(path.join(dist, '..', 'src', 'config', 'site.ts'), 'utf8');
const productBlock = siteConfig.match(/export const PRODUCT = \{([\s\S]*?)\}/)?.[1] ?? '';
const productEnabled = /enabled:\s*true/.test(productBlock);
const slug = productBlock.match(/slug:\s*'([^']+)'/)?.[1];

const required = [
  'index.html',
  '404.html',
  'privacy/index.html',
  'sitemap.xml',
  'robots.txt',
  'CNAME',
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'og.png',
  'site.webmanifest',
  'brand/rll-horizontal-colour.svg',
  'brand/rll-horizontal-colour-dark.svg',
];
const productPages = ['', 'support/', 'privacy/', 'terms/'].map(
  (page) => `${slug}/${page}index.html`,
);

if (productEnabled) {
  required.push(...productPages);
} else if (existsSync(path.join(dist, slug))) {
  // The flag is off, so none of the app's pages should be published.
  problems.push(`PRODUCT.enabled is false but dist/${slug}/ was built`);
}

for (const file of required) {
  if (!existsSync(path.join(dist, file))) problems.push(`Missing ${file}`);
}

const SITE_ORIGIN = 'https://renderlooplabs.com';

// True if a site path exists in dist/, the way GitHub Pages serves it:
// the exact file, a directory's index.html, or an extensionless .html file.
const resolves = (pathname) => {
  const target = path.join(dist, decodeURIComponent(pathname));
  return (
    (existsSync(target) && statSync(target).isFile()) ||
    existsSync(path.join(target, 'index.html')) ||
    existsSync(`${target}.html`)
  );
};

// The URL path a built HTML file is served at, used to resolve relative links.
const pagePath = (file) => {
  const r = rel(file).split(path.sep).join('/');
  return r.endsWith('index.html') ? `/${r.slice(0, -'index.html'.length)}` : `/${r}`;
};

// Every URL in src, href and srcset attributes, plus absolute URLs in meta
// content (og:image, og:url and similar).
const urlsIn = (source) => {
  const found = [];
  for (const [, attr, value] of source.matchAll(/\s(src|href|srcset|content)="([^"]*)"/g)) {
    if (attr === 'srcset') {
      for (const candidate of value.split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) found.push({ url, resource: true });
      }
    } else if (attr === 'content') {
      if (/^https?:\/\//.test(value)) found.push({ url: value, resource: false });
    } else {
      // A src is always a loaded resource; an href is one when it points at a file type the page loads.
      const resource = attr === 'src' || /\.(css|js|mjs|woff2?|ttf|otf|png|jpe?g|gif|svg|webp|avif|ico)([?#]|$)/i.test(value);
      found.push({ url: value, resource });
    }
  }
  return found;
};

for (const file of html) {
  const source = readFileSync(file, 'utf8');
  const text = source.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '');

  if (/\u2014|&mdash;|&#8212;/.test(text)) problems.push(`Em dash in ${rel(file)}`);
  if (/\{\{[A-Z_]+\}\}/.test(source)) problems.push(`Unreplaced token in ${rel(file)}`);

  const base = new URL(pagePath(file), SITE_ORIGIN);
  for (const { url, resource } of urlsIn(source)) {
    if (url.startsWith('#')) continue;
    let parsed;
    try {
      parsed = new URL(url, base);
    } catch {
      problems.push(`Invalid URL ${url} in ${rel(file)}`);
      continue;
    }
    if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') continue;
    if (parsed.origin === SITE_ORIGIN) {
      // Relative, root-relative and absolute links to this site must all exist in dist/.
      if (!resolves(parsed.pathname)) problems.push(`Broken link ${url} in ${rel(file)}`);
    } else if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      // External links are fine; external resources (scripts, styles, fonts, images) are not.
      if (resource) problems.push(`Third-party resource ${url} in ${rel(file)}`);
    } else {
      problems.push(`Unexpected URL scheme ${url} in ${rel(file)}`);
    }
  }
}

for (const file of files.filter((f) => f.endsWith('.css'))) {
  for (const [, url] of readFileSync(file, 'utf8').matchAll(/url\(([^)]+)\)/g)) {
    if (/^['"]?https?:/.test(url)) problems.push(`Third-party url() ${url} in ${rel(file)}`);
  }
}

if (problems.length) {
  console.error(`Found ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`OK: ${html.length} pages checked, ${files.length} files in dist/.`);
