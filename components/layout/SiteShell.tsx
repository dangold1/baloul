import "@/styles";
import { heebo } from "@/app/fonts";
import { consentBootstrapScript } from "@/lib/consent";
import { dirOf, homeRedirectScript, type Lang } from "@/lib/i18n/languages";
import { makeI18n } from "@/lib/i18n/i18n";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { TagManager } from "@/components/analytics/TagManager";
import { ClickTracker } from "@/components/analytics/ClickTracker";

/** The document both root layouts share: Hebrew at /…, English at /en/…. lang/dir are in the static HTML. */
export function SiteShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} dir={dirOf(lang)} className={heebo.variable}>
      <head>
        {/* Consent Mode v2 defaults must exist before any tag can load. */}
        <script dangerouslySetInnerHTML={{ __html: consentBootstrapScript }} />
        {/* Hebrew home only: a visitor who chose English opens /en. */}
        {lang === "he" && <script dangerouslySetInnerHTML={{ __html: homeRedirectScript }} />}
      </head>
      <body>
        <LanguageProvider lang={lang}>
          <div id="baloul-site" className="site">
            <a className="b-skip" href="#main" data-no-scroll="">
              {makeI18n(lang).t("skip.main")}
            </a>
            {children}
          </div>
          <CookieConsent />
          <TagManager />
          <ClickTracker />
        </LanguageProvider>
      </body>
    </html>
  );
}
