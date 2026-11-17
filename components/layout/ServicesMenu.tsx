"use client";

import { useEffect, useRef } from "react";
import { T } from "@/components/ui/Typography";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { serviceLinks } from "./nav";

/** Desktop "תחומי פעילות" menu: a native <details> that lists the four service pages. */
export function ServicesMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const { href } = useLanguage();

  useEffect(() => {
    const close = () => ref.current?.removeAttribute("open");
    const onClick = (e: MouseEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <details className="b-services-menu" ref={ref}>
      <summary>
        <T k="nav.services" />
      </summary>
      <div className="b-services-menu-list">
        {serviceLinks.map((s) => (
          <a key={s.href} href={href(s.href)}>
            <T k={s.labelKey} />
          </a>
        ))}
      </div>
    </details>
  );
}
