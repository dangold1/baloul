import { asset, money } from "@/app/story";

// Every HUD renders its final state; the timeline animates from zero.
// Counters: data-count holds the end value, data-fmt the format.

function Count({ to, fmt = "money", className = "" }: { to: number; fmt?: "money" | "pct"; className?: string }) {
  const text = fmt === "pct" ? `+${to.toFixed(1)}%` : money(to);
  return (
    <span className={`num count ${className}`} data-count={to} data-fmt={fmt}>
      {text}
    </span>
  );
}

// Deterministic series so server and client render the same paths.
function series(n: number, from: number, to: number, wobble: number, seed: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return from + (to - from) * (t * t * 0.35 + t * 0.65) + (i && i < n - 1 ? rnd() * wobble : 0);
  });
}

function toPoints(values: number[], min: number, max: number, w = 320, h = 120) {
  return values.map((v, i) => [(i / (values.length - 1)) * w, h - ((v - min) / (max - min)) * h + 5] as const);
}
const toPath = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

const portfolio = toPoints(series(37, 482_300, 684_900, 26_000, 7), 440_000, 720_000);
const benchmark = toPoints(series(37, 482_300, 618_000, 30_000, 19), 440_000, 720_000);
const months = Array.from({ length: 16 }, (_, i) => 850 + 1500 * (i + 1) + 120 * i * (i + 1) * 0.08);

function Dawn() {
  return (
    <div className="hud hud-dawn">
      <div className="logo-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/brand/logo.jpg")} alt="BALOUL — בית פיננסי, ניהול הון וביטוח" />
        <span className="logo-sweep" aria-hidden />
      </div>
    </div>
  );
}

function Find() {
  const items = [
    { t: "06:12", label: "הפקדה במזומן", v: 120 },
    { t: "06:31", label: "העברה נכנסת", v: 340 },
    { t: "06:48", label: "הפקדה במזומן", v: 390 },
  ];
  return (
    <div className="hud hud-find">
      {items.map((it) => (
        <div className="panel toast" key={it.t}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brand/mark.jpg")} alt="" className="toast-icon" />
          <div className="toast-text">
            <strong>{it.label}</strong>
            <span>חשבון עו״ש · {it.t}</span>
          </div>
          <span className="num toast-amt">+{money(it.v)}</span>
        </div>
      ))}
    </div>
  );
}

function Kupa() {
  const max = months[months.length - 1];
  return (
    <div className="panel hud hud-kupa">
      <div className="kupa-head">
        <svg viewBox="0 0 120 120" className="goal-ring" aria-hidden>
          <circle cx="60" cy="60" r="50" className="ring-bg" pathLength={100} />
          <circle cx="60" cy="60" r="50" className="ring-fg" pathLength={100} />
        </svg>
        <div>
          <span className="label">יעד חיסכון ראשון</span>
          <Count to={25_120} className="big" />
          <span className="muted">מתוך יעד של {money(25_000)} · 16 חודשים</span>
        </div>
      </div>
      <div className="bars" aria-hidden>
        {months.map((m, i) => (
          <span key={i} className="bar" style={{ height: `${(m / max) * 100}%` }} />
        ))}
      </div>
      <span className="muted small">הוראת קבע {money(1_500)} בחודש לקרן כספית</span>
    </div>
  );
}

function Wealth() {
  const rows = [
    { k: "חיסכון נזיל", v: 120_000 },
    { k: "פיקדונות וקרנות כספיות", v: 212_300 },
    { k: "קרן השתלמות", v: 150_000 },
  ];
  return (
    <div className="panel hud hud-wealth">
      <span className="label">
        שווי נקי · <span className="num">2033</span>
      </span>
      <Count to={482_300} className="huge" />
      <svg viewBox="0 0 320 70" className="spark" aria-hidden preserveAspectRatio="none">
        <path d={toPath(toPoints(series(24, 25_120, 482_300, 18_000, 3), 0, 500_000, 320, 60))} className="spark-line" pathLength={1} />
      </svg>
      <ul className="rows">
        {rows.map((r) => (
          <li className="row" key={r.k}>
            <span>{r.k}</span>
            <span className="num">{money(r.v)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Market() {
  const alloc = [
    { k: "מניות", v: 60, c: "var(--gold)" },
    { k: "אג״ח", v: 30, c: "var(--royal-2)" },
    { k: "נזילות", v: 10, c: "var(--muted)" },
  ];
  const tape = ["מניות ישראל", "מניות חו״ל", "אג״ח ממשלתי", "אג״ח קונצרני", "קרנות סל", "קרן כספית"];
  const [tx, ty] = portfolio[portfolio.length - 1];
  let offset = 0;
  return (
    <div className="panel hud hud-market">
      <div className="market-top">
        <div>
          <span className="label">
            תיק השקעות · <span className="num">2033–2036</span>
          </span>
          <Count to={684_900} className="big" />
        </div>
        <span className="pill up">
          <Count to={42.0} fmt="pct" />
        </span>
      </div>
      <svg
        viewBox="0 0 320 130"
        className="chart"
        aria-hidden
        data-pts={portfolio.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
      >
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#d4af5a" stopOpacity="0.28" />
            <stop offset="1" stopColor="#d4af5a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((g) => (
          <line key={g} x1="0" x2="320" y1={5 + g * 40} y2={5 + g * 40} className="gridline" />
        ))}
        <path d={`${toPath(portfolio)} L320 130 L0 130 Z`} className="area" fill="url(#area)" />
        <path d={toPath(benchmark)} className="line-bench" pathLength={1} />
        <path d={toPath(portfolio)} className="line-main" pathLength={1} />
        <g className="tip" transform={`translate(${tx} ${ty})`}>
          <circle r="9" className="tip-halo" />
          <circle r="3.5" className="tip-dot" />
        </g>
      </svg>
      <div className="legend">
        <span><i className="dot gold" />התיק</span>
        <span><i className="dot dash" />מדד ייחוס</span>
      </div>
      <div className="alloc">
        <svg viewBox="0 0 42 42" className="donut" aria-hidden>
          {alloc.map((a) => {
            const el = (
              <circle
                key={a.k}
                cx="21"
                cy="21"
                r="15.915"
                pathLength={100}
                className="seg"
                stroke={a.c}
                strokeDasharray={`${a.v} ${100 - a.v}`}
                strokeDashoffset={-offset}
                data-v={a.v}
              />
            );
            offset += a.v;
            return el;
          })}
        </svg>
        <ul>
          {alloc.map((a) => (
            <li key={a.k}>
              <i className="dot" style={{ background: a.c }} />
              {a.k} <span className="num">{a.v}%</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="tape" aria-hidden>
        <div className="tape-track">
          {[...tape, ...tape].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Family() {
  const items = [
    { k: "ביטוח חיים", v: `כיסוי ${money(2_000_000)}` },
    { k: "ביטוח בריאות משלים", v: "לכל בני המשפחה" },
    { k: "חיסכון לכל ילד", v: "5 גוזלים · הפקדה חודשית לכל אחד" },
    { k: "קרן חירום", v: "6 חודשי הוצאות בצד" },
  ];
  return (
    <div className="panel hud hud-family">
      <div className="fam-head">
        <span className="label">תיק משפחתי · מוגן</span>
        <span className="fam" aria-label="תרנגול, תרנגולת וחמישה גוזלים">
          <i className="m big-m" />
          <i className="m big-m" />
          {[0, 1, 2, 3, 4].map((k) => (
            <i className="m" key={k} />
          ))}
        </span>
      </div>
      <ul className="prots">
        {items.map((it) => (
          <li className="prot" key={it.k}>
            <svg viewBox="0 0 24 24" className="check" aria-hidden>
              <circle cx="12" cy="12" r="11" pathLength={1} />
              <path d="M7 12.5l3.2 3.2L17 9" pathLength={1} />
            </svg>
            <div>
              <strong>{it.k}</strong>
              <span>{it.v}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Coop() {
  const rows = [
    { k: "מחיר הלול", v: money(2_400_000) },
    { k: "הון עצמי (25%)", v: money(600_000) },
    { k: "משכנתא · 25 שנה · 4.9%", v: money(1_800_000) },
  ];
  return (
    <div className="hud hud-coop">
      <div className="panel">
        <svg viewBox="0 0 220 110" className="coop" aria-hidden>
          <path className="draw" pathLength={1} d="M10 104 H210" />
          <path className="draw" pathLength={1} d="M40 104 V52 L110 14 L180 52 V104" />
          <path className="draw" pathLength={1} d="M30 58 L110 8 L190 58" />
          <path className="door" pathLength={1} d="M96 104 V72 a14 14 0 0 1 28 0 V104 Z" />
          <rect className="win" x="140" y="62" width="22" height="18" rx="2" pathLength={1} />
          <path className="draw" pathLength={1} d="M124 104 L150 92 H170" />
        </svg>
        <span className="label">
          עסקת רכישה · <span className="num">2038</span>
        </span>
        <ul className="rows">
          {rows.map((r) => (
            <li className="row mrow" key={r.k}>
              <span>{r.k}</span>
              <span className="num">{r.v}</span>
            </li>
          ))}
        </ul>
        <div className="pay">
          <span>החזר חודשי משוער</span>
          <Count to={10_418} className="big" />
        </div>
        <p className="brk">
          שווי נקי {money(684_900)}: הלול {money(2_400_000)}, פחות משכנתא {money(1_800_000)}, ועוד תיק השקעות של{" "}
          {money(84_900)}.
        </p>
      </div>
      <div className="cta-wrap">
        <a className="cta" href="#contact">
          בואו נבנה את הלול שלכם
        </a>
      </div>
    </div>
  );
}

export const huds = [Dawn, Find, Kupa, Wealth, Market, Family, Coop];
