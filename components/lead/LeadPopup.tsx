"use client";

import { WhatsAppIcon } from "@/components/ui/Icons";

import { useCallback, useEffect, useRef, useState } from "react";
import { popupTopics, topicLabel } from "@/content/services";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { track } from "@/lib/analytics";
import { LEAD_SUBMITTED_KEY, setRootState } from "@/lib/ui-events";
import { NetlifyFields } from "./Honeypot";
import { useLeadSubmit } from "./useLeadSubmit";

const FORM_NAME = "popup-lead";
const SEEN_KEY = "baloulLeadShown";
/** Pages without a reviews section: share of the page the visitor scrolls before the popup may appear. */
const SCROLL_TRIGGER = 0.6;
/** Phones and small tablets never get the automatic popup: the bottom bar already offers call and WhatsApp. */
const SMALL_SCREEN = "(max-width: 979px)";

function storageFlag(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/** Another dialog (cookie consent, about) is on screen. */
const otherDialogOpen = () => Boolean(document.querySelector(".b-modal.open, .b-consent[data-open='true']"));

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLanguage();
  const shown = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setRootState("b-lead-open", false);
  }, []);
  const { status, onSubmit, onPhoneInput } = useLeadSubmit(FORM_NAME, () => setTimeout(close, 180));

  useEffect(() => {
    if (storageFlag(SEEN_KEY) || storageFlag(LEAD_SUBMITTED_KEY)) return;
    if (window.matchMedia(SMALL_SCREEN).matches) return;
    let timer: number | undefined;
    // On the home page, wait until the visitor has read past the reviews (the proof), never on top of them.
    const reached = () => {
      const reviews = document.getElementById("reviews");
      if (reviews) return reviews.getBoundingClientRect().bottom < window.innerHeight * 0.4;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 && window.scrollY / max >= SCROLL_TRIGGER;
    };
    const onScroll = () => {
      if (shown.current || timer) return;
      if (!reached()) return;
      timer = window.setTimeout(() => {
        timer = undefined;
        if (shown.current || !reached() || otherDialogOpen() || storageFlag(LEAD_SUBMITTED_KEY)) return;
        shown.current = true;
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* storage unavailable */
        }
        setOpen(true);
        setRootState("b-lead-open", true);
        track("popup_view");
        window.removeEventListener("scroll", onScroll);
      }, 420);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 180);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className={`b-lead-pop${open ? " open" : ""}`} id="bLeadPop" aria-hidden={!open}>
      <div className="b-lead-pop-backdrop" onClick={close} />
      <div className="b-lead-pop-card" role="dialog" aria-modal="true" aria-labelledby="bLeadPopTitle">
        <button ref={closeRef} type="button" className="b-lead-pop-close" aria-label={t("popup.close")} onClick={close}>
          ×
        </button>
        <div className="b-lead-pop-brand">BALOUL</div>
        <div className="b-lead-pop-eyebrow">{t("popup.eyebrow")}</div>
        <h2 id="bLeadPopTitle">{t("popup.title")}</h2>
        <p>{t("popup.text")}</p>
        <form id="bLeadPopForm" name={FORM_NAME} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit}>
          <NetlifyFields formName={FORM_NAME} />
          <div className="b-lead-pop-fields">
            <label>
              <span>{t("form.name")}</span>
              <input id="bLeadPopName" name="name" autoComplete="name" required type="text" placeholder={t("popup.namePlaceholder")} />
            </label>
            <label>
              <span>{t("form.phone")}</span>
              <input id="bLeadPopPhone" name="phone" autoComplete="tel" inputMode="tel" required type="tel" dir="ltr" placeholder="050-0000000" onInput={onPhoneInput} />
            </label>
            <label className="b-lead-pop-full">
              <span>{t("popup.topic")}</span>
              <select id="bLeadPopTopic" name="topic">
                {popupTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topicLabel(topic, lang)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button className="b-btn b-btn-wa b-btn-block b-lead-pop-submit" type="submit">
            <WhatsAppIcon />
            <span>{t("form.submit")}</span>
          </button>
          <div className="b-form-status" id="bLeadPopStatus" aria-live="polite">
            {status}
          </div>
          <small>{t("popup.privacy")}</small>
        </form>
      </div>
    </div>
  );
}
