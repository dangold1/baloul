"use client";

import type { DictKey } from "@/content/dictionary";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Text from the dictionary in the visitor's language. Server components render it to stay server components. */
export function T({ k, vars }: { k: DictKey; vars?: Record<string, string | number> }) {
  return <>{useLanguage().t(k, vars)}</>;
}
