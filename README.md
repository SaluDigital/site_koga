# Koga Orthodontics: one-page website

Plain HTML, CSS and vanilla JS. No frameworks, no runtime dependencies.
English lives at `/`, a fully pre-rendered Spanish version at `/es/`.

```
index.html            English page (generated)
es/index.html         Spanish page (generated)
404.html  robots.txt  sitemap.xml (generated)  site.webmanifest (generated)
MIGRATION.md          301 redirect map + launch checklist
assets/css/styles.css all styles (the block between @critical markers is inlined in <head>)
assets/js/main.js     the only script (deferred)
assets/fonts/         self-hosted Abril Fatface + Nunito (woff2, Latin subset)
assets/img/           photos go here (see below)
assets/docs/          chompers_gets_braces.pdf goes here
build/                the generator (Node 18+, no npm install needed)
```

## Editing text

`index.html` and `es/index.html` are **generated**. Do not edit them by hand.

| What | Where |
|---|---|
| English copy, meta tags, alt texts | `build/copy.en.mjs` |
| Spanish copy, meta tags, alt texts | `build/copy.es.mjs` |
| Phone, booking link, social links, email, offices, hours | `build/data.mjs` |
| Layout of each section | `build/sections.mjs` |

After any change run:

```
node build/build.mjs
```

It rewrites both pages, `sitemap.xml` and `site.webmanifest`, and warns if a title is over 60 or a description over 155 characters.

### Hours and email

In `build/data.mjs` every office has `hours: null` and `EMAIL = null`. They are **not confirmed**, so nothing is shown. When you have them:

```js
hours: { en: 'Mon–Thu 8:00 am – 5:00 pm', es: 'Lun–Jue 8:00 am – 5:00 pm',
         schema: [{ days: ['Monday','Tuesday','Wednesday','Thursday'], opens: '08:00', closes: '17:00' }] }
```

The text appears on the office card and `openingHoursSpecification` is added to the JSON-LD automatically. `EMAIL = 'name@domain.com'` shows it in the footer and cards.
For West Monroe, fill `zip` (currently `null`).

## Dropping in photos

Every image slot already points to its final file name in `assets/img/`. Until the file exists, the slot shows a dashed placeholder with the file name and size. **Drop the real file in with the same name, no code change.**

| File | Size |
|---|---|
| `hero.webp`, `hero-mobile.webp` | 1920×1080, 900×1200 (subject on the right; left stays calm for text) |
| `dr-koga.webp` | 900×1100 |
| `team.webp` | 1400×900 |
| `chompers.webp` | 800×800, transparent (until then, an SVG Chompers is used) |
| `office-monroe.webp`, `office-west-monroe.webp`, `office-rayville.webp`, `office-columbia.webp` | 1024×683 (in place) |
| `gallery-01-before.webp` … `gallery-06-after.webp` | 1200×900 |
| `pitts21-old.webp`, `pitts21-new.webp` | 800×800 |
| `smile-traditional.webp`, `smile-arc.webp` | 1000×700 |
| `service-kids.webp`, `service-adults.webp`, `service-aligners.webp`, `service-bite.webp`, `service-retainers.webp` | 900×900 |
| `og-image.jpg` | 1200×630 (a branded stand-in is included) |
| `logo.webp`, `logo-white.webp` | real logo (1024×350, transparent) used in header, footer and JSON-LD; already in place |

More than 6 gallery pairs: set `GALLERY_COUNT` in `build/data.mjs`.
Add AVIF: not wired by default (a missing `.avif` would break the fallback). Convert the `.webp` to the same sizes and, if wanted, add `<source type="image/avif">` in `img()` in `build/ui.mjs`.

The Pitts21 slider shows hand-drawn brackets (with the animated sliding door) until `pitts21-old/new.webp` exist; once real photos arrive they replace the drawings.

## Performance notes

* Hero is a real `<img>` in `<picture>`, `fetchpriority="high"`, preloaded per breakpoint.
* Critical CSS is inlined; `styles.css` loads without blocking. Fonts are preloaded.
* One 30 KB-ish script, `defer`. Analytics: set `ANALYTICS_ID` in `build/data.mjs` and it loads after the first interaction or idle.
* Motion uses only `transform`, `opacity` and `clip-path`, pauses offscreen and respects `prefers-reduced-motion`.

## Languages

`/` and `/es/` are separate pre-rendered pages with reciprocal `hreflang`, self canonicals and translated JSON-LD. The EN | ES switch keeps the current section (`#faq`) and stores the choice in `localStorage` (`kf-lang`). It never redirects automatically.

## Deploy

Any static host (Netlify, Cloudflare Pages, S3, Apache, Nginx). Upload the folder (`build/` is not needed in production). Serve `404.html` as the 404 page, gzip/brotli on, long cache on `/assets/`. Redirects: see `MIGRATION.md`.

## Still needs your input

* Opening hours for the four offices (not invented, hidden for now)
* Practice email
* West Monroe ZIP code
* Privacy Policy URL (`PRIVACY_URL`, currently points to `#top`)
* Final production domain (`SITE`, assumed `https://kogaortho.com`)
* All photos, `assets/docs/chompers_gets_braces.pdf`
* GA4 / GTM ID, if wanted
