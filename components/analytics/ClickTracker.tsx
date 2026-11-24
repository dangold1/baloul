"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Sends contact clicks (WhatsApp, phone, email) from anywhere on the page, tagged with the page area. */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const area = link.closest("section[id], header, footer, .b-floating");
      const location = area?.id || area?.className.split(" ")[0] || "page";
      if (href.includes("wa.me/")) track("click_whatsapp", { location });
      else if (href.startsWith("tel:")) track("click_phone", { location });
      else if (href.startsWith("mailto:")) track("click_email", { location });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
