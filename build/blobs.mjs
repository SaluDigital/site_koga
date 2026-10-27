// Organic blob shapes as clip-path polygons.
// Every polygon has the same vertex count, so CSS can morph between them
// (used by the About portrait reveal and the Services blob).

const N = 64;

// tiny deterministic PRNG so the shapes are stable between builds
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function blob(seed, wobble = 0.16) {
  const rand = rng(seed);
  const harmonics = [2, 3, 4].map((k) => ({
    k,
    a: (rand() * 0.5 + 0.5) * wobble / (k - 0.6),
    p: rand() * Math.PI * 2,
  }));
  const pts = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    let r = 1;
    for (const h of harmonics) r += h.a * Math.cos(h.k * t + h.p);
    pts.push([r * Math.cos(t), r * Math.sin(t)]);
  }
  // fit into 3%..97% of the box
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return pts.map(([x, y]) => [3 + ((x - x0) / (x1 - x0)) * 94, 3 + ((y - y0) / (y1 - y0)) * 94]);
}

const fmt = (pts) =>
  'polygon(' + pts.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(',') + ')';

export function blobCss() {
  const shapes = [blob(7), blob(23), blob(41), blob(59), blob(77)];
  const tiny = shapes[0].map(([x, y]) => [50 + (x - 50) * 0.1, 50 + (y - 50) * 0.1]);
  const vars = shapes.map((s, i) => `--blob-${i + 1}:${fmt(s)}`);
  vars.push(`--blob-tiny:${fmt(tiny)}`);
  return `:root{${vars.join(';')}}`;
}
