import { PageChrome } from "@/components/layout/PageChrome";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Reviews } from "@/components/sections/Reviews";
import { Knowledge } from "@/components/sections/Knowledge";
import { Contact } from "@/components/sections/Contact";
import { FaqJsonLd, OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content/localized";
import type { Lang } from "@/lib/i18n/languages";
import { pageMetadata } from "@/lib/seo";

export const homeMetadata = (lang: Lang) => {
  const { site } = getContent(lang);
  return pageMetadata({ lang, path: "/", title: site.title, description: site.description });
};

/**
 * Page order follows the visitor's questions: what do you do and can I trust you (Hero),
 * what exactly do you offer (Services; "נשמע מוכר?" lives on each service page, removed from home by Dan 2026-11-10), what happens if I call (Process),
 * who are you (About), what do others say (Reviews), my remaining questions (Knowledge), and how to start (Contact).
 */
export function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <OrganizationJsonLd lang={lang} />
      <WebsiteJsonLd lang={lang} />
      <FaqJsonLd lang={lang} />
      <PageChrome lang={lang} variant="home">
        <main id="top">
          <span id="main" tabIndex={-1} />
          <Hero lang={lang} />
          <Services lang={lang} />
          <Process lang={lang} />
          <About lang={lang} />
          <Reviews lang={lang} />
          <Knowledge lang={lang} />
          <Contact lang={lang} />
        </main>
      </PageChrome>
    </>
  );
}
