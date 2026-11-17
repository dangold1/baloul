"use client";

import { useEffect, useRef, useState } from "react";
import { useSteps } from "./ActiveSection";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Dark bands where the stepper switches to its light colours. */
const darkAreas = ["#reviews", ".b-footer"];

/**
 * Scroll progress for the home page (Dan, 2026-11-10).
 * Desktop (1200px and up): a thin rail on the right with a dot per part of the page; smaller screens: a gold bar
 * under the header. The steps and their names come from the components themselves (Section, StepRegion) and the
 * current step from the page's one scroll-spy (ActiveSectionProvider). The small scroll handler below only
 * measures how far the page is read (fill) and whether the rail sits over a dark band.
 */
export function ScrollStepper() {
  const { steps, currentStep, goTo } = useSteps();
  const { t } = useLanguage();
  const [dark, setDark] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const root = rootRef.current;
      const doc = document.documentElement;
      const max = doc.scrollHeight - innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      root?.style.setProperty("--stepper-progress", progress.toFixed(4));
      const header = document.querySelector(".b-header");
      if (header) root?.style.setProperty("--stepper-top", `${Math.round(header.getBoundingClientRect().bottom)}px`);
      const mid = innerHeight / 2;
      setDark(
        darkAreas.some((sel) => {
          const r = document.querySelector(sel)?.getBoundingClientRect();
          return !!r && r.top <= mid && r.bottom >= mid;
        }),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  const current = currentStep ?? "top";
  const inHero = current === "top";
  const currentIndex = steps.findIndex((s) => s.id === current);
  const currentLabel = steps[currentIndex]?.label ?? "";

  return (
    <div ref={rootRef} className="b-stepper-root" data-tone={dark ? "dark" : undefined} data-hero={inHero ? "" : undefined}>
      <nav className="b-stepper" aria-label={t("stepper.label")}>
        <span aria-hidden="true" className="b-stepper-track">
          <span className="b-stepper-fill" />
        </span>
        <ol>
          {steps.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="b-stepper-step"
                data-state={i < currentIndex ? "past" : i === currentIndex ? "current" : "next"}
                aria-current={i === currentIndex ? "step" : undefined}
                onClick={() => goTo(s.id)}
              >
                <span aria-hidden="true" className="b-stepper-dot" />
                <span className="b-stepper-label">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {/* Phones: the same information as a progress bar. The page links are already in the menu. */}
      <div aria-hidden="true" className="b-stepper-mobile">
        <span className="b-stepper-mobile-bar">
          <span className="b-stepper-fill" />
        </span>
        <span className="b-stepper-mobile-label">{currentLabel}</span>
      </div>
    </div>
  );
}
