"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { type DictKey, translate } from "@/content/dictionary";
import { DEFAULT_LANG, type Lang, localePath } from "@/lib/i18n/languages";

type Vars = Record<string, string | number>;
type LanguageState = {
  lang: Lang;
  t: (key: DictKey, vars?: Vars) => string;
  /** A site path in the page's language: "/insurance" → "/en/insurance" on English pages. */
  href: (path: string) => string;
};

const LanguageContext = createContext<LanguageState>({
  lang: DEFAULT_LANG,
  t: (key, vars) => translate(DEFAULT_LANG, key, vars),
  href: (path) => path,
});

/** The page's language comes from its URL (set by the root layout of /… or /en/…), so the static HTML is already right. */
export function LanguageProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = useCallback((key: DictKey, vars?: Vars) => translate(lang, key, vars), [lang]);
  const href = useCallback((path: string) => localePath(lang, path), [lang]);
  const value = useMemo(() => ({ lang, t, href }), [lang, t, href]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
