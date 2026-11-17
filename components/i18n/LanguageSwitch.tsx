"use client";

import { useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { basePath, LANG_STORAGE_KEY, LANGS, localePath, parseLang } from "@/lib/i18n/languages";
import { useDismiss } from "@/lib/useDismiss";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useSteps } from "@/components/layout/ActiveSection";
import { Flag } from "./Flags";
import { useLanguage } from "./LanguageProvider";

/**
 * Language picker: a round flag button that opens a small menu (menuitemradio pattern).
 * Each option is a real link to the same page in that language (/x ↔ /en/x), so crawlers and no-JS visitors can follow it.
 * Switching keeps the reader's place: on the home page it carries the section being read (/en#process), elsewhere the hash.
 * The choice is remembered, so the home page opens in that language next time (see homeRedirectScript).
 * Keyboard: Enter/Space/ArrowDown open, arrows and Home/End move, Escape closes and returns focus, Tab closes.
 */
export function LanguageSwitch() {
  const { lang, t } = useLanguage();
  const page = basePath(usePathname() ?? "/");
  const { currentStep } = useSteps();
  const [, rememberLang] = useLocalStorage(LANG_STORAGE_KEY, parseLang, lang);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuId = useId();

  const focusItem = (i: number) => itemRefs.current[(i + LANGS.length) % LANGS.length]?.focus();
  const openMenu = (focusIndex = LANGS.indexOf(lang)) => {
    setOpen(true);
    requestAnimationFrame(() => focusItem(focusIndex));
  };
  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  // Escape returns focus to the flag button; a press elsewhere just closes.
  useDismiss(rootRef, open, (reason) => close(reason === "escape"));

  const onMenuKey = (e: React.KeyboardEvent) => {
    const i = itemRefs.current.findIndex((el) => el === document.activeElement);
    const keys: Record<string, () => void> = {
      ArrowDown: () => focusItem(i + 1),
      ArrowUp: () => focusItem(i - 1),
      Home: () => focusItem(0),
      End: () => focusItem(LANGS.length - 1),
      Tab: () => setOpen(false),
    };
    if (!keys[e.key]) return;
    if (e.key !== "Tab") e.preventDefault();
    keys[e.key]();
  };

  return (
    <div ref={rootRef} className="b-lang" data-open={open ? "" : undefined}>
      <button
        ref={triggerRef}
        type="button"
        className="b-lang-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t("lang.switchLabel")}: ${t(`lang.${lang}`)}`}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openMenu(e.key === "ArrowUp" ? LANGS.length - 1 : LANGS.indexOf(lang));
          }
        }}
      >
        <Flag lang={lang} />
      </button>
      <div id={menuId} role="menu" aria-label={t("lang.switchLabel")} className="b-lang-menu" hidden={!open} onKeyDown={onMenuKey}>
        {LANGS.map((l, i) => (
          <a
            key={l}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            href={localePath(l, page)}
            hrefLang={l}
            role="menuitemradio"
            aria-checked={lang === l}
            lang={l}
            tabIndex={-1}
            className="b-lang-option"
            data-no-scroll=""
            onClick={(e) => {
              rememberLang(l);
              if (l === lang) {
                e.preventDefault();
                close(true);
                return;
              }
              const hash = currentStep && currentStep !== "top" ? `#${currentStep}` : location.hash;
              e.currentTarget.href = localePath(l, page) + hash;
            }}
          >
            <Flag lang={l} />
            <span className="b-lang-name">{t(`lang.${l}`)}</span>
            <span className="b-lang-check" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}
