import type { DictKey } from "@/content/dictionary";
import { site } from "@/content/site";
import { legalDocs } from "@/content/legal";
import { sectionHref, type SectionId } from "@/content/sections";
import { services, servicePath } from "@/content/services";
import { AboutLink } from "@/components/about/AboutLink";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { FacebookIcon, MailIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { contactLink } from "@/lib/contact";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { Logo } from "@/components/ui/Logo";

const legalLinks = legalDocs.map((d) => ({ href: `/${d.slug}`, labelKey: `footer.legal.${d.slug}` as DictKey }));

export function Footer({ lang, home }: { lang: Lang; home: boolean }) {
  const { t, href } = makeI18n(lang);
  const [phone, whatsapp, email, address] = (["phone", "whatsapp", "email", "address"] as const).map((k) => contactLink(k, lang));
  /** Sub pages link back to the home page sections; the home page links in place. */
  const section = (id: SectionId) => (home ? sectionHref(id) : href(sectionHref(id, "/")));
  return (
    <footer className="b-footer" id="footer">
      <div className="b-container">
        <div className="b-footer-grid">
          <div className="b-footer-brand">
            <Logo alt={t("brand.logoAlt")} className="b-footer-logo" lazy />
            <p>{t("footer.about", { founded: site.foundedYear, agency: site.agencyYear })}</p>
            <div className="b-socials">
              <a aria-label="WhatsApp" href={whatsapp.href} rel="noopener" target="_blank">
                <WhatsAppIcon />
              </a>
              <a aria-label={t("footer.mailLabel")} href={email.href}>
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
            {home ? <AboutLink className="b-open-about">{t("nav.about")}</AboutLink> : <a href={section("about-inline")}>{t("nav.about")}</a>}
            <a href={section("process")}>{t("nav.process")}</a>
            <a href={section("reviews")}>{t("nav.reviews")}</a>
            <a href={section("knowledge")}>{t("footer.knowledge")}</a>
            <a href={section("contact")}>{t("nav.contact")}</a>
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
            <a href={phone.href}>{t("footer.phone", { phone: phone.display })}</a>
            <a href={whatsapp.href} rel="noopener" target="_blank">
              WhatsApp: {whatsapp.display}
            </a>
            <a href={email.href}>{email.display}</a>
            <a href={address.href} rel="noopener" target="_blank">
              {address.display}
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
