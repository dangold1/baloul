"use client";

import { sectionHref, toSectionId } from "@/content/sections";
import { site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { PhoneRingIcon } from "@/components/ui/Icons";
import { AboutLink } from "@/components/about/AboutLink";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { ServicesMenu } from "./ServicesMenu";
import { desktopNav, mobileNav } from "./nav";

/**
 * Site header. On the home page the anchors stay in-page and the about link opens the dialog.
 * On sub pages (services, legal) they point back to the home page, except the mobile menu's contact
 * link when the page has its own form (contactHref). The header button calls the office (tel:).
 */
export function Header({ home = true, contactHref }: { home?: boolean; contactHref?: string }) {
  const { t, href } = useLanguage();
  const base = home ? "" : href("/");
  const cta = contactHref ?? sectionHref("contact", base);
  /** A home page anchor from nav.ts ("#process"), pointing back to the home page on sub pages. "#top" is not a section. */
  const homeAnchor = (hash: string) => {
    const id = toSectionId(hash);
    return id ? sectionHref(id, base) : `${base}${hash}`;
  };
  return (
    <header className="b-header">
      <div className="b-container b-nav">
        <a aria-label={t("brand.homeLabel")} className="b-brand" href={home ? "#top" : href("/")}>
          <Logo alt={t("brand.logoAlt")} />
          <span className="b-brand-text">
            <span className="b-brand-name">BALOUL</span>
            <span className="b-brand-tag">{t("brand.tagline")}</span>
          </span>
        </a>
        <nav aria-label={t("menu.mainLabel")} className="b-links">
          <ServicesMenu />
          {desktopNav.map((item) =>
            item.opensAbout && home ? (
              <AboutLink key={item.href} className="b-open-about">
                {t(item.labelKey)}
              </AboutLink>
            ) : (
              <NavLink key={item.href} href={item.opensAbout ? sectionHref("about-inline", base) : homeAnchor(item.href)}>
                {t(item.labelKey)}
              </NavLink>
            ),
          )}
        </nav>
        <LanguageSwitch />
        <a className="b-nav-cta" href={site.phone.href} aria-label={`${t("nav.call")} ${site.phone.display}`}>
          <span className="b-nav-call-icon">
            <PhoneRingIcon />
          </span>
          <span className="b-nav-call-text">
            <span className="b-nav-call-label">{t("nav.call")}</span>
            <span className="b-nav-call-number">{site.phone.display}</span>
          </span>
        </a>
        <MobileMenu
          items={mobileNav.map((i) => ({
            ...i,
            href: i.href.startsWith("#") ? (i.href === sectionHref("contact") ? cta : homeAnchor(i.href)) : href(i.href),
          }))}
        />
      </div>
    </header>
  );
}
