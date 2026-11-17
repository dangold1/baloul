"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useDismiss } from "@/lib/useDismiss";
import type { NavItem } from "./nav";
import { NavLink } from "./NavLink";

/** Native <details> menu: closes on outside click, Escape and navigation. Links are handled by HashLinkController. */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const { t } = useLanguage();
  // Layout: plain links, then the service pages under one heading, then the rest; the last item is the call to action.
  const firstGrouped = items.findIndex((i) => i.group === "services");
  const cta = items.at(-1);
  const rest = items.slice(0, -1);
  const before = firstGrouped < 0 ? rest : rest.slice(0, firstGrouped).filter((i) => !i.group);
  const grouped = rest.filter((i) => i.group === "services");
  const after = firstGrouped < 0 ? [] : rest.slice(firstGrouped).filter((i) => !i.group);
  const link = (item: NavItem) => (
    <NavLink key={item.href} href={item.href}>
      {t(item.labelKey)}
    </NavLink>
  );

  const [open, setOpen] = useState(false);
  useDismiss(ref, open, () => ref.current?.removeAttribute("open"));
  useEffect(() => {
    const close = () => ref.current?.removeAttribute("open");
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <details className="b-mobile-menu-shell" id="bMobileMenu" ref={ref} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary aria-label={t("menu.open")} className="b-menu">
        <span aria-hidden="true" className="b-menu-icon" />
        <span aria-hidden="true" className="b-menu-text">
          {t("menu.text")}
        </span>
      </summary>
      <nav aria-label={t("menu.mobileLabel")} className="b-mobile">
        {before.map(link)}
        {grouped.length > 0 && (
          <div className="b-mobile-group" role="group" aria-labelledby="bMobileServicesTitle">
            <p className="b-mobile-group-title" id="bMobileServicesTitle">
              {t("nav.services")}
            </p>
            {grouped.map(link)}
          </div>
        )}
        {after.map(link)}
        {cta && (
          <NavLink className="b-mobile-cta" href={cta.href}>
            {t(cta.labelKey)}
          </NavLink>
        )}
      </nav>
    </details>
  );
}
