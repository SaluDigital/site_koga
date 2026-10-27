// Static site generator. Run:  node build/build.mjs
// Writes: index.html, es/index.html, sitemap.xml, site.webmanifest
// (robots.txt, 404.html, README.md and MIGRATION.md are maintained by hand.)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './data.mjs';
import { blobCss } from './blobs.mjs';
import { renderPage } from './page.mjs';
import en from './copy.en.mjs';
import es from './copy.es.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = join(root, 'assets/css/styles.css');
let css = readFileSync(cssPath, 'utf8');
// generated blob shapes live in styles.css between markers
css = css.replace(/\/\* @blobs \*\/[\s\S]*?\/\* @blobs-end \*\//, `/* @blobs */${blobCss()}/* @blobs-end */`);
writeFileSync(cssPath, css);

// Everything between the markers is inlined in <head> (critical CSS).
const m = css.match(/\/\* @critical-start \*\/([\s\S]*?)\/\* @critical-end \*\//);
if (!m) throw new Error('critical CSS markers not found in styles.css');
const minify = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>~])\s*/g, '$1').replace(/:\s+/g, ':').replace(/;}/g, '}').trim();
const criticalCss = minify(m[1]);
const blobs = '';

const pages = [
  { copy: en, file: 'index.html' },
  { copy: es, file: 'es/index.html' },
];

for (const { copy, file } of pages) {
  const html = renderPage(copy, { criticalCss, blobCss: blobs });
  const out = join(root, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  const t = copy.title.length;
  const d = copy.description.length;
  console.log(`${file}  ${(html.length / 1024).toFixed(1)} KB  title ${t}${t > 60 ? ' !! >60' : ''}  desc ${d}${d > 155 ? ' !! >155' : ''}`);
}

// sitemap with hreflang alternates
const today = new Date().toISOString().slice(0, 10);
const alt = `    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE}/es/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
writeFileSync(
  join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${alt}
  </url>
  <url>
    <loc>${SITE}/es/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
${alt}
  </url>
</urlset>
`
);

writeFileSync(
  join(root, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'Koga Orthodontics',
      short_name: 'Koga Ortho',
      description: en.description,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#FFFBF2',
      theme_color: '#0096AC',
      icons: [
        { src: 'assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2
  ) + '\n'
);
console.log('sitemap.xml, site.webmanifest written');
