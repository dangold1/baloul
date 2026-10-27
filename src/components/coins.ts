// Gold coins drawn on one canvas as a pure function of timeline time T
// (10 units per shot), so scrubbing backwards replays exactly.

const N = 72;
const hash = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const coins = Array.from({ length: N }, (_, i) => ({
  a: hash(i, 1),
  b: hash(i, 2),
  c: hash(i, 3),
  d: hash(i, 4),
}));

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const inCubic = (t: number) => t * t * t;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function coin(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, spin: number, alpha: number) {
  if (alpha <= 0.01 || r < 1) return;
  const sx = Math.abs(Math.cos(spin)) * 0.86 + 0.14;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(Math.sin(spin * 0.5) * 0.4);
  ctx.scale(sx, 1);
  // Edge thickness, darker, offset away from the key light (camera-left).
  ctx.beginPath();
  ctx.arc(r * 0.09, r * 0.06, r, 0, Math.PI * 2);
  ctx.fillStyle = "#6e521b";
  ctx.fill();
  const g = ctx.createRadialGradient(-r * 0.45, -r * 0.45, r * 0.05, 0, 0, r);
  g.addColorStop(0, "#fff1c4");
  g.addColorStop(0.35, "#e9c46e");
  g.addColorStop(0.8, "#b88c34");
  g.addColorStop(1, "#8a6524");
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.strokeStyle = "rgba(255,236,186,0.45)";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export type CoinStage = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  target: [number, number];
};

export function drawCoins(s: CoinStage, T: number) {
  const { ctx, w, h } = s;
  ctx.clearRect(0, 0, w, h);
  if (T < 11.5 || T > 41) return;
  const unit = Math.min(w, h) / 900;
  const mobile = w < 900;
  // Keep coins in the open area: centre on desktop (HUD left, copy right), middle row on phones.
  const [x0, x1, y0, y1] = mobile ? [0.1, 0.9, 0.27, 0.5] : [0.36, 0.72, 0.16, 0.56];
  const heap = (x: number) => 70 * unit * Math.exp(-Math.pow((x - w * 0.46) / (w * 0.22), 2));

  coins.forEach(({ a, b, c, d }, i) => {
    const r = (12 + 10 * b) * Math.max(unit, 0.55);
    const spin = T * (1.6 + 2.4 * d) + a * 6;

    // 02 burst out of the straw → 03 stream into the savings ring.
    if (T < 27) {
      const apex: [number, number] = [w * (x0 + (x1 - x0) * a), h * (y0 + (y1 - y0) * b)];
      const start: [number, number] = [w * (0.5 + (a - 0.5) * 0.25), h + 40];
      const e = outCubic(clamp((T - 12 - c * 1.8) / 2.6));
      const g = inCubic(clamp((T - 19.5 - c * 3.2) / 2.2));
      const float = Math.sin(T * 1.4 + d * 6) * 8 * unit * (1 - g);
      const x = lerp(lerp(start[0], apex[0], e), s.target[0], g);
      const y = lerp(lerp(start[1], apex[1], e), s.target[1], g) + float;
      coin(ctx, x, y, r * (1 - g * 0.7), spin, e * (1 - clamp((g - 0.85) / 0.15)));
      return;
    }

    // 04 rain onto a pile.
    if (i > 52 || T < 31) return;
    const x = w * (mobile ? 0.08 + 0.84 * a : 0.24 + 0.44 * a);
    // Phones: the bottom is the HUD sheet, so coins fall through the middle and dissolve.
    const land = mobile ? h * (0.4 + 0.08 * b) : h - heap(x) - r * 0.6 - b * 26 * unit;
    const f = clamp((T - 31.5 - c * 4.2) / 1.5);
    const y = lerp(-60, land, f * f);
    const settled = f >= 1;
    const fade = (1 - clamp((T - 39.2) / 1.6)) * (mobile ? 1 - clamp((f - 0.8) / 0.2) : 1);
    coin(ctx, x, y, r, settled ? a * 6 + 1.2 : spin * 1.4, clamp(f * 4) * fade);
  });
}
