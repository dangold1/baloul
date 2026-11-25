# BALOUL – דף נחיתה (Next.js)

האתר baloul.co.il, בנוי ב־Next.js (App Router) ומיוצא כקבצים סטטיים ל־Netlify.
עברית בכתובות `/…`, אנגלית ב־`/en/…`.
הגרסה הקודמת (קובץ index.html יחיד) שמורה בתיקייה `_legacy/` ולא עולה לאוויר.
כללי הקומפוננטות (שכבות, שרת/לקוח, איך מוסיפים מקטע, שירות או חלון) מתועדים ב־`AGENTS.md`.

## הרצה מקומית

דרוש Node.js 20 ומעלה. פורט 3100 בלבד (3000-3002 שמורים לפרויקטים אחרים).

```bash
npm install
npm run dev -- -p 3100        # פיתוח: http://localhost:3100
npm run build                 # בנייה מלאה לתיקייה out/
npx serve@14 out -l 3100      # הצגת תוצאת ה־build: http://localhost:3100
```

בדיקות: `npm run lint && npm run test:unit && npm run build && npm run test:markup && npm run test:e2e`.

טפסי Netlify לא נקלטים בהרצה מקומית (WhatsApp כן נפתח). הם עובדים רק אחרי פריסה ל־Netlify.

## איפה משנים מה

| מה רוצים לשנות | קובץ |
|---|---|
| טלפון, וואטסאפ, מייל, כתובת, תמונות | `content/site.ts` |
| טקסטים קבועים בעברית ובאנגלית (כותרות, כפתורים, תפריט) | `content/dictionary.ts` |
| תחומי פעילות (כרטיסים, תפריט, נושאי טופס) | `content/services.ts` |
| שאלות נפוצות (כלליות בבית, לפי תחום בעמודי השירות) | `content/faq.ts` |
| עמודי השירות: כתובת (slug), כותרת ומטא, פתיח | `content/services.ts` |
| המלצות ודירוג גוגל | `content/reviews.ts` |
| טקסט "אודותינו", ציוני דרך ועקרונות | `content/about.ts` |
| "מתי פונים אלינו" ושלבי העבודה | `content/journey.ts` |
| תנאי שימוש, פרטיות, גילוי נאות, נגישות | `content/legal.ts` |
| הודעת WhatsApp לפי נושא | `lib/whatsapp.ts` |
| מיקום באנר העוגיות (`modal` או `bar`) | `content/site.ts` → `consentConfig` |

## מבנה

```
app/                 נתיבים: app/(he) לעברית, app/(en)/en לאנגלית; בכל אחד בית ו־[slug] לעמודי השירות (/pension-retirement וכו') והעמודים המשפטיים (/privacy וכו'); sitemap, robots, manifest
components/pages     HomePage, SubPage: העמודים המלאים ש־app/ מציג
components/ui        אבני בסיס: ButtonLink, Stars, Logo, Dialog, Icons, SectionHeading
components/blocks    חלקים משותפים לבית ולעמודי השירות: ContactBlock, FaqList, StepsList, ReviewCard ועוד
components/service   ServicePage: תבנית אחת לארבעת עמודי השירות
components/layout    PageChrome, Header, MobileMenu, Footer, FloatingWhatsApp, Section, ActiveSection, ScrollStepper
components/sections Hero, Services (+ServiceCard), Process, About, Reviews, Knowledge, Contact
components/i18n      LanguageProvider (useLanguage), LanguageSwitch
components/lead      ContactForm, LeadPopup, LeadFields, useLeadSubmit (זרימת הליד המשותפת)
components/consent   CookieConsent, CookieSettingsLink
components/analytics TagManager (GTM אחרי הסכמה), ClickTracker
components/about     AboutModal, AboutLink
components/seo       JsonLd (InsuranceAgency + FAQPage)
content/             כל הטקסטים והנתונים; content/localized.ts (getContent) מחזיר אותם בשפה המבוקשת
lib/                 i18n (makeI18n), contact, dom, cx, useDismiss, steps, whatsapp, netlify-forms, analytics, consent
styles/              base.css (טוקנים: צבעים, פונטים, ריווח) + shared.css (כפתורים, שדות, כותרות) + index.ts
.agents/             product-marketing.md: הקשר שיווקי (קהל, שפה, הוכחות) לשימוש בכלי השיווק
public/llms.txt      תקציר הסוכנות למנועי חיפוש מבוססי AI
```

כל קומפוננטה יושבת ליד קובץ ה־CSS שלה ומעצבת רק את המחלקות שלה. צבעים ופונטים משנים ב־`styles/base.css` (`:root`).
כותרות: Frank Ruhl Libre. טקסט: Heebo. הפונטים נטענים ע"י Next בזמן build (`app/fonts.ts`).

## סדר העמוד

Hero (כותרת, פעולה, עובדות: 2003 / 2014 / דירוג Google) → תחומי פעילות →
"איך עובדים איתנו" → מי אנחנו → לקוחות מספרים → מרכז ידע (FAQ) → יצירת קשר.
"נשמע מוכר?" (מצבים מהחיים) מופיע בעמודי השירות בלבד.
במובייל יש פס תחתון קבוע עם "התקשרו אלינו" ו־WhatsApp.

## מקטע פעיל (active section)

רשימת מקטעי דף הבית נמצאת ב־`content/sections.ts`. `ActiveSectionProvider` (`components/layout/ActiveSection.tsx`) מחזיק איזה מקטע פעיל:
המקטע שנלחץ (`Section` עוטף כל `<section>`), שאליו ניווטו (`NavLink` מסמן `aria-current`) או שנגלל למרכז המסך. ה־CSS צובע לפי `data-active` ו־`aria-current`.
בדיקות קצה לקצה (Playwright, אחרי `npm run build`): `npm run test:e2e`.

## עמודי שירות

ארבעה עמודים, לפי סדר עדיפות: `/pension-retirement`, `/insurance`, `/savings-investments`, `/financial-planning`.
כולם נבנים מאותה תבנית (`components/service/ServicePage.tsx`): פתיח → מצבים מהחיים → מה בודקים → 4 שלבים → שאלות של התחום → ביקורת אחת → טופס עם הנושא מסומן.
כרטיסי השירות, "נשמע מוכר?" והתפריט בבית מקשרים לעמודים האלה. לכל עמוד יש Schema מסוג Service + BreadcrumbList + FAQPage, והוא רשום ב־sitemap וב־`public/llms.txt`.
אירוע `generate_lead` כולל `page`: הנתיב שממנו נשלח הליד.

## זרימת ליד

1. בדיקת שם וטלפון ישראלי תקין.
2. אירוע `generate_lead` ל־dataLayer (form: contact/popup, topic).
3. שליחה ל־Netlify Forms ברקע (`contact-lead` / `popup-lead`).
4. פתיחת WhatsApp ל־054-9194771 עם הודעה מוכנה לפי הנושא. במובייל באותו טאב, במחשב בטאב חדש.

הפופאפ מופיע פעם אחת בביקור, אחרי גלילה של חצי עמוד, לא אחרי שכבר נשלח ליד ולא מעל באנר העוגיות.

## מדידה ועוגיות (GTM)

- Consent Mode v2 מוגדר כ־denied כברירת מחדל ב־`<head>`.
- GTM נטען **רק אחרי "אישור"**, ורק אם הוגדר מזהה:
  העתיקו `.env.example` ל־`.env.local` (ובהגדרות Netlify → Environment variables) ומלאו `NEXT_PUBLIC_GTM_ID`.
- את GA4, המרות Google Ads ו־Meta Pixel מגדירים בתוך GTM על האירועים:
  `generate_lead`, `click_whatsapp`, `click_phone`, `click_email`, `popup_view`, `lead_submit_error`.
- "הגדרות עוגיות" בפוטר פותח מחדש את הבחירה.
- אימות Google Search Console: למלא `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (ב־`.env.local` ובהגדרות Netlify). תג האימות מופיע בכל עמוד רק כשהמשתנה מוגדר.

## SEO ו־GEO

`app/robots.ts`, `app/sitemap.ts` (hreflang he/en, lastmod) ו־`app/manifest.ts` נבנים בזמן build. מטא לכל עמוד ב־`lib/seo.ts`, סכמות ב־`components/seo/JsonLd.tsx`, תקציר למנועי AI ב־`public/llms.txt` (עברית ואנגלית).
`npm run test:markup` בודק גם SEO על תוצאת ה־build: כותרת עד 70 תווים, תיאור עד 160, h1 אחד, canonical ו־hreflang, JSON-LD תקין, התאמה בין העמודים ל־sitemap, robots, manifest ו־llms.txt.

## פריסה ל־Netlify

`netlify.toml` מוגדר: build command `npm run build`, publish `out`.
אפשר גם להריץ `npm run build` ולגרור את תיקיית `out/` ל־Netlify (Deploys → drag and drop).
אחרי הפריסה הראשונה: לוודא ב־Netlify → Forms ששני הטפסים מופיעים, ולשלוח ליד בדיקה.
