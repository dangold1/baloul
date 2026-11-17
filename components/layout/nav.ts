import type { DictKey } from "@/content/dictionary";
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
  { href: "#process", labelKey: "nav.process" },
  { href: "#about-modal", labelKey: "nav.about", opensAbout: true },
  { href: "#reviews", labelKey: "nav.reviews" },
  { href: "#knowledge", labelKey: "nav.knowledge" },
];

export const mobileNav: NavItem[] = [
  { href: "#top", labelKey: "nav.home" },
  ...serviceLinks,
  { href: "#process", labelKey: "nav.process" },
  { href: "#about-inline", labelKey: "nav.about" },
  { href: "#reviews", labelKey: "nav.reviews" },
  { href: "#knowledge", labelKey: "nav.knowledge" },
  { href: "#contact", labelKey: "nav.contact" },
];
