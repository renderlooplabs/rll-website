// Single source of truth for names, contact details and company information.
// Everything on the site, including the Markdown pages, reads from here.

export const SITE = {
  url: 'https://renderlooplabs.com',
  name: 'Render Loop Labs',
  description:
    'Render Loop Labs builds and publishes its own digital products, starting with mobile apps.',
  locale: 'en_GB',
  lang: 'en-GB',
} as const;

export const COMPANY = {
  legalName: 'Render Loop Labs Ltd',
  jurisdiction: 'England and Wales',
  number: '17497074',
  registeredOffice: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ',
} as const;

export const EMAIL = {
  hello: 'hello@renderlooplabs.com',
  support: 'support@renderlooplabs.com',
} as const;

// The app's name and URL slug. "DIGEST" is a working title: change `name` here
// and every page, title and Markdown file updates on the next build.
// Changing `slug` changes the URLs (/digest/...), so settle it before the
// privacy and support URLs are submitted to the app stores.
//
// `enabled` is the feature flag for everything about the app. When false, the
// app's pages (/digest/, support, privacy, terms) are not built at all, and
// every link to them is removed: header nav, home page section, footer,
// sitemap and 404 page. The site is then a company-only landing page.
export const PRODUCT = {
  enabled: false,
  name: 'DIGEST',
  slug: 'digest',
  status: 'Coming soon',
  supportResponse: 'within 3 working days',
} as const;

export const productPath = (page = '') =>
  `/${PRODUCT.slug}/${page ? `${page}/` : ''}`;

// Tokens available in Markdown content, written as {{TOKEN}}.
export const TOKENS: Record<string, string> = {
  APP_NAME: PRODUCT.name,
  APP_PATH: productPath(),
  SUPPORT_EMAIL: EMAIL.support,
  HELLO_EMAIL: EMAIL.hello,
  SUPPORT_RESPONSE: PRODUCT.supportResponse,
  COMPANY_NAME: COMPANY.legalName,
  COMPANY_NUMBER: COMPANY.number,
  REGISTERED_OFFICE: COMPANY.registeredOffice,
};

const lookup = (key: string) => {
  if (!(key in TOKENS)) throw new Error(`Unknown token {{${key}}} in Markdown content`);
  return TOKENS[key];
};

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// For plain text such as frontmatter titles.
export const fillTokens = (text: string) =>
  text.replace(/\{\{([A-Z_]+)\}\}/g, (_, key: string) => lookup(key));

// For rendered Markdown HTML. Tokens inside link URLs arrive percent-encoded.
// This runs on every build, so a name change is never hidden by Astro's content cache.
export const fillHtmlTokens = (html: string) =>
  html.replace(/\{\{([A-Z_]+)\}\}|%7B%7B([A-Z_]+)%7D%7D/g, (_, text?: string, url?: string) =>
    text ? escapeHtml(lookup(text)) : escapeHtml(encodeURI(lookup(url!))),
  );
