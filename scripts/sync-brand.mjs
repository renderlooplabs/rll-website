// Copies the website's brand assets from the logo kit in brand/ into public/,
// and builds the Open Graph image. Run with `npm run brand` after updating
// the kit, then commit the results in public/.
//
// The kit's own favicon files are used exactly as supplied. Only og.png is
// generated, because the kit does not include a 1200 x 630 social image.

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brand = (file) => path.join(root, 'brand', file);
const pub = (file) => path.join(root, 'public', file);

const NAVY = '#12233D';
const PAPER = '#F7F5F0';

// Favicons and app icons, straight from the kit.
for (const file of [
  'favicon.svg',
  'favicon.ico',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
]) {
  copyFileSync(brand(`favicon/${file}`), pub(file));
}

// Header and footer logo (horizontal lock-up), light and dark colourways.
mkdirSync(pub('brand'), { recursive: true });
for (const file of ['rll-horizontal-colour.svg', 'rll-horizontal-colour-dark.svg']) {
  copyFileSync(brand(`svg/${file}`), pub(`brand/${file}`));
}

// Web app manifest, as specified in brand/README.md.
writeFileSync(
  pub('site.webmanifest'),
  JSON.stringify(
    {
      name: 'Render Loop Labs',
      short_name: 'Render Loop Labs',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
      theme_color: NAVY,
      background_color: PAPER,
      display: 'browser',
    },
    null,
    2,
  ) + '\n',
);

// Open Graph image: 1200 x 630, stacked dark lock-up centred on Navy.
// The logo is 300px tall, leaving far more than the 2X clear space the kit asks for.
const W = 1200;
const H = 630;
const logo = await sharp(readFileSync(brand('svg/rll-stacked-colour-dark.svg')))
  .resize({ height: 300 })
  .png()
  .toBuffer();
const { width: logoW, height: logoH } = await sharp(logo).metadata();
await sharp({ create: { width: W, height: H, channels: 3, background: NAVY } })
  .composite([
    { input: logo, top: Math.round((H - logoH) / 2), left: Math.round((W - logoW) / 2) },
  ])
  .png({ compressionLevel: 9 })
  .toFile(pub('og.png'));

console.log('Synced favicons, logos and site.webmanifest into public/, and built og.png.');
