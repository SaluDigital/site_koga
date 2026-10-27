# Migration from the old WordPress site (kogaortho.com)

The new site is a single page, so most old URLs become **301 redirects to a section anchor**.
Anchors survive a redirect in browsers, so `/faq/` → `/#faq` lands on the right section.
(Search engines drop the fragment, which is fine: the page itself is what gets the old URL's authority.)

> Replace `kogaortho.com` if the production domain differs (`SITE` in `build/data.mjs`).

## 301 redirect map

| Old URL | New destination |
|---|---|
| `/braces-for-kids/` | `/#services` (Kids tab) and `/#kids` |
| `/braces-for-adults-seniors/` | `/#services` |
| `/bite-jaw-correction/` | `/#services` |
| `/clear-aligners/` | `/#services` |
| `/retainers/` | `/#services` |
| `/all-services/` | `/#services` |
| `/kids-orthodontics/` | `/#kids` |
| `/faq/` | `/#faq` |
| `/locations/` | `/#locations` |
| `/orthodontist-in-monroe-louisiana/` | `/#locations` |
| `/orthodontist-in-west-monroe-louisiana/` | `/#locations` |
| `/orthodontist-in-rayville-louisiana/` | `/#locations` |
| `/orthodontist-in-columbia-louisiana/` | `/#locations` |
| `/blog/` | `/` (no blog yet) |

Spanish visitors: the same rules apply under `/es/` if the old site had Spanish URLs.

### Apache (`.htaccess`)

```apache
Redirect 301 /braces-for-kids/                       https://kogaortho.com/#services
Redirect 301 /braces-for-adults-seniors/             https://kogaortho.com/#services
Redirect 301 /bite-jaw-correction/                   https://kogaortho.com/#services
Redirect 301 /clear-aligners/                        https://kogaortho.com/#services
Redirect 301 /retainers/                             https://kogaortho.com/#services
Redirect 301 /all-services/                          https://kogaortho.com/#services
Redirect 301 /kids-orthodontics/                     https://kogaortho.com/#kids
Redirect 301 /faq/                                   https://kogaortho.com/#faq
Redirect 301 /locations/                             https://kogaortho.com/#locations
Redirect 301 /orthodontist-in-monroe-louisiana/      https://kogaortho.com/#locations
Redirect 301 /orthodontist-in-west-monroe-louisiana/ https://kogaortho.com/#locations
Redirect 301 /orthodontist-in-rayville-louisiana/    https://kogaortho.com/#locations
Redirect 301 /orthodontist-in-columbia-louisiana/    https://kogaortho.com/#locations
Redirect 301 /blog/                                  https://kogaortho.com/
ErrorDocument 404 /404.html
```

### Nginx

```nginx
location = /faq/                 { return 301 /#faq; }
location = /locations/           { return 301 /#locations; }
location = /kids-orthodontics/   { return 301 /#kids; }
location ~ ^/(braces-for-kids|braces-for-adults-seniors|bite-jaw-correction|clear-aligners|retainers|all-services)/?$ { return 301 /#services; }
location ~ ^/orthodontist-in-(monroe|west-monroe|rayville|columbia)-louisiana/?$ { return 301 /#locations; }
location = /blog/                { return 301 /; }
error_page 404 /404.html;
```

### Netlify / Cloudflare Pages (`_redirects`)

```
/braces-for-kids/                           /#services   301
/braces-for-adults-seniors/                 /#services   301
/bite-jaw-correction/                       /#services   301
/clear-aligners/                            /#services   301
/retainers/                                 /#services   301
/all-services/                              /#services   301
/kids-orthodontics/                         /#kids       301
/faq/                                       /#faq        301
/locations/                                 /#locations  301
/orthodontist-in-monroe-louisiana/          /#locations  301
/orthodontist-in-west-monroe-louisiana/     /#locations  301
/orthodontist-in-rayville-louisiana/        /#locations  301
/orthodontist-in-columbia-louisiana/        /#locations  301
/blog/                                      /            301
```

## Launch checklist

### Before switching DNS
- [ ] Replace placeholder photos in `assets/img/` (see README).
- [ ] Confirm hours, email, West Monroe ZIP and Privacy Policy URL (see README, "Still needs your input").
- [ ] Put the final domain in `SITE` (`build/data.mjs`) and run `node build/build.mjs`.
- [ ] Add `assets/docs/chompers_gets_braces.pdf`.
- [ ] Test the Rich Results Test and the Schema Markup Validator on `/` and `/es/` (no `AggregateRating` on purpose).
- [ ] Run PageSpeed Insights (mobile): targets Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
- [ ] Load the redirect map above and spot-check every old URL.

### Google Search Console
- [ ] Add the property (Domain), verify via DNS.
- [ ] Submit `https://kogaortho.com/sitemap.xml`.
- [ ] URL Inspection on `/` and `/es/` → Request indexing.
- [ ] Use *Change of address* only if the domain changes; otherwise watch **Pages** and **Redirects** for errors for 4 weeks.
- [ ] Check **International targeting / Page indexing** that both language versions are indexed with the hreflang pairs.

### Google Business Profile (one profile per office)
- [ ] Website link → `https://kogaortho.com/` (or `/#locations`).
- [ ] Appointment link → the booking URL.
- [ ] Confirm name, address, phone `(318) 388-4209` match the website exactly (NAP consistency).
- [ ] Add hours (and then add them to `build/data.mjs` so the site and JSON-LD match).
- [ ] Upload the same office photos used on the site; add services (braces, clear aligners, Pitts21, retainers).
- [ ] Keep answering reviews; keep the "See more reviews" link pointing at the Google place.
