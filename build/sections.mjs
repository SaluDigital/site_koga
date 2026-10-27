// Every section of the page as a function (ctx) => html string.
// ctx = { c: copy, P: asset path prefix, lang, other: other-language url pieces }

import { BOOKING_URL, REVIEWS_URL, PORTAL_URL, FACEBOOK_URL, INSTAGRAM_URL, PRIVACY_URL, PHONE, EMAIL, OFFICES, GALLERY_COUNT } from './data.mjs';
import { esc, img, wire, icon, chompers, sectionHead, wave, bracketArt, toothRowArt, signArt, smileArcSvg } from './ui.mjs';

const NEW_TAB = { en: ' (opens in a new tab)', es: ' (se abre en una pestaña nueva)' };
const COLORS = ['teal', 'yellow', 'orange', 'crimson'];
const tel = `tel:${PHONE.tel}`;
const sms = `sms:${PHONE.tel}`;

const book = (ctx, label, cls = 'btn--primary', extra = '') =>
  `<a class="btn ${cls}" href="${BOOKING_URL}" target="_blank" rel="noopener"${extra}><span>${esc(label)}</span>${icon('arrow')}<span class="sr">${NEW_TAB[ctx.lang]}</span></a>`;

/** Mascot: real photo if present, inline SVG Chompers if not (see kfMissing in <head>). */
const mascot = (ctx, cls = '', priority = 'low', file = 'chompers', w = 440, h = 546) =>
  `<span class="mascot ${cls}" aria-hidden="true"><img src="${ctx.P}assets/img/${file}.webp" width="${w}" height="${h}" alt="" loading="lazy" decoding="async" fetchpriority="${priority}" onerror="kfMissing(this)"></span>`;

export const logo = (ctx, white = false) =>
  `<a class="logo${white ? ' logo--white' : ''}" href="#top"><img src="${ctx.P}assets/img/${white ? 'logo-white' : 'logo'}.webp" width="1024" height="350" alt="${esc(ctx.c.logoLabel)}" decoding="async"></a>`;

/* ------------------------------------------------------------------ */
export function header(ctx) {
  const { c } = ctx;
  const links = Object.entries(c.nav).map(([k, v]) => `<li><a href="#${k === 'smiles' ? 'smiles' : k}" data-nav="${k}">${esc(v)}</a></li>`).join('');
  const lang = langSwitch(ctx);
  return `<header class="hdr" id="top">
  <div class="hdr__in wrap">
    ${logo(ctx)}
    <nav class="nav" aria-label="${esc(c.navLabel)}"><ul>${links}</ul></nav>
    <div class="hdr__actions">
      ${lang}
      <a class="btn btn--ghost btn--sm hdr__tel" href="${tel}" aria-label="${esc(c.header.call)}">${icon('phone')}<span>${PHONE.display}</span></a>
      ${book(ctx, c.header.book, 'btn--primary btn--sm hdr__book')}
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="${esc(c.menuOpen)}" data-open="${esc(c.menuOpen)}" data-close="${esc(c.menuClose)}"><span></span><span></span><span></span></button>
    </div>
  </div>
  <div class="progress" aria-hidden="true"><i class="progress__fill"></i><span class="progress__marks"></span></div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="${esc(c.mobileNavLabel)}" hidden>
  <nav aria-label="${esc(c.mobileNavLabel)}"><ul class="menu__list">${Object.entries(c.nav)
    .map(([k, v], i) => `<li style="--i:${i}" class="t-${COLORS[i % 4]}"><a href="#${k}"><small>0${i + 1}</small>${esc(v)}</a></li>`)
    .join('')}</ul></nav>
  <div class="menu__foot">
    ${book(ctx, c.header.book, 'btn--yellow btn--lg')}
    <a class="btn btn--ghost-light btn--lg" href="${tel}">${icon('phone')}<span>${PHONE.display}</span></a>
    ${lang}
  </div>
</div>`;
}

function langSwitch(ctx) {
  const { c, lang } = ctx;
  const en = lang === 'en';
  const href = en ? 'es/index.html' : '../index.html';
  return `<div class="lang" role="group" aria-label="${esc(c.langLabel)}">
  ${en ? '<span class="lang__on" aria-current="true" lang="en">EN</span>' : `<a href="${href}" lang="en" hreflang="en" data-lang="en" title="${esc(c.langSwitchTitle)}">EN</a>`}
  <span aria-hidden="true">|</span>
  ${en ? `<a href="${href}" lang="es" hreflang="es" data-lang="es" title="${esc(c.langSwitchTitle)}">ES</a>` : '<span class="lang__on" aria-current="true" lang="es">ES</span>'}
</div>`;
}

export function mobileBar(ctx) {
  const { c } = ctx;
  return `<div class="bar" role="region" aria-label="${esc(c.bar.label)}">
  <div class="bar__call">
    <a class="bar__btn bar__btn--call" href="${tel}" aria-label="${esc(c.bar.callAria)}">${icon('phone')}<span>${esc(c.bar.call)}</span></a>
    <a class="bar__btn bar__btn--text" href="${sms}" aria-label="${esc(c.bar.textAria)}">${icon('sms')}<span>${esc(c.bar.text)}</span></a>
  </div>
  <a class="bar__btn bar__btn--book" href="${BOOKING_URL}" target="_blank" rel="noopener">${icon('cal')}<span>${esc(c.bar.book)}</span><span class="sr">${NEW_TAB[ctx.lang]}</span></a>
</div>`;
}

/* ------------------------------------------------------------------ */
export function hero(ctx) {
  const { c, P } = ctx;
  const h = c.hero;
  const word = (w, i) => `<span class="w"><span style="--i:${i}">${esc(w)}</span></span>`;
  const l1 = h.line1.map((w, i) => word(w, i + 1)).join(' ');
  const l2 = h.line2.map((w, i) => word(w, i + 3)).join(' ');
  return `<section class="hero" aria-labelledby="hero-title">
  <picture class="hero__pic ph" data-ph="hero.webp 1920×1080 · hero-mobile.webp 900×1200" style="--ar:16/9">
    <source media="(max-width: 700px)" srcset="${P}assets/img/hero-mobile.webp" width="900" height="1200">
    <img src="${P}assets/img/hero.webp" width="1920" height="1080" alt="${esc(c.alt.hero)}" fetchpriority="high" decoding="async" onerror="kfMissing(this)">
  </picture>
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="hero__deco" aria-hidden="true">
    <svg class="spark spark--1"><use href="#i-spark"/></svg><svg class="spark spark--2"><use href="#i-spark"/></svg><svg class="spark spark--3"><use href="#i-spark"/></svg>
  </div>
  <div class="wrap hero__in">
    <h1 id="hero-title" class="hero__title"><span class="hero__eyebrow">${esc(h.eyebrow)}</span> <span class="hero__line">${l1}</span> <span class="hero__line hero__line--accent">${l2}<svg class="hero__ul" viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M4 14C60 3 110 22 165 11S262 6 296 13" pathLength="1"/></svg></span></h1>
    <p class="hero__sub">${esc(h.sub)}</p>
    <div class="hero__cta">
      ${book(ctx, h.cta1, 'btn--primary btn--lg')}
      <span class="hero__call"><a class="btn btn--ghost btn--lg" href="${tel}">${icon('phone')}<span>${esc(h.cta2)}</span></a><a class="btn btn--icon btn--ghost" href="${sms}" aria-label="${esc(c.bar.textAria)}">${icon('sms')}</a></span>
    </div>
  </div>
  <div class="hero__wire" aria-hidden="true">${wire()}</div>
</section>`;
}

export function trust(ctx) {
  const { c } = ctx;
  const cols = ['yellow', 'teal', 'orange', 'white'];
  const items = c.trust.items
    .map((it, i) => {
      const num = it.word
        ? `<p class="trust__n trust__n--word">${esc(it.word)}</p>`
        : `<p class="trust__n"><span data-count="${it.n}">${it.n}</span>${esc(it.suffix)}</p>`;
      return `<li class="trust__item" style="--i:${i}" data-c="${cols[i]}"><svg class="trust__star" aria-hidden="true"><use href="#i-star"/></svg>${num}<p class="trust__l">${esc(it.label)}</p></li>`;
    })
    .join('');
  return `<section class="trust" aria-label="${esc(c.trust.label)}">${wave()}<div class="wrap"><ul class="trust__list">${items}</ul></div></section>`;
}

/* ------------------------------------------------------------------ */
export function about(ctx) {
  const { c } = ctx;
  const a = c.about;
  return `<section id="about" class="sec t-yellow" aria-labelledby="about-title" data-chapter>
  ${wave()}
  <div class="wrap about">
    <figure class="about__fig" data-reveal-blob>
      <span class="about__bg" aria-hidden="true"></span>
      <div class="about__blob">${img(ctx, { file: 'dr-koga.webp', w: 641, h: 713, alt: c.alt['dr-koga'], cls: 'about__img', sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
      <span class="sticker about__sticker" aria-hidden="true">${esc(a.sticker)}</span>
    </figure>
    <div class="about__txt">
      ${sectionHead(c, { id: 'about', eyebrow: a.eyebrow, title: a.title, intro: a.lead })}
      <ul class="ticks ticks--wire">${a.creds.map((x) => `<li>${x}</li>`).join('')}</ul>
      <p class="about__family">${esc(a.family)}</p>
      <p class="about__area"><span>${esc(a.areaLabel)}</span> ${a.areas.map((x) => `<b class="chip">${esc(x)}</b>`).join('')} ${a.areaSuffix ? `<span>${esc(a.areaSuffix)}</span>` : ''}</p>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
export function services(ctx) {
  const { c } = ctx;
  const s = c.services;
  const files = ['service-kids', 'service-adults', 'service-aligners', 'service-bite', 'service-retainers'];
  const tabs = s.items
    .map(
      (it, i) => `<button class="svc__tab" role="tab" id="svc-tab-${it.id}" aria-controls="svc-${it.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}" data-accent="${it.color}"><span class="svc__num" aria-hidden="true">0${i + 1}</span><span>${esc(it.tab)}</span></button>`
    )
    .join('');
  const panels = s.items
    .map((it, i) => {
      const bookCls = 'btn--primary';
      return `<div class="svc__panel" role="tabpanel" id="svc-${it.id}" aria-labelledby="svc-tab-${it.id}" tabindex="0"${i ? ' hidden' : ''}>
  <div class="svc__img">${img(ctx, { file: `${files[i]}.webp`, w: 900, h: 900, alt: c.alt[files[i]], sizes: '(min-width: 900px) 40vw, 80vw' })}</div>
  <div class="svc__txt">
    <h3 class="h3">${esc(it.title)}</h3>
    <p>${esc(it.body)}</p>
    <ul class="ticks">${it.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    ${it.note ? `<p class="note">${esc(it.note)}</p>` : ''}
    ${book(ctx, it.cta, bookCls)}
  </div>
</div>`;
    })
    .join('');
  return `<section id="services" class="sec t-teal" aria-labelledby="services-title" data-chapter>
  ${wave()}
  <div class="wrap">
    ${sectionHead(c, { id: 'services', eyebrow: s.eyebrow, title: s.title, intro: s.intro })}
    <div class="svc" data-svc data-accent="teal" data-i="0">
      <div class="svc__tabs" role="tablist" aria-label="${esc(s.tablistLabel)}">${tabs}</div>
      <div class="svc__stage">
        <span class="svc__blob" aria-hidden="true"></span>
        ${panels}
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
export function tech(ctx) {
  const { c } = ctx;
  const t = c.tech;
  const p = t.pitts;
  const a = t.arc;
  return `<section id="technology" class="sec t-orange" aria-labelledby="technology-title" data-chapter>
  ${wave()}
  <div class="wrap">
    ${sectionHead(c, { id: 'technology', eyebrow: t.eyebrow, title: t.title })}
    <div class="tech">
      <div class="tech__txt">
        <h3 class="h3">${esc(p.title)}</h3>
        <p>${esc(p.intro)}</p>
        <ul class="pills">${p.benefits.map((b) => `<li>${icon('star')}${esc(b)}</li>`).join('')}</ul>
      </div>
      <div class="cmp cmp--pitts" data-cmp data-door style="--p:50">
        <div class="cmp__layer">${img(ctx, { file: 'pitts21-old.webp', w: 800, h: 800, alt: c.alt['pitts21-old'], art: bracketArt('old'), sizes: '(min-width: 900px) 45vw, 90vw' })}</div>
        <div class="cmp__layer cmp__top">${img(ctx, { file: 'pitts21-new.webp', w: 800, h: 800, alt: c.alt['pitts21-new'], art: bracketArt('new'), sizes: '(min-width: 900px) 45vw, 90vw' })}</div>
        <span class="cmp__tag cmp__tag--l">${esc(p.oldLabel)}</span><span class="cmp__tag cmp__tag--r">${esc(p.newLabel)}</span>
        <span class="cmp__handle" aria-hidden="true"><span class="cmp__knob">${icon('drag')}</span></span>
        <input class="cmp__range" type="range" min="0" max="100" value="50" aria-label="${esc(p.sliderLabel)}">
        <span class="cmp__hint" aria-hidden="true">${esc(p.hint)}</span>
      </div>
    </div>

    <div class="arc" data-arc>
      <div class="arc__stage">
        ${smileArcSvg(a.svgLabel)}
        <div class="arc__toggle" role="group" aria-label="${esc(a.toggleLabel)}">
          <button type="button" class="chipbtn" data-arc-mode="6" aria-pressed="false">${esc(a.traditional)}</button>
          <button type="button" class="chipbtn" data-arc-mode="12" aria-pressed="true">${esc(a.arc)}</button>
        </div>
      </div>
      <div class="arc__txt">
        <h3 class="h3">${esc(a.title)}</h3>
        <p>${esc(a.intro)}</p>
        <div class="arc__figs">
          <figure>${img(ctx, { file: 'smile-traditional.webp', w: 1000, h: 700, alt: c.alt['smile-traditional'], sizes: '(min-width: 900px) 20vw, 45vw' })}<figcaption>${esc(a.figTraditional)}</figcaption></figure>
          <figure>${img(ctx, { file: 'smile-arc.webp', w: 1000, h: 700, alt: c.alt['smile-arc'], sizes: '(min-width: 900px) 20vw, 45vw' })}<figcaption>${esc(a.figArc)}</figcaption></figure>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
export function kids(ctx) {
  const { c } = ctx;
  const k = c.kids;
  const xs = k.ages.map((_, i) => i / (k.ages.length - 1)); // equal spacing between stops
  const burst = Array.from({ length: 10 }, (_, i) => `<i style="--a:${i * 36}deg;--d:${(i % 3) * 40}ms"></i>`).join('');
  const stops = k.ages
    .map(
      (a, i) => `<li class="tl__stop${a.star ? ' is-star' : ''}" style="--x:${xs[i].toFixed(3)}" data-x="${xs[i].toFixed(3)}">
  <span class="tl__age"><b>${a.age}</b><small>${esc(k.yearsLabel)}</small></span>
  <span class="tl__pin" aria-hidden="true"><i></i>${a.star ? `<span class="burst">${burst}</span>` : ''}</span>
  <p class="tl__text">${a.star ? `<strong class="tag">${esc(a.star)}</strong>` : ''}${esc(a.text)}</p>
</li>`
    )
    .join('');
  const signs = k.signs
    .map(
      (s) => `<li><button type="button" class="flip" aria-pressed="false"><span class="flip__in">
  <span class="flip__f">${signArt(s.id)}<b>${esc(s.name)}</b></span>
  <span class="flip__b"><b>${esc(s.name)}</b><span>${esc(s.text)}</span></span>
</span></button></li>`
    )
    .join('');
  const steps = k.steps
    .map(
      (s, i) => `<li class="steps__item" style="--i:${i}" data-c="${COLORS[i]}"><span class="steps__sq" aria-hidden="true"><b>${i + 1}</b></span><h4><span class="sr">${esc(k.stepLabel)} ${i + 1}: </span>${esc(s.t)}</h4><p>${esc(s.d)}</p></li>`
    )
    .join('');
  return `<section id="kids" class="sec t-crimson" aria-labelledby="kids-title" data-chapter>
  ${wave()}
  <div class="wrap">
    ${sectionHead(c, { id: 'kids', eyebrow: k.eyebrow, title: k.title, intro: k.intro })}

    <div class="tl" data-tl role="group" aria-label="${esc(k.timelineLabel)}">
      <h3 class="h3 tl__title">${esc(k.timelineTitle)}</h3>
      <div class="tl__track">
        <ol class="tl__stops">${stops}</ol>
        <div class="tl__chomp" aria-hidden="true"><span class="tl__roll">${mascot(ctx, 'mascot--ball', 'low', 'chompers-face', 256, 256)}</span></div>
      </div>
    </div>

    <div class="signs">
      <div class="signs__head"><h3 class="h3">${esc(k.signsTitle)}</h3><p class="hintline">${esc(k.signsHint)}</p></div>
      <ul class="signs__grid">${signs}</ul>
      <p class="signs__note">${esc(k.signsNote)}</p>
    </div>

    <div class="coloring">
      ${mascot(ctx, 'coloring__chomp')}
      <div>
        <h3 class="h3">${esc(k.chompers.title)}</h3>
        <p>${esc(k.chompers.text)}</p>
        <p class="coloring__meta"><b>${esc(k.chompers.book)}</b> · ${esc(k.chompers.meta)}</p>
        <a class="btn btn--yellow" href="${ctx.P}assets/docs/chompers_gets_braces.pdf" download>${icon('dl')}<span>${esc(k.chompers.cta)}</span></a>
      </div>
    </div>

    <div class="steps">
      <h3 class="h3">${esc(k.stepsTitle)}</h3>
      <ol class="steps__list">${steps}</ol>
      <div class="steps__cta">${book(ctx, k.ctaBook, 'btn--primary btn--lg')}</div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
export function gallery(ctx) {
  const { c } = ctx;
  const g = c.gallery;
  const n = GALLERY_COUNT;
  const pad = (i) => String(i).padStart(2, '0');
  const cases = Array.from({ length: n }, (_, i) => {
    const k = i + 1;
    return `<div class="cmp cmp--gal" data-cmp style="--p:50" id="case-${k}"${i ? ' hidden' : ''}>
  <div class="cmp__layer">${img(ctx, { file: `gallery-${pad(k)}-before.webp`, w: 1200, h: 900, alt: c.alt.gallery(k, 'before'), art: toothRowArt('before', k), cls: 'is-before', sizes: '(min-width: 900px) 60vw, 95vw' })}</div>
  <div class="cmp__layer cmp__top">${img(ctx, { file: `gallery-${pad(k)}-after.webp`, w: 1200, h: 900, alt: c.alt.gallery(k, 'after'), art: toothRowArt('after', k), cls: 'is-after', sizes: '(min-width: 900px) 60vw, 95vw' })}</div>
  <span class="cmp__tag cmp__tag--l">${esc(g.before)}</span><span class="cmp__tag cmp__tag--r">${esc(g.after)}</span>
  <span class="cmp__handle" aria-hidden="true"><span class="cmp__knob">${icon('drag')}</span></span>
  <input class="cmp__range" type="range" min="0" max="100" value="50" aria-label="${esc(g.sliderLabel)} ${k}">
  <span class="cmp__hint" aria-hidden="true">${esc(g.hint)}</span>
</div>`;
  }).join('');
  const thumbs = Array.from({ length: n }, (_, i) => `<button type="button" class="gal__thumb" aria-pressed="${i === 0}" data-case="${i + 1}" style="--c:${['#4FD1E3', '#FBE21B', '#E5832A', '#C8203F'][i % 4]};--fg:${i % 4 === 3 ? '#fff' : '#0B3340'}"><span>${esc(g.caseLabel)}</span><b>${i + 1}</b></button>`).join('');
  return `<section id="smiles" class="sec t-teal" aria-labelledby="smiles-title" data-chapter>
  ${wave()}
  <div class="wrap">
    ${sectionHead(c, { id: 'smiles', eyebrow: g.eyebrow, title: g.title, intro: g.intro })}
    <div class="gal" data-gal>
      <div class="gal__stage">${cases}</div>
      <div class="gal__thumbs" role="group" aria-label="${esc(g.casesLabel)}">${thumbs}</div>
      <p class="fine">${esc(g.disclaimer)}</p>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
export function why(ctx) {
  const { c } = ctx;
  const w = c.why;
  const tiles = w.tiles
    .map((t, i) => {
      const inner = `<span class="bento__ic">${icon(t.icon)}</span><h3>${esc(t.t)}</h3><p>${esc(t.d)}</p>`;
      const body =
        t.id === 'family'
          ? `<div class="bento__photo">${img(ctx, { file: 'team.webp', w: 1400, h: 900, alt: c.alt.team, sizes: '(min-width: 900px) 40vw, 90vw' })}</div><div class="bento__text">${inner}</div>`
          : inner;
      return `<li class="bento__tile bento__tile--${t.id}" style="--i:${i};--rx:${[-90, 80, -70, 100, -100, 70][i]}px;--ry:${[60, -80, 90, -60, 80, -70][i]}px;--rr:${[-9, 7, -6, 10, -8, 6][i]}deg" data-c="${COLORS[i % 4]}">${body}</li>`;
    })
    .join('');
  return `<section id="why" class="sec t-yellow" aria-labelledby="why-title" data-chapter>
  ${wave()}
  <div class="wrap">
    ${sectionHead(c, { id: 'why', eyebrow: w.eyebrow, title: w.title })}
    <ul class="bento" data-bento>${tiles}</ul>
  </div>
</section>`;
}

export function payment(ctx) {
  const { c } = ctx;
  const p = c.payment;
  const steps = p.steps
    .map(
      (s, i) => `<li class="pay__card" style="--i:${i}" data-c="${COLORS[i]}"><span class="pay__num" aria-hidden="true">${i + 1}</span><div><h3 class="h3"><span class="sr">${esc(p.stepLabel)} ${i + 1}: </span>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></li>`
    )
    .join('');
  return `<section id="payment" class="sec t-orange" aria-labelledby="payment-title" data-chapter>
  ${wave()}
  <div class="wrap pay">
    <div class="pay__intro">${sectionHead(c, { id: 'payment', eyebrow: p.eyebrow, title: p.title, intro: p.intro })}<div class="pay__cta">${book(ctx, p.cta, 'btn--primary btn--lg')}</div>${mascot(ctx, 'pay__chomp', 'low', 'chompers-calm', 440, 557)}</div>
    <ol class="pay__stack">${steps}</ol>
  </div>
</section>`;
}

export function reviews(ctx) {
  const { c } = ctx;
  const r = c.reviews;
  const cards = r.items
    .map(
      (it, i) => `<li class="rv__card" style="--i:${i}" data-c="${COLORS[i % 4]}"><figure class="bubble"><blockquote><p>${esc(it.q)}</p></blockquote><figcaption><span class="rv__av" aria-hidden="true">${esc(it.n[0])}</span><span><b>${esc(it.n)}</b><small>${esc(r.source)}</small></span></figcaption></figure></li>`
    )
    .join('');
  return `<section id="reviews" class="sec t-crimson" aria-labelledby="reviews-title" data-chapter>
  ${wave()}
  <div class="wrap rv__head">
    ${sectionHead(c, { id: 'reviews', eyebrow: r.eyebrow, title: r.title })}
    ${mascot(ctx, 'rv__chomp', 'low', 'chompers-grin', 440, 549)}
  </div>
  <div class="rv" data-rv>
    <ul class="rv__track" tabindex="0" aria-label="${esc(r.label)}">${cards}</ul>
  </div>
  <div class="wrap rv__bar">
    <div class="rv__ctrl">
      <button type="button" class="iconbtn" data-rv-prev aria-label="${esc(r.prev)}">${icon('chev', 'flip-x')}</button>
      <button type="button" class="iconbtn" data-rv-next aria-label="${esc(r.next)}">${icon('chev')}</button>
      <button type="button" class="iconbtn" data-rv-toggle aria-pressed="false" data-play="${esc(r.play)}" data-pause="${esc(r.pause)}" aria-label="${esc(r.pause)}">${icon('pause')}</button>
    </div>
    <a class="btn btn--ghost" href="${REVIEWS_URL}" target="_blank" rel="noopener"><span>${esc(r.more)}</span>${icon('arrow')}<span class="sr">${NEW_TAB[ctx.lang]}</span></a>
  </div>
</section>`;
}

export function faq(ctx) {
  const { c } = ctx;
  const f = c.faq;
  const items = f.items
    .map(
      (it, i) => `<div class="faq__item">
  <h3><button type="button" class="faq__q" id="faq-q${i}" aria-expanded="false" aria-controls="faq-a${i}"><span>${esc(it.q)}</span><span class="faq__ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path class="plus" d="M12 5v14M5 12h14"/><path class="smile" d="M5 10c2 6 12 6 14 0" pathLength="1"/></svg></span></button></h3>
  <div class="faq__a" id="faq-a${i}" role="region" aria-labelledby="faq-q${i}"><div><p>${esc(it.a)}</p></div></div>
</div>`
    )
    .join('');
  return `<section id="faq" class="sec t-teal" aria-labelledby="faq-title" data-chapter>
  ${wave()}
  <div class="wrap faq">
    <div class="faq__side">${sectionHead(c, { id: 'faq', eyebrow: f.eyebrow, title: f.title })}${mascot(ctx, 'faq__chomp', 'low', 'chompers-worried', 440, 545)}</div>
    <div class="faq__list" data-faq>${items}</div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
export function officeAddress(o) {
  return `${o.street}, ${o.locality}, ${o.region}${o.zip ? ' ' + o.zip : ''}`;
}

export function locations(ctx) {
  const { c, lang } = ctx;
  const l = c.locations;
  const tabs = OFFICES.map(
    (o, i) => `<button class="loc__tab t-${o.color}" role="tab" id="loc-tab-${o.id}" aria-controls="loc-${o.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}"><i class="loc__dot" aria-hidden="true"></i><span><b>${esc(o.city)}</b><small>${esc(o.street)}</small></span></button>`
  ).join('');
  const panels = OFFICES.map((o, i) => {
    const addr = officeAddress(o);
    const hours = o.hours ? `<p class="loc__hours"><b>${esc(l.hoursLabel)}:</b> ${esc(o.hours[lang])}</p>` : '';
    const email = EMAIL ? `<p><a href="mailto:${EMAIL}">${EMAIL}</a></p>` : '';
    return `<article class="loc__card t-${o.color}" role="tabpanel" id="loc-${o.id}" aria-labelledby="loc-tab-${o.id}" tabindex="0"${i ? ' hidden' : ''} data-lat="${o.lat}" data-lng="${o.lng}">
  <div class="loc__photo">${img(ctx, { file: o.image, w: 1024, h: 683, alt: c.alt[o.image.replace('.webp', '')], sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
  <div class="loc__body">
    <h3 class="h3">Koga Orthodontics<br><span>${esc(o.city)}, ${o.region}</span></h3>
    <address>${esc(o.street)}<br>${esc(o.locality)}, ${o.region}${o.zip ? ' ' + o.zip : ''}</address>
    <p class="loc__phone">${esc(l.phoneLabel)}: <a href="${tel}">${PHONE.display}</a></p>
    ${hours}${email}
    <div class="loc__btns">
      <a class="btn btn--primary btn--sm" href="https://www.google.com/maps/search/?api=1&amp;query=${o.lat},${o.lng}" target="_blank" rel="noopener" data-map="open" data-lat="${o.lat}" data-lng="${o.lng}" data-label="${esc(addr)}">${icon('pin')}<span>${esc(l.openMap)}</span><span class="sr">${NEW_TAB[lang]}</span></a>
      <a class="btn btn--ghost btn--sm" href="https://www.google.com/maps/dir/?api=1&amp;destination=${o.lat},${o.lng}" target="_blank" rel="noopener" data-map="dir" data-lat="${o.lat}" data-lng="${o.lng}" data-label="${esc(addr)}">${icon('nav')}<span>${esc(l.directions)}</span><span class="sr">${NEW_TAB[lang]}</span></a>
      <a class="btn btn--ghost btn--sm" href="${tel}">${icon('phone')}<span>${esc(l.call)}</span></a>
      <a class="btn btn--ghost btn--sm" href="${sms}">${icon('sms')}<span>${esc(l.text)}</span></a>
    </div>
  </div>
  <div class="loc__map" data-map-box role="group" aria-label="${esc(l.mapLabel)}: ${esc(o.city)}">
    <svg class="loc__art" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><use href="#map-art"/></svg>
    <svg class="loc__pin" viewBox="0 0 40 52" aria-hidden="true" focusable="false"><ellipse class="loc__shadow" cx="20" cy="49" rx="9" ry="3"/><path class="loc__pinbody" d="M20 2C10 2 3 9.500 3 19c0 12 17 29 17 29s17-17 17-29C37 9.500 30 2 20 2z"/><circle cx="20" cy="19" r="6.500" fill="#fff"/></svg>
    <button type="button" class="btn btn--sm btn--white loc__load" data-map-load>${icon('pin')}<span>${esc(l.showMap)}</span></button>
    <p class="loc__note">${esc(l.mapNote)}</p>
  </div>
</article>`;
  }).join('');
  return `<section id="locations" class="sec t-yellow" aria-labelledby="locations-title" data-chapter>
  ${wave()}
  <div class="wrap">
    ${sectionHead(c, { id: 'locations', eyebrow: l.eyebrow, title: l.title })}
    <div class="loc" data-loc>
      <div class="loc__list" role="tablist" aria-orientation="vertical" aria-label="${esc(l.listLabel)}">${tabs}</div>
      <div class="loc__panels">${panels}</div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
export function finalCta(ctx) {
  const { c } = ctx;
  const m = c.cta.marquee;
  return `<section id="book" class="cta" aria-labelledby="book-title" data-chapter>
  ${wave()}
  <div class="cta__marquee" aria-hidden="true"><div class="cta__run" data-marquee><span>${esc(m)} </span><span>${esc(m)} </span><span>${esc(m)} </span><span>${esc(m)} </span></div></div>
  <div class="wrap cta__in">
    ${mascot(ctx, 'cta__chomp', 'low', 'chompers-wink', 440, 560)}
    <h2 id="book-title" class="h2 cta__title">${esc(c.cta.title)}</h2>
    <p class="cta__text">${esc(c.cta.text)}</p>
    <div class="cta__btns">
      <span data-magnetic>${book(ctx, c.cta.book, 'btn--yellow btn--xl')}</span>
      <a class="btn btn--ghost-light btn--lg" href="${tel}">${icon('phone')}<span>${esc(c.cta.call)}</span></a>
    </div>
  </div>
</section>`;
}

export function footer(ctx) {
  const { c } = ctx;
  const f = c.footer;
  return `<footer class="ftr">
  <div class="wrap ftr__grid">
    <div class="ftr__brand">${logo(ctx, true)}
      <p class="ftr__social"><a href="${FACEBOOK_URL}" target="_blank" rel="noopener" aria-label="${f.facebook}">${icon('fb')}<span class="sr">${f.facebook}${NEW_TAB[ctx.lang]}</span></a><a href="${INSTAGRAM_URL}" target="_blank" rel="noopener" aria-label="${f.instagram}">${icon('ig')}<span class="sr">${f.instagram}${NEW_TAB[ctx.lang]}</span></a></p>
    </div>
    <div><h2 class="ftr__h">${esc(f.contact)}</h2><p><a href="${tel}">${PHONE.display}</a></p>${EMAIL ? `<p><a href="mailto:${EMAIL}">${EMAIL}</a></p>` : ''}</div>
    <div><h2 class="ftr__h">${esc(f.offices)}</h2><ul>${OFFICES.map((o) => `<li><a href="#locations" data-loc-go="${o.id}">${esc(o.city)}</a></li>`).join('')}</ul></div>
    <div><h2 class="ftr__h">${esc(f.links)}</h2><ul>
      <li><a href="${PORTAL_URL}" target="_blank" rel="noopener">${esc(f.portal)}<span class="sr">${NEW_TAB[ctx.lang]}</span></a></li>
      <li><a href="${PRIVACY_URL}">${esc(f.privacy)}</a></li>
    </ul></div>
  </div>
  <div class="wrap ftr__copy"><p>${esc(f.copy)}</p></div>
</footer>`;
}
