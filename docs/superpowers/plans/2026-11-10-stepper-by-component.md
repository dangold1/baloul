# Stepper לפי קומפוננטות, בצד ימין: תוכנית יישום

> **For agentic workers:** Implement this plan task-by-task (subagent-driven or natively). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ה־stepper עובר לצד ימין, וכל קומפוננטה בדף הבית מכריזה על עצמה כשלב. השלב הנוכחי נקבע לפי המיקום האמיתי של הקומפוננטות על המסך, כך שה־stepper תמיד מראה את החלק שהגולש קורא, בגלילה למטה, בגלילה למעלה ואחרי לחיצה על נקודה.

**Architecture:** `ActiveSectionProvider` נשאר המנגנון היחיד, אבל ה־IntersectionObserver שבו מוחלף ב־registry של שלבים: כל קומפוננטה נרשמת עם `id`, שם ו־ref. בכל גלילה (פעם אחת לפריים) פונקציה טהורה `resolveStep` בוחרת את השלב האחרון שהחלק העליון שלו עבר את "קו הקריאה". ה־stepper, התפריט העליון וגוון המקטע הפעיל קוראים את אותה תוצאה, ו־`useStepChange` פתוח לשימושים עתידיים (אנליטיקס, פופאפ, אנימציות).

**Tech Stack:** Next.js 16.4.4 (static export), React 19.3.1, TypeScript 5.9, CSS לכל רכיב, Playwright מול `out/`, `node --test` (Node 22) לבדיקת יחידה.

**Spec:** `/mnt/project-files/BALOUL Finance/prompts/scroll-stepper.md` + הבקשה של דן מ־2026-11-10: (1) ה־stepper בצד ימין; (2) הפרדה לפי קומפוננטות, כשקומפוננטה מגיעה למסך ה־stepper יודע באיזה שלב הוא, כבסיס לדברים אחרים בהמשך.

## למה זה לא עובד היום (נמדד)

סריקה של כל הדף ב־1440 וב־1280, בקפיצות של 150px למטה ולמעלה, מצאה שלב שגוי במקומות כמו: גלילה למעלה ב־y=1050 מציגה "תחומי פעילות" כשבמרכז המסך כבר "איך עובדים"; ב־1280 בגלילה למטה ב־y=1800 מוצג "מי אנחנו" כשעדיין קוראים "איך עובדים". הסיבה: ה־observer מחליט לפי **סדר האירועים** (מי נכנס אחרון לפס של 40%–50%), לא לפי **מיקום**. בנוסף נעילת הלחיצה (800ms) קצרה מגלילה חלקה ארוכה, וה־hero נבדק בכלל בחישוב נפרד (`inHero`) עם קו אחר (50%).

## Global Constraints

- מנגנון אחד: אין IntersectionObserver נוסף ואין scroll listener נוסף מעבר לזה שב־provider. ה־measure של ה־stepper (מילוי, גוון כהה, גובה הדר) נשאר אבל לא קובע שלב.
- השלבים, לפי הסדר: `top` בית, `services` תחומי פעילות, `process` איך עובדים, `about-inline` מי אנחנו, `reviews` לקוחות מספרים, `knowledge` שאלות נפוצות, `contact` צור קשר. השם של כל שלב כתוב בקומפוננטה שלו, לא ברשימה מרכזית.
- קו הקריאה: `headerBottom + (innerHeight - headerBottom) * 0.35`. כשהדף בתחתית (`scrollY + innerHeight >= scrollHeight - 2`) השלב הוא האחרון.
- מסילה בצד ימין: `right: 14px`, ממורכזת לגובה, תוויות נפתחות שמאלה (לכיוון התוכן). מוצגת מ־**1200px**; ב־980–1199 יש פחות מ־40px בין התוכן לקצה (נמדד 32px ב־1024), ולכן שם מוצג הפס העליון כמו בטלפון.
- נגישות ועיצוב כמו בפרומפט: `nav aria-label="התקדמות בדף"`, `aria-current="step"`, `<a href="#id">`, רק `transform`/`opacity`, `prefers-reduced-motion`, טוקנים מ־`styles/base.css`, בלי מספרים ובלי גרדיאנטים.
- לא שוברים: `aria-current` בתפריט העליון, הפופאפ אחרי הביקורות (`LeadPopup` מודד את `#reviews` בעצמו, לא נוגעים בו), חלון "אודותינו", קישורי `#service-*`.
- אין git בפרויקט: "commit" = העתקה ל־`/mnt/project-files/BALOUL Finance/sync-2026-11-10-stepper-v2/` וסנכרון למק אחרי בדיקת md5.
- `npm run lint`, `npm run build`, `npm run test:e2e` עוברים בסוף כל משימה.

## Review Focus

1. **גלילה מהירה (גלגלת/טראקפד חזק) שמדלגת מקטע שלם בין שני פריימים** → השלב מתעדכן לפי המיקום הסופי, לא נתקע על הקודם. נבדק ב־Task 3 (`sweep matches geometry`, קפיצות של 600px).
2. **לחיצה על נקודה רחוקה (בית → צור קשר)** → בזמן הגלילה החלקה ה־stepper לא מהבהב דרך השלבים שבדרך, ובסוף נשאר "צור קשר". נבדק ב־Task 3 (`far jump holds target`).
3. **"צור קשר" קצר מכדי להגיע לקו הקריאה בסוף הדף** → בתחתית הדף השלב האחרון מסומן. נבדק ב־Task 1 (`bottom of page picks last`).
4. **שינוי גודל חלון / סיבוב טלפון** → השלב מחושב מחדש ב־resize. נבדק ב־Task 3 (`resize recomputes`).
5. **כניסה עם hash (`/#knowledge`)** → השלב הנכון מסומן מהטעינה, בלי לחכות לגלילה. נבדק ב־Task 3 (`deep link`).

---

### Task 1: פונקציית הבחירה `resolveStep`

**Files:**
- Modify: `content/sections.ts`
- Create: `lib/steps.ts`
- Test: `tests/unit/steps.test.ts`

**Interfaces:**
- Produces:
  - `content/sections.ts`: `stepIds = ["top", ...sectionIds] as const`, `type StepId = (typeof stepIds)[number]`. `sectionIds`, `SectionId`, `toSectionId` נשארים כמו שהם.
  - `lib/steps.ts`: `type StepBox = { id: StepId; top: number }` (top במונחי viewport), `resolveStep(boxes: StepBox[], line: number, atBottom: boolean): StepId | null`, `readingLine(headerBottom: number, viewportHeight: number): number`.

- [ ] **Step 1: לכתוב בדיקה שנכשלת** (`node:test` + `assert`)
  - `picks last box above the line`: boxes top=-500,-100,200,600 ו־line=300 → השלישי.
  - `before first box picks first`: כל ה־top גדולים מ־line → `boxes[0].id`.
  - `bottom of page picks last`: atBottom=true → האחרון גם כש־top שלו מתחת לקו.
  - `order independent`: אותן קופסאות בסדר מעורבב → אותה תוצאה (הפונקציה ממיינת לפי top).
  - `empty`: `[]` → `null`.
  - `readingLine(80, 900)` → `80 + 820 * 0.35` = `367`.
- [ ] **Step 2:** `node --test tests/unit/steps.test.ts` → FAIL (module not found).
- [ ] **Step 3:** לממש. פונקציה טהורה בלי DOM.
- [ ] **Step 4:** אותה פקודה → PASS. להוסיף ל־package.json: `"test:unit": "node --test tests/unit/"`, ו־`test:e2e` מתחיל ב־`npm run test:unit &&`. (Node 22.18+ מריץ `.ts` בלי דגל; לבדוק `node --version` במק.)
- [ ] **Step 5:** lint + sync.

### Task 2: registry ב־provider במקום ה־observer

**Files:**
- Modify: `components/layout/ActiveSection.tsx`
- Modify: `components/sections/Hero.tsx`, `Services.tsx`, `Process.tsx`, `About.tsx`, `Reviews.tsx`, `Knowledge.tsx`, `Contact.tsx`

**Interfaces:**
- Consumes: `resolveStep`, `readingLine`, `StepId` (Task 1).
- Produces (מ־`ActiveSection.tsx`):
  - `type RegisteredStep = { id: StepId; label: string; el: HTMLElement }`
  - `useSteps(): { steps: RegisteredStep[]; currentStep: StepId | null; goTo(id: StepId): void }`. `steps` ממוינים לפי מיקום ב־DOM (`compareDocumentPosition`).
  - `useRegisterStep(id: StepId, label: string, ref: React.RefObject<HTMLElement | null>): void`
  - `useStepChange(cb: (id: StepId, prev: StepId | null) => void): void`, נקרא פעם אחת לכל שינוי אמיתי.
  - `useActiveSection()` נשאר באותה צורה: `activeId` = `currentStep === "top" ? null : currentStep`. `setActive`/`markClick` נשארים ל־NavLink ול־`Section.onClick`.
  - `Section` מקבל prop חובה `step: string` (השם בעברית) ונרשם בעצמו, ומוסיף `data-step={id}` לאלמנט (הבדיקות ב־Task 3 מודדות לפיו). חדש: `StepRegion({ id, label, as?, className, labelledBy, children })` לחלקים שאינם `Section`, בשימוש ב־Hero (`id="top"`, `label="בית"`). ה־`id="top"` עובר מ־`<main>` ל־section של ה־hero, ו־`<main>` מקבל `id="main-content"` רק אם צריך (לבדוק ש־`#top` עדיין גולל לראש הדף; `#main` של קישור הדילוג לא משתנה).

- [ ] **Step 1:** להעביר את השמות לקומפוננטות: `<Section id="services" step="תחומי פעילות" ...>`, וכן הלאה לפי הרשימה ב־Global Constraints.
- [ ] **Step 2:** להחליף את ה־observer: scroll + resize, `requestAnimationFrame` פעם לפריים, `getBoundingClientRect().top` לכל שלב רשום, `resolveStep`. חישוב ראשון ב־mount ואחרי כל רישום.
- [ ] **Step 3:** נעילת לחיצה: `goTo`/`markClick` נועלים עד אירוע `scrollend` (גיבוי: 1500ms אם הדפדפן לא תומך או שלא הייתה גלילה), ובשחרור מחשבים מחדש. מוחקים את `CLICK_LOCK_MS = 800`.
- [ ] **Step 4:** `npm run lint && npm run build && node tests/e2e/active-section.test.js` → PASS (התפריט העליון וגוון המקטע הפעיל עובדים כמו קודם).
- [ ] **Step 5:** sync.

### Task 3: ה־stepper קורא מה־registry ועובר לימין

**Files:**
- Modify: `components/layout/ScrollStepper.tsx`, `components/layout/ScrollStepper.css`
- Test: `tests/e2e/stepper.test.js`

**Interfaces:**
- Consumes: `useSteps()` (Task 2). מוחקים מה־stepper את המערך `steps` ואת `inHero`; "ב־hero" = `currentStep === "top"`.

- [ ] **Step 1: לעדכן את הבדיקה כך שתיכשל**
  - `rail on the right`: ב־1440, `innerWidth - rail.getBoundingClientRect().left <= 60`, ו־`rail.right <= innerWidth - 8`.
  - `steps come from components`: 7 קישורים, ה־href וה־textContent בסדר של הרשימה.
  - `sweep matches geometry`: ב־1440×900 וב־1280×720, גלילה למטה ואז למעלה בקפיצות של 150 ושל 600px; אחרי כל קפיצה ו־120ms, ה־href של `[aria-current="step"]` שווה לשלב שמחושב בבדיקה מ־`readingLine` ומה־rect של כל `[data-step]`. אפס אי־התאמות.
  - `far jump holds target`: מ־y=0 לחיצה על "צור קשר"; דוגמים כל 50ms עד `scrollend`: ה־current הוא תמיד `#contact`; אחרי 300ms נוספים עדיין `#contact`.
  - `resize recomputes`: גלילה ל־`#process`, שינוי viewport ל־1280×600 → current נשאר תואם לגאומטריה.
  - `deep link`: `goto('/#knowledge')` → current `#knowledge` אחרי 500ms.
  - `mid desktop uses bar`: ב־1100×800 אין מסילה גלויה, הפס העליון מופיע אחרי גלילה מעבר ל־hero.
  - בדיקות הטלפון והגוון הכהה הקיימות נשארות.
- [ ] **Step 2:** `npm run build && node tests/e2e/stepper.test.js` → FAIL (`rail on the right`, `sweep matches geometry`).
- [ ] **Step 3:** CSS: `left` → `right` במסילה, במסלול ובתוויות (התווית ב־`right: 34px`, נפתחת שמאלה); breakpoint המסילה ל־`min-width: 1200px`, והפס העליון ל־`max-width: 1199px`. התווית הקבועה של השלב הנוכחי נשארת מ־1400px.
- [ ] **Step 4:** הבדיקה → PASS, ואז `npm run test:e2e` כולו → PASS.
- [ ] **Step 5:** צילומים ב־1440×900, 1280×720, 1100×800 ו־iPhone 13 ל־`design-review/2026-11-10-stepper-v2/`, לבדוק שהמסילה לא נוגעת בטקסט, בכפתורים, בטופס יצירת הקשר ובתמונת ה־hero. sync.

### Task 4: נקודת חיבור לשימושים הבאים

**Files:**
- Modify: `components/layout/ActiveSection.tsx` (תיעוד בלבד אם `useStepChange` כבר קיים מ־Task 2)
- Test: `tests/e2e/stepper.test.js`

**Interfaces:**
- Consumes: `useStepChange` (Task 2).
- Produces: `window` event `baloul:step` עם `detail: { id: StepId, prev: StepId | null }`, משוגר מה־provider בכל שינוי שלב. זה מה שאנליטיקס (GA4/GTM) או סקריפט חיצוני יכולים להאזין לו בלי לגעת ב־React.

- [ ] **Step 1: בדיקה** `step change event`: מאזינים ל־`baloul:step` לפני גלילה; גלילה מ־top ל־process → האירועים הם בדיוק `services` ואז `process` (בלי כפילויות), עם `prev` נכון.
- [ ] **Step 2:** → FAIL.
- [ ] **Step 3:** לשגר את האירוע בתוך ה־provider, באותו מקום שמעדכן את `currentStep`.
- [ ] **Step 4:** `npm run test:e2e` → PASS.
- [ ] **Step 5:** sync למק (כל הקבצים מ־Tasks 1–4), עדכון הזיכרון של הפרויקט ש־stepper הוא בצד ימין ושהשלבים נרשמים מהקומפוננטות.
