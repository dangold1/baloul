"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { shots, money, asset } from "@/app/story";
import { ShotMedia } from "./ShotMedia";
import { huds } from "./Huds";
import { drawCoins, type CoinStage } from "./coins";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const U = 10; // timeline units per shot
const SCROLL_PER_SHOT = 1.5; // viewport heights
const COLS = 7; // odometer digits

const fmt = (el: HTMLElement, v: number) =>
  (el.textContent = el.dataset.fmt === "pct" ? `+${v.toFixed(1)}%` : money(v));

// Rolling-digit net worth. Strips move by CSS transition; nothing else animates them.
function setOdometer(root: HTMLElement, value: number) {
  const v = Math.round(value);
  root.querySelectorAll<HTMLElement>(".odo-col").forEach((col) => {
    const k = Number(col.dataset.k);
    const on = k === 0 || v >= 10 ** k;
    col.style.width = on ? "1ch" : "0";
    (col.firstElementChild as HTMLElement).style.transform = `translateY(${-(Math.floor(v / 10 ** k) % 10) * 10}%)`;
  });
  root.querySelectorAll<HTMLElement>(".odo-sep").forEach((sep) => {
    sep.style.width = v >= 10 ** Number(sep.dataset.k) ? "0.32em" : "0";
  });
  root.setAttribute("aria-label", money(v));
}

function Odometer() {
  const cells = [];
  for (let k = COLS - 1; k >= 0; k--) {
    cells.push(
      <span className="odo-col" data-k={k} key={`c${k}`} style={{ width: k === 0 ? "1ch" : 0 }}>
        <span className="odo-strip">
          {Array.from({ length: 10 }, (_, d) => (
            <span key={d}>{d}</span>
          ))}
        </span>
      </span>,
    );
    if (k === 6 || k === 3)
      cells.push(
        <span className="odo-sep" data-k={k} key={`s${k}`} style={{ width: 0 }}>
          ,
        </span>,
      );
  }
  return (
    <span className="odo nw-val" dir="ltr" role="status" aria-label={money(0)}>
      <span className="odo-cur">₪</span>
      {cells}
    </span>
  );
}

export function Story() {
  const root = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const odo = q(".odo")[0] as HTMLElement;
      const chapter = q(".chapter-name")[0] as HTMLElement;
      const n = shots.length;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setOdometer(odo, shots[n - 1].netWorth);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.config({ ignoreMobileResize: true });
        const layers = q(".shot") as HTMLElement[];
        const titles = layers.map((l) => SplitText.create(l.querySelector(".title"), { type: "words", mask: "words" }));

        // Coin canvas, redrawn only when the timeline moves.
        const canvas = q(".coins")[0] as HTMLCanvasElement;
        const stage: CoinStage = { ctx: canvas.getContext("2d")!, w: 0, h: 0, target: [0, 0] };
        const size = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          stage.w = window.innerWidth;
          stage.h = window.innerHeight;
          canvas.width = stage.w * dpr;
          canvas.height = stage.h * dpr;
          stage.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          // Measure the ring where it will sit once its panel has entered.
          const ringEl = q(".goal-ring")[0];
          const ring = ringEl?.getBoundingClientRect();
          const lift = Number(gsap.getProperty(q(".shot-03 .hud")[0], "y")) || 0;
          if (ring) stage.target = [ring.left + ring.width / 2, ring.top + ring.height / 2 - lift];
        };

        let current = -1;
        const nw = { v: 0 };
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: q(".stage")[0],
            start: "top top",
            end: () => `+=${window.innerHeight * SCROLL_PER_SHOT * n}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefresh: size,
            onUpdate: (st) => {
              const i = Math.min(n - 1, Math.floor(st.progress * n + 0.08));
              if (i !== current) {
                current = i;
                chapter.textContent = `${shots[i].id} · ${shots[i].name}`;
              }
            },
          },
          onUpdate: () => {
            drawCoins(stage, tl.time());
            setOdometer(odo, nw.v);
          },
        });
        size();

        const count = (el: HTMLElement, at: number, duration = 2.2) => {
          const o = { v: 0 };
          tl.fromTo(o, { v: 0 }, { v: Number(el.dataset.count), duration, ease: "power2.out", onUpdate: () => fmt(el, o.v) }, at);
        };

        tl.fromTo(".rail-fill", { scaleX: 0 }, { scaleX: 1, duration: n * U, ease: "none" }, 0);
        tl.to(".scroll-cue", { autoAlpha: 0, duration: 1 }, 0.4);

        layers.forEach((layer, i) => {
          const t0 = i * U;
          const s = shots[i];
          const $ = gsap.utils.selector(layer);
          const at = `${s.iris[0]}% ${s.iris[1]}%`;

          if (i > 0) {
            // Iris from the motivated focal point; the outgoing shot recedes.
            tl.fromTo(layer, { clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})`, duration: 2, ease: "power3.inOut" }, t0 - 0.8);
            tl.to(layers[i - 1], { scale: 0.92, filter: "brightness(0.5)", duration: 2, ease: "power3.inOut" }, t0 - 0.8);
            tl.fromTo($(".year"), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 1 }, t0 + 1);
            tl.from(titles[i].words, { yPercent: 115, rotate: -4, duration: 1.3, stagger: 0.12 }, t0 + 1.1);
            tl.fromTo($(".sub"), { autoAlpha: 0, y: 18, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2 }, t0 + 1.9);
            tl.fromTo(
              $(".hud"),
              { autoAlpha: 0, rotateX: -28, y: 60, filter: "blur(14px)", clipPath: "inset(0% 0% 100% 0%)" },
              { autoAlpha: 1, rotateX: 0, y: 0, filter: "blur(0px)", clipPath: "inset(-30% -30% -30% -30%)", duration: 1.6 },
              t0 + 1.6,
            );
            tl.to(nw, { v: s.netWorth, duration: 2.6, ease: "power2.inOut" }, t0 + 2.6);
          }

          tl.fromTo($(".media"), { scale: 1 }, { scale: 1.08, duration: U, ease: "none" }, t0);
          const clip = { p: 0 };
          tl.fromTo(
            clip,
            { p: 0 },
            {
              p: 1,
              duration: U,
              ease: "none",
              onUpdate: () => {
                const v = videos.current[i];
                if (v && v.duration) v.currentTime = clip.p * (v.duration - 0.05);
              },
            },
            t0,
          );

          // One authored moment per shot.
          switch (i) {
            case 0:
              tl.fromTo($(".logo-sweep"), { xPercent: -140 }, { xPercent: 140, duration: 3, ease: "power2.inOut" }, 1);
              tl.to($(".logo-frame"), { rotateY: 18, scale: 0.94, duration: 4, ease: "power1.inOut" }, 3);
              break;
            case 1:
              $(".toast").forEach((el, k) => {
                const at2 = t0 + 2.4 + k * 1.2;
                tl.fromTo(el, { autoAlpha: 0, y: -50, rotateX: 70, scale: 0.9 }, { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 1, ease: "back.out(1.6)" }, at2);
                tl.fromTo(el, { boxShadow: "0 0 0 0 rgba(212,175,90,0.7)" }, { boxShadow: "0 0 0 14px rgba(212,175,90,0)", duration: 1.2, ease: "power2.out" }, at2 + 0.5);
              });
              break;
            case 2:
              tl.fromTo($(".ring-fg"), { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 4.5, ease: "power1.inOut" }, t0 + 2.4);
              tl.fromTo($(".bar"), { scaleY: 0 }, { scaleY: 1, duration: 0.8, stagger: 0.25, ease: "back.out(2)" }, t0 + 2.4);
              tl.fromTo($(".goal-ring"), { scale: 1 }, { scale: 1.12, duration: 0.5, yoyo: true, repeat: 1, ease: "power2.out" }, t0 + 6.9);
              $(".count").forEach((el) => count(el, t0 + 2.4, 4.5));
              break;
            case 3:
              $(".count").forEach((el) => count(el, t0 + 2.2, 3.4));
              tl.fromTo($(".huge"), { letterSpacing: "0.12em", filter: "blur(8px)" }, { letterSpacing: "0em", filter: "blur(0px)", duration: 2.4 }, t0 + 2.2);
              tl.fromTo($(".spark-line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 3.4, ease: "power1.inOut" }, t0 + 2.2);
              tl.fromTo($(".row"), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.5 }, t0 + 4);
              break;
            case 4: {
              const pts = ($(".chart")[0] as unknown as SVGElement).dataset.pts!.split(" ").map((p) => p.split(",").map(Number));
              const tip = $(".tip")[0];
              const draw = { p: 0 };
              tl.fromTo($(".line-bench"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 3.6, ease: "power1.inOut" }, t0 + 2.2);
              tl.fromTo($(".line-main"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 3.6, ease: "power1.inOut" }, t0 + 2.4);
              tl.fromTo(
                draw,
                { p: 0 },
                {
                  p: 1,
                  duration: 3.6,
                  ease: "power1.inOut",
                  onUpdate: () => {
                    const f = draw.p * (pts.length - 1);
                    const a = pts[Math.floor(f)];
                    const b = pts[Math.min(pts.length - 1, Math.floor(f) + 1)];
                    const t = f - Math.floor(f);
                    tip.setAttribute("transform", `translate(${a[0] + (b[0] - a[0]) * t} ${a[1] + (b[1] - a[1]) * t})`);
                  },
                },
                t0 + 2.4,
              );
              tl.fromTo($(".area"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4 }, t0 + 5.4);
              $(".count").forEach((el) => count(el, t0 + 2.4, 3.6));
              $(".seg").forEach((el, k) => {
                const v = Number((el as HTMLElement).dataset.v);
                tl.fromTo(el, { strokeDasharray: "0 100" }, { strokeDasharray: `${v} ${100 - v}`, duration: 1.4 }, t0 + 4.6 + k * 0.4);
              });
              tl.fromTo($(".tape-track"), { xPercent: 0 }, { xPercent: 50, duration: U, ease: "none" }, t0);
              break;
            }
            case 5:
              tl.fromTo($(".m"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, stagger: 0.18, ease: "back.out(2.4)" }, t0 + 2);
              tl.fromTo($(".prot"), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.9 }, t0 + 2.6);
              tl.fromTo($(".check circle"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.9 }, t0 + 2.8);
              tl.fromTo($(".check path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.9 }, t0 + 3.3);
              break;
            case 6:
              tl.fromTo($(".coop .draw"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.3, ease: "power2.inOut" }, t0 + 2);
              tl.fromTo($(".coop .door, .coop .win"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: 0.4 }, t0 + 3.6);
              tl.fromTo($(".mrow"), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.5 }, t0 + 3.2);
              $(".count").forEach((el) => count(el, t0 + 4.8, 2));
              tl.fromTo($(".brk"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, t0 + 5.6);
              tl.fromTo($(".cta-wrap"), { autoAlpha: 0, y: 30, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.8)" }, t0 + 6.4);
              break;
          }

          if (i < n - 1) {
            tl.to($(".copy, .hud"), { autoAlpha: 0, y: -30, filter: "blur(8px)", duration: 1, ease: "power2.in" }, t0 + U - 1.8);
          }
        });

        // Hero intro on load (time-based, before any scroll): only the hero's own words and logo.
        gsap.from(titles[0].words, { yPercent: 115, rotate: -4, duration: 1.2, stagger: 0.12, ease: "power4.out", delay: 0.15 });
        gsap.from(q(".shot-01 .sub, .shot-01 .year"), { autoAlpha: 0, y: 16, duration: 1, delay: 0.7 });
        gsap.from(q(".shot-01 .logo-frame img"), { autoAlpha: 0, scale: 1.08, filter: "blur(16px)", duration: 1.8, ease: "power3.out" });

        // Desktop pointer parallax on the HUD wrappers (scroll never animates .tilt).
        const fine = window.matchMedia("(pointer: fine)").matches;
        const tilts = (q(".tilt") as HTMLElement[]).map((el) => ({
          rx: gsap.quickTo(el, "rotateX", { duration: 0.8, ease: "power3.out" }),
          ry: gsap.quickTo(el, "rotateY", { duration: 0.8, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          tilts.forEach((t) => {
            t.ry(x * 10);
            t.rx(-y * 8);
          });
        };
        if (fine) window.addEventListener("pointermove", onMove);

        document.fonts?.ready.then(() => ScrollTrigger.refresh());
        return () => {
          window.removeEventListener("pointermove", onMove);
          titles.forEach((t) => t.revert());
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="story">
      <header className="topbar">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brand/mark.jpg")} alt="" width={36} height={36} />
          <span className="wordmark">BALOUL</span>
        </div>
        <span className="chapter-name" aria-live="polite">
          {shots[0].id} · {shots[0].name}
        </span>
        <div className="nw">
          <span>שווי נקי</span>
          <Odometer />
        </div>
        <span className="rail" aria-hidden>
          <span className="rail-fill" />
        </span>
      </header>

      <section className="stage" aria-label="סיפור התרנגול של בלול">
        {shots.map((s, i) => {
          const Hud = huds[i];
          return (
            <article className={`shot shot-${s.id}`} key={s.id} style={{ zIndex: i + 1 }}>
              <div className="media">
                <ShotMedia shot={s} onVideo={(el) => (videos.current[i] = el)} />
              </div>
              <div className="scrim" aria-hidden />
              <div className="frame">
                <div className="copy">
                  <span className="year num">{s.year}</span>
                  {i === 0 ? <h1 className="title">{s.title}</h1> : <h2 className="title">{s.title}</h2>}
                  <p className="sub">{s.sub}</p>
                </div>
                <div className="hud-slot">
                  <div className="tilt">
                    <Hud />
                  </div>
                </div>
                <span className="ph-tag" dir="ltr">
                  PLACEHOLDER · {s.id}/{String(shots.length).padStart(2, "0")} · clips/{s.file}.mp4
                </span>
              </div>
            </article>
          );
        })}
        <canvas className="coins" aria-hidden />
        <span className="scroll-cue" aria-hidden>
          גללו
        </span>
      </section>

      <footer id="contact" className="end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/brand/logo.jpg")} alt="BALOUL — בית פיננסי, ניהול הון וביטוח" className="end-logo" />
        <p className="end-line">כל לול גדול התחיל בגרגר אחד.</p>
        <p className="disclaimer">
          הסיפור, הסכומים, התשואות ותנאי המשכנתא באתר זה הם להמחשה בלבד ואינם מהווים ייעוץ השקעות, ייעוץ פנסיוני או
          המלצה לרכישת מוצר פיננסי. השקעה בשוק ההון כרוכה בסיכון, ותשואות עבר אינן מבטיחות תשואות עתידיות.
        </p>
      </footer>
    </div>
  );
}
