// Assembles <head>, JSON-LD and the section list into a full HTML document.

import { SITE, PHONE, OFFICES, EMAIL, FACEBOOK_URL, INSTAGRAM_URL, ANALYTICS_ID } from './data.mjs';
import { esc, sprite, wire } from './ui.mjs';
import * as S from './sections.mjs';

const json = (o) => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');

function structuredData(c, pageUrl) {
  const orgId = `${SITE}/#org`;
  const doctorId = `${SITE}/#dr-koga`;
  const phone = '+1-318-388-4209';
  const hasHours = (o) => o.hours && o.hours.schema;
  const offices = OFFICES.map((o) => ({
    '@type': 'Dentist',
    '@id': `${SITE}/#${o.id}`,
    name: `Koga Orthodontics, ${o.city}`,
    url: `${pageUrl}#locations`,
    image: `${SITE}/assets/img/${o.image}`,
    telephone: phone,
    medicalSpecialty: 'Dentistry',
    address: {
      '@type': 'PostalAddress',
      streetAddress: o.street,
      addressLocality: o.locality,
      addressRegion: o.region,
      ...(o.zip ? { postalCode: o.zip } : {}), // West Monroe ZIP: TODO, omitted until confirmed
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: o.lat, longitude: o.lng },
    parentOrganization: { '@id': orgId },
    ...(hasHours(o)
      ? { openingHoursSpecification: o.hours.schema.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })) }
      : {}),
  }));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'Koga Orthodontics',
        inLanguage: ['en-US', 'es-US'],
        publisher: { '@id': orgId },
      },
      {
        '@type': 'Dentist',
        '@id': orgId,
        name: 'Koga Orthodontics',
        url: `${SITE}/`,
        description: c.description,
        slogan: 'Your smile. Our passion.',
        image: `${SITE}/assets/img/og-image.jpg`,
        logo: `${SITE}/assets/img/logo.webp`,
        telephone: phone,
        ...(EMAIL ? { email: EMAIL } : {}),
        medicalSpecialty: 'Dentistry',
        knowsAbout: ['Orthodontics', 'Braces for kids', 'Clear aligners', 'Pitts21 braces', 'Early orthodontic check-up'],
        sameAs: [FACEBOOK_URL, INSTAGRAM_URL],
        areaServed: ['Ouachita Parish', 'Lincoln Parish', 'Richland Parish', 'Caldwell Parish'].map((n) => ({ '@type': 'AdministrativeArea', name: `${n}, Louisiana` })),
        employee: { '@id': doctorId },
        location: OFFICES.map((o) => ({ '@id': `${SITE}/#${o.id}` })),
      },
      ...offices,
      {
        '@type': 'Person',
        '@id': doctorId,
        name: 'Liseane Koga',
        honorificPrefix: 'Dr.',
        jobTitle: 'Orthodontist',
        image: `${SITE}/assets/img/dr-koga.webp`,
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Indiana University' },
        worksFor: { '@id': orgId },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq-list`,
        inLanguage: c.lang === 'en' ? 'en-US' : 'es-US',
        mainEntity: c.faq.items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
      },
      // NOTE: no AggregateRating / Review markup on purpose (self-serving reviews are not eligible).
    ],
  };
}

export function renderPage(c, { criticalCss, blobCss }) {
  const lang = c.lang;
  const P = lang === 'en' ? '' : '../';
  const ctx = { c, P, lang };
  const pageUrl = `${SITE}/${c.path}`;
  const urlEn = `${SITE}/`;
  const urlEs = `${SITE}/es/`;
  const crit = criticalCss.replace(/url\(\.\.\/fonts\//g, `url(${P}assets/fonts/`);
  const og = `${SITE}/assets/img/og-image.jpg`;
  const altLocale = lang === 'en' ? 'es_US' : 'en_US';

  const head = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.description)}">
<link rel="canonical" href="${pageUrl}">
<link rel="alternate" hreflang="en" href="${urlEn}">
<link rel="alternate" hreflang="es" href="${urlEs}">
<link rel="alternate" hreflang="x-default" href="${urlEn}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="theme-color" content="#0096AC">
<meta name="color-scheme" content="light">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Koga Orthodontics">
<meta property="og:title" content="${esc(c.ogTitle)}">
<meta property="og:description" content="${esc(c.ogDescription)}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:locale" content="${c.locale}">
<meta property="og:locale:alternate" content="${altLocale}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(c.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(c.ogTitle)}">
<meta name="twitter:description" content="${esc(c.ogDescription)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="${P}assets/img/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="${P}favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="${P}assets/img/apple-touch-icon.png">
<link rel="manifest" href="${P}site.webmanifest">
<link rel="preload" href="${P}assets/fonts/abril-fatface-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${P}assets/fonts/nunito-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="${P}assets/img/hero-mobile.webp" media="(max-width: 700px)" fetchpriority="high">
<link rel="preload" as="image" href="${P}assets/img/hero.webp" media="(min-width: 701px)" fetchpriority="high">
<script>
/* "js" class unlocks the reveal animations; kfMissing() swaps a missing photo for a branded placeholder. */
document.documentElement.className+=' js';
function kfMissing(i){var p=i.closest('.ph,.mascot');if(!p)return;if(p.classList.contains('mascot')){p.innerHTML='<svg viewBox="0 0 120 140" focusable="false"><use href="#chompers"/></svg>';return}p.classList.add('missing');p.setAttribute('role','img');p.setAttribute('aria-label',i.alt);i.remove()}
</script>
<style>${blobCss}</style>
<style>${crit}</style>
<link rel="stylesheet" href="${P}assets/css/styles.css" media="print" onload="this.media='all';this.onload=null;setTimeout(function(){document.documentElement.classList.add('ready')},80)">
<noscript><link rel="stylesheet" href="${P}assets/css/styles.css"></noscript>
<script type="application/ld+json">
${json(structuredData(c, pageUrl))}
</script>
<!-- ANALYTICS SLOT: set ANALYTICS_ID in build/data.mjs. main.js loads GA4/GTM after first interaction or idle. -->
<meta name="kf-analytics" content="${esc(ANALYTICS_ID)}">
</head>`;

  const body = `<body>
<a class="skip" href="#main">${esc(c.skip)}</a>
${sprite()}
<div class="intro" aria-hidden="true"><div class="intro__wire"><i></i><i></i><i></i><i></i></div></div>
${S.header(ctx)}
<main id="main">
${S.hero(ctx)}
${S.trust(ctx)}
${S.about(ctx)}
${S.services(ctx)}
${S.tech(ctx)}
${S.kids(ctx)}
${S.gallery(ctx)}
${S.why(ctx)}
${S.payment(ctx)}
${S.reviews(ctx)}
${S.faq(ctx)}
${S.locations(ctx)}
${S.finalCta(ctx)}
</main>
${S.footer(ctx)}
${S.mobileBar(ctx)}
<script src="${P}assets/js/main.js" defer></script>
</body>
</html>
`;
  return head + '\n' + body;
}
