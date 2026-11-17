"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { whatsappTopics } from "@/content/services";
import { greetingFor, topicMessage, whatsappUrl } from "@/lib/whatsapp";
import { topicLabel } from "@/content/services";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ArrowIcon, CloseIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** A short pause before opening, so passing over the button on the way elsewhere does not pop the bubble. */
const OPEN_DELAY_MS = 120;
/** Closing waits a moment, so moving the pointer from the button up to the bubble never closes it. */
const CLOSE_DELAY_MS = 300;

/**
 * WhatsApp with a choice of topic (Dan, 2026-11-10); each topic opens WhatsApp with a ready message.
 * Desktop: a round button. Pointing at it or tabbing to it opens a bubble above it; clicking the button itself still
 * opens a plain chat. No X: moving away, Escape or a click elsewhere closes it.
 * Phones: a bottom bar with call and WhatsApp. Tapping WhatsApp opens the same topics as a sheet above the bar,
 * with an X, because on a small screen there is nowhere to move the finger away to.
 */
export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLanguage();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dismissed = useRef(false);

  const later = useCallback((fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  }, []);
  const close = useCallback(
    (refocus = false) => {
      clearTimeout(timer.current);
      setOpen(false);
      if (refocus) buttonRef.current?.focus({ preventScroll: true });
    },
    [],
  );
  const canHover = () => matchMedia("(min-width: 760px) and (hover: hover) and (pointer: fine)").matches;
  const isDesktop = () => matchMedia("(min-width: 760px)").matches;
  // Phones get the sheet with an X; read after mount so the static HTML is the same for everyone.
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width: 759px)");
    const sync = () => {
      setIsPhone(mq.matches);
      setOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const closeRef = useRef<HTMLButtonElement>(null);
  // On phones, move focus into the sheet so screen readers and keyboards land on it.
  useEffect(() => {
    if (open && isPhone) closeRef.current?.focus({ preventScroll: true });
  }, [open, isPhone]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismissed.current = true;
        close(true);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="b-floating">
      <a className="b-call" href={site.phone.href}>
        <PhoneIcon />
        <span>{t("wa.call")}</span>
      </a>
      <div
        ref={wrapRef}
        className="b-wa-wrap"
        data-open={open ? "" : undefined}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse" || !canHover() || dismissed.current) return;
          later(() => setOpen(true), OPEN_DELAY_MS);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          dismissed.current = false;
          later(() => setOpen(false), CLOSE_DELAY_MS);
        }}
        onFocus={(e) => {
          // Keyboard only: a mouse click on the button should just open the chat.
          const t = e.target as Element;
          if (isDesktop() && !dismissed.current && t === buttonRef.current && t.matches(":focus-visible")) setOpen(true);
        }}
        onBlur={(e) => {
          if (e.relatedTarget && !wrapRef.current?.contains(e.relatedTarget as Node)) {
            dismissed.current = false;
            close();
          }
        }}
      >
        <a
          ref={buttonRef}
          aria-expanded={isPhone ? open : undefined}
          aria-haspopup={isPhone ? "true" : undefined}
          aria-label="WhatsApp"
          className="b-wa"
          href={whatsappUrl(greetingFor(lang))}
          rel="noopener"
          target="_blank"
          onClick={(e) => {
            if (!isPhone) return;
            e.preventDefault();
            setOpen((o) => !o);
          }}
        >
          <WhatsAppIcon />
          <span className="b-wa-label">WhatsApp</span>
        </a>
        <div aria-labelledby="bWaMenuTitle" className="b-wa-menu" role="group">
          <div className="b-wa-menu-head">
            <span aria-hidden="true" className="b-wa-menu-badge">
              <WhatsAppIcon />
            </span>
            <p className="b-wa-menu-title" id="bWaMenuTitle">
              {t("wa.menuTitle")}
            </p>
            <button
              ref={closeRef}
              aria-label={t("wa.close")}
              className="b-wa-menu-close"
              type="button"
              onClick={() => {
                dismissed.current = true;
                close(true);
              }}
            >
              <CloseIcon />
            </button>
          </div>
          <ul>
            {whatsappTopics.map((topic) => (
              <li key={topic}>
                <a href={whatsappUrl(topicMessage(topic, lang))} rel="noopener" target="_blank" onClick={() => close()}>
                  <span>{topicLabel(topic, lang)}</span>
                  <ArrowIcon />
                </a>
              </li>
            ))}
          </ul>
          <p className="b-wa-menu-note">{t("wa.note")}</p>
        </div>
      </div>
    </div>
  );
}
