import { site } from "../content/site.ts";
import { topicLabel } from "../content/services.ts";
import type { Lang } from "./i18n/languages.ts";

/** Default greeting for the floating button and plain WhatsApp links. */
const GREETING: Record<Lang, string> = {
  he: "היי, הגעתי דרך אתר BALOUL ואשמח לקבל פרטים",
  en: "Hi, I found you through the BALOUL website and would like more details",
};
export const WHATSAPP_GREETING = GREETING.he;

const OPENER: Record<Lang, string> = { he: "היי, הגעתי מאתר BALOUL.", en: "Hi, I came from the BALOUL website." };

/** Opening line per topic (keyed by the Hebrew topic), so the conversation starts in the right context. */
const TOPIC_INTRO: Record<string, Record<Lang, string>> = {
  "תכנון פיננסי": { he: "אשמח לשיחה על תכנון פיננסי.", en: "I'd like to talk about financial planning." },
  "חיסכון והשקעות": { he: "אשמח לבדוק את החיסכון וההשקעות שלי.", en: "I'd like to review my savings and investments." },
  "פנסיה ופרישה": { he: "אשמח לבדוק את הפנסיה ותכנון הפרישה שלי.", en: "I'd like to review my pension and retirement plan." },
  "ביטוח וניהול סיכונים": { he: "אשמח לבדוק את מעטפת הביטוח שלי.", en: "I'd like to review my insurance coverage." },
  "משפחה / עסק": {
    he: "אשמח לשיחה על התמונה הפיננסית של המשפחה או העסק.",
    en: "I'd like to talk about my family's or business's financial picture.",
  },
  "התייעצות כללית": { he: "אשמח להתייעץ ולהבין מה נכון עבורי.", en: "I'd like some advice on what is right for me." },
};

/** The ready message for a topic chosen in the floating button's bubble. The visitor can still edit it before sending. */
export function topicMessage(topic: string, lang: Lang = "he"): string {
  const fallback = lang === "en" ? `I'd like to get in touch about ${topicLabel(topic, lang)}.` : `אשמח ליצור קשר בנושא ${topic}.`;
  return [OPENER[lang], TOPIC_INTRO[topic]?.[lang] ?? fallback].join(" ");
}

export function whatsappUrl(text: string = WHATSAPP_GREETING): string {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export const greetingFor = (lang: Lang) => GREETING[lang];

export type Lead = { name: string; phone: string; topic: string };

export function leadMessage({ name, phone, topic }: Lead, lang: Lang = "he"): string {
  const intro = TOPIC_INTRO[topic]?.[lang] ?? (lang === "en" ? "Please get back to me." : "אשמח שתחזרו אליי.");
  const [n, p, t] = lang === "en" ? ["Name", "Phone", "Topic"] : ["שם", "טלפון", "נושא"];
  return [OPENER[lang], intro, `${n}: ${name}`, `${p}: ${phone}`, `${t}: ${topicLabel(topic, lang)}`].join("\n");
}

/**
 * Opens WhatsApp with the lead details. On phones the same tab hands off to
 * the app directly; on desktop a new tab keeps the site open behind it.
 * Must be called synchronously inside the click/submit handler, or browsers block it.
 */
export function openWhatsApp(text: string): void {
  const url = whatsappUrl(text);
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
    return;
  }
  const win = window.open(url, "_blank", "noopener");
  if (!win) window.location.href = url;
}
