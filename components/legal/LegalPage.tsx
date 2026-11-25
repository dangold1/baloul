import type { LegalDoc } from "@/content/legal";
import { getContent } from "@/content/localized";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

/** Legal document as a standalone page, reusing the original dialog typography. English pages say the Hebrew text binds. */
export function LegalPage({ lang, doc: heDoc }: { lang: Lang; doc: LegalDoc }) {
  const { t, href } = makeI18n(lang);
  const docs = getContent(lang).legalDocs;
  const doc = docs.find((d) => d.slug === heDoc.slug) ?? heDoc;
  return (
    <main id="top" className="b-legal-page">
      <span id="main" tabIndex={-1} />
      <BreadcrumbJsonLd lang={lang} items={[{ name: t("common.home"), path: "/" }, { name: doc.title, path: `/${doc.slug}` }]} />
      <section aria-label={doc.title} className="b-legal-overlay">
        <article className="b-legal-dialog">
          <a aria-label={t("common.backHome")} className="b-legal-close" href={href("/")}>
            ×
          </a>
          <div className="b-legal-kicker">{t("legal.kicker")}</div>
          <h1>{doc.title}</h1>
          <nav aria-label={t("legal.tabsLabel")} className="b-legal-tabs">
            {docs.map((d) => (
              <a key={d.slug} href={href(`/${d.slug}`)} aria-current={d.slug === doc.slug ? "page" : undefined}>
                {d.tabLabel}
              </a>
            ))}
          </nav>
          {lang === "en" && (
            <p className="b-legal-notice" role="note">
              {t("legal.notice")}
            </p>
          )}
          <p>{doc.intro}</p>
          {doc.sections.map((s, i) => (
            <section key={i}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {s.items.length > 0 && (
                <ul>
                  {s.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
