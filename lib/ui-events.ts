import { DOM } from "./dom.ts";

/** Cross-component UI events, so server-rendered links can open client dialogs. */
export const OPEN_ABOUT_EVENT = "baloul:open-about";
export const LEAD_SUBMITTED_KEY = "baloul-lead-submitted";

/** Toggles a state class on the site root (used by CSS to hide floating UI under dialogs). */
export function setRootState(className: string, on: boolean): void {
  document.querySelector(DOM.site)?.classList.toggle(className, on);
  document.body.style.overflow = on ? "hidden" : "";
}
