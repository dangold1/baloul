"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { aboutModalChips, aboutModalChipsEn, aboutParagraphs, aboutParagraphsEn } from "@/content/about";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { pick } from "@/lib/i18n/languages";
import { OPEN_ABOUT_EVENT, setRootState } from "@/lib/ui-events";

export function AboutModal() {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<Element | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setRootState("b-about-open", false);
    (returnFocus.current as HTMLElement | null)?.focus?.();
  }, []);

  useEffect(() => {
    const onOpen = () => {
      returnFocus.current = document.activeElement;
      setOpen(true);
      setRootState("b-about-open", true);
      setTimeout(() => closeRef.current?.focus(), 0);
    };
    window.addEventListener(OPEN_ABOUT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ABOUT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div aria-hidden={!open} className={`b-modal${open ? " open" : ""}`} id="about-modal">
      <div className="b-modal-backdrop b-close-about" onClick={close} />
      <div aria-labelledby="aboutTitle" aria-modal="true" className="b-modal-dialog" role="dialog">
        <button ref={closeRef} aria-label={t("about.modalClose")} className="b-modal-close b-close-about" type="button" onClick={close}>
          ×
        </button>
        <div className="b-modal-photo">
          <img alt={t("about.teamAlt")} src={site.images.team.src} width={site.images.team.width} height={site.images.team.height} loading="lazy" decoding="async" />
        </div>
        <div className="b-modal-copy">
          <div className="b-eyebrow">{t("nav.about")}</div>
          <h2 id="aboutTitle">{t("about.modalTitle")}</h2>
          {pick(lang, aboutParagraphs, aboutParagraphsEn).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="b-chip-row">
            {pick(lang, aboutModalChips, aboutModalChipsEn).map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
