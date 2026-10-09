# Render Loop Labs: logo kit

Version 1.0, October 2026. Master files are the SVGs; everything else is exported from them.

> **In this repository:** only the files the website uses are kept here: the five files in `favicon/`, and `svg/rll-horizontal-colour.svg`, `svg/rll-horizontal-colour-dark.svg` and `svg/rll-stacked-colour-dark.svg`. The full kit (every lock-up and colourway, PNGs, PDFs and avatars) is kept outside the repo. The guidelines below still apply in full.

## What is in this folder

| Folder | Contents |
|---|---|
| `svg/` | Master vector files. Six logos, each in four colourways. Transparent backgrounds. |
| `png/` | Transparent PNGs of every logo at standard (1x) and retina (`@2x`) sizes, plus the symbol at 512px. |
| `pdf/` | Vector PDFs of the main lock-ups for print, invoices and documents. |
| `favicon/` | Website favicon (SVG, ICO, PNG), Apple touch icon and web app icons. |
| `avatar/` | Square profile images for GitHub, Google Workspace and social accounts. |

### The logos

| File name | Use it for |
|---|---|
| `rll-two-line` | **Primary logo.** Email signature, documents, invoices, most everyday uses. |
| `rll-horizontal` | Wide, short spaces: website header and footer. |
| `rll-three-line` | Tight, near-square spaces. |
| `rll-stacked` | Centred layouts: title pages, cover slides, social banners. |
| `rll-wordmark` | Where the symbol already appears nearby, or space is very wide and shallow. |
| `rll-symbol` | On its own once the name is established: app screens, small spaces, watermarks. |

### Colourways

| Suffix | Use on |
|---|---|
| `-colour` | White, Paper or other light backgrounds. |
| `-colour-dark` | Navy or other dark backgrounds. |
| `-black` | One-colour printing, faxes, stamps, light backgrounds where colour is not possible. |
| `-white` | One-colour on dark backgrounds or photographs. |

## Clear space

Let **X** be the diameter of the amber dot in the symbol (about a quarter of the symbol's height).

Keep a clear space of at least **2X** on every side of any logo. Nothing else (text, edges, other logos) should enter it. The SVG files are cropped tight to the artwork, so add this space around them in your layouts.

## Minimum sizes

| Logo | Screen (height) | Print (width) |
|---|---|---|
| Horizontal | 16px | 30mm |
| Two-line | 24px | 20mm |
| Three-line | 32px | 15mm |
| Stacked | 40px | 20mm |
| Wordmark | 12px | 25mm |
| Symbol | 16px (use the favicon files below 24px) | 5mm |

## Colours

| Name | Hex | RGB | Role |
|---|---|---|---|
| Navy | `#12233D` | 18, 35, 61 | Symbol and lettering on light backgrounds; dark background colour. |
| Amber | `#B4530A` | 180, 83, 10 | The dot on light backgrounds. Logo accent. |
| Paper | `#F7F5F0` | 247, 245, 240 | Light background; symbol and lettering on dark backgrounds. |
| Amber on dark | `#F2A65A` | 242, 166, 90 | The dot on dark backgrounds. |

Contrast (WCAG): Navy on Paper 14.5:1, Amber on Paper 4.6:1, Amber on dark on Navy 7.8:1. All pass AA for text.

Further accent colours will be defined in the design system. Amber stays reserved for the logo.

## Typeface

**DM Sans** (Colophon Foundry, SIL Open Font Licence 1.1, free on Google Fonts).

- The logo lettering is DM Sans Medium, lower case, tracked at -2%, converted to outlines. Never retype the logo; always use the files.
- DM Sans is also a good choice for the website, app and documents (Regular for body text, Medium or SemiBold for headings).

## Favicon and app icons

| File | Size | Notes |
|---|---|---|
| `favicon.svg` | Scalable | Tuned for small sizes. Switches automatically to light colours in dark mode. |
| `favicon.ico` | 16, 32, 48px | For older browsers and tools. |
| `favicon-16.png`, `favicon-32.png` | 16, 32px | Transparent. |
| `apple-touch-icon.png` | 180px | Solid Navy, because iOS fills transparency with black. iOS rounds the corners itself. |
| `icon-192.png`, `icon-512.png` | 192, 512px | Solid Navy, symbol inside the maskable safe zone. Web app manifest and app stores. |
| `icon-tile.svg` | Scalable | Source for the tile icons, for any further sizes. |

HTML for the website `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

`site.webmanifest`:

```json
{
  "name": "Render Loop Labs",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "theme_color": "#12233D",
  "background_color": "#F7F5F0"
}
```

### Exporting other PNG sizes

Export from the SVG, never by enlarging a PNG. Below 24px, use `favicon.svg` or `icon-tile.svg` rather than `rll-symbol`, because the favicon version has a heavier line and wider gaps that hold up at small sizes. Any SVG tool will do (Figma, Inkscape, or `rsvg-convert -w 512 favicon/icon-tile.svg -o icon-512.png`).

## Avatars

`avatar-navy` is the default for GitHub, Google Workspace, LinkedIn and other profiles. `avatar-paper` is the light alternative. Both are full-bleed squares with the symbol sized to survive a circular crop. Upload the 1024px PNG where allowed.

## Email signature

Use `png/rll-two-line-colour@2x.png`, displayed at 120px wide. Host it on the website rather than attaching it, so it does not appear as an attachment.

## Do

- Use the supplied files exactly as they are.
- Use `-colour` on light backgrounds and `-colour-dark` on dark ones.
- Keep the clear space and minimum sizes.
- Use the one-colour versions when colour is not available.
- Write the company name in running text as "Render Loop Labs" (title case), and "Render Loop Labs Ltd" where the legal name is needed.

## Don't

- Retype, re-space or recolour the lettering.
- Change the case of the logo lettering (it is always lower case).
- Stretch, squash, rotate or add effects such as shadows, outlines or glows.
- Move, resize or remove the amber dot, or close the gap in the track.
- Put the colour logo on busy photographs or mid-tone backgrounds where contrast is low.
- Use the full-colour version on dark backgrounds or the dark version on light ones.
- Place the symbol inside another shape, except the supplied avatar and icon tiles.
