"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { consentConfig } from "@/content/site";
import { OPEN_CONSENT_EVENT, readConsent, saveConsent, type ConsentChoice } from "@/lib/consent";
import { T } from "@/components/ui/Typography";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Variant = "modal" | "bar";

/**
 * Cookie consent (Privacy Protection Law amendment 13): asked up front, equal Accept / Decline,
 * nothing that tracks runs before Accept. Switch placement with the `variant` prop or consentConfig.
 */
export function CookieConsent({ variant: preferred = consentConfig.variant }: { variant?: Variant }) {
  const { href } = useLanguage();
  const [open, setOpen] = useState(false);
  // On the privacy page the visitor must be able to read the policy, so never block it.
  const pathname = usePathname();
  const variant: Variant = pathname === "/privacy" ? "bar" : preferred;
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (readConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (open && variant === "modal") acceptRef.current?.focus({ preventScroll: true });
  }, [open, variant]);

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className={`b-consent b-consent--${variant}`} data-open="true">
      {variant === "modal" && <div className="b-consent-backdrop" aria-hidden="true" />}
      <div
        className="b-consent-card"
        role={variant === "modal" ? "dialog" : "region"}
        aria-modal={variant === "modal" ? true : undefined}
        aria-labelledby="bConsentTitle"
        aria-describedby="bConsentText"
      >
        <div className="b-consent-copy">
          <p id="bConsentTitle" className="b-consent-title">
            <T k="consent.title" />
          </p>
          <p id="bConsentText" className="b-consent-text">
            <T k="consent.text" />{" "}
            <a href={href("/privacy")}>
              <T k="footer.legal.privacy" />
            </a>
          </p>
        </div>
        <div className="b-consent-actions">
          <button ref={acceptRef} type="button" className="b-consent-btn b-consent-accept" onClick={() => choose("granted")}>
            <T k="consent.accept" />
          </button>
          <button type="button" className="b-consent-btn b-consent-decline" onClick={() => choose("denied")}>
            <T k="consent.decline" />
          </button>
        </div>
      </div>
    </div>
  );
}
