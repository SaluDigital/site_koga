// Small building blocks shared by every section: escaping, image slots,
// inline SVG sprite, hand-drawn illustrations. No dependencies.

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const r1 = (n) => Math.round(n * 10) / 10;

/** Image slot. If the file is missing, kfMissing() turns it into a branded placeholder. */
export function img(ctx, { file, w, h, alt, cls = '', eager = false, sizes = '', art = '' }) {
  const src = `${ctx.P}assets/img/${file}`;
  const srcset = sizes ? ` srcset="${src} ${w}w" sizes="${sizes}"` : '';
  const load = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  return `<span class="ph ${cls}" data-ph="${esc(file)} · ${w}×${h}" style="--ar:${w}/${h}">${art}<img src="${src}"${srcset} width="${w}" height="${h}" alt="${esc(alt)}" ${load} onerror="kfMissing(this)"></span>`;
}

/** The brand motif: four brackets on a wire. Pure CSS (see .wire). */
export const wire = (cls = '') => `<span class="wire ${cls}" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;

export const icon = (id, cls = '') => `<svg class="ic ${cls}" aria-hidden="true" focusable="false"><use href="#i-${id}"/></svg>`;

export const chompers = (cls = '') =>
  `<span class="chomp ${cls}" aria-hidden="true"><svg viewBox="0 0 120 140" focusable="false"><use href="#chompers"/></svg></span>`;

export function sectionHead(c, { id, eyebrow, title, intro = '', cls = '' }) {
  return `<header class="sec-head ${cls}">
  <p class="eyebrow"><i class="eyebrow__sq" aria-hidden="true"></i>${esc(eyebrow)}</p>
  <h2 id="${id}-title" class="h2">${esc(title)}</h2>
  ${intro ? `<p class="lead">${esc(intro)}</p>` : ''}
</header>`;
}

/** Wavy divider (one style, used everywhere). Colour comes from the section background. */
export const wave = () => '<div class="wave" aria-hidden="true"><i></i></div>';

/* ------------------------------------------------------------------ */
/* Inline SVG sprite                                                   */
/* ------------------------------------------------------------------ */
export function sprite() {
  const s = (id, body, vb = '0 0 24 24') => `<symbol id="${id}" viewBox="${vb}">${body}</symbol>`;
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
${s('i-phone', '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>')}
${s('i-sms', '<path d="M4 4h16v12H8l-4 4z"/><path d="M8 9h8M8 12h5"/>')}
${s('i-pin', '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>')}
${s('i-arrow', '<path d="M5 12h14M13 6l6 6-6 6"/>')}
${s('i-cal', '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>')}
${s('i-dl', '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>')}
${s('i-nav', '<path d="M3 11l18-8-8 18-2-8z"/>')}
${s('i-chev', '<path d="M8 5l8 7-8 7"/>')}
${s('i-play', '<path d="M7 4l13 8-13 8z"/>')}
${s('i-pause', '<path d="M8 4v16M16 4v16"/>')}
${s('i-drag', '<path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/>')}
${s('i-fb', '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>')}
${s('i-ig', '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>')}
${s('i-doc', '<path d="M7 3h8l4 4v14H7zM15 3v4h4M10 14l2 2 4-4"/>')}
${s('i-swap', '<path d="M4 8h15l-3-3M20 16H5l3 3"/>')}
${s('i-chat', '<path d="M3 4h12v8H8l-3 3v-3H3zM17 8h4v9h-2v3l-3-3h-6"/>')}
${s('i-lab', '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8"/>')}
${s('i-home', '<path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/>')}
${s('i-badge', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4"/>')}
${s('i-star', '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z"/>')}
${s('i-spark', '<path d="M12 1c.8 6 3.6 9.2 10 10-6.4.8-9.2 4-10 10-.8-6-3.6-9.2-10-10 6.4-.8 9.2-4 10-10z"/>')}
${s('i-tooth', '<path d="M12 3c-2-1.2-5.5-.8-6 2.5-.4 2.8 1.2 4.4 1.4 7.2.2 3 .6 6.3 2.1 6.3 1.2 0 1.1-3.2 2.5-3.2s1.3 3.2 2.5 3.2c1.5 0 1.9-3.3 2.1-6.3.2-2.8 1.800-4.400 1.400-7.200C17.500 2.200 14 1.800 12 3z"/>')}
${s('i-smile', '<path d="M4 10c1.500 7 14.500 7 16 0"/>')}
${s('chompers', chompersArt(), '0 0 120 140')}
${s('map-art', mapArt(), '0 0 400 260')}
</defs></svg>`;
}

function chompersArt() {
  // Friendly tooth with braces: four colored brackets on a wire (the brand motif).
  return `<path d="M60 14C44 4 18 8 14 36c-3 20 8 34 12 56 3 20 6 40 18 40 10 0 10-26 16-26s6 26 16 26c12 0 15-20 18-40 4-22 15-36 12-56C102 8 76 4 60 14z" fill="#fff" stroke="#0B3340" stroke-width="5" stroke-linejoin="round"/>
<path d="M30 28c4-8 12-10 18-6" fill="none" stroke="#DDF3F7" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="42" cy="58" rx="5.500" ry="7" fill="#0B3340"/><ellipse cx="78" cy="58" rx="5.500" ry="7" fill="#0B3340"/>
<circle cx="44" cy="55" r="2" fill="#fff"/><circle cx="80" cy="55" r="2" fill="#fff"/>
<ellipse cx="29" cy="74" rx="7" ry="5" fill="#F5A3B3" opacity=".8"/><ellipse cx="91" cy="74" rx="7" ry="5" fill="#F5A3B3" opacity=".8"/>
<path d="M46 76c4 8 24 8 28 0" fill="none" stroke="#0B3340" stroke-width="4.500" stroke-linecap="round"/>
<path d="M27 96q33 12 66 0" fill="none" stroke="#8aa3ab" stroke-width="3" stroke-linecap="round"/>
<rect x="28" y="89" width="11" height="11" rx="2.500" fill="#0096AC" stroke="#0B3340" stroke-width="2.500"/>
<rect x="46" y="94" width="11" height="11" rx="2.500" fill="#FBE21B" stroke="#0B3340" stroke-width="2.500"/>
<rect x="63" y="94" width="11" height="11" rx="2.500" fill="#E5832A" stroke="#0B3340" stroke-width="2.500"/>
<rect x="81" y="89" width="11" height="11" rx="2.500" fill="#C8203F" stroke="#0B3340" stroke-width="2.500"/>`;
}

function mapArt() {
  return `<rect width="400" height="260" fill="#EAF6F2"/>
<path d="M-10 190C60 170 110 215 190 195s150-40 230-10v90H-10z" fill="#CFEBF5"/>
<path d="M300 -10c-20 40 10 70-10 110s30 60 20 90" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/>
<g fill="#D6EBC8"><ellipse cx="90" cy="70" rx="48" ry="30"/><ellipse cx="330" cy="200" rx="40" ry="26"/></g>
<g fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"><path d="M-10 120H410"/><path d="M130 -10V270"/><path d="M-10 40l420 110"/><path d="M230 270l60-290"/></g>
<g fill="none" stroke="#F6E7B8" stroke-width="5" stroke-linecap="round"><path d="M-10 120H410"/><path d="M130 -10V270"/></g>
<g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"><path d="M-10 75H410"/><path d="M60 -10V270"/><path d="M330 -10V270"/><path d="M-10 220H410"/></g>`;
}

/* ------------------------------------------------------------------ */
/* Hand-drawn illustrations                                            */
/* ------------------------------------------------------------------ */

/** Old braces vs Pitts21 sliding door (fallback art for the compare slider). */
export function bracketArt(kind) {
  const wireLine = `<path d="M0 200H400" stroke="#8aa3ab" stroke-width="14" stroke-linecap="round"/><path d="M0 195H400" stroke="#fff" stroke-width="3" opacity=".7"/>`;
  if (kind === 'old') {
    return `<svg class="ph__art" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
${wireLine}
<rect x="130" y="130" width="140" height="140" rx="26" fill="#E9EEF0" stroke="#0B3340" stroke-width="7"/>
<rect x="130" y="188" width="140" height="24" fill="#6f8790"/>
<rect x="158" y="106" width="84" height="188" rx="40" fill="none" stroke="#E5832A" stroke-width="18"/>
<path d="M70 168l12-14 12 14 12-14M306 168l12-14 12 14 12-14" fill="none" stroke="#C8203F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }
  return `<svg class="ph__art" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
${wireLine}
<rect x="130" y="130" width="140" height="140" rx="26" fill="#BFEAF2" stroke="#0B3340" stroke-width="7"/>
<rect x="130" y="188" width="140" height="24" fill="#007A91"/>
<g class="door"><rect x="140" y="148" width="120" height="64" rx="12" fill="#fff" stroke="#0B3340" stroke-width="7"/><path d="M160 168h80M160 190h80" stroke="#0096AC" stroke-width="6" stroke-linecap="round"/></g>
</svg>`;
}

/** Row of teeth: crooked ("before") or aligned ("after"), fallback art for the gallery. */
export function toothRowArt(kind, seed = 1) {
  const n = 8;
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = 40 + i * 40;
    const jitter = ((i * 37 + seed * 17) % 11) - 5;
    const rot = kind === 'before' ? jitter * 2.2 : 0;
    const dy = kind === 'before' ? ((i * 53 + seed * 7) % 9) - 4 : Math.abs(i - 3.5) * 3;
    const w = kind === 'before' ? 28 + ((i * 13 + seed) % 10) : 34;
    out += `<rect x="${r1(x - w / 2)}" y="${r1(70 + dy)}" width="${w}" height="60" rx="13" transform="rotate(${r1(rot)} ${x} ${r1(100 + dy)})" fill="#fff" stroke="#0B3340" stroke-width="4"/>`;
  }
  return `<svg class="ph__art" viewBox="0 0 360 200" aria-hidden="true" focusable="false"><path d="M10 60Q180 40 350 60V160Q180 190 10 160z" fill="${kind === 'before' ? '#7a2a3d' : '#C8203F'}"/>${out}</svg>`;
}

/** Six mini mouth diagrams for the "signs" flip cards. */
export function signArt(id) {
  const row = ({ n, x0, y, w, h, gap, rot = 0, fill = '#fff' }) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (w + gap);
      const a = rot ? (i % 2 ? rot : -rot) : 0;
      s += `<rect x="${r1(x)}" y="${y}" width="${w}" height="${h}" rx="6" transform="rotate(${a} ${r1(x + w / 2)} ${y + h / 2})" fill="${fill}" stroke="#0B3340" stroke-width="2.600"/>`;
    }
    return s;
  };
  const mouth = '<rect x="4" y="6" width="112" height="68" rx="24" fill="#C8203F"/>';
  const diagrams = {
    spacing: row({ n: 4, x0: 14, y: 14, w: 14, h: 26, gap: 12 }) + row({ n: 4, x0: 14, y: 42, w: 14, h: 24, gap: 12 }),
    crowding: row({ n: 4, x0: 24, y: 14, w: 24, h: 26, gap: -6, rot: 9 }) + row({ n: 4, x0: 24, y: 42, w: 24, h: 24, gap: -6, rot: 9 }),
    crossbite: row({ n: 4, x0: 38, y: 14, w: 11, h: 28, gap: 3 }) + row({ n: 4, x0: 16, y: 42, w: 20, h: 24, gap: 3 }),
    overbite: row({ n: 4, x0: 16, y: 40, w: 20, h: 22, gap: 3 }) + row({ n: 4, x0: 16, y: 10, w: 20, h: 40, gap: 3 }),
    underbite: row({ n: 4, x0: 16, y: 12, w: 20, h: 24, gap: 3 }) + row({ n: 4, x0: 16, y: 28, w: 20, h: 34, gap: 3 }),
    open: row({ n: 4, x0: 16, y: 8, w: 20, h: 22, gap: 3 }) + row({ n: 4, x0: 16, y: 50, w: 20, h: 20, gap: 3 }),
  };
  return `<svg viewBox="0 0 120 80" aria-hidden="true" focusable="false">${mouth}${diagrams[id]}</svg>`;
}

/** The Smile Arc stage: a smile curve with 12 teeth, 6 of them "traditional". */
export function smileArcSvg(label) {
  const P0 = [60, 70], P1 = [300, 340], P2 = [540, 70];
  const at = (t) => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
  ];
  const tan = (t) => {
    const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
    const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };
  const N = 12;
  const teeth = [];
  for (let i = 0; i < N; i++) {
    const t = 0.1 + (i / (N - 1)) * 0.8;
    const [x, y] = at(t);
    const edge = Math.abs(t - 0.5) * 2; // 0 centre → 1 edge
    const w = 46 - edge * 12;
    const h = 80 - edge * 50;
    const central = i >= 3 && i <= 8;
    teeth.push({ x, y, a: tan(t), w, h, central, order: Math.abs(i - 5.5) });
  }
  // outer teeth first, so the centre ones sit on top
  const body = [...teeth]
    .sort((a, b) => b.order - a.order)
    .map((o, k) => {
      const delay = o.central ? 0 : r1(0.12 * (Math.abs(o.order) - 2.5) + 0.05);
      return `<g transform="translate(${r1(o.x)} ${r1(o.y)}) rotate(${r1(o.a)})"><rect class="tooth ${o.central ? 'tooth--core' : 'tooth--extra'}" style="--d:${delay}s" x="${r1(-o.w / 2)}" y="${r1(-o.h)}" width="${r1(o.w)}" height="${r1(o.h)}" rx="${r1(o.w * 0.34)}"/></g>`;
    })
    .join('');
  return `<svg class="arc__svg" viewBox="0 20 600 230" role="img" aria-label="${esc(label)}" focusable="false">
<path class="arc__cavity" d="M60 70Q300 112 540 70Q300 340 60 70Z"/>
<g class="arc__teeth">${body}</g>
<path class="arc__upper" d="M60 70Q300 112 540 70" pathLength="1"/>
<path class="arc__curve" d="M60 70Q300 340 540 70" pathLength="1"/>
</svg>`;
}
