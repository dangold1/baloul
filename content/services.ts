export type Service = {
  id: string;
  /** URL of the service page, without a leading slash. */
  slug: string;
  num: string;
  title: string;
  /** Short label used in the domain strip and navigation. */
  navLabel: string;
  /** Matches an option in the lead form topic list. */
  topic: string;
  icon: "chart" | "coin" | "clock" | "shield";
  /** Phones only, home page list: one short line, under ~32 characters. Desktop shows `summary`. */
  tagline: string;
  /** One or two sentences: the problem and what we do about it. */
  summary: string;
  description: string;
  bullets: string[];
  /** Service page: <title>, meta description and the opening paragraph. */
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Heading above the bullet list on the service page. */
  checksHeading: string;
};

export const services: Service[] = [
  {
    id: "service-pension",
    slug: "pension-retirement",
    num: "01",
    title: "פנסיה ופרישה",
    navLabel: "פנסיה ופרישה",
    topic: "פנסיה ופרישה",
    icon: "clock",
    tagline: "כמה תקבלו, ומה לא לפספס.",
    summary:
      "כמה תקבלו בפרישה, כמה מס תשלמו ואיך לא לפספס זכויות. בודקים מוקדם ומלווים אתכם גם בתהליך הפרישה עצמו.",
    description:
      "פנסיה נכונה לא מתחילה ביום הפרישה. אנחנו בודקים שהחיסכון, הכיסויים והמסלולים מתאימים לאורך הדרך, ומתכננים מראש את המעבר לקצבה ואת היבטי המס.",
    bullets: ["תכנון פרישה וקיבוע זכויות", "קצבה מזכה וקצבה מוכרת", "טופס 161, רצף קצבה ורצף פיצויים", "מיסוי, משיכות, מקדמי קצבה ותיקון 190"],
    metaTitle: "פנסיה ותכנון פרישה בחולון | BALOUL",
    metaDescription:
      "בדיקת פנסיה, תכנון פרישה, קיבוע זכויות וטופס 161 עם ליווי אישי. סוכנות BALOUL בחולון, פעילות מקצועית מאז 2003. שיחת היכרות ללא התחייבות.",
    intro:
      "רוב האנשים מגלים מה יש להם בפנסיה רק כשהם מתקרבים לפרישה, ואז חלק מההחלטות כבר קשה לשנות. אנחנו בודקים את הפנסיה מוקדם, מסבירים בשפה פשוטה מה המצב, ומלווים אתכם בתהליך הפרישה עצמו, כולל הטפסים ומול פקיד השומה.",
    checksHeading: "מה בודקים בפנסיה ובפרישה",
  },
  {
    id: "service-insurance",
    slug: "insurance",
    num: "02",
    title: "ביטוח וניהול סיכונים",
    navLabel: "ביטוח",
    topic: "ביטוח וניהול סיכונים",
    icon: "shield",
    tagline: "כיסוי נכון, וליווי ביום התביעה.",
    summary:
      "ביטוחים כפולים, כיסויים חסרים ותביעה שנתקעת מול החברה. מסדרים את המעטפת ומלווים אתכם גם ביום שבו צריך אותה.",
    description:
      "אנחנו בוחנים את מערך הביטוח של המשפחה והעסק, מצמצמים כפילויות, משלימים פערים ומתאימים את הכיסויים כך שיהיו נכונים גם לשנים הבאות.",
    bullets: [
      "בריאות, חיים, מחלות קשות, אובדן כושר עבודה וסיעוד",
      "בית, רכב, עסק ואחריות מקצועית",
      "בדיקת כפל, התאמת כיסויים ושירות שוטף",
      "מערך תביעות, איסוף מסמכים, עבודה מול חברת הביטוח ומעקב עד סיום הטיפול",
    ],
    metaTitle: "ביטוח בריאות, חיים ועסק וליווי תביעות | BALOUL חולון",
    metaDescription:
      "בדיקת כפל ביטוחים, התאמת כיסויים לבריאות, חיים, בית, רכב ועסק, וליווי תביעות מול חברות הביטוח עד סיום הטיפול. סוכנות BALOUL בחולון, מאז 2003.",
    intro:
      "ביטוח הוא משהו שמשלמים עליו כל חודש ומקווים לא להשתמש בו. לכן קל לצבור כפילויות, ולגלות פער רק כשקורה משהו. אנחנו מרכזים את כל הפוליסות, מסדרים את המעטפת, ומלווים אתכם בתביעה מהמסמך הראשון ועד שהכסף מגיע.",
    checksHeading: "מה בודקים במעטפת הביטוח",
  },
  {
    id: "service-savings",
    slug: "savings-investments",
    num: "03",
    title: "חיסכון והשקעות",
    navLabel: "חיסכון והשקעות",
    topic: "חיסכון והשקעות",
    icon: "coin",
    tagline: "חיסכון שמתאים למטרה ולטווח.",
    summary:
      "כסף שיושב בעו״ש, קרן השתלמות שלא נבדקה שנים או תיק שלא ברור כמה הוא מסוכן. מתאימים את החיסכון למטרה, לטווח ולצורך בנזילות.",
    description:
      "לכל לקוח מתאימים את הדרך לפי הסכום, הטווח, הצורך בנזילות ורמת הסיכון. בוחנים מה כבר קיים ואילו אפשרויות מתאימות להמשך.",
    bullets: ["גמל להשקעה, קרנות השתלמות וקופות גמל", "פוליסות חיסכון", "חשבונות מסחר ותיקים מנוהלים", "IRA, תיקון 190, ניודים, מסלולים ודמי ניהול"],
    metaTitle: "חיסכון והשקעות: קרן השתלמות, גמל להשקעה, תיקון 190 | BALOUL",
    metaDescription:
      "התאמת החיסכון למטרה ולטווח: קרנות השתלמות, גמל להשקעה, פוליסות חיסכון, תיקון 190, מסלולים ודמי ניהול. ליווי אישי מסוכנות BALOUL בחולון, מאז 2003.",
    intro:
      "כסף שיושב בעו״ש מאבד ערך, וקרן השתלמות שלא נבדקה שנים עשויה לשבת במסלול לא מתאים עם דמי ניהול גבוהים. אנחנו מתחילים מהשאלה למה הכסף מיועד ומתי תצטרכו אותו, ורק אז בוחרים מוצר, מסלול ורמת סיכון.",
    checksHeading: "מה בודקים בחיסכון ובהשקעות",
  },
  {
    id: "service-financial",
    slug: "financial-planning",
    num: "04",
    title: "תכנון פיננסי",
    navLabel: "תכנון פיננסי",
    topic: "תכנון פיננסי",
    icon: "chart",
    tagline: "הכנסות, הלוואות וחסכון בתוכנית אחת.",
    summary:
      "הכנסות, הלוואות וחסכונות שמתנהלים כל אחד לחוד מקשים לדעת אם אתם בכיוון הנכון. בונים יחד תמונה אחת ותוכנית שאפשר לעמוד בה.",
    description:
      "אנחנו מלווים לקוחות בכל רמת הון, ומתחילים מהמצב האישי, מהיעדים ומהיכולת בפועל. בוחנים הכנסות, התחייבויות, חסכונות ונכסים, ובונים סדר כלכלי שמתאים להיום וגם לשנים קדימה.",
    bullets: ["תקציב ותזרים", "הלוואות, משכנתא וקרן חירום", "מטרות כמו דירה, ילדים, חיסכון ופרישה", "ליווי שוטף והתאמות לפי שינויים בחיים"],
    metaTitle: "תכנון פיננסי למשפחה ולעסק | BALOUL חולון",
    metaDescription:
      "סדר בהכנסות, בהלוואות ובחסכונות: תקציב ותזרים, משכנתא וקרן חירום, יעדים כמו דירה, ילדים ופרישה. ליווי אישי לאורך זמן מסוכנות BALOUL בחולון.",
    intro:
      "תכנון פיננסי הוא לא טבלת אקסל מסובכת. זו תמונה אחת ברורה של מה נכנס, מה יוצא, מה חייבים ומה חוסכים, ותוכנית שמתאימה לחיים שלכם בפועל. אחרי אירוע כמו לידה, דירה או עסק חדש, זה הזמן לעשות אותה מחדש.",
    checksHeading: "מה בודקים בתכנון הפיננסי",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
/** Service page path, for links from the home page and the schema. */
export const servicePath = (s: Pick<Service, "slug">) => `/${s.slug}`;

/** Topics offered in the lead forms. */
export const contactTopics = ["רוצה להבין מה נכון עבורי", "תכנון פיננסי", "חיסכון והשקעות", "פנסיה ופרישה", "ביטוח וניהול סיכונים", "משפחה / עסק", "נושא אחר"];
/** Desktop floating WhatsApp button: the topics in its hover bubble (Dan, 2026-11-10). Each opens WhatsApp with a ready message. */
export const whatsappTopics = ["פנסיה ופרישה", "ביטוח וניהול סיכונים", "חיסכון והשקעות", "תכנון פיננסי", "התייעצות כללית"];

export const popupTopics = ["רוצה להבין מה נכון עבורי", "פנסיה ופרישה", "ביטוח וניהול סיכונים", "חיסכון והשקעות", "תכנון פיננסי"];

/** English for each service, merged over the Hebrew by localizeService. Fields without English stay Hebrew. */
export const servicesEn: Record<string, Partial<Service>> = {
  "service-pension": {
    metaTitle: "Pension and Retirement Planning in Holon | BALOUL",
    metaDescription:
      "Pension review, retirement planning, Kibua Zchuyot (tax-exemption allocation) and Form 161, with personal guidance. BALOUL agency in Holon, serving clients since 2003. Free introductory call.",
    title: "Pension and retirement",
    navLabel: "Pension and retirement",
    tagline: "What you will get, and what not to miss.",
    summary:
      "How much you will receive at retirement, how much tax you will pay and how not to miss your entitlements. We check early and support you through the retirement process itself.",
    description:
      "A good pension does not start on retirement day. We check that your savings, cover and investment tracks fit along the way, and plan the move to a monthly pension and its tax aspects in advance.",
    bullets: [
      "Retirement planning and allocating your tax exemption (Kibua Zchuyot)",
      "Qualifying and recognized pension (Kitzba Mezaka / Mukeret)",
      "Form 161, pension continuity and severance continuity",
      "Tax, withdrawals, annuity factors and Amendment 190",
    ],
    intro:
      "Most people only find out what their pension holds as retirement approaches, when some decisions are already hard to change. We review your pension early, explain the situation in plain words, and support you through the retirement process itself, including the forms and the tax assessor.",
    checksHeading: "What we check in your pension and retirement",
  },
  "service-insurance": {
    metaTitle: "Health, Life and Business Insurance and Claims Support | BALOUL Holon",
    metaDescription:
      "Duplicate-cover checks, the right health, life, home, car and business cover, and claims support with the insurer until it is settled. BALOUL agency in Holon, since 2003.",
    title: "Insurance and risk management",
    navLabel: "Insurance",
    tagline: "The right cover, and support on claim day.",
    summary:
      "Duplicate policies, missing cover and a claim stuck with the insurer. We put your coverage in order and stand by you on the day you need it.",
    description:
      "We review the insurance set-up of your family and business, remove duplicates, close gaps and adjust your cover so it stays right for the years ahead.",
    bullets: [
      "Health, life, critical illness, loss of earning capacity and long-term care",
      "Home, car, business and professional liability",
      "Duplicate-cover check, matching cover to needs, and ongoing service",
      "Claims handling: gathering documents, working with the insurer and following up until it is settled",
    ],
    intro:
      "Insurance is something you pay for every month and hope never to use. That makes it easy to build up duplicates and only discover a gap when something happens. We gather all your policies in one place, put your coverage in order, and support your claim from the first document until the money arrives.",
    checksHeading: "What we check in your insurance",
  },
  "service-savings": {
    metaTitle: "Savings and Investments: Study Funds, Investment Provident Funds, Amendment 190 | BALOUL",
    metaDescription:
      "Savings matched to the goal and time frame: study funds (Keren Hishtalmut), investment provident funds, savings policies, Amendment 190, tracks and management fees. Personal guidance from BALOUL in Holon, since 2003.",
    title: "Savings and investments",
    navLabel: "Savings and investments",
    tagline: "Savings that fit the goal and the timeline.",
    summary:
      "Money sitting in a checking account, a study fund (Keren Hishtalmut) nobody has reviewed in years, or a portfolio with unclear risk. We match your savings to the goal, the time frame and your need for liquidity.",
    description:
      "For each client we choose the approach by the amount, the time frame, the need for liquidity and the level of risk. We look at what you already have and which options fit from here.",
    bullets: [
      "Investment provident funds, study funds (Keren Hishtalmut) and provident funds",
      "Savings policies",
      "Trading accounts and managed portfolios",
      "IRA, Amendment 190, transfers, investment tracks and management fees",
    ],
    intro:
      "Money sitting in a checking account loses value, and a study fund (Keren Hishtalmut) nobody has reviewed in years may be in the wrong track with high management fees. We start with what the money is for and when you will need it, and only then choose a product, a track and a level of risk.",
    checksHeading: "What we check in your savings and investments",
  },
  "service-financial": {
    metaTitle: "Financial Planning for Families and Businesses | BALOUL Holon",
    metaDescription:
      "Order in your income, loans and savings: budget and cash flow, mortgage and emergency fund, goals such as a home, children and retirement. Long-term personal guidance from BALOUL in Holon.",
    title: "Financial planning",
    navLabel: "Financial planning",
    tagline: "Income, loans and savings in one plan.",
    summary:
      "When income, loans and savings are each managed separately, it is hard to know whether you are on the right track. Together we build one picture and a plan you can stick to.",
    description:
      "We work with clients at every level of wealth, starting from your personal situation, your goals and what you can actually do. We look at income, commitments, savings and assets, and build a financial order that fits today and the years ahead.",
    bullets: [
      "Budget and cash flow",
      "Loans, mortgage and an emergency fund",
      "Goals such as a home, children, savings and retirement",
      "Ongoing support and adjustments as your life changes",
    ],
    intro:
      "Financial planning is not a complicated spreadsheet. It is one clear picture of what comes in, what goes out, what you owe and what you save, and a plan that fits the life you actually live. After an event like a new baby, a new home or a new business, it is time to make it again.",
    checksHeading: "What we check in financial planning",
  },
};

export const localizeService = (s: Service, lang: "he" | "en"): Service => (lang === "en" ? { ...s, ...servicesEn[s.id] } : s);

/** What visitors see for each lead topic in English. The submitted value stays Hebrew so the leads read the same in Netlify. */
const topicLabelsEn: Record<string, string> = {
  "רוצה להבין מה נכון עבורי": "I want to understand what is right for me",
  "תכנון פיננסי": "Financial planning",
  "חיסכון והשקעות": "Savings and investments",
  "פנסיה ופרישה": "Pension and retirement",
  "ביטוח וניהול סיכונים": "Insurance and risk management",
  "משפחה / עסק": "Family / business",
  "נושא אחר": "Something else",
  "התייעצות כללית": "General advice",
};

export const topicLabel = (topic: string, lang: "he" | "en") => (lang === "en" ? (topicLabelsEn[topic] ?? topic) : topic);
