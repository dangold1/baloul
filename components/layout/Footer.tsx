"use client";

import type { DictKey } from "@/content/dictionary";
import { site } from "@/content/site";
import { legalDocs } from "@/content/legal";
import { services, servicePath } from "@/content/services";
import { AboutLink } from "@/components/about/AboutLink";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { FacebookIcon, MailIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { greetingFor, whatsappUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const legalLinks = legalDocs.map((d) => ({ href: `/${d.slug}`, labelKey: `footer.legal.${d.slug}` as DictKey }));

export function Footer({ base = "" }: { base?: string }) {
  const { lang, t, href } = useLanguage();
  /** Sub pages link back to the home page sections; the home page links in place. */
  const root = base ? href("/") : "";
  return (
    <footer className="b-footer" id="footer">
      <div className="b-container">
        <div className="b-footer-grid">
          <div className="b-footer-brand">
            <img alt="BALOUL" className="b-footer-logo" src={site.images.logo.src} width={site.images.logo.width} height={site.images.logo.height} loading="lazy" decoding="async" />
            <p>{t("footer.about", { founded: site.foundedYear, agency: site.agencyYear })}</p>
            <div className="b-socials">
              <a aria-label="WhatsApp" href={whatsappUrl(greetingFor(lang))} rel="noopener" target="_blank">
                <WhatsAppIcon />
              </a>
              <a aria-label={t("footer.mailLabel")} href={`mailto:${site.email}`}>
                <MailIcon />
              </a>
              <a aria-label="Facebook" href={site.social.facebook} rel="noopener" target="_blank">
                <FacebookIcon />
              </a>
            </div>
          </div>
          <div>
            <h2 className="b-footer-title">{t("footer.servicesTitle")}</h2>
            {services.map((s) => (
              <a key={s.id} href={href(servicePath(s))}>
                {t(`nav.${s.id}` as DictKey)}
              </a>
            ))}
          </div>
          <div>
            <h2 className="b-footer-title">{t("footer.siteTitle")}</h2>
            {base ? <a href={`${root}#about-inline`}>{t("nav.about")}</a> : <AboutLink className="b-open-about">{t("nav.about")}</AboutLink>}
            <a href={`${root}#process`}>{t("nav.process")}</a>
            <a href={`${root}#reviews`}>{t("nav.reviews")}</a>
            <a href={`${root}#knowledge`}>{t("footer.knowledge")}</a>
            <a href={`${root}#contact`}>{t("nav.contact")}</a>
          </div>
          <div>
            <h2 className="b-footer-title">{t("footer.legalTitle")}</h2>
            {legalLinks.map((l) => (
              <a key={l.href} href={href(l.href)}>
                {t(l.labelKey)}
              </a>
            ))}
          </div>
          <div>
            <h2 className="b-footer-title">{t("footer.contactTitle")}</h2>
            <a href={site.phone.href}>{t("footer.phone", { phone: site.phone.display })}</a>
            <a href={whatsappUrl(greetingFor(lang))} rel="noopener" target="_blank">
              WhatsApp: {site.whatsapp.display}
            </a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.address.mapsUrl} rel="noopener" target="_blank">
              {t("footer.address")}
            </a>
          </div>
        </div>
        <div className="b-footer-bottom">
          <span>{t("footer.copyright")}</span>
          <div className="b-footer-legal">
            {legalLinks.map((l) => (
              <a key={l.href} href={href(l.href)}>
                {t(l.labelKey)}
              </a>
            ))}
            <CookieSettingsLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
