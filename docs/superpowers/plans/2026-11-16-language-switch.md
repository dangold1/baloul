# Language Switch (Hebrew / English) Implementation Plan

> **Note (2026-11-17):** Shipped as per-URL routes; see code. Hebrew at `/…`, English at `/en/…` (`app/(he)`, `app/(en)/en`); localStorage only remembers the choice for a redirect from `/`. Conventions: `AGENTS.md` → Components.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A visitor can switch the site chrome between Hebrew (default) and English from the top nav. The choice is kept in localStorage and restored on the next visit.

**Architecture:** There are three separate pieces, each in its own file:
1. **Storage:** a generic `useLocalStorage` hook built on `useSyncExternalStore`. It is SSR-safe, stays in sync across tabs and within the same tab, and never causes a hydration mismatch.
2. **Dictionary:** a plain data module. Hebrew is the source of truth. English uses the same keys, and an empty value falls back to Hebrew.
3. **Typography:** a `<T k="..."/>` component that renders a dictionary entry for the current language. A `LanguageProvider` connects these pieces and sets `<html lang dir>`. A bootstrap script in `<head>` sets `lang` and `dir` before first paint, the same way `lib/consent.ts` does.

**Tech Stack:** Next.js 16.4.4 (static export), React 19.3.1, TypeScript, CSS per component, `node --test` (Node 22.23, runs `.ts` natively), Playwright against `out/`.

**Spec:** Dan's request of 2026-11-16, plus his answers to the scoping questions:
- Language is stored in localStorage. The default is Hebrew and the second choice is English. The switch sits in the nav bar at the top.
- Typography and the dictionary are separate components.
- A `useLocalStorage` hook holds the state correctly.
- Scope: build the whole system, but translate only the chrome (utility bar, header/nav, services menu, mobile menu, footer, skip link). Sections, popups and sub-page bodies stay Hebrew for a later plan.
- English copy: Dan supplies it. The plan ships the English dictionary with empty strings that fall back to Hebrew.
- English flips the layout to `dir="ltr"`. The switch sits in the header nav next to "צור קשר" and also in the mobile menu.

## Global Constraints

- Languages: `"he" | "en"`. The default is `"he"`. The storage key is `baloul-lang-v1`, matching the `baloul-consent-v1` convention.
- `he` uses `dir="rtl"` and `en` uses `dir="ltr"`. A missing, unknown or corrupt stored value means `"he"`.
- Modules imported by unit tests (`lib/i18n/*.ts`, `lib/storage.ts`, `content/dictionary.ts`) must use **relative** or **type-only** imports. Node cannot resolve `@/`. See `lib/steps.ts` for the pattern.
- `useLocalStorage` is limited to primitive values (`string | number | boolean`). `getSnapshot` must return a value that is stable under `Object.is`, otherwise React loops.
- Every localStorage access goes through try/catch, because private mode throws. On failure the in-memory value still updates for the current page view.
- Untranslated regions keep `lang="he" dir="rtl"` explicitly, so Hebrew text never renders in an LTR flow.
- SEO metadata, JSON-LD, sitemap and URLs stay Hebrew and unchanged. There are no `/en` routes.
- No new dependencies.
- No git in this project. A "commit" step means `npm run lint && npm run test:unit` pass. Then copy the touched files into `_archive/` only if Dan asks.
- `npm run lint`, `npm run build` and `npm run test:e2e` all pass at the end of every task.

## Review Focus

1. **Returning English visitor on a slow device:** the static HTML is Hebrew RTL, but layout direction must not flash. The bootstrap script sets `dir="ltr"` before paint. Text may show Hebrew for one frame until hydration, which is accepted. Tested in Task 4 (`no rtl frame for stored en`).
2. **localStorage blocked** (Safari private mode, storage disabled): the switch still works for the page view and nothing throws. Tested in Task 1 (`read survives throwing storage`, `write survives throwing storage`) and Task 4 (`switch works with storage blocked`).
3. **Two tabs open:** switching in one tab updates the other through the `storage` event. Tested in Task 4 (`other tab follows`).
4. **English is still empty:** choosing EN must never show blank labels. Tested in Task 2 (`empty en falls back to he`) and Task 4 (`en has no empty links`).
5. **Untranslated Hebrew sections in English mode:** they keep RTL alignment. Tested in Task 4 (`main stays rtl in en`).

---

### Task 1: Storage primitive and `useLocalStorage` hook

**Files:**
- Create: `lib/storage.ts` (pure, testable in Node)
- Create: `lib/useLocalStorage.ts` (client hook)
- Test: `tests/unit/storage.test.mjs`

**Interfaces:**
- Produces:
  - `lib/storage.ts`:
    - `type Primitive = string | number | boolean`
    - `readStorage<T extends Primitive>(storage: Pick<Storage, "getItem"> | undefined, key: string, parse: (raw: string | null) => T): T`. Calls `parse(null)` when storage is undefined or throws.
    - `writeStorage(storage: Pick<Storage, "setItem"> | undefined, key: string, value: string): boolean`. Returns false when storage is undefined or throws.
    - `STORAGE_EVENT = "baloul:storage"`. This is a same-tab change event on `window`, with `detail: { key }`.
  - `lib/useLocalStorage.ts`:
    - `useLocalStorage<T extends Primitive>(key: string, parse: (raw: string | null) => T, serverValue: T): [T, (next: T) => void]`

- [ ] **Step 1: Write the failing tests** in `tests/unit/storage.test.mjs`. Use a fake storage built on a `Map`.
  - `read returns parsed value`: stored `"en"`, parse `(r) => r === "en" ? "en" : "he"`. Expect `"en"`.
  - `read missing key`: expect `parse(null)`, which is `"he"`.
  - `read survives throwing storage`: `getItem` throws. Expect `"he"`.
  - `read without storage`: `storage` is `undefined`. Expect `"he"`.
  - `write stores string`: `writeStorage(fake, "k", "en")` returns `true` and the fake now holds `"en"`.
  - `write survives throwing storage`: `setItem` throws. Returns `false` and does not throw.
- [ ] **Step 2:** Run `node --test tests/unit/storage.test.mjs`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement `lib/storage.ts`.**
- [ ] **Step 4: Implement `useLocalStorage`** using `useSyncExternalStore`:
  - `subscribe`: listen to `window` `storage` (other tabs) and `STORAGE_EVENT` (this tab). Filter on `key`.
  - `getSnapshot`: `readStorage(localStorage, key, parse)`.
  - `getServerSnapshot`: `() => serverValue`.
  - Setter: `writeStorage`, then dispatch `STORAGE_EVENT`.
  - If the write failed, keep the value in a module-level `Map<key, T>` override that `getSnapshot` prefers, so the UI still changes in private mode. Wrap the setter in `useCallback`.
- [ ] **Step 5:** Run `node --test tests/unit/storage.test.mjs`. Expected: PASS. Then run `npm run lint`. Expected: no errors.

---

### Task 2: Languages and dictionary

**Files:**
- Create: `lib/i18n/languages.ts`
- Create: `content/dictionary.ts`
- Test: `tests/unit/i18n.test.mjs`
- Modify: `package.json` so `test:unit` stays `node --test tests/unit/*.test.mjs`. The glob already picks up the new files, so just verify.

**Interfaces:**
- Produces:
  - `lib/i18n/languages.ts`:
    - `type Lang = "he" | "en"`
    - `LANGS: readonly Lang[] = ["he", "en"]`
    - `DEFAULT_LANG: Lang = "he"`
    - `LANG_STORAGE_KEY = "baloul-lang-v1"`
    - `parseLang(raw: string | null): Lang`
    - `dirOf(lang: Lang): "rtl" | "ltr"`
    - `langBootstrapScript: string`. This is an inline script that reads the key in try/catch and, if the value is `"en"`, sets `document.documentElement.lang="en"` and `dir="ltr"`.
  - `content/dictionary.ts`:
    - `he` is a flat `const` object of string entries, with keys namespaced by region: `skip.*`, `utility.*`, `nav.*`, `menu.*`, `footer.*`, `lang.*`.
    - `type DictKey = keyof typeof he`
    - `en: Record<DictKey, string>` (all `""` for now)
    - `translate(lang: Lang, key: DictKey, vars?: Record<string, string | number>): string`. This replaces `{name}` placeholders. If `lang === "en"` and the entry is `""`, it uses `he`.
- Dictionary entries (Hebrew copied verbatim from the current components):
  - `skip.main`: "דילוג לתוכן הראשי"
  - `utility.since`: "פעילות מקצועית מאז {year} • {city}". Note that `site.address.city` stays Hebrew content, so in EN pass `city` from a `utility.city` key with value "חולון".
  - Every label in `components/layout/nav.ts` (`nav.home`, `nav.services`, `nav.process`, `nav.about`, `nav.reviews`, `nav.knowledge`, `nav.contact`).
  - The four service nav labels (`nav.service-pension`, `nav.service-insurance`, `nav.service-savings`, `nav.service-financial`), keyed by `services[].id`.
  - `menu.open` ("פתיחת תפריט ניווט"), `menu.text` ("תפריט"), `menu.mainLabel` ("ניווט ראשי"), `menu.mobileLabel` ("ניווט מובייל").
  - `brand.homeLabel` ("BALOUL עמוד הבית") and `brand.logoAlt`.
  - The footer: about text with `{founded}` and `{agency}`, the four column titles, "מרכז ידע", the mail aria label, "טלפון:", the copyright line, "הגדרות עוגיות", and one `footer.legal.<slug>` per entry of `legalDocs`.
  - `lang.switchLabel` ("שפה"), `lang.he` ("עברית"), `lang.en` ("English"). The switch labels are filled in **both** dictionaries; they are the only non-empty `en` values.

- [ ] **Step 1: Write the failing tests** in `tests/unit/i18n.test.mjs`:
  - `parseLang`: `"en"` → `"en"`, `"he"` → `"he"`, `null` → `"he"`, `"fr"` → `"he"`, `"EN"` → `"he"`.
  - `dirOf`: `he` → `"rtl"`, `en` → `"ltr"`.
  - `empty en falls back to he`: `translate("en", "nav.process")` equals `he["nav.process"]`.
  - `en value wins when set`: `translate("en", "lang.he")` equals `"עברית"` and `translate("en", "lang.en")` equals `"English"`.
  - `vars interpolate`: `translate("he", "utility.since", { year: 2003, city: "חולון" })` contains `"2003"` and has no `{`.
  - `dictionaries have the same keys`: `Object.keys(en).sort()` deep-equals `Object.keys(he).sort()`.
  - `bootstrap script runs`: run `langBootstrapScript` with `new Function` against a fake `localStorage`/`document`. With `"en"` stored, `lang` becomes `"en"` and `dir` becomes `"ltr"`. With a throwing storage, nothing changes.
- [ ] **Step 2:** Run `node --test tests/unit/i18n.test.mjs`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement both modules.** `content/dictionary.ts` imports `Lang` with `import type` only.
- [ ] **Step 4:** Run `npm run test:unit`. Expected: all pass, including the existing `steps.test.mjs`. Then run `npm run lint`.

---

### Task 3: Language provider, Typography, switch, and chrome migration

**Files:**
- Create: `components/i18n/LanguageProvider.tsx` (client)
- Create: `components/ui/Typography.tsx` (client)
- Create: `components/i18n/LanguageSwitch.tsx` + `components/i18n/LanguageSwitch.css` (import it in `styles/index.ts` the same way the existing component CSS is imported)
- Modify:
  - `app/layout.tsx`: add the bootstrap script, the provider, `suppressHydrationWarning` on `<html>`, and render the skip link through `T`.
  - `components/layout/nav.ts`: `label` becomes `labelKey: DictKey`.
  - `Header.tsx`, `UtilityBar.tsx`, `ServicesMenu.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `components/consent/CookieSettingsLink.tsx`
  - `Header.css`, `UtilityBar.css`, `Footer.css`: switch from physical to logical properties.
  - `app/page.tsx`, `app/[slug]/page.tsx`, `app/not-found.tsx`: add `lang="he" dir="rtl"` to `<main>`.
  - `components/about/AboutModal.tsx`, `components/lead/LeadPopup.tsx`, `components/consent/CookieConsent.tsx`, `components/layout/ScrollStepper.tsx`: add `lang="he" dir="rtl"` to each root element.

**Interfaces:**
- Consumes:
  - `useLocalStorage` (Task 1)
  - `Lang`, `parseLang`, `dirOf`, `DEFAULT_LANG`, `LANG_STORAGE_KEY`, `langBootstrapScript` (Task 2)
  - `DictKey`, `translate` (Task 2)
- Produces:
  - `LanguageProvider({ children })`
  - `useLanguage(): { lang: Lang; setLang: (l: Lang) => void; t: (key: DictKey, vars?: Record<string, string | number>) => string }`
  - `T({ k, vars }: { k: DictKey; vars?: Record<string, string | number> })`. Renders the translated string as a fragment.
  - `LanguageSwitch({ className }: { className?: string })`

- [ ] **Step 1: Implement `LanguageProvider`.**
  - Call `useLocalStorage(LANG_STORAGE_KEY, parseLang, DEFAULT_LANG)`.
  - Use `useEffect` on `lang` to set `document.documentElement.lang` and `.dir`.
  - Memoize `t` with `useCallback` and memoize the context value.
- [ ] **Step 2: Implement `T` and `LanguageSwitch`.**
  - `T` returns `t(k, vars)`. It is the only component that turns keys into text. Server components such as `Header` and `Footer` render `<T k=.../>`, which keeps them server components.
  - `LanguageSwitch` renders `<div role="group" aria-label={t("lang.switchLabel")}>` with one `<button type="button" lang={l} aria-pressed={lang === l}>` per entry of `LANGS`, labelled `t("lang." + l)`.
  - Style it with the existing tokens only (`--navy`, `--line`, `--bronze`, `--radius-sm`, `--t`).
- [ ] **Step 3: Migrate the chrome.** Replace every Hebrew literal in the files listed above with `<T k=.../>`. For attribute strings (`aria-label`, `alt`), use `useLanguage().t`. A server component that needs a translated attribute becomes a small client wrapper or moves that element into a client child; keep that minimal.
  - Put `<LanguageSwitch className="b-lang" />` in `Header` between `</nav>` and the "צור קשר" `NavLink`.
  - Put a second `LanguageSwitch` at the bottom of the mobile menu `<nav>`, before the CTA.
  - `ServicesMenu` and `MobileMenu` get each service label through `nav.<service id>`.
  - In the footer, the services column uses the same `nav.<service id>` keys, and the legal links use `footer.legal.<slug>`.
- [ ] **Step 4: Convert physical CSS to logical CSS** in the three chrome CSS files:
  - `margin-left` → `margin-inline-start`
  - `padding-right` → `padding-inline-start`
  - `right` / `left` → `inset-inline-start` / `inset-inline-end`
  - `transform-origin: right` → `transform-origin: var(--start)`, with `--start: right` on `[dir=rtl]` and `left` on `[dir=ltr]`
  - The inset box-shadow `-3px` → mirror it under `:root[dir="ltr"]`
  - The chevron's `border-right` → `border-inline-end`

  Leave `ScrollStepper.css` and the section CSS untouched (they stay RTL via `dir` on their roots).
- [ ] **Step 5:** Run `npm run lint && npm run build`. Expected: both pass. Then run `grep -rnP "[\x{0590}-\x{05FF}]" components/layout/Header.tsx components/layout/UtilityBar.tsx components/layout/ServicesMenu.tsx components/layout/MobileMenu.tsx components/layout/Footer.tsx components/layout/nav.ts components/consent/CookieSettingsLink.tsx`. Expected: no output (all Hebrew now lives in the dictionary).
- [ ] **Step 6:** Run `npm run test:e2e`. Expected: all existing e2e tests still pass. Hebrew is the default, so selectors and copy are unchanged.

---

### Task 4: End-to-end language checks

**Files:**
- Create: `tests/e2e/language.test.js` (port `4334`, same structure as `tests/e2e/hover.test.js`: `serve("out", PORT)`, consent preset to `denied`, lead popup suppressed)
- Modify: `package.json`, appending `&& node tests/e2e/language.test.js` to `test:e2e`

**Interfaces:**
- Consumes: the DOM produced by Task 3. Selectors:
  - `.b-lang button[lang="en"]` and `.b-lang button[lang="he"]`
  - `html[lang][dir]`
  - `.b-links a`, `main`
  - storage key `baloul-lang-v1`

- [ ] **Step 1: Write the tests.** Each one is a `step = "..."` block, as in `hover.test.js`.
  - `default is hebrew`: with empty storage, `html` has `lang="he"`, `dir="rtl"`, and the HE button has `aria-pressed="true"`.
  - `switch to english persists`:
    - Click EN. Expect `html` to have `lang="en"`, `dir="ltr"`, and `localStorage["baloul-lang-v1"] === "en"`.
    - Reload. `html` is still `en`/`ltr`, and the EN button has `aria-pressed="true"`.
  - `no rtl frame for stored en`: in a fresh context, use `addInitScript` to set `"en"` before load. Read `document.documentElement.dir` on `domcontentloaded`, before hydration. Expect `"ltr"`.
  - `switch back to hebrew`: click HE. Expect `rtl`, and storage `"he"`.
  - `en has no empty links`: in EN, every `.b-links a`, `.b-utility a` and `.b-footer a` has non-empty `textContent.trim()`, or else an `aria-label`.
  - `main stays rtl in en`: in EN, `getComputedStyle(main).direction === "rtl"`.
  - `other tab follows`: open two pages in one context and click EN in page A. Page B's `html` becomes `lang="en"` within 1000ms.
  - `switch works with storage blocked`: in a context whose init script makes `Storage.prototype.setItem` throw, click EN. `html` becomes `en`/`ltr`, and there are no `pageerror` entries.
  - `mobile menu has the switch`: at a 390px viewport, open `#bMobileMenu` and expect `.b-mobile .b-lang button[lang="en"]` to be visible.
  - `no hydration errors`: the collected `errs` array (console errors plus page errors) is empty after all steps.
- [ ] **Step 2:** Run `npm run build && node tests/e2e/language.test.js`. Expected: PASS. Any failure points back to Task 3, so fix it there.
- [ ] **Step 3:** Run `npm run test:e2e`. Expected: the full suite passes, including unit tests.
