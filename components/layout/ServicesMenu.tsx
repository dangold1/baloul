"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useDismiss } from "@/lib/useDismiss";
import { serviceLinks } from "./nav";

/** Desktop "תחומי פעילות" menu: a native <details> that lists the four service pages. */
export function ServicesMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const { t, href } = useLanguage();
  useDismiss(ref, open, () => ref.current?.removeAttribute("open"));

  return (
    <details className="b-services-menu" ref={ref} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{t("nav.services")}</summary>
      <div className="b-services-menu-list">
        {serviceLinks.map((s) => (
          <a key={s.href} href={href(s.href)}>
            {t(s.labelKey)}
          </a>
        ))}
      </div>
    </details>
  );
}
