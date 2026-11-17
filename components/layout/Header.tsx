"use client";

import { site } from "@/content/site";
import { AboutLink } from "@/components/about/AboutLink";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { ServicesMenu } from "./ServicesMenu";
import { desktopNav, mobileNav } from "./nav";

/**
 * Site header. On the home page the anchors stay in-page and the about link opens the dialog.
 * On sub pages (services, legal) they point back to the home page, except the contact link
 * when the page has its own form (contactHref).
 */
export function Header({ home = true, contactHref }: { home?: boolean; contactHref?: string }) {
  const { t, href } = useLanguage();
  const base = home ? "" : href("/");
  const cta = contactHref ?? `${base}#contact`;
  return (
    <header className="b-header">
      <div className="b-container b-nav">
        <a aria-label={t("brand.homeLabel")} className="b-brand" href={home ? "#top" : href("/")}>
          <img alt={t("brand.logoAlt")} src={site.images.logo.src} width={site.images.logo.width} height={site.images.logo.height} />
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
              <NavLink key={item.href} href={item.opensAbout ? `${base}#about-inline` : `${base}${item.href}`}>
                {t(item.labelKey)}
              </NavLink>
            ),
          )}
        </nav>
        <LanguageSwitch />
        <NavLink className="b-nav-cta" href={cta}>
          {t("nav.contact")}
        </NavLink>
        <MobileMenu
          items={mobileNav.map((i) => ({
            ...i,
            href: i.href.startsWith("#") ? (i.href === "#contact" ? cta : `${base}${i.href}`) : href(i.href),
          }))}
        />
      </div>
    </header>
  );
}
