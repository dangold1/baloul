/*
 * Stylesheet order: tokens and shared building blocks first, then one file per area.
 * Each component file only styles its own classes, so new files can be added at the end.
 */
import "./base.css";
import "./shared.css";
import "@/components/layout/UtilityBar.css";
import "@/components/layout/Header.css";
import "@/components/i18n/LanguageSwitch.css";
import "@/components/sections/Hero.css";
import "@/components/sections/Journey.css";
import "@/components/sections/Services.css";
import "@/components/sections/About.css";
import "@/components/sections/Reviews.css";
import "@/components/sections/Knowledge.css";
import "@/components/sections/Contact.css";
import "@/components/service/ServicePage.css";
import "@/components/layout/Footer.css";
import "@/components/about/AboutModal.css";
import "@/components/legal/Legal.css";
import "@/components/lead/LeadPopup.css";
import "@/components/layout/FloatingWhatsApp.css";
import "@/components/layout/ScrollStepper.css";
import "@/components/consent/CookieConsent.css";
