<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Components

Layers, imports point left only: `ui/` ← `blocks/` ← `sections/`, `service/`, `layout/` ← `pages/` ← `app/`.
- `ui/`: primitives (`ButtonLink`, `Stars`, `Logo`, `Dialog`, `Icons`, `ServiceEmblem`, `SectionHead`/`Eyebrow`). Type-only imports from `content/` are fine (`Icons`, `ServiceEmblem` use `type Service`); no runtime imports from `content/` or i18n, except `Logo` (reads `content/site`).
- `blocks/`: server pieces shared by home and service pages. Never render `<section>` or an `id`; the caller owns them.
- `sections/` (home), `service/` (service pages), `layout/` (chrome: `PageChrome` per variant home/service/legal), `pages/` (whole pages, called by `app/`).

Server/client: a file gets `"use client"` only for state, effects, refs, event handlers or browser APIs.
- Server components take `lang: Lang` as a prop, use `makeI18n(lang)` (`lib/i18n/i18n.ts`) for `t` and `href`, and read data from `getContent(lang)` (`content/localized.ts`), never raw `content/*` lists plus `pick`. Known exceptions: `AboutModal` and `JsonLd` use `pick`; `ServicePage` passes raw `faqsFor` to `FaqJsonLd` (localized inside).
- Client components call `useLanguage()` (same `t`/`href`). Never pass functions such as `t` from server to client; pass strings.
- Internal links always go through `href(path)` / `localePath(lang, path)`, never a bare `"/x"`. Home anchors use `sectionHref(id, base?)` from `content/sections.ts`.
- Dictionary keys (`content/dictionary.ts`) need both `he` and `en` values; a unit test enforces it.
- Join classes with `cx()` (`lib/cx.ts`); keep the `b-` prefix.

Add a home section:
1. `content/sections.ts`: add the id to `sectionIds`, in page order.
2. `components/sections/X.tsx`: a server component `X({ lang })` that wraps its blocks in `<Section id step labelledBy>` (from `layout/Section`).
3. `components/pages/HomePage.tsx`: render `<X lang={lang} />` in place.
4. Text in `content/dictionary.ts` (he + en). Data in `content/` and exposed through `getContent`.
5. Optional nav entry in `components/layout/nav.ts` via `sectionHref(id)` (desktopNav and/or mobileNav).
6. Own CSS only if shared classes do not cover it: `components/sections/X.css`, imported in `styles/index.ts`.
The stepper e2e test (`tests/e2e/stepper.test.js`) lists every step; update it too.

Add a service: one entry in `content/services.ts` `services` plus its `servicesEn` entry; page, sitemap, cards and menus follow. Also add `nav.<id>` (he + en) to the dictionary; its `topic` must be in `contactTopics`, and a new topic needs an English label in `topicLabelsEn` (`content/services.ts`); FAQs, situations and `public/llms.txt` are per service.

Add an overlay: build it on `components/ui/Dialog.tsx` (Escape, backdrop, focus return, `data-dialog-open`). Don't hand-roll a modal. Dialog has two shells, `modal` and `leadPop`; a new look needs a new `SHELLS` entry plus its CSS.

DOM selectors used from client code live in `lib/dom.ts` (`DOM.header`, `DOM.openDialog`, …); don't repeat selector strings.

Tokens: colors, fonts, radius, shadow, spacing and `--x` (reading direction) are CSS variables in `styles/base.css` `:root`. Use them, not raw values. New CSS uses the breakpoints 600 / 760 / 980 / 1200 listed there.

Snapshot: `npm run test:markup` compares the `<body>` of every page in `out/` and `out/en/` (React `useId` values masked). A refactor keeps it unchanged. For an intended markup change, check the diff is only that change, then `UPDATE=1 npm run test:markup`.

Gate: `npm run lint && npm run test:unit && npm run build && npm run test:markup && npm run test:e2e`. Local server on port 3100 only (`npx serve@14 out -l 3100`).
