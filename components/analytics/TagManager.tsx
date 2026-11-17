"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function loadGtm(id: string) {
  if (document.getElementById("gtm-script")) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

/** Loads GTM only after the visitor accepts cookies, and only when an ID is configured. */
export function TagManager() {
  useEffect(() => {
    if (!GTM_ID) return;
    if (readConsent() === "granted") loadGtm(GTM_ID);
    const onConsent = (e: Event) => {
      if ((e as CustomEvent).detail === "granted") loadGtm(GTM_ID);
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);
  return null;
}
