export type Lang = "he" | "en";

/** Order in the switch. Hebrew is the default, English the second choice. */
export const LANGS: readonly Lang[] = ["he", "en"];
export const DEFAULT_LANG: Lang = "he";
export const LANG_STORAGE_KEY = "baloul-lang-v1";

/** A stored value back to a language. Anything unknown is Hebrew. */
export function parseLang(raw: string | null): Lang {
  return raw === "en" ? "en" : DEFAULT_LANG;
}

export function dirOf(lang: Lang): "rtl" | "ltr" {
  return lang === "he" ? "rtl" : "ltr";
}

/** Hebrew lives at the root (/, /insurance), English under /en (/en, /en/insurance). */
export function localePath(lang: Lang, path: string): string {
  if (lang === "he") return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/** The page's path without the language prefix: /en/insurance → /insurance, /en → /. */
export function basePath(pathname: string): string {
  if (pathname === "/en" || pathname === "/en/") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
}

/**
 * Runs in <head> of Hebrew pages before paint: a visitor who chose English lands on /en when opening the home page.
 * Only the bare home URL, and only with a stored choice, so crawlers (no storage) and explicit links are never redirected.
 */
export const homeRedirectScript = `try{if(location.pathname==='/'&&localStorage.getItem('${LANG_STORAGE_KEY}')==='en'){location.replace('/en'+location.search+location.hash);}}catch(e){}`;

/** The value for a language, for content kept as a Hebrew/English pair. */
export const pick = <T>(lang: Lang, he: T, en: T): T => (lang === "en" ? en : he);
