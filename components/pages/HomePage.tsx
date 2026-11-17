import { UtilityBar } from "@/components/layout/UtilityBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { HashLinkController } from "@/components/layout/HashLinkController";
import { ScrollStepper } from "@/components/layout/ScrollStepper";
import { ActiveSectionProvider } from "@/components/layout/ActiveSection";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Reviews } from "@/components/sections/Reviews";
import { Knowledge } from "@/components/sections/Knowledge";
import { Contact } from "@/components/sections/Contact";
import { AboutModal } from "@/components/about/AboutModal";
import { LeadPopup } from "@/components/lead/LeadPopup";
import { FaqJsonLd, OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import { site, siteEn } from "@/content/site";
import { pick, type Lang } from "@/lib/i18n/languages";
import { pageMetadata } from "@/lib/seo";

export const homeMetadata = (lang: Lang) =>
  pageMetadata({ lang, path: "/", title: pick(lang, site.title, siteEn.title), description: pick(lang, site.description, siteEn.description) });

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
      <UtilityBar />
      <ActiveSectionProvider>
        <Header />
        <main id="top">
          <span id="main" tabIndex={-1} />
          <Hero />
          <Services />
          <Process />
          <About />
          <Reviews />
          <Knowledge />
          <Contact />
        </main>
        <ScrollStepper />
      </ActiveSectionProvider>
      <Footer />
      <AboutModal />
      <LeadPopup />
      <FloatingWhatsApp />
      <HashLinkController />
    </>
  );
}
