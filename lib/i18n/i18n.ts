import { type DictKey, translate } from "../../content/dictionary.ts";
import { dirOf, type Lang, localePath } from "./languages.ts";

export type I18n = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
  /** A site path in the page's language: "/insurance" → "/en/insurance" on English pages. */
  href: (path: string) => string;
};

export function makeI18n(lang: Lang): I18n {
  return {
    lang,
    dir: dirOf(lang),
    t: (key, vars) => translate(lang, key, vars),
    href: (path) => localePath(lang, path),
  };
}
