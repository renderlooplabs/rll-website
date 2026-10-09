# renderlooplabs.com

The website for Render Loop Labs Ltd. A small static site built with [Astro](https://astro.build) and deployed to GitHub Pages.

- No cookies, analytics, trackers or third-party requests. Fonts are self-hosted.
- No forms. Contact is by `mailto:` links only.
- Pages: `/`, `/privacy/` (the company privacy notice) and a custom 404. The app pages (`/digest/`, `/digest/support/`, `/digest/privacy/` and `/digest/terms/`) are built only when the app's feature flag is on (see below).

## Local development

You need Node.js 22.12 or later.

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run check
npm run brand
```

- `npm ci`: install exact dependency versions from `package-lock.json`
- `npm run dev`: start the dev server at <http://localhost:4321>
- `npm run build`: build the production site into `dist/`
- `npm run preview`: serve `dist/` locally to check the production build
- `npm run check`: sanity checks on `dist/` (see below)
- `npm run brand`: copy favicons and logos from the logo kit in `brand/` into `public/`, and rebuild the OG image

`npm run check` looks at the built site and fails if a page is missing, an internal link is broken, a `{{TOKEN}}` was not replaced, a page contains an em dash, or anything loads from a third-party host.

## Project structure

```
brand/                         brand guidelines plus the logo files the site uses (see brand/README.md)
public/                        copied as-is: CNAME, robots.txt, favicons, logos, og.png, manifest
scripts/sync-brand.mjs         copies site assets out of brand/ and builds og.png
scripts/check-build.mjs        post-build checks
src/config/site.ts             names, emails, company details, app name and slug
src/content/pages/privacy.md   company privacy notice at /privacy/ (always published)
src/content/product/*.md       the app's support, privacy and terms pages (Markdown)
src/layouts/Base.astro         <head>, meta and Open Graph tags, header, footer
src/layouts/Prose.astro        layout for the Markdown pages, including the draft banner
src/pages/                     home, product page, Markdown page route, 404, sitemap.xml
src/styles/global.css          colours, type and spacing tokens
.github/workflows/deploy.yml   build and deploy to GitHub Pages
```

## How deployment works

Every push to `main` runs `.github/workflows/deploy.yml`:

1. **build**: checks out the repo, installs dependencies with `npm ci`, runs `astro build` and uploads `dist/` as a Pages artifact (via `withastro/action`).
2. **deploy**: publishes that artifact to GitHub Pages (via `actions/deploy-pages`).

The workflow also runs at 06:00 UTC on 1 January each year, so the copyright year in the footer updates without a code change. You can run it by hand from the repo's **Actions** tab ("Deploy to GitHub Pages" → "Run workflow").

`public/CNAME` tells GitHub Pages the site's domain is `renderlooplabs.com`.

## Showing or hiding the app (feature flag)

Everything about the app is behind one switch in `src/config/site.ts`:

```ts
export const PRODUCT = {
  enabled: false,   // false: company landing page only. true: app pages and links are published.
  ...
};
```

When `enabled` is `false`:

- `/digest/` and its support, privacy and terms pages are **not built at all**, so they can't be found by URL.
- The header nav link, the "What we're building" section on the home page, the footer's app support and privacy links (the company Privacy link stays), the sitemap entries and the links on the 404 page are all removed.
- `npm run check` fails if any app page is built anyway.

To preview the app pages locally, set it to `true` and run `npm run dev`. Set it back to `false` before pushing, unless you want them live. When the app is ready to launch, set it to `true` and push.

## Changing the app name

The app's working title is set in one place, `src/config/site.ts`:

```ts
export const PRODUCT = {
  name: 'DIGEST',   // shown everywhere: pages, titles, nav, Markdown
  slug: 'digest',   // the URL: /digest/, /digest/support/ ...
  ...
};
```

- Change `name` and rebuild. Every page, page title, the nav and the Markdown pages update.
- Changing `slug` changes the URLs. Settle it before the support and privacy URLs are submitted to App Store Connect or Google Play, as changing it later breaks those links.

In Markdown files, write `{{APP_NAME}}` rather than the name itself. Available tokens: `{{APP_NAME}}`, `{{APP_PATH}}`, `{{SUPPORT_EMAIL}}`, `{{HELLO_EMAIL}}`, `{{SUPPORT_RESPONSE}}`, `{{COMPANY_NAME}}`, `{{COMPANY_NUMBER}}` and `{{REGISTERED_OFFICE}}`. They work in text, link URLs and the frontmatter `title` and `description`. A misspelt token stops the build with an error.

## Editing the Markdown pages

The company privacy notice is `src/content/pages/privacy.md`, published at `/privacy/` and linked from every footer. It covers the website and emails sent to us; each app has its own notice. Update its `updated` date whenever you change it.

The app's support, privacy and terms pages are Markdown files in `src/content/product/`. Frontmatter fields:

| Field         | Meaning                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `title`       | Page heading and browser title                                                                           |
| `description` | Meta and Open Graph description                                                                          |
| `draft`       | `true` shows a "Draft, not yet in force" banner, adds `noindex` and leaves the page out of the sitemap |
| `updated`     | Optional date (`2026-10-09`), shown as "Last updated 9 October 2026" when not a draft                    |

When the final privacy notice and terms are ready, replace the file contents, remove `draft: true` and add an `updated` date.

Writing style for the whole site: British English, plain and calm, and no em dashes. For the app pages, keep wording descriptive and observational, with no medical claims and no diagnosis or treatment language.

## Brand, colours and dark mode

`brand/` holds the logo kit's guidelines ([`brand/README.md`](brand/README.md)) and only the kit files the site uses: the five favicon files and three SVG lock-ups. The full kit (PNGs, PDFs, avatars and other lock-ups) is kept outside the repo. The site follows the guidelines:

- **Logo:** the horizontal lock-up (`rll-horizontal`) in the header and footer, as the kit recommends for websites. The `-colour` version is used in light mode and `-colour-dark` in dark mode, switched by the browser with a `<picture>` element. Clear space of at least 2X is kept around it.
- **Favicons and app icons:** the kit's own files, used unchanged. `favicon.svg` switches colours in dark mode by itself.
- **OG image:** `public/og.png` (1200 × 630) is the stacked dark lock-up centred on Navy, built by `npm run brand`.
- **Typeface:** DM Sans, self-hosted via `@fontsource-variable/dm-sans`.
- **Colours:** Navy `#12233D` and Paper `#F7F5F0`. Amber is reserved for the logo, so the interface itself uses only Navy and Paper tones. When the design system defines further accent colours, add them as tokens in `src/styles/global.css`.

Light and dark themes follow the visitor's system setting (`prefers-color-scheme`). There is no manual toggle, which keeps the site free of JavaScript and of anything stored on the visitor's device. All colours are tokens at the top of `src/styles/global.css`, once for light and once for dark, with their WCAG contrast ratios noted. Keep body text at 4.5:1 or better in both themes.

When the logo kit changes, copy the new versions of those eight files into `brand/` (same names and folders), then run:

```sh
npm run brand
```

and commit the updated files in `public/`.

## Go live checklist

1. **Turn on GitHub Pages.** In the repo, go to **Settings → Pages**:
   - **Source:** GitHub Actions.
   - Push to `main` (or run the workflow by hand) and wait for the first deploy to finish.
   - **Custom domain:** `renderlooplabs.com`, then Save.

2. **Update DNS at IONOS** (Domains & SSL → renderlooplabs.com → DNS):
   - **Delete** the default IONOS `A` and `AAAA` records on `@`.
   - **Add four `A` records** on `@`:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **Add four `AAAA` records** on `@`:
     `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
     (check these against [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) in case they have changed).
   - **Add a `CNAME` record:** host `www`, pointing to `renderlooplabs.github.io`. If IONOS already has a `www` record, replace it. GitHub then redirects `www.renderlooplabs.com` to `renderlooplabs.com`.
   - **Do not touch** the existing `MX`, `SPF` (TXT), `DKIM`, `DMARC` or Google verification records, or email will stop working.

   DNS changes can take up to a few hours. To check:

   ```sh
   dig renderlooplabs.com +noall +answer
   dig www.renderlooplabs.com +noall +answer
   ```

3. **Verify the domain and turn on HTTPS.**
   - In the **organisation's** settings (github.com/organizations/renderlooplabs/settings/pages), add `renderlooplabs.com` as a verified domain. GitHub shows a `TXT` record (host like `_github-pages-challenge-renderlooplabs`). Add it at IONOS, wait a few minutes, then click **Verify**. This stops anyone else claiming the domain on GitHub Pages.
   - Back in the repo's **Settings → Pages**, wait for the DNS check to pass and the certificate to be issued (this can take up to an hour). Then tick **Enforce HTTPS**.

Afterwards, check that `https://renderlooplabs.com`, `https://www.renderlooplabs.com` and `http://renderlooplabs.com` all end up at `https://renderlooplabs.com/`.
