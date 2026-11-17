/** Home page sections that can be "active" (clicked, navigated to or scrolled into). Order follows the page. */
export const sectionIds = ["services", "process", "about-inline", "reviews", "knowledge", "contact"] as const;

export type SectionId = (typeof sectionIds)[number];

/** Steps of the scroll stepper: the hero ("top") and then every section. Each component registers its own step and label. */
export const stepIds = ["top", ...sectionIds] as const;

export type StepId = (typeof stepIds)[number];

/** "#process" or "process" → "process". Anything else (other pages, modal links, empty) → null. */
export function toSectionId(hashOrId: string): SectionId | null {
  const id = hashOrId.startsWith("#") ? hashOrId.slice(1) : hashOrId;
  return (sectionIds as readonly string[]).includes(id) ? (id as SectionId) : null;
}
