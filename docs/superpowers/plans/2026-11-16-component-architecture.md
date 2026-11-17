# Component Architecture Redesign Implementation Plan (v2, after per-URL languages)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> On approval, overwrite `landing_page/docs/superpowers/plans/2026-11-16-component-architecture.md` with this file. That file holds v1, which is now out of date.

**Goal:** Every piece of UI exists once. Static content renders on the server in the page's language, and only interactive parts ship JS. Adding a section, a service or an overlay is a one-place edit.

**Architecture:** Each page URL now has a fixed language (`/…` Hebrew, `/en/…` English).
- **Pages pass `lang` down as a prop.** Static blocks are **server components** that get their text from `makeI18n(lang)` and their data from `getContent(lang)`.
- **Interactive islands stay client components** and read the same `I18n` object from context through `useLanguage()`. The islands are the menus, dialogs, scroll-spy `Section`, forms, LanguageSwitch and FloatingWhatsApp.
- **Four layers:**
  1. `ui/` language-agnostic primitives that take strings as props.
  2. `blocks/` server, `{ lang }`.
  3. `sections/` and `service/` regions.
  4. `pages/` + `app/`.
- **Cross-cutting behaviour moves to:** `useDismiss`, the `Dialog` component, `lib/dom.ts` selectors, and the `base.css` tokens.

**Tech Stack:** Next.js 16.4.6 (`output: "export"`, two root layouts `app/(he)` and `app/(en)/en`), React 19.3.1, TypeScript strict, plain CSS with `b-` classes (registered in `styles/index.ts`), `node --test`, Playwright scripts against `out/`.

**Spec:** Dan's request of 2026-11-16 ("use components best practice to make adding and changing things easier"), plus his answers:
- Scope: all four layers (primitives, shared blocks, structure, CSS tokens).
- Copy goes into the dictionary. This is mostly done already by the language work.
- `git init` and commits.
- 2026-11-17, "language support finished, consider redesign": **server blocks + lang prop**, with client context only for interactive parts.

**Current state (audit of 2026-11-17):**
- Almost every component is `"use client"` only so it can call `useLanguage()`.
- `ServicePage.tsx` (221 lines) still hand-copies Hero, Process, Knowledge, Reviews, Contact and DomainNav.
- Other duplicates still present:
  - stars ×4, CTA ×3, call line ×2
  - contact-link building ×6
  - modal shell ×2, lead fields ×2
  - outside-click/Escape handlers ×6 (now including `LanguageSwitch`)
  - logo ×2
  - chrome repeated 3× across `pages/HomePage.tsx` and `pages/SubPage.tsx`
- DOM-selector coupling remains, and raw colours remain.
- `SiteShell` already exists as the `<html>` shell. It stays as it is.
- Playwright is missing and there is no git repo.

## Target Component Map

How a page is put together after the redesign. s = server component, c = client component, **bold** = new. The task that delivers each item is in brackets.

```
app/(he)/…  and  app/(en)/en/…        routes: only pass lang
└─ SiteShell(lang)                    <html>, consent, analytics          [s, exists]
   └─ pages/HomePage(lang) | SubPage(lang, slug)                          [s]
      └─ layout/PageChrome(lang, variant)                                  [s, T8]
         ├─ UtilityBar  Header  Footer  FloatingWhatsApp  LeadPopup  AboutModal
         └─ <main> regions (sections/ or service/)
               └─ blocks/  →  ui/
```

| Folder | Components | Role |
|---|---|---|
| `pages/` | HomePage (s), SubPage (s, gets `lang` [T7]) | Chooses which regions a page shows |
| `layout/` | SiteShell (s), **PageChrome** (s) [T8], UtilityBar (s) [T8], Footer (s) [T8], Header (c), MobileMenu (c), ServicesMenu (c), NavLink (c), FloatingWhatsApp (c), ScrollStepper (c), HashLinkController (c), ActiveSection (c, provider and hooks only), **Section / StepRegion** (c, split out) [T8] | The site frame and its interactive parts |
| `sections/` | Hero, Services, ServiceCard, Process, About, Reviews, Knowledge, Contact. All become server components [T6]. | Home regions: the `Section` wrapper plus blocks |
| `service/` | ServicePage (s, 70 lines or fewer), **ServiceHero**, **ServiceSituations**, **ServiceChecks** (s) [T7] | Service-page regions |
| `legal/` | LegalPage, which becomes a server component [T7] | The legal page |
| `blocks/` | **StepsList, FaqList, ReviewCard, GoogleReviewsLink, CallLine, ContactLinks, ContactBlock, ServiceLinks** (all s) [T6] | Content shared by the home and service pages |
| `ui/` | **ButtonLink, Stars, Logo** (s) [T3], **Dialog** (c) [T4], Icons, ServiceEmblem, SectionHeading, Typography | Primitives that don't depend on the language |
| `lead/` | ContactForm (c), **LeadFields** (c) [T5], LeadPopup (c, uses Dialog) [T4], Honeypot, useLeadSubmit | Forms |
| `about/`, `consent/`, `analytics/`, `i18n/`, `seo/` | Unchanged, except that they now use `Dialog` and `useDismiss` [T4] | |
| `lib/`, `content/` | **cx**, **dom** [T2], **contact** [T3], **useDismiss** [T4], **i18n/makeI18n**, **content/localized (getContent)** [T1] | Shared helpers |

Where each shared block is used:

| Block | Home page | Service page |
|---|---|---|
| StepsList | Process | "How we work" region |
| FaqList | Knowledge | Service FAQ |
| ReviewCard + Stars | Reviews | Single review |
| ContactBlock + ContactLinks | Contact | Contact region |
| CallLine + ButtonLink | Hero | ServiceHero |
| ServiceLinks | — | "Other services" |

## Global Constraints

- Code is the source of truth for i18n. The language-switch plan's unticked boxes are stale, so ignore them.
- **Server/client rule:**
  - A file gets `"use client"` only if it uses state, effects, refs, event handlers or browser APIs.
  - Server components take `lang: Lang` as a prop and never call `useLanguage()`.
  - Client components never receive functions (such as `t`) as props from server components. They receive strings or call `useLanguage()` themselves.
- **Import direction:** `ui/` ← `blocks/` ← `sections/`, `service/`, `layout/` ← `pages/` ← `app/`.
  - `ui/` imports nothing from `content/` and nothing from `i18n`.
  - Blocks take data from `getContent(lang)` or from props, and never from raw `content/*` lists plus `pick`.
- **Section ownership:** blocks never render `<section>` or `id`. The wrapper owns them (`Section` on home, a plain `<section>` on the service page).
- **Internal links:** always `href(path)` / `localePath(lang, path)`, never a bare `"/x"`.
- **Dictionary:** new keys need both `he` and `en` values, because the unit test `every en entry is filled` enforces it. List the new English strings in the commit body for Dan.
- **Snapshot:** the static export's `<body>` markup (scripts stripped) for **every page in `out/` and `out/en/`** stays unchanged, unless a task declares an intentional change. In that case, show the diff and rerun with `UPDATE=1`.
- **Unit-test imports:** modules imported by unit tests use relative or type-only imports (see `lib/steps.ts`).
- **Class names:** keep the `b-` names and join them with `cx()`.
- **No new runtime dependencies.** The only new dev dependency is `playwright`.
- **Out of scope:** `app/global-not-found.tsx`. It sits outside both layouts, is bilingual by design, and stays as it is.
- **Gate at the end of every task:**
  ```bash
  npm run lint && npm run test:unit && npm run build && npm run test:markup && npm run test:e2e
  ```
  Then commit.
- **Phases:** stop and show Dan the results after Phase A (Tasks 0–5), Phase B (Tasks 6–7) and Phase C (Tasks 8–10).

## Review Focus

1. **English pages leaking Hebrew after a block moves to the server.**
   - Risk: a server block that forgets `lang` (or defaults to `"he"`) renders Hebrew on `/en/…`.
   - Expected: no Hebrew characters anywhere in `out/en/**` `<body>` text, except the allowlisted `עברית` label in LanguageSwitch.
   - Test: `en pages contain no hebrew`, added in Task 0 to `tests/markup/markup.test.mjs` and kept green from then on.
2. **Interactivity lost at the server/client boundary.**
   - Section click-to-activate, scroll-spy, the stepper and hover must keep working when section bodies become server children of the client `Section`.
   - Covered by the existing `active-section`, `stepper` and `hover` e2e tests, run in every task's gate. Task 6 also adds `active-section works on /en`.
3. **`#contact` on both page types and both languages.**
   - The hero CTA must reach the form on `/`, `/en`, `/pension` and `/en/pension`.
   - Test: `cta reaches contact form`, added in Task 6 (home) and Task 7 (service).
4. **Stacked overlays, Escape and focus.**
   - The lead popup must not open while another dialog is open.
   - Escape closes only the top overlay, and focus returns to the element that opened it.
   - Tests: `lead popup waits for open dialog` and `escape closes top dialog and restores focus`, in Task 4.
5. **FAQ grouping.**
   - Only one item is open at a time per list (`name="knowledge"` on home, `"service-faq"` on service pages).
   - Test: `faq keeps one open`, in Task 6.

---

## Phase A: foundation

### Task 0: Baseline (git, Playwright, markup snapshot, metrics)

**Files:**
- Create: `tests/markup/markup.test.mjs`, `tests/markup/snapshots/**` (generated)
- Modify: `package.json` (add a `test:markup` script and the `playwright` dev dependency), `.gitignore` (`out/`, `.next/`, `node_modules/`, `tsconfig.tsbuildinfo`)

**Interfaces:**
- Produces: `normalize(html: string): string`. It keeps the `<body>` inner HTML, strips `<script>…</script>` and `<!-- -->`, and collapses the whitespace between tags.
- Produces: `npm run test:markup`, which runs one test per `out/**/*.html` file (skipping Finder copies that match `/ \d+\.html$/`) and compares it against `tests/markup/snapshots/<same path>`. `UPDATE=1` rewrites the snapshots. If `out/` is missing, it fails with `run npm run build first`.
- Produces: the test `en pages contain no hebrew`. For every `out/en/**/*.html`, it takes the normalized body text with tags stripped, removes the allowlist `["עברית"]`, and asserts no match for `/[֐-׿]/`. On failure it reports the page and a 40-character excerpt.

- [ ] **Step 1:** Run `cd landing_page && git init && git add -A && git commit -m "chore: baseline before component redesign"`.
- [ ] **Step 2:** Run `npm i -D playwright && npx playwright install chromium`. Then run `npm run build && npm run test:e2e`. Expected: PASS. If it fails, stop and report the failure. This is the baseline, so don't fix anything at this point.
- [ ] **Step 3:** Write `markup.test.mjs`. Then run `UPDATE=1 npm run test:markup` followed by `npm run test:markup`. Expected: PASS for the he and en pages: home, 4 services and the legal pages each.
- [ ] **Step 4:** If `en pages contain no hebrew` fails now, add each current leak to the allowlist with a `// TODO Task N` comment that names the task that removes it. Expected leaks: the Honeypot label and the Footer logo alt.
- [ ] **Step 5:** Record the metrics in the commit body:
  - `grep -rl '"use client"' components | wc -l`
  - `du -sk out/_next/static/chunks`
  - `wc -l components/**/*.tsx | tail -1`
- [ ] **Step 6:** Commit `test: playwright, markup snapshot (he+en), metrics baseline`.

### Task 1: Server i18n core (`makeI18n`, `getContent`)

**Files:**
- Create: `lib/i18n/i18n.ts`, `content/localized.ts`, `tests/unit/content.test.mjs`
- Modify:
  - `components/i18n/LanguageProvider.tsx`: the value becomes `useMemo(() => makeI18n(lang), [lang])`, the inline `t`/`href` are deleted, and the `useLanguage()` return shape stays the same.
  - `content/reviews.ts`: Hebrew `countLabel` becomes `"מעל 100 ביקורות ב־Google"`.
  - `components/service/ServicePage.tsx:76`: delete the `.replace` patch.

**Interfaces:**
- Produces in `lib/i18n/i18n.ts` (relative imports):
  - `type I18n = { lang: Lang; dir: "rtl" | "ltr"; t: (key: DictKey, vars?: Record<string, string | number>) => string; href: (path: string) => string }`
  - `makeI18n(lang: Lang): I18n`, built from `translate`, `localePath` and `dirOf`.
- Produces in `content/localized.ts` (relative imports):
  - `getContent(lang: Lang)`, which returns:
    ```ts
    {
      site, services: Service[], homeFaqs: Faq[], faqsFor(serviceId: string): Faq[],
      steps: Step[], situationsFor(serviceId: string): Situation[],
      reviews: Review[], googleRating: { score: string; countLabel: string },
      reviewForService(serviceId: string): Review, legalDocs: LegalDoc[],
    }
    ```
  - Every item is already localized (using `localizeService`, `localizeFaq`, `pick`, `situationsEn`, `legalDocsEn` and `siteEn`, which already exist).
  - `reviewForService(id)` returns `reviews[services.findIndex(s => s.id === id) % reviews.length]`.

- [ ] **Step 1:** Write the tests:
  - `makeI18n("en").href("/pension") === "/en/pension"`
  - `makeI18n("he").dir === "rtl"`
  - `makeI18n("en").t("nav.process") === "How we work"`
  - `getContent("en").services[0].title === servicesEn[services[0].id].title`
  - `getContent("en").faqsFor(services[0].id)` has no Hebrew in any question
  - `getContent("he").reviewForService(services[i].id)` deep-equals `reviews[i % reviews.length]` for every i
  - `getContent("he").googleRating.countLabel` includes `"ב־Google"`
- [ ] **Step 2:** Run `npm run test:unit`. Expected: FAIL, modules not found.
- [ ] **Step 3:** Implement both modules and change the provider.
- [ ] **Step 4:** Run the gate. **Intentional markup change:** the maqaf in the Google count label now also shows on the home page (previously only the service page patched it). Show the diff and update the snapshot.
- [ ] **Step 5:** Commit `feat: makeI18n and getContent for server components`.

### Task 2: `cx`, DOM constants, dead code

**Files:**
- Create: `lib/cx.ts`, `lib/dom.ts`, `tests/unit/cx.test.mjs`
- Modify:
  - `ActiveSection.tsx:101`, `ScrollStepper.tsx:32`, `LeadPopup.tsx:29,49`, `HashLinkController.tsx:12,26`, `lib/ui-events.ts:7`
  - the template classNames in `AboutModal.tsx:41`, `LeadPopup.tsx:91`, `CookieConsent.tsx:43`, `Icons.tsx:83`
- Delete:
  - `components/sections/DomainNav.tsx`
  - the dead `.b-solution-details` branch
  - `aboutInlineChips` / `aboutInlineChipsEn`, only if `grep` finds no consumer

**Interfaces:**
- Produces: `cx(...parts: Array<string | false | null | undefined>): string`.
- Produces:
  ```ts
  DOM = {
    site: ".site", header: ".b-header", reviews: "#reviews", mobileMenu: "#bMobileMenu",
    openDialog: ".b-modal.open, .b-consent[data-open='true']",
  } as const
  ```
  Task 4 changes `openDialog`.

- [ ] **Step 1:** Write the tests: `cx("a", false, null, undefined, "b") === "a b"`, `cx() === ""` and `cx("a", "") === "a"`. Run them. Expected: FAIL.
- [ ] **Step 2:** Implement both files, replace every literal, and delete the dead code. `grep -rnE "'(\.b-header|#reviews|#bMobileMenu)'|\"(\.b-header|#reviews|#bMobileMenu)\"" components lib` should match only `lib/dom.ts`.
- [ ] **Step 3:** Run the gate. Expected: markup unchanged.
- [ ] **Step 4:** Commit `refactor: cx, DOM selector constants, remove dead code`.

### Task 3: Language-agnostic UI primitives and `contactLink`

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/Stars.tsx`, `components/ui/Logo.tsx`, `lib/contact.ts`, `tests/unit/contact.test.mjs`
- Modify (swap in the primitives without changing client/server status yet):
  - `Hero.tsx`, `Process.tsx`, `Reviews.tsx`, `ServicePage.tsx` (buttons and stars)
  - `Header.tsx:25`, `Footer.tsx:24` (logo; Footer alt from `t("brand.logoAlt")`)
  - `Contact.tsx`, `Footer.tsx`, `UtilityBar.tsx`, `FloatingWhatsApp.tsx`, `Hero.tsx`, `ServicePage.tsx` (every phone, WhatsApp, mailto and maps href goes through `contactLink`)

**Interfaces:**
- Produces: `type ContactKind = "phone" | "whatsapp" | "email" | "address"` and `contactLink(kind: ContactKind, lang: Lang): { href: string; display: string; external: boolean }`. It's pure and uses `site`/`siteEn` and `whatsappUrl(greetingFor(lang))`.
- Produces `ButtonLink`, with signature:
  ```ts
  ButtonLink(props: { href: string; variant?: "primary" | "secondary"; className?: string; children: React.ReactNode }
    & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">)
  ```
  It renders `cx("b-btn", "b-btn-" + (variant ?? "primary"), className)`. It's a server-safe component with no hooks.
- Produces: `Stars({ label, as = "div", className = "b-stars" }: { label: string; as?: "div" | "span"; className?: string })`, which renders `role="img" aria-label={label}` around `★★★★★`. Hero uses `as="span" className="b-fact-stars"`.
- Produces: `Logo({ alt, className }: { alt: string; className?: string })`.

- [ ] **Step 1:** Write the tests:
  - `contactLink("phone","he").href === site.phone.href`
  - `contactLink("email","en").href.startsWith("mailto:")`
  - `contactLink("whatsapp","en")`: `external === true`, and the decoded href contains `greetingFor("en")`
  - `contactLink("address","he").href === site.address.mapsUrl`

  Run them. Expected: FAIL.
- [ ] **Step 2:** Implement the primitives and replace the duplicates.
- [ ] **Step 3:** Run the gate. **Intentional markup change:** Footer logo alt on `/en` (also remove it from the Task 0 allowlist). Show the diff and update the snapshot.
- [ ] **Step 4:** Commit `refactor: ButtonLink, Stars, Logo primitives and contactLink`.

### Task 4: `useDismiss` and `Dialog` (client)

**Files:**
- Create: `lib/useDismiss.ts`, `components/ui/Dialog.tsx`
- Modify: `ServicesMenu.tsx`, `MobileMenu.tsx`, `AboutModal.tsx`, `LeadPopup.tsx`, `FloatingWhatsApp.tsx`, `LanguageSwitch.tsx`, `CookieConsent.tsx` (`data-dialog-open` while open), `lib/dom.ts` (`openDialog: "[data-dialog-open]"`)
- Test: `tests/e2e/ux.test.js`

**Interfaces:**
- Produces: `useDismiss(ref: React.RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void, opts?: { outside?: boolean })`. While active, it handles Escape and, unless `outside === false`, a `pointerdown` outside `ref`.
- Produces:
  ```ts
  Dialog({ open, onClose, labelledBy, closeLabel, className, children }:
    { open: boolean; onClose: () => void; labelledBy: string; closeLabel: string; className?: string; children: React.ReactNode })
  ```
  - It's a client component.
  - It renders the current shell markup: `cx("b-modal", open && "open", className)`, the backdrop and the `×` close button, with `role="dialog" aria-modal="true"` and `data-dialog-open` while open.
  - It focuses the close button on open, and on close returns focus to the element that was focused at open time.

- [ ] **Step 1:** Add the e2e cases:
  - `escape closes top dialog and restores focus`: open AboutModal from its link, press Escape, then check it's closed and focus is on the link.
  - `lead popup waits for open dialog`: open AboutModal, scroll past `#reviews`, and check no lead popup appears.
  - `menus close on escape and outside click`: covers ServicesMenu, MobileMenu and LanguageSwitch.
- [ ] **Step 2:** Run `npm run build && node tests/e2e/ux.test.js`. Expected: the focus-restore case FAILs.
- [ ] **Step 3:** Implement the hook and Dialog, then migrate all 6 call sites. LeadPopup keeps only its trigger logic.
- [ ] **Step 4:** Run the gate. **Intentional markup change:** `data-dialog-open` attributes and close-button attributes only. Show the diff and update the snapshot.
- [ ] **Step 5:** Commit `refactor: Dialog and useDismiss for overlays and menus`.

### Task 5: `LeadFields`

**Files:**
- Create: `components/lead/LeadFields.tsx`
- Modify: `ContactForm.tsx:23-31`, `LeadPopup.tsx:106-114`, `styles/shared.css` (merge the `.b-lead-pop` field rules into `.b-form`, and give the popup `<form>` the `b-form` class)

**Interfaces:**
- Produces: `LeadFields({ idPrefix, topics, defaultTopic, namePlaceholder }: { idPrefix: string; topics: readonly string[]; defaultTopic?: string; namePlaceholder?: string })`. It's a client component (it calls `useLanguage()` for labels and `topicLabel`).
  - IDs are `${idPrefix}Name`, `${idPrefix}Phone` and `${idPrefix}Topic`.
  - Pass `idPrefix="b"` and `idPrefix="bLeadPop"` so the current IDs are preserved.

- [ ] **Step 1:** Add the e2e case `no duplicate ids with popup open`. Run it. Expected: PASS (it's a guard).
- [ ] **Step 2:** Implement `LeadFields`, use it in both forms, and merge the CSS.
- [ ] **Step 3:** Run the gate. **Intentional markup change:** the popup form class. Show the diff and update the snapshot.
- [ ] **Step 4:** Commit `refactor: one LeadFields for both lead forms`.

**Phase A stop:** show Dan the snapshot diffs and the metric deltas.

---

## Phase B: server blocks and pages

### Task 6: Server blocks and home sections

**Files:**
- Create (all server components, each taking `lang: Lang`) in `components/blocks/`:
  - `StepsList.tsx`
  - `FaqList.tsx`
  - `ReviewCard.tsx`
  - `GoogleReviewsLink.tsx`
  - `CallLine.tsx`
  - `ContactLinks.tsx`
  - `ContactBlock.tsx`, which renders the client `ContactForm` inside it
  - `ServiceLinks.tsx`
- Modify: remove `"use client"` from `sections/Hero.tsx`, `Services.tsx`, `ServiceCard.tsx`, `Process.tsx`, `About.tsx`, `Reviews.tsx`, `Knowledge.tsx` and `Contact.tsx`. Each one becomes `X({ lang }: { lang: Lang })` built from `makeI18n`, `getContent`, blocks and the client `Section`/`StepRegion` wrapper. `pages/HomePage.tsx` passes `lang`.
- Test: `tests/e2e/ux.test.js`, `tests/e2e/active-section.test.js`

**Interfaces** (all components return JSX):
- `StepsList({ steps }: { steps: Step[] })` renders `ol.b-steps`.
- `FaqList({ faqs, name }: { faqs: Faq[]; name: string })` renders `div.b-faq` of `details.b-faq-item`.
- `ReviewCard({ review, starsLabel }: { review: Review; starsLabel: string })`.
- `GoogleReviewsLink({ lang, variant }: { lang: Lang; variant: "button" | "text" })`. `"button"` gives the `Reviews.tsx` markup, and `"text"` gives `b-text-link` + ArrowIcon.
- `CallLine({ lang }: { lang: Lang })` renders `p.b-hero-call` with `t("hero.call")` and `contactLink("phone", lang)`.
- `ContactLinks({ lang, show }: { lang: Lang; show: readonly ContactKind[] })` renders `ul.b-contact-list`.
- `ContactBlock({ lang, titleId, title, lead, show, defaultTopic, nextSteps }: { lang: Lang; titleId: string; title: string; lead: string; show: readonly ContactKind[]; defaultTopic?: string; nextSteps?: boolean })` renders `div.b-container.b-contact-wrap`.
- `ServiceLinks({ lang, exclude, title }: { lang: Lang; exclude?: string; title: string })` renders `nav.b-other-services`.
- `Section` and `StepRegion` keep their current props (strings plus children), so server children pass through unchanged.
- About's "read more" is the client `AboutLink`, which stays client and is rendered as a child.

- [ ] **Step 1:** Add the e2e cases:
  - `faq keeps one open` (home)
  - `cta reaches contact form` on `/` and `/en`
  - `active-section works on /en`: repeat the first click-to-activate case of `active-section.test.js` at `/en`
- [ ] **Step 2:** Run them. Expected: PASS. They guard behaviour, because markup must not change.
- [ ] **Step 3:** Implement the blocks and convert the 8 section files. Each section file stays under 40 lines.
- [ ] **Step 4:** Run the gate. Expected: markup unchanged for he and en, and the `"use client"` count drops by 8 or more.
- [ ] **Step 5:** Commit `refactor: home sections as server components built from shared blocks`.

### Task 7: ServicePage and LegalPage on the server

**Files:**
- Create: `components/service/ServiceHero.tsx`, `ServiceSituations.tsx`, `ServiceChecks.tsx` (server, `{ lang, service }`)
- Modify:
  - `service/ServicePage.tsx`: a server component of 70 lines or fewer, `ServicePage({ lang, service }: { lang: Lang; service: Service })`, containing JSON-LD and the region list. Each block keeps its existing `<section className aria-labelledby>`, and the contact `<section>` keeps `id="contact"`.
  - `legal/LegalPage.tsx`: server, `{ lang, doc }`. Any interactive part (tabs or a close button, if they exist) moves into a small client child.
  - `pages/SubPage.tsx`: `SubPage({ lang, slug })`.
  - `app/(he)/[slug]/page.tsx` and `app/(en)/en/[slug]/page.tsx`: pass `lang`.
  - `lead/Honeypot.tsx`: label from a `label` prop. Remove it from the Task 0 allowlist.

- [ ] **Step 1:** Add the e2e cases:
  - `cta reaches contact form` on `/pension` and `/en/pension` (use the first service slug)
  - `faq keeps one open` on a service page
- [ ] **Step 2:** Implement. The ServicePage regions are:
  - ServiceHero (crumbs, kicker, h1, lead, `ButtonLink` CTA, `CallLine`, facts)
  - ServiceSituations
  - ServiceChecks
  - a `<section class="b-section b-process">` with `SectionHead` + `StepsList`
  - a `<section class="b-section b-knowledge">` with `FaqList name="service-faq"`
  - a `<section class="b-section b-reviews">` with `ReviewCard` + `GoogleReviewsLink variant="text"`
  - a `<section id="contact">` with `ContactBlock show={["phone","whatsapp"]}`
  - `ServiceLinks`
- [ ] **Step 3:** Run the gate. Expected:
  - markup unchanged, except the Honeypot label on `/en` (intentional; update the snapshot);
  - the Task 0 allowlist is back to `["עברית"]`;
  - the `"use client"` count drops by 2 or more.
- [ ] **Step 4:** Commit `refactor: service and legal pages as server compositions`.

**Phase B stop:** show Dan ServicePage before and after, the metric deltas (client components, chunk KB), and screenshots of `/pension` and `/en/pension`.

---

## Phase C: structure, tokens, conventions

### Task 8: PageChrome, Section split, `sectionHref`, chrome to the server

**Files:**
- Create: `components/layout/PageChrome.tsx`, `components/layout/Section.tsx` (move `Section` and `StepRegion` out of `ActiveSection.tsx`)
- Modify:
  - `pages/HomePage.tsx`, `pages/SubPage.tsx`
  - `ActiveSection.tsx`: keep the provider and hooks, and delete the legacy adapter only if `grep` shows no callers. `LanguageSwitch` still uses `useSteps()`, so keep that and its context default.
  - `content/sections.ts`, `layout/nav.ts`, `Header.tsx`, `Footer.tsx`
  - `UtilityBar.tsx`, `Footer.tsx`: make them server components with `{ lang }`, keeping `CookieSettingsLink`/`AboutLink` as client children.
- Test: `tests/unit/steps.test.mjs`

**Interfaces:**
- Produces: `PageChrome({ lang, variant, children }: { lang: Lang; variant: "home" | "service" | "legal"; children: React.ReactNode })`. Rendering order:
  1. `UtilityBar`
  2. `Header` (`home={variant === "home"}`, `contactHref="#contact"` for service)
  3. `children`
  4. `Footer`
  5. `AboutModal`, home only
  6. `LeadPopup` and `HashLinkController`, unless legal
  7. `FloatingWhatsApp`

  For home, it wraps Header, children and `ScrollStepper` in `ActiveSectionProvider`, keeping the current order in `HomePage.tsx`.
- Produces: `sectionHref(id: SectionId, base?: string): string`, which returns `${base ?? ""}#${id}`. Callers wrap it in `href()` for the language prefix.

- [ ] **Step 1:** Write the tests: `sectionHref("process") === "#process"` and `sectionHref("contact", "/") === "/#contact"`. Run them. Expected: FAIL.
- [ ] **Step 2:** Implement. `HomePage` and `SubPage` become JSON-LD plus `<PageChrome>`, with only the main content inside.
- [ ] **Step 3:** Run the gate. Expected: markup unchanged.
- [ ] **Step 4:** Commit `refactor: PageChrome, Section split, sectionHref, server chrome`.

### Task 9: CSS tokens

**Files:**
- Modify: `styles/base.css`, `Reviews.css`, `Footer.css`, `ScrollStepper.css`, `Hero.css`, `shared.css`, `CookieConsent.css`

**Interfaces:**
- Produces these tokens:
  - `--gold-light:#e2b76f`
  - `--on-dark-muted:#c9d2df`
  - `--gold:#c19a4b`
  - one token per remaining raw colour used 2 or more times
- Produces a breakpoint comment in `base.css` that lists the widths in use and the preferred set for new CSS, `600 / 760 / 980 / 1200`. Existing breakpoints are not migrated.

- [ ] **Step 1:** Take Playwright screenshots of these, as the "before" set:
  - `/` (top, reviews, footer)
  - the consent banner
  - `/pension`
  - `/en`

  Take each at 1440 and 390 widths, into the scratchpad.
- [ ] **Step 2:** Replace the repeated hex values with tokens. In `CookieConsent.css`:
  - map its colours to the tokens;
  - `#172a46` becomes `var(--navy)` (an intentional, near-identical shift);
  - `var(--font-serif)` becomes `var(--serif)`.
- [ ] **Step 3:** Run the gate (markup unchanged), then take the "after" screenshots. The only visible difference should be the consent navy.
- [ ] **Step 4:** Commit `style: colour tokens, consent banner on tokens`.

### Task 10: Conventions doc and final metrics

**Files:**
- Modify: `AGENTS.md` (add a "Components" section), `README.md` (fix outdated lines), `docs/superpowers/plans/2026-11-16-language-switch.md` (add a note at the top: "Shipped as per-URL routes; see code")

**Interfaces:**
- Produces: the AGENTS.md "Components" section, 45 lines at most. It covers:
  - the layers and the import rule;
  - the server/client rule;
  - `makeI18n` vs `useLanguage`, and `getContent`;
  - internal links through `href`;
  - how to add a home section: a `sectionIds` entry, a server section `{ lang }` in `Section` + blocks, CSS registered in `styles/index.ts`, and a nav entry through `sectionHref`;
  - how to add a service: one `content/services.ts` entry plus its `servicesEn` entry;
  - how to add an overlay: `Dialog`;
  - selectors through `lib/dom.ts`;
  - the tokens;
  - the snapshot rule.

- [ ] **Step 1:** Write the section. Then dry-run it: add a throwaway home section using only those instructions. It should touch 5 files or fewer and appear on both `/` and `/en`. Revert it afterwards.
- [ ] **Step 2:** Run the gate, then compare the Task 0 metrics before and after. Targets:
  - `"use client"` count down 40% or more;
  - no component file over 150 lines except `ActiveSection.tsx`.
- [ ] **Step 3:** Commit `docs: component conventions`.

**Phase C stop:** show the results to Dan.

---

## Verification (end to end)

```bash
cd landing_page
npm run lint && npm run test:unit && npm run build && npm run test:markup && npm run test:e2e
npx serve@14 out -l 3100   # manual check on port 3100 (keep 3000-3002 free)
```

Manual check:
- On `/`, `/en`, `/pension` and `/en/pension`:
  - CTA → form
  - FAQ accordion
  - About modal
  - lead popup
  - WhatsApp sheet
  - language switch
  - cookie banner
  - Escape and focus behaviour
- `git log --oneline` shows one commit per task.
