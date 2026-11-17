# Hover מעודן ומקטע פעיל: תוכנית יישום

> **For agentic workers:** Implement this plan task-by-task (subagent-driven or natively). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** דף הבית של BALOUL מקבל hover עדין ואחיד על כל אלמנט אינטראקטיבי, ו־state של "מקטע פעיל" שמצבע את המקטע שנלחץ או שנגלל אליו ומסמן את קישור הניווט שלו.

**Architecture:** רשימת המקטעים יושבת ב־`content/sections.ts`. `ActiveSectionProvider` (client, React context) מחזיק `activeId`; `Section` עוטף כל `<section>` של דף הבית ומוסיף `data-active` ו־onClick; `NavLink` מסמן `aria-current` ומעדכן את ה־state בלחיצה. כל הצבעים והמעברים הם CSS בלבד על `data-active`, `aria-current` ו־`:hover`, בתוך `@media (hover:hover)`.

**Tech Stack:** Next.js 16.4.4 (App Router, `output: "export"`), React 19.3.1, TypeScript 5.9, CSS רגיל (קובץ לכל רכיב, טוקנים ב־`styles/base.css`), Playwright (מותקן מראש) מול שרת סטטי קטן על `out/`.

**Spec:** `docs/superpowers/specs/2026-11-06-hover-active-section.md`

## Global Constraints

- בנייה: `npm run build` (צריך `@next/swc-linux-x64-gnu@16.4.4` בענן); בדיקת טיפוסים: `npm run lint` (`tsc --noEmit`) חייבת לעבור אחרי כל משימה.
- סגנון: Premium, Minimal, Trustworthy. בלי גרדיאנטים, בלי אנימציות דקורטיביות. תזוזת hover עד `2px`, מעבר עד `.25s`.
- Hover רק בתוך `@media (hover:hover)`. `prefers-reduced-motion` כבר מאפס מעברים ב־`styles/base.css` ואסור לשבור אותו.
- נגישות: ניגודיות 4.5:1 נשמרת (navy `#172a46`, bronze `#86593a`, muted `#4d5866`); מטרות מגע ≥44px; `:focus-visible` נשאר.
- שומרים על כל הקיים: HashLinkController, תפריט מובייל (`<details>`), AboutModal, LeadPopup, טופס Netlify + WhatsApp, הסכמת קוקיז.
- CSS: קובץ אחד לכל רכיב, רק הקלאסים שלו; טוקנים חדשים רק ב־`styles/base.css`; תוכן רק ב־`content/`.
- עברית טבעית; לא נוגעים בתוכן או במבנה המקטעים.
- קומיט אחרי כל משימה, הודעות בסגנון הקיים (`Add ...`, `Refine ...`).

## Review Focus

1. לחיצה על קישור לעמוד שירות בתוך מקטע (למשל `.b-situation`) חייבת לנווט כרגיל; `Section.onClick` לא קורא ל־`preventDefault`. נבדק ב־Task 1 (`navigates from inside a section`).
2. הקלדה בטופס יצירת קשר ולחיצה בתוך המקטע לא מאפסת את הערכים (ה־`children` לא נטענים מחדש). נבדק ב־Task 1 (`keeps form values`).
3. בטלפון (ללא עכבר) כרטיס לא נשאר במצב hover אחרי נגיעה. נבדק ב־Task 4 (`no hover transform on touch`).
4. עמודי שירות ועמודים משפטיים נבנים ורצים בלי provider: `useActiveSection` מחזיר ברירת מחדל ולא זורק. נבדק ב־Task 1 (`service page renders without provider`).
5. אחרי לחיצה על קישור ניווט, הגלילה החלקה עוברת דרך מקטעים אחרים ולא "גונבת" את הסימון מהיעד. נבדק ב־Task 5 (`click wins over scroll for 800ms`).

---

### Task 1: רשימת מקטעים, Provider ו־`Section` + תשתית בדיקות

**Files:**
- Create: `content/sections.ts`
- Create: `components/layout/ActiveSection.tsx`
- Create: `tests/e2e/serve.js`
- Create: `tests/e2e/active-section.test.js`
- Modify: `app/page.tsx` (עטיפה ב־provider)
- Modify: `components/sections/Situations.tsx`, `Services.tsx`, `Process.tsx`, `About.tsx`, `Reviews.tsx`, `Knowledge.tsx`, `Contact.tsx` (`<section>` → `<Section>`)
- Modify: `package.json` (סקריפט `test:e2e`)

**Interfaces:**
- Consumes: כלום חדש.
- Produces:
  - `content/sections.ts`: `export const sectionIds = ["situations","services","process","about-inline","reviews","knowledge","contact"] as const; export type SectionId = (typeof sectionIds)[number]; export function toSectionId(hashOrId: string): SectionId | null` (מקבל `"#process"` או `"process"`; כל דבר אחר → `null`).
  - `components/layout/ActiveSection.tsx` (`"use client"`): `export function ActiveSectionProvider({ children }: { children: React.ReactNode })`; `export function useActiveSection(): { activeId: SectionId | null; setActive: (id: SectionId | null) => void }` (מחוץ ל־provider: `{ activeId: null, setActive: () => {} }`); `export function Section({ id, className, labelledBy, children }: { id: SectionId; className?: string; labelledBy: string; children: React.ReactNode })` שמרנדר `<section id={id} className={className} aria-labelledby={labelledBy} data-active={active ? "" : undefined} onClick={() => setActive(id)}>`.
  - `tests/e2e/serve.js`: `module.exports = function serve(root, port) => Promise<http.Server>`; מגיש קבצים מ־`root`, מוסיף `.html` כשחסר, עונה `ok` ל־POST. (העתק את השרת מ־`/tmp/claude-0/svc.js` בלי החלק של Playwright.)
  - סקריפט npm: `"test:e2e": "node tests/e2e/active-section.test.js"` (Task 4 יוסיף קובץ שני).

- [ ] **Step 1: Write the failing test**

`tests/e2e/active-section.test.js` (Node + Playwright, `require('playwright')`, `node:assert/strict`, פורט 4330, root `out`). לפני כל דף: `addInitScript` שמגדיר `localStorage['baloul-consent-v1']='denied'` ו־`sessionStorage['baloulLeadShown']='1'`, ו־`document.documentElement.style.scrollBehavior='auto'` ב־DOMContentLoaded. שני contexts: `page` (דסקטופ 1440×900) ו־`mobile` (`{viewport:{width:390,height:844}, hasTouch:true, isMobile:true}`); שניהם נפתחים ב־`http://localhost:4330/`. אוסף `pageerror` ו־console errors משני הדפים ל־`errs`. בסוף: `process.exitCode = 1` על כל assert שנכשל (עטוף ב־try/catch שמדפיס את השגיאה), ואז סוגר דפדפן ושרת.

```js
// starts with nothing active
assert.equal(await page.$$eval('[data-active]', els => els.length), 0);
// clicking inside a section activates it, and only it
await page.click('#process h2');
assert.ok(await page.$('#process[data-active]'));
assert.equal(await page.$$eval('[data-active]', els => els.length), 1);
await page.click('#reviews h2');
assert.ok(await page.$('#reviews[data-active]'));
assert.equal(await page.$('#process[data-active]'), null);
// keeps form values
await page.fill('#bName', 'בדיקה'); await page.click('#contact h2');
assert.equal(await page.inputValue('#bName'), 'בדיקה');
// navigates from inside a section
await page.click('.b-situation >> nth=0'); await page.waitForLoadState();
assert.ok(page.url().endsWith('/pension-retirement'));
// service page renders without provider
assert.ok(await page.isVisible('h1'));
// deep link activates on load
await page.goto('http://localhost:4330/#knowledge'); await page.waitForTimeout(300);
assert.ok(await page.$('#knowledge[data-active]'));
// no console errors
assert.deepEqual(errs, []);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && npm run test:e2e`
Expected: FAIL at `#process[data-active]` (null).

- [ ] **Step 3: Implement `content/sections.ts` and `components/layout/ActiveSection.tsx`**

Provider: `useState<SectionId | null>(null)`; ב־`useEffect` ראשון קורא `toSectionId(location.hash)` ואם לא `null` מגדיר אותו. ה־context value ממומש ב־`useMemo`. `Section` משתמש ב־`useActiveSection()`.

- [ ] **Step 4: Wire the page**

ב־`app/page.tsx` עוטפים את `<Header />` ואת `<main>` (יחד) ב־`<ActiveSectionProvider>`. בשבעת רכיבי המקטעים מחליפים את ה־`<section ... id= aria-labelledby=>` ב־`<Section id="..." className="b-section b-..." labelledBy="...">` עם אותם ערכים בדיוק (About: `id="about-inline"`, `labelledBy="aboutSectionTitle"`). `Hero` ו־`DomainNav` לא משתנים.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run lint && npm run build && npm run test:e2e`
Expected: tsc בלי שגיאות; כל ה־assert עוברים; `no console errors`.

- [ ] **Step 6: Commit**

```bash
git add content/sections.ts components/layout/ActiveSection.tsx components/sections app/page.tsx tests/e2e package.json
git commit -m "Add active-section state: provider, Section wrapper, e2e harness"
```

---

### Task 2: קישורי ניווט מסמנים ומעדכנים את המקטע הפעיל

**Files:**
- Create: `components/layout/NavLink.tsx`
- Modify: `components/layout/Header.tsx:25-39` (קישורי `desktopNav` ו־`.b-nav-cta`)
- Modify: `components/layout/MobileMenu.tsx:30-34`
- Test: `tests/e2e/active-section.test.js`

**Interfaces:**
- Consumes: `useActiveSection`, `toSectionId` (Task 1).
- Produces: `components/layout/NavLink.tsx` (`"use client"`): `export function NavLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode })` → `<a href className aria-current={activeId !== null && activeId === toSectionId(href) ? "true" : undefined} onClick={...}>`; ה־onClick קורא `setActive(toSectionId(href))` רק כשהתוצאה אינה `null`, ולא קורא ל־`preventDefault` (HashLinkController ממשיך לטפל בגלילה).

- [ ] **Step 1: Write the failing test** (הוסף לקובץ הקיים)

```js
// nav reflects the active section
await page.click('#reviews h2');
assert.equal(await page.getAttribute('.b-links a[href="#reviews"]', 'aria-current'), 'true');
assert.equal(await page.getAttribute('.b-links a[href="#process"]', 'aria-current'), null);
// nav click activates its target immediately and still scrolls
await page.click('.b-links a[href="#process"]'); await page.waitForTimeout(50);
assert.ok(await page.$('#process[data-active]'));
await page.waitForTimeout(1500);
assert.ok(await page.evaluate(() => Math.abs(document.getElementById('process').getBoundingClientRect().top) < 120));
// header CTA marks contact
await page.click('.b-nav-cta'); await page.waitForTimeout(50);
assert.equal(await page.getAttribute('.b-nav-cta', 'aria-current'), 'true');
// mobile menu (viewport 390×844, hasTouch:true, isMobile:true)
await mobile.click('.b-menu'); await mobile.click('.b-mobile a[href="#knowledge"]'); await mobile.waitForTimeout(50);
assert.equal(await mobile.$$eval('#knowledge[data-active]', e => e.length), 1);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && npm run test:e2e`
Expected: FAIL at `aria-current` (null).

- [ ] **Step 3: Implement `NavLink` and use it**

ב־`Header.tsx`: ה־`<a>` של פריטי `desktopNav` שאינם `AboutLink` וה־`<a className="b-nav-cta">` הופכים ל־`<NavLink>` עם אותם `href`/`className`. ב־`MobileMenu.tsx`: כל פריט → `<NavLink href={item.href}>`. `ServicesMenu` ו־`AboutLink` לא משתנים.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run lint && npm run build && npm run test:e2e`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/layout/NavLink.tsx components/layout/Header.tsx components/layout/MobileMenu.tsx tests/e2e/active-section.test.js
git commit -m "Mark the active section in desktop and mobile navigation"
```

---

### Task 3: צבע למקטע הפעיל ולקישור הפעיל (CSS)

**Files:**
- Modify: `styles/base.css:6-26` (טוקנים)
- Modify: `styles/shared.css:12-20` (`.b-section`, `.b-eyebrow`)
- Modify: `components/layout/Header.css:22-37` (desktop links), `:62-66` (mobile links)
- Test: `tests/e2e/active-section.test.js`

**Interfaces:**
- Consumes: `data-active` (Task 1), `aria-current` (Task 2).
- Produces: טוקנים `--active-tint:#f1ece3`, `--shadow-hover:0 2px 4px rgba(23,42,70,.06),0 14px 32px rgba(23,42,70,.10)`, `--t:.2s ease` (Task 4 משתמש בשניים האחרונים).

- [ ] **Step 1: Write the failing test** (הוסף לקובץ הקיים)

```js
await page.click('#process h2'); await page.waitForTimeout(400);
assert.equal(await page.$eval('#process', e => getComputedStyle(e).backgroundColor), 'rgb(241, 236, 227)');
assert.equal(await page.$eval('#process .b-eyebrow', e => getComputedStyle(e).color), 'rgb(23, 42, 70)');
assert.equal(await page.$eval('#process .b-eyebrow', e => getComputedStyle(e, '::before').width), '44px');
assert.equal(await page.$eval('.b-links a[href="#process"]', e => getComputedStyle(e, '::after').transform), 'matrix(1, 0, 0, 1, 0, 0)');
assert.equal(await page.$eval('.b-links a[href="#reviews"]', e => getComputedStyle(e, '::after').transform), 'matrix(0, 0, 0, 1, 0, 0)');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && npm run test:e2e`
Expected: FAIL at backgroundColor.

- [ ] **Step 3: Implement the CSS**

`styles/shared.css`:
```css
.site .b-section{transition:background-color .25s ease}
.site .b-section[data-active]{background-color:var(--active-tint)}
.site .b-section[data-active] .b-eyebrow{color:var(--navy)}
.site .b-section[data-active] .b-eyebrow::before{width:44px;background:var(--navy)}
.site .b-eyebrow::before{transition:width var(--t),background-color var(--t)}
```
`Header.css` בתוך `@media (min-width:1024px)`: `.b-links a` מקבל `position:relative` ו־`transition:color var(--t)`; `::after` = קו `2px` ברונזה, `right:14px;left:14px;bottom:6px`, `transform:scaleX(0)`, `transform-origin:right`, `transition:transform var(--t)`; `:hover` ו־`[aria-current="true"]` → `scaleX(1)` וצבע navy; מוחקים את ה־`background:var(--paper-2)` מה־hover. מובייל: `.b-mobile a[aria-current="true"]{color:var(--navy);box-shadow:inset -3px 0 0 var(--bronze);padding-right:12px}` (לא על הפריט האחרון, שהוא כפתור navy).

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run build && npm run test:e2e`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add styles/base.css styles/shared.css components/layout/Header.css tests/e2e/active-section.test.js
git commit -m "Tint the active section and underline its nav link"
```

---

### Task 4: Hover מעודן ואחיד

**Files:**
- Modify: `components/sections/Journey.css:6-15` (`.b-situation`)
- Modify: `components/sections/Services.css:5-23` (`.b-solution`, icon, more)
- Modify: `components/sections/Hero.css:43-51` (`.b-domain-link`, icon)
- Modify: `components/sections/Knowledge.css:8-21` (FAQ summary)
- Modify: `styles/shared.css:23-40` (`.b-btn*`, `.b-text-link`)
- Modify: `components/layout/Header.css:30-35` (`.b-nav-cta`)
- Create: `tests/e2e/hover.test.js`
- Modify: `package.json` (`"test:e2e": "node tests/e2e/active-section.test.js && node tests/e2e/hover.test.js"`)

**Interfaces:**
- Consumes: `--shadow-hover`, `--t` (Task 3).
- Produces: כלום לקוד אחר.

- [ ] **Step 1: Write the failing test**

`tests/e2e/hover.test.js` (אותו setup כמו Task 1; context דסקטופ ו־context מובייל `{viewport:{width:390,height:844}, hasTouch:true, isMobile:true}`):

```js
const card = page.locator('.b-solution').first();
await card.hover(); await page.waitForTimeout(300);
assert.equal(await card.evaluate(e => getComputedStyle(e).transform), 'matrix(1, 0, 0, 1, 0, -2)');
assert.equal(await card.evaluate(e => getComputedStyle(e).borderColor), 'rgb(23, 42, 70)');
assert.equal(await card.evaluate(e => getComputedStyle(e.querySelector('.b-solution-icon')).backgroundColor), 'rgb(23, 42, 70)');
assert.equal(await card.evaluate(e => getComputedStyle(e.querySelector('.b-solution-more svg')).transform), 'matrix(1, 0, 0, 1, -4, 0)');
await page.hover('.b-situation >> nth=0'); await page.waitForTimeout(300);
assert.equal(await page.$eval('.b-situation', e => getComputedStyle(e).transform), 'matrix(1, 0, 0, 1, 0, -2)');
await page.hover('.b-hero .b-btn-primary'); await page.waitForTimeout(300);
assert.equal(await page.$eval('.b-hero .b-btn-primary', e => getComputedStyle(e).transform), 'matrix(1, 0, 0, 1, 0, -1)');
await page.hover('.b-faq-item summary >> nth=0'); await page.waitForTimeout(300);
assert.equal(await page.$eval('.b-faq-item summary', e => getComputedStyle(e).backgroundColor), 'rgb(247, 245, 241)');
// no hover transform on touch (if Playwright's mobile context does not report hover:none,
// force it: const cdp = await mobile.context().newCDPSession(mobile);
// await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }] });)
await mobile.hover('.b-solution >> nth=0'); await mobile.waitForTimeout(300);
assert.equal(await mobile.$eval('.b-solution', e => getComputedStyle(e).transform), 'none');
// no horizontal scroll after the changes
assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && node tests/e2e/hover.test.js`
Expected: FAIL at transform (`none`).

- [ ] **Step 3: Implement the CSS**

כל כללי ה־`:hover` של האלמנטים הבאים עוברים לתוך `@media (hover:hover){...}` באותו קובץ, והכללים הקיימים שלהם (`border-color`, `background`) נשארים בתוכו:
- `.b-situation`, `.b-solution`, `.b-domain-link`: `transition` מורחב ל־`border-color var(--t),background-color var(--t),transform var(--t),box-shadow var(--t)`; hover: `transform:translateY(-2px);box-shadow:var(--shadow-hover);border-color:var(--navy)`.
- `.b-solution-icon`, `.b-domain-icon`: `transition:background-color var(--t),color var(--t)`; בהורה ב־hover: `background:var(--navy);color:#fff`.
- `.b-situation-link svg`, `.b-solution-more svg`, `.b-text-link svg`: `transition:transform var(--t)`; בהורה ב־hover: `transform:translateX(-4px)` (החץ מצביע שמאלה = קדימה ב־RTL).
- `.b-btn`: `transition` מוסיף `transform var(--t),box-shadow var(--t)`; `.b-btn-primary:hover` ו־`.b-nav-cta:hover`: `transform:translateY(-1px);box-shadow:var(--shadow-hover)`; `.b-btn-secondary:hover`: `background:var(--paper);border-color:var(--navy)`; `.b-btn:active{transform:none;box-shadow:none}`.
- `.b-faq-item summary`: `transition:background-color var(--t),color var(--t)`; hover: `background:var(--paper);margin-inline:-12px;padding-inline:12px;border-radius:var(--radius-sm)`; `summary:hover::after{border-color:var(--navy)}`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run build && npm run test:e2e`
Expected: שני הקבצים PASS, בלי console errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Journey.css components/sections/Services.css components/sections/Hero.css components/sections/Knowledge.css styles/shared.css components/layout/Header.css tests/e2e/hover.test.js package.json
git commit -m "Refine hover states: lift, shadow, icon tint, arrow nudge; pointer devices only"
```

---

### Task 5: המקטע הפעיל עוקב אחרי הגלילה (scroll-spy)

**Files:**
- Modify: `components/layout/ActiveSection.tsx` (provider, `Section.onClick`)
- Modify: `components/layout/NavLink.tsx` (onClick קורא `markClick`)
- Modify: `README.md` (פסקה קצרה "מקטע פעיל" תחת מבנה הדף)
- Test: `tests/e2e/active-section.test.js`

**Interfaces:**
- Consumes: `setActive` (Task 1), `NavLink.onClick` (Task 2).
- Produces: ב־context נוסף `markClick(): void` שמגדיר `clickLockUntil = Date.now() + 800`; `Section.onClick` ו־`NavLink.onClick` קוראים לו לפני `setActive`.

- [ ] **Step 1: Write the failing test** (הוסף לקובץ הקיים)

```js
// scrolling updates the active section
await page.evaluate(() => document.getElementById('knowledge').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(400);
assert.ok(await page.$('#knowledge[data-active]'));
assert.equal(await page.getAttribute('.b-links a[href="#knowledge"]', 'aria-current'), 'true');
// click wins over scroll for 800ms
await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'smooth'; });
await page.click('.b-links a[href="#reviews"]'); await page.waitForTimeout(400);
assert.ok(await page.$('#reviews[data-active]'));
await page.waitForTimeout(1200);
assert.ok(await page.$('#reviews[data-active]'));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && npm run test:e2e`
Expected: FAIL at `#knowledge[data-active]` אחרי הגלילה.

- [ ] **Step 3: Implement scroll-spy in the provider**

`useEffect` ב־`ActiveSectionProvider`: `new IntersectionObserver(cb, { rootMargin: "-40% 0px -50% 0px", threshold: 0 })` על `sectionIds.map(id => document.getElementById(id))` (מדלג על `null`); ב־callback, אם `Date.now() < clickLockUntil.current` מתעלמים; אחרת לוקחים את הכניסה האחרונה עם `isIntersecting` ומגדירים `setActive(target.id as SectionId)`. `clickLockUntil` הוא `useRef(0)`. ניקוי ב־unmount.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run lint && npm run build && npm run test:e2e`
Expected: PASS.

- [ ] **Step 5: README and commit**

ב־`README.md`, בסעיף מבנה הדף: שלוש שורות על `content/sections.ts`, `ActiveSectionProvider`/`Section`/`NavLink`, ועל `npm run test:e2e` (דורש `npm run build` קודם).

```bash
git add components/layout/ActiveSection.tsx components/layout/NavLink.tsx README.md tests/e2e/active-section.test.js
git commit -m "Follow scroll with the active section; document the state and e2e tests"
```

---

## אחרי התוכנית (לא משימות קוד)

- סנכרון לתיקייה במק של דן: `~/Desktop/BALOUL Finance/landing_page` (שם רץ `npm run dev`), כולל הקבצים החדשים `content/sections.ts`, `components/layout/ActiveSection.tsx`, `components/layout/NavLink.tsx`, `tests/e2e/*`.
- פריסה: `npm run build` ואז `out/` ל־Netlify, כרגיל.
