"use client";

import { toSectionId } from "@/content/sections";
import { useActiveSection } from "./ActiveSection";

/**
 * A navigation link to a home page section. Marks aria-current when its section is active and
 * activates it on click, right away, before the smooth scroll lands. Scrolling itself is still
 * done by HashLinkController, so this never prevents the default.
 */
export function NavLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const { activeId, setActive } = useActiveSection();
  const target = toSectionId(href);
  const current = target !== null && activeId === target;
  return (
    <a
      className={className}
      href={href}
      aria-current={current ? "true" : undefined}
      onClick={() => {
        if (target) setActive(target);
      }}
    >
      {children}
    </a>
  );
}
