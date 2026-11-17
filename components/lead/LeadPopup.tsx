"use client";

import { WhatsAppIcon } from "@/components/ui/Icons";

import { useCallback, useEffect, useRef, useState } from "react";
import { popupTopics } from "@/content/services";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Dialog } from "@/components/ui/Dialog";
import { DOM } from "@/lib/dom";
import { track } from "@/lib/analytics";
import { LEAD_SUBMITTED_KEY, setRootState } from "@/lib/ui-events";
import { NetlifyFields } from "./Honeypot";
import { LeadFields } from "./LeadFields";
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

/** Another dialog, banner or popover (cookie consent, About, the WhatsApp bubble) is on screen. */
const otherDialogOpen = () => Boolean(document.querySelector(DOM.openDialog));

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const shown = useRef(false);

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
      const reviews = document.querySelector(DOM.reviews);
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

  return (
    <Dialog variant="leadPop" id="bLeadPop" open={open} onClose={close} labelledBy="bLeadPopTitle" closeLabel={t("popup.close")} focusDelay={180}>
      <div className="b-lead-pop-brand">BALOUL</div>
      <div className="b-lead-pop-eyebrow">{t("popup.eyebrow")}</div>
      <h2 id="bLeadPopTitle">{t("popup.title")}</h2>
      <p>{t("popup.text")}</p>
      <form className="b-form" id="bLeadPopForm" name={FORM_NAME} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit}>
        <NetlifyFields formName={FORM_NAME} label={t("form.honeypot")} />
        <div className="b-lead-pop-fields">
          <LeadFields
            idPrefix="bLeadPop"
            topics={popupTopics}
            namePlaceholder={t("popup.namePlaceholder")}
            topicQuestion={t("popup.topic")}
            onPhoneInput={onPhoneInput}
          />
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
    </Dialog>
  );
}
