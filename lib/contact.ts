import { translate } from "../content/dictionary.ts";
import { site } from "../content/site.ts";
import { greetingFor, whatsappUrl } from "./whatsapp.ts";
import type { Lang } from "./i18n/languages.ts";

export type ContactKind = "phone" | "whatsapp" | "email" | "address";

/** The link and visible text for one way of reaching the office, in the page's language. */
export function contactLink(kind: ContactKind, lang: Lang): { href: string; display: string; external: boolean } {
  switch (kind) {
    case "phone":
      return { href: site.phone.href, display: site.phone.display, external: false };
    case "whatsapp":
      return { href: whatsappUrl(greetingFor(lang)), display: site.whatsapp.display, external: true };
    case "email":
      return { href: `mailto:${site.email}`, display: site.email, external: false };
    case "address":
      return { href: site.address.mapsUrl, display: translate(lang, "footer.address"), external: true };
  }
}
