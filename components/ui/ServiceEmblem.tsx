import type { Service } from "@/content/services";

/*
 * Home page service emblems (Dan, 2026-11-10): gold line drawings on a navy tile with a fine
 * banknote-style guilloche behind them (public/images/guilloche.svg, set in Services.css).
 * Drawn on a 48-unit grid; colour comes from `color` on the tile.
 */
const drawings: Record<Service["icon"], React.ReactNode> = {
  // Pension and retirement: an hourglass whose sand settles into a coin stack.
  clock: (
    <>
        <path d="M15 9h18M15 39h18"/>
        <path d="M17 9c0 7 7 9.5 7 15s-7 8-7 15M31 9c0 7-7 9.5-7 15s7 8 7 15"/>
        <path fill="currentColor" stroke="none" d="M19.5 13h9c-.8 3-4.5 5-4.5 7.5 0-2.5-3.7-4.5-4.5-7.5z"/>
        <path fill="currentColor" stroke="none" d="M19.2 36.2h9.6v1.6h-9.6zM20.4 33.2h7.2v1.6h-7.2z"/>
        <path d="M24 26v4"/>
    </>
  ),
  // Insurance: an umbrella over a house.
  shield: (
    <>
        <path d="M9 22a15 11 0 0 1 30 0c-2.5-1.8-5-1.8-7.5 0-2.5-1.8-5-1.8-7.5 0-2.5-1.8-5-1.8-7.5 0-2.5-1.8-5-1.8-7.5 0z"/>
        <path d="M24 8v3"/>
        <path d="M17 33.5l7-6 7 6"/>
        <path d="M19 31.8V40h10v-8.2"/>
        <path fill="currentColor" stroke="none" d="M22.6 40v-4.2h2.8V40z"/>
    </>
  ),
  // Savings and investments: a seedling growing from a coin stack.
  coin: (
    <>
        <ellipse cx="24" cy="38" rx="9" ry="2.6"/>
        <path d="M15 38v-3.5c0 1.4 4 2.6 9 2.6s9-1.2 9-2.6V38"/>
        <ellipse cx="24" cy="34.5" rx="9" ry="2.6"/>
        <path d="M24 32V19"/>
        <path fill="currentColor" stroke="none" d="M24 23c-1-4.5-4.5-7-9.5-7 .4 4.8 3.8 7.4 9.5 7z"/>
        <path d="M24 20c.8-5 4.4-8.2 10-8.2-.2 5.4-4.2 8.4-10 8.2z"/>
    </>
  ),
  // Financial planning: a compass.
  chart: (
    <>
        <circle cx="24" cy="24" r="14"/>
        <path d="M24 6.5v3.5M24 38v3.5M6.5 24h3.5M38 24h3.5"/>
        <path fill="currentColor" stroke="none" d="M31.5 16.5L26.3 26.3 21.7 21.7z"/>
        <path d="M16.5 31.5L21.7 21.7 26.3 26.3z"/>
    </>
  ),
};

export function ServiceEmblem({ name }: { name: Service["icon"] }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {drawings[name]}
    </svg>
  );
}
