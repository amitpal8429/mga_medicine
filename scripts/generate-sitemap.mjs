// Generates public/sitemap.xml from the live course list.
// Runs automatically before `npm run build`. If the API is unreachable it falls back to the
// slugs below, so a build never fails because of the network.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE = (process.env.VITE_SITE_URL || 'https://www.medicalglobalacademy.com').replace(/\/$/, '');
const API = process.env.SITEMAP_API || 'https://24x7.medicalglobalacademy.com/api/course-list';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml');

const STATIC = [
  ['/', 'weekly', '1.0'],
  ['/courses', 'daily', '0.9'],
  ['/faculty', 'weekly', '0.7'],
  ['/about', 'monthly', '0.6'],
  ['/support', 'monthly', '0.5'],
  ['/app', 'monthly', '0.5'],
  ['/privacy-policy', 'yearly', '0.3'],
  ['/terms-and-conditions', 'yearly', '0.3'],
  ['/refund-and-cancellation-policy', 'yearly', '0.3'],
  ['/sitemap', 'monthly', '0.2'],
];

const SEED = 'certificate-in-family-medicine certificate-in-internal-medicine fellowship-in-internal-medicine pg-diploma-in-internal-medicine pg-diploma-in-general-medicine fellowship-in-addiction-medicine fellowship-in-pulmonology-medicine fellowship-in-palliative-medicine fellowship-in-reproductive-medicine'.split(' ');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

async function slugs() {
  try {
    const res = await fetch(API, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(res.status);
    const list = (await res.json()).filter((c) => c.category?.name === 'Medicine'); // Medicine only, same rule as the site
    console.log(`sitemap: ${list.length} courses from API`);
    return list.map((c) => ({ slug: c.slug, lastmod: (c.updated_at || '').slice(0, 10) }));
  } catch (e) {
    console.warn(`sitemap: API unreachable (${e.message}); using ${SEED.length} seed Medicine slugs`);
    return SEED.map((slug) => ({ slug, lastmod: '' }));
  }
}

const today = new Date().toISOString().slice(0, 10);
const courses = await slugs();
const url = (loc, freq, pri, lastmod = today) =>
  `  <url>\n    <loc>${esc(SITE + loc)}</loc>\n    <lastmod>${lastmod || today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`;

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
  ...STATIC.map(([p, f, pr]) => url(p, f, pr)),
  ...courses.map((c) => url(`/courses/${c.slug}`, 'weekly', '0.8', c.lastmod)),
].join('\n')}\n</urlset>\n`;

writeFileSync(OUT, xml);
console.log(`sitemap: wrote ${STATIC.length + courses.length} URLs to public/sitemap.xml`);
