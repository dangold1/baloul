"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/content/site";
import { aboutModalChips, aboutModalChipsEn, aboutParagraphs, aboutParagraphsEn } from "@/content/about";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Dialog } from "@/components/ui/Dialog";
import { pick } from "@/lib/i18n/languages";
import { OPEN_ABOUT_EVENT, setRootState } from "@/lib/ui-events";

export function AboutModal() {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLanguage();

  const close = useCallback(() => {
    setOpen(false);
    setRootState("b-about-open", false);
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setRootState("b-about-open", true);
    };
    window.addEventListener(OPEN_ABOUT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ABOUT_EVENT, onOpen);
  }, []);

  return (
    <Dialog id="about-modal" open={open} onClose={close} labelledBy="aboutTitle" closeLabel={t("about.modalClose")}>
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
    </Dialog>
  );
}
