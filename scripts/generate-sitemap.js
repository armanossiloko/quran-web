import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseUrl = 'https://armanossiloko.github.io/quran-web';
const lastmod = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${baseUrl}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${baseUrl}/bookmarks`, changefreq: 'monthly', priority: '0.8' },
  ...Array.from({ length: 114 }, (_, i) => ({
    loc: `${baseUrl}/surah/${i + 1}`,
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(__dirname, '..', 'public', 'sitemap.xml'), xml);
console.log(`✓ Generated sitemap.xml with ${urls.length} URLs`);
