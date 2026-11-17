"use client";

import { createContext, useContext, useMemo } from "react";
import { type I18n, makeI18n } from "@/lib/i18n/i18n";
import { DEFAULT_LANG, type Lang } from "@/lib/i18n/languages";

const LanguageContext = createContext<I18n>(makeI18n(DEFAULT_LANG));

/** The page's language comes from its URL (set by the root layout of /… or /en/…), so the static HTML is already right. */
export function LanguageProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const value = useMemo(() => makeI18n(lang), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
