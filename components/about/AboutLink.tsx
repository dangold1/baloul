"use client";

import { OPEN_ABOUT_EVENT } from "@/lib/ui-events";

/** A link that opens the About dialog instead of navigating. */
export function AboutLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <a
      className={className}
      href="#about-modal"
      data-no-scroll=""
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new Event(OPEN_ABOUT_EVENT));
      }}
    >
      {children}
    </a>
  );
}
