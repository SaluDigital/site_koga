/* Koga Orthodontics · main.js
   One deferred file, small modules, feature-detected. No dependencies.
   Motion uses transform / opacity / clip-path only. Honours prefers-reduced-motion. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const raf = requestAnimationFrame;
  const BRAND = ['#0096AC', '#FBE21B', '#E5832A', '#C8203F'];
  const hasIO = 'IntersectionObserver' in window;

  /** Run cb once when el is visible (immediately without IntersectionObserver). */
  function once(el, cb, threshold = 0.25) {
    if (!el) return;
    if (!hasIO) return cb(el);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); cb(e.target); }
    }, { threshold });
    io.observe(el);
  }

  const debounce = (fn, ms) => { let t; return () => { clearTimeout(t); t = setTimeout(fn, ms); }; };
  const idle = (fn, ms) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: ms }) : setTimeout(fn, ms));
  /** Run layout-reading work after the page has loaded, off the critical path. */
  const afterLoad = (fn) => {
    const run = () => setTimeout(fn, 60);
    if (document.readyState === 'complete') run(); else addEventListener('load', run, { once: true });
  };

  /* ---------- one shared, rAF-batched scroll loop ---------- */
  const scrollFns = [];
  let lastY = scrollY, ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    raf(() => {
      ticking = false;
      const y = scrollY, dy = y - lastY;
      lastY = y;
      for (const f of scrollFns) f(y, dy);
    });
  }, { passive: true });

  /* ---------- header: compact on scroll ---------- */
  function headerCompact() {
    const hdr = $('.hdr');
    if (!hdr) return;
    const set = (y) => hdr.classList.toggle('is-compact', y > 24);
    scrollFns.push(set);
    set(scrollY);
  }

  /* ---------- mobile menu (full-screen, focus managed) ---------- */
  function menu() {
    const btn = $('.burger'), m = $('#menu');
    if (!btn || !m) return;
    const inertTargets = () => ['#main', '.ftr', '.bar'].map((s) => $(s)).filter(Boolean);
    let open = false;
    const focusables = () => $$('a[href],button', m).filter((el) => !el.disabled);
    function set(v) {
      open = v;
      btn.setAttribute('aria-expanded', String(v));
      btn.setAttribute('aria-label', v ? btn.dataset.close : btn.dataset.open);
      document.body.classList.toggle('menu-open', v);
      inertTargets().forEach((el) => { el.inert = v; });
      if (v) {
        m.hidden = false;
        void m.offsetWidth;
        m.classList.add('is-open');
        const first = $('a', m);
        setTimeout(() => first && first.focus({ preventScroll: true }), reduce ? 0 : 250);
      } else {
        m.classList.remove('is-open');
        setTimeout(() => { if (!open) m.hidden = true; }, reduce ? 0 : 650);
      }
    }
    btn.addEventListener('click', () => set(!open));
    $('.menu__close', m).addEventListener('click', () => { set(false); btn.focus(); });
    m.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'Escape') { set(false); btn.focus(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables();
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    matchMedia('(min-width: 1000px)').addEventListener('change', (e) => { if (e.matches && open) set(false); });
  }

  /* ---------- chapters: active nav link, offscreen pausing, scroll wire ---------- */
  let currentSection = '';
  function chapters() {
    const sections = $$('main > section[id]');
    const links = $$('.nav a[data-nav]');
    if (hasIO) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          currentSection = e.target.id;
          links.forEach((a) => {
            if (a.getAttribute('href') === '#' + currentSection) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        }
      }, { rootMargin: '-40% 0px -55% 0px' });
      sections.forEach((s) => io.observe(s));

      // pause infinite animations that are offscreen
      const off = new IntersectionObserver((entries) => {
        for (const e of entries) e.target.classList.toggle('off', !e.isIntersecting);
      }, { rootMargin: '120px 0px' });
      $$('main > section, .ftr').forEach((s) => off.observe(s));
    }
    scrollWire($$('main > section[data-chapter]'));
  }

  function scrollWire(chap) {
    const marks = $('.progress__marks'), fill = $('.progress__fill');
    if (!marks || !chap.length) return;
    const n = chap.length;
    // marks sit at equal distances; the wire fill is mapped piecewise so it reaches
    // each bracket exactly when that chapter is reached
    const items = chap.map((sec, i) => {
      const el = document.createElement('i');
      el.style.setProperty('--c', BRAND[i % 4]);
      const x = (i + 0.5) / n;
      el.style.setProperty('--m', (x * 100).toFixed(3));
      marks.appendChild(el);
      return { sec, el, at: 0, x };
    });
    let max = 1;
    function measure() {
      measured = true;
      const vh = innerHeight;
      max = Math.max(1, document.documentElement.scrollHeight - vh);
      let prev = 0;
      for (const it of items) {
        const top = it.sec.getBoundingClientRect().top + scrollY;
        it.at = Math.max(prev + 1, clamp(top - vh * 0.55, 0, max));
        prev = it.at;
      }
      paint(scrollY);
    }
    function frac(y) {
      let ax = 0, ay = 0;
      for (const it of items) {
        if (y <= it.at) return ax + ((y - ay) / Math.max(1, it.at - ay)) * (it.x - ax);
        ax = it.x; ay = it.at;
      }
      return ax + clamp((y - ay) / Math.max(1, max - ay), 0, 1) * (1 - ax);
    }
    function paint(y) {
      if (fill) fill.style.setProperty('--p', clamp(frac(y), 0, 1).toFixed(4));
      for (const it of items) it.el.classList.toggle('on', y >= it.at - 2);
    }
    // layout reads are lazy: first scroll (or idle), never on the critical path
    let measured = false;
    const ensure = () => { if (!measured) { measured = true; measure(); } };
    scrollFns.unshift(ensure);
    scrollFns.push(paint);
    idle(ensure, 6000);
    const later = debounce(measure, 150);
    addEventListener('resize', later, { passive: true });
    if ('ResizeObserver' in window) {
      let first = true;
      new ResizeObserver(() => { if (first) { first = false; return; } later(); }).observe(document.body);
    }
  }

  /* ---------- language switch keeps the section and remembers the choice ---------- */
  function language() {
    $$('.lang a[data-lang]').forEach((a) => {
      a.addEventListener('click', () => {
        try { localStorage.setItem('kf-lang', a.dataset.lang); } catch (_) { /* storage may be blocked */ }
        const base = a.getAttribute('href').split('#')[0];
        a.setAttribute('href', base + (currentSection ? '#' + currentSection : ''));
      });
    });
  }

  /* ---------- trust strip: count-up + star pop ---------- */
  function trust() {
    const sec = $('.trust');
    if (!sec) return;
    const nums = $$('[data-count]', sec);
    if (!reduce) nums.forEach((n) => { n.textContent = '0'; });
    once(sec, () => {
      sec.classList.add('in');
      if (reduce) return;
      const t0 = performance.now(), D = 1500;
      const step = (now) => {
        const k = clamp((now - t0) / D, 0, 1), e = 1 - Math.pow(1 - k, 3);
        nums.forEach((n) => { n.textContent = Math.round(+n.dataset.count * e); });
        if (k < 1) raf(step);
      };
      raf(step);
    }, 0.4);
  }

  /* ---------- about: blob reveal ---------- */
  function about() {
    once($('[data-reveal-blob]'), (el) => el.classList.add('in'), 0.3);
  }

  /* ---------- accessible tabs (shared by Services and Locations) ---------- */
  function tabs(list, onSelect) {
    const ts = $$('[role="tab"]', list);
    function select(i, focus) {
      ts.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) ts[i].focus();
      if (list.scrollWidth > list.clientWidth + 2) {
        const t = ts[i];
        list.scrollTo({ left: t.offsetLeft - (list.clientWidth - t.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
      if (onSelect) onSelect(i, ts[i]);
    }
    ts.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const k = e.key, n = ts.length;
        let to = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') to = (i + 1) % n;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') to = (i - 1 + n) % n;
        else if (k === 'Home') to = 0;
        else if (k === 'End') to = n - 1;
        if (to !== null) { e.preventDefault(); select(to, true); }
      });
    });
    return select;
  }

  /* ---------- services: blob morphs and accent swaps with the tab ---------- */
  function services() {
    const root = $('[data-svc]');
    if (!root) return;
    tabs($('.svc__tabs', root), (i, tab) => {
      root.dataset.i = String(i);
      root.dataset.accent = tab.dataset.accent;
    });
  }

  /* ---------- compare sliders (Pitts21 + gallery) ---------- */
  function compare(el) {
    const range = $('.cmp__range', el);
    const door = el.hasAttribute('data-door');
    let dragging = false;
    function set(p) {
      p = clamp(p, 0, 100);
      el.style.setProperty('--p', p.toFixed(2));
      range.value = String(Math.round(p));
      range.setAttribute('aria-valuetext', Math.round(p) + '%');
      if (door) el.style.setProperty('--door', Math.abs(Math.sin((p / 100) * Math.PI * 3)).toFixed(3));
    }
    const fromEvent = (e) => { const r = el.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      dragging = true;
      el.classList.add('touched');
      try { el.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      fromEvent(e);
    });
    el.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    const end = () => { dragging = false; };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    range.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 5 : e.key === 'ArrowLeft' ? -5 : 0;
      if (d) { e.preventDefault(); el.classList.add('touched'); set(+range.value + d); }
    });
    range.addEventListener('input', () => { el.classList.add('touched'); set(+range.value); });
    set(50);
    once(el, () => el.classList.add('in'), 0.5);
  }

  function gallery() {
    const root = $('[data-gal]');
    if (!root) return;
    const cases = $$('.cmp', root), thumbs = $$('.gal__thumb', root);
    thumbs.forEach((b) => b.addEventListener('click', () => {
      const n = +b.dataset.case - 1;
      cases.forEach((c, i) => { c.hidden = i !== n; });
      thumbs.forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    }));
  }

  /* ---------- smile arc: curve draws, 6 teeth grow into 12 ---------- */
  function arc() {
    const el = $('[data-arc]');
    if (!el) return;
    el.dataset.mode = '12';
    const btns = $$('[data-arc-mode]', el);
    btns.forEach((b) => b.addEventListener('click', () => {
      el.dataset.mode = b.dataset.arcMode;
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }));
    once(el, () => {
      el.classList.add('in');
      setTimeout(() => el.classList.add('settled'), 3600);
    }, 0.35);
  }

  /* ---------- kids: a tiny Chompers rolls along the age path ---------- */
  function timeline() {
    const tl = $('[data-tl]');
    if (!tl) return;
    const track = $('.tl__track', tl), chomp = $('.tl__chomp', tl), roll = $('.tl__roll', tl);
    const pins = $$('.tl__stop .tl__pin', tl), star = $('.is-star', tl);
    const starX = star ? +star.dataset.x : 0.5;
    let pts = [], a, b, burst = false, visible = false;

    function measure() {
      const tr = track.getBoundingClientRect();
      pts = pins.map((p) => { const r = p.getBoundingClientRect(); return { x: r.left + r.width / 2 - tr.left, y: r.top + r.height / 2 - tr.top }; });
      a = pts[0]; b = pts[pts.length - 1];
      update();
    }
    function place(t) {
      const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
      chomp.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      roll.style.transform = `rotate(${(Math.hypot(x - a.x, y - a.y) / 29 * 57.3).toFixed(1)}deg)`;
      if (t >= starX - 0.01 && !burst && star) { burst = true; star.classList.add('is-burst'); }
    }
    function update() {
      if (!a) return;
      if (reduce) { place(starX); return; }
      if (!visible) return;
      const r = track.getBoundingClientRect(), c = r.top + r.height / 2;
      place(clamp((innerHeight * 0.9 - c) / (innerHeight * 0.55), 0, 1));
    }
    if (hasIO) {
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) { if (a) update(); else measure(); } }, { rootMargin: '150px 0px' }).observe(track);
    } else visible = true;
    scrollFns.push(update);
    addEventListener('resize', debounce(() => { if (a) measure(); }, 150), { passive: true });
    if (reduce) afterLoad(measure);
  }

  /* ---------- kids: sign cards flip on tap ---------- */
  function flips() {
    $$('.flip').forEach((b) => b.addEventListener('click', () => {
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    }));
  }

  /* ---------- why koga: bento tiles assemble ---------- */
  function bento() {
    once($('[data-bento]'), (el) => el.classList.add('in'), 0.2);
  }

  /* ---------- testimonials: springy bubbles + auto-advancing snap carousel ---------- */
  function reviews() {
    const root = $('[data-rv]');
    if (!root) return;
    const track = $('.rv__track', root), cards = $$('.rv__card', track);
    cards.forEach((c) => once(c, () => c.classList.add('in'), 0.35));
    const prev = $('[data-rv-prev]'), next = $('[data-rv-next]'), tog = $('[data-rv-toggle]');
    const pos = (i) => cards[i].offsetLeft - cards[0].offsetLeft;
    const current = () => {
      let best = 0, d = Infinity;
      cards.forEach((_, i) => { const x = Math.abs(pos(i) - track.scrollLeft); if (x < d) { d = x; best = i; } });
      return best;
    };
    const go = (i) => track.scrollTo({ left: pos((i + cards.length) % cards.length), behavior: reduce ? 'auto' : 'smooth' });
    prev.addEventListener('click', () => go(current() - 1));
    next.addEventListener('click', () => go(current() + 1));

    let userPaused = reduce, hold = false, inView = false, holdTimer;
    const sync = () => {
      tog.setAttribute('aria-pressed', String(userPaused));
      tog.setAttribute('aria-label', userPaused ? tog.dataset.play : tog.dataset.pause);
      $('use', tog).setAttribute('href', userPaused ? '#i-play' : '#i-pause');
    };
    sync();
    tog.addEventListener('click', () => { userPaused = !userPaused; sync(); });
    // pause while the finger / pointer / focus is on the carousel
    const holdOn = () => { hold = true; clearTimeout(holdTimer); };
    const holdOff = (ms) => { clearTimeout(holdTimer); holdTimer = setTimeout(() => { hold = false; }, ms); };
    track.addEventListener('touchstart', holdOn, { passive: true });
    track.addEventListener('touchend', () => holdOff(7000), { passive: true });
    track.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') holdOn(); });
    track.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') holdOff(300); });
    root.addEventListener('focusin', holdOn);
    root.addEventListener('focusout', () => holdOff(1500));
    if (hasIO) new IntersectionObserver((es) => { inView = es[0].isIntersecting; }, { threshold: 0.3 }).observe(root);
    setInterval(() => {
      if (userPaused || hold || !inView || document.hidden) return;
      go(current() + 1);
    }, 4800);
  }

  /* ---------- faq accordion ---------- */
  function faq() {
    $$('.faq__q').forEach((q) => q.addEventListener('click', () => {
      const item = q.closest('.faq__item');
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      q.setAttribute('aria-expanded', String(open));
    }));
  }

  /* ---------- locations: tabs, pin drop, lazy map, native maps links ---------- */
  function locations() {
    const root = $('[data-loc]');
    if (!root) return;
    const cards = $$('.loc__card', root);
    const drop = (card) => {
      if (!card || reduce) return;
      card.classList.remove('drop');
      void card.offsetWidth;
      card.classList.add('drop');
    };
    const select = tabs($('.loc__list', root), (i) => drop(cards[i]));
    once(root, () => drop(cards[0]), 0.3);

    $$('[data-loc-go]').forEach((a) => a.addEventListener('click', () => {
      const i = cards.findIndex((c) => c.id === 'loc-' + a.dataset.locGo);
      if (i > -1) select(i);
    }));

    $$('[data-map-load]', root).forEach((btn) => btn.addEventListener('click', () => {
      const card = btn.closest('.loc__card'), box = btn.closest('[data-map-box]');
      const f = document.createElement('iframe');
      f.src = `https://maps.google.com/maps?q=${card.dataset.lat},${card.dataset.lng}&z=15&output=embed`;
      f.title = box.getAttribute('aria-label') || 'Map';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.appendChild(f);
      box.classList.add('is-live');
    }));

    // iPhone / iPad / Mac touch devices: open Apple Maps natively
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (ios) {
      $$('a[data-map]', root).forEach((a) => {
        const { lat, lng, label, map } = a.dataset, q = encodeURIComponent(label);
        a.href = map === 'dir' ? `https://maps.apple.com/?daddr=${lat},${lng}&q=${q}` : `https://maps.apple.com/?ll=${lat},${lng}&q=${q}`;
        a.removeAttribute('target');
      });
    }
  }

  /* ---------- final CTA: velocity-skewed marquee + magnetic button ---------- */
  function finale() {
    const mq = $('.cta__marquee');
    if (mq && !reduce && finePointer) {
      let sk = 0, tgt = 0, run = false, inView = false;
      const loop = () => {
        sk += (tgt - sk) * 0.18;
        tgt *= 0.86;
        if (Math.abs(sk) < 0.03 && Math.abs(tgt) < 0.03) { sk = 0; mq.style.setProperty('--skew', '0deg'); run = false; return; }
        mq.style.setProperty('--skew', sk.toFixed(2) + 'deg');
        raf(loop);
      };
      if (hasIO) new IntersectionObserver((es) => { inView = es[0].isIntersecting; }).observe(mq);
      scrollFns.push((_, dy) => {
        if (!inView) return;
        tgt = clamp(dy * -0.28, -9, 9);
        if (!run) { run = true; raf(loop); }
      });
    }
    if (finePointer && !reduce && innerWidth >= 900) {
      $$('[data-magnetic]').forEach((w) => {
        const b = $('.btn', w);
        w.addEventListener('pointermove', (e) => {
          const r = w.getBoundingClientRect();
          const x = (e.clientX - (r.left + r.width / 2)) * 0.28, y = (e.clientY - (r.top + r.height / 2)) * 0.4;
          b.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
        });
        w.addEventListener('pointerleave', () => { b.style.transform = ''; });
      });
    }
  }

  /* ---------- analytics slot: GA4 loads after first interaction or idle ---------- */
  function analytics() {
    const id = ($('meta[name="kf-analytics"]') || {}).content;
    if (!id) return; // set ANALYTICS_ID in build/data.mjs to enable
    let done = false;
    const evs = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    function load() {
      if (done) return;
      done = true;
      evs.forEach((e) => removeEventListener(e, load));
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', id);
    }
    evs.forEach((e) => addEventListener(e, load, { once: true, passive: true }));
    idle(load, 6000);
  }

  /* ---------- boot ---------- */
  // safety net: 'ready' (transitions on) is normally set when styles.css arrives, see <head>
  setTimeout(() => document.documentElement.classList.add('ready'), 3000);
  headerCompact();
  menu();
  chapters();
  // #top points at the fixed header, which never scrolls into view: scroll the page itself
  $$('a[href="#top"]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', location.pathname + location.search);
  }));
  language();
  trust();
  about();
  services();
  $$('[data-cmp]').forEach(compare);
  gallery();
  arc();
  timeline();
  flips();
  bento();
  reviews();
  faq();
  locations();
  finale();
  analytics();
})();
