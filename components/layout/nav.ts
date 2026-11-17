import type { DictKey } from "@/content/dictionary";
import { sectionHref } from "@/content/sections";
import { services, servicePath } from "@/content/services";

export type NavItem = { href: string; labelKey: DictKey; opensAbout?: boolean; group?: "services" };

/** The four service pages, in priority order. */
export const serviceLinks: NavItem[] = services.map((s) => ({
  href: servicePath(s),
  labelKey: `nav.${s.id}` as DictKey,
  group: "services",
}));

/** Desktop: the services menu lists the four pages; the rest are anchors on the home page. */
export const desktopNav: NavItem[] = [
  { href: sectionHref("process"), labelKey: "nav.process" },
  { href: "#about-modal", labelKey: "nav.about", opensAbout: true },
  { href: sectionHref("reviews"), labelKey: "nav.reviews" },
  { href: sectionHref("knowledge"), labelKey: "nav.knowledge" },
];

export const mobileNav: NavItem[] = [
  { href: "#top", labelKey: "nav.home" },
  ...serviceLinks,
  { href: sectionHref("process"), labelKey: "nav.process" },
  { href: sectionHref("about-inline"), labelKey: "nav.about" },
  { href: sectionHref("reviews"), labelKey: "nav.reviews" },
  { href: sectionHref("knowledge"), labelKey: "nav.knowledge" },
  { href: sectionHref("contact"), labelKey: "nav.contact" },
];
