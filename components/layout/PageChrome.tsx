import type { Lang } from "@/lib/i18n/languages";
import { UtilityBar } from "./UtilityBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { HashLinkController } from "./HashLinkController";
import { ScrollStepper } from "./ScrollStepper";
import { ActiveSectionProvider } from "./ActiveSection";
import { AboutModal } from "@/components/about/AboutModal";
import { LeadPopup } from "@/components/lead/LeadPopup";

/** The chrome around every page: bars, header, footer and the floating parts. The home page also gets the scroll-spy and stepper. */
export function PageChrome({
  lang,
  variant,
  children,
}: {
  lang: Lang;
  variant: "home" | "service" | "legal";
  children: React.ReactNode;
}) {
  const home = variant === "home";
  const header = <Header home={home} contactHref={variant === "service" ? "#contact" : undefined} />;
  return (
    <>
      <UtilityBar lang={lang} />
      {home ? (
        <ActiveSectionProvider>
          {header}
          {children}
          <ScrollStepper />
        </ActiveSectionProvider>
      ) : (
        <>
          {header}
          {children}
        </>
      )}
      <Footer lang={lang} home={home} />
      {home && <AboutModal />}
      {variant !== "legal" && <LeadPopup />}
      <FloatingWhatsApp />
      {variant !== "legal" && <HashLinkController />}
    </>
  );
}
