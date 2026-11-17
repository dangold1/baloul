"use client";

import { useEffect } from "react";

/**
 * One place for in-page navigation (replaces the legacy per-version menu scripts):
 * closes the mobile menu, opens the target accordion or service card, scrolls smoothly
 * and keeps the URL hash in sync.
 */
function openTarget(target: Element) {
  if (target instanceof HTMLDetailsElement) target.open = true;
  const inner = target.querySelector<HTMLDetailsElement>(".b-solution-details");
  if (inner) inner.open = true;
}

export function HashLinkController() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.dataset.noScroll !== undefined) return;
      const href = link.getAttribute("href") ?? "#";
      const target = href.length > 1 ? document.querySelector(href) : document.getElementById("top");
      if (!target) return;
      e.preventDefault();
      document.querySelector("#bMobileMenu")?.removeAttribute("open");
      openTarget(target);
      const block: ScrollLogicalPosition = href.startsWith("#service-") && window.innerWidth > 980 ? "center" : "start";
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block });
          if (href === "#top") history.replaceState(null, "", location.pathname + location.search);
          else history.pushState(null, "", href);
        }),
      );
    };
    document.addEventListener("click", onClick);

    // Deep links such as baloul.co.il/#service-pension open the right card on load.
    if (location.hash.length > 1) {
      const target = document.querySelector(location.hash);
      if (target) openTarget(target);
    }
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
