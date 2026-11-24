import type { Lang } from "../lib/i18n/languages";

/**
 * One-off interface copy (chrome, section headings, forms, dialogs). Hebrew is the source of truth.
 * Lists and long content (services, FAQ, journey, about, reviews) keep their Hebrew/English pairs in their own content files.
 */
export const he = {
  "skip.main": "דילוג לתוכן הראשי",

  "brand.homeLabel": "BALOUL עמוד הבית",
  "brand.logoAlt": "BALOUL פיננסים, פנסיה וביטוח",
  "brand.tagline": "פיננסים • פנסיה • ביטוח",

  "nav.home": "בית",
  "nav.services": "תחומי פעילות",
  "nav.process": "איך עובדים",
  "nav.about": "אודותינו",
  "nav.reviews": "לקוחות מספרים",
  "nav.knowledge": "שאלות נפוצות",
  "nav.contact": "צור קשר",
  "nav.call": "מעדיפים לדבר?",
  "nav.service-pension": "פנסיה ופרישה",
  "nav.service-insurance": "ביטוח",
  "nav.service-savings": "חיסכון והשקעות",
  "nav.service-financial": "תכנון פיננסי",

  "menu.open": "פתיחת תפריט ניווט",
  "menu.text": "תפריט",
  "menu.mainLabel": "ניווט ראשי",
  "menu.mobileLabel": "ניווט מובייל",

  "footer.about": "סוכנות לפיננסים, פנסיה וביטוח. פעילות מקצועית מאז {founded}, סוכנות מאז {agency}.",
  "footer.mailLabel": "מייל",
  "footer.servicesTitle": "תחומי פעילות",
  "footer.siteTitle": "האתר",
  "footer.legalTitle": "מידע משפטי",
  "footer.contactTitle": "יצירת קשר",
  "footer.knowledge": "מרכז ידע",
  "footer.phone": "טלפון: {phone}",
  "footer.address": "אהוד מנור 15, חולון",
  "footer.copyright": "© כל הזכויות שמורות BALOUL",
  "footer.cookies": "הגדרות עוגיות",
  "footer.legal.terms": "תנאי שימוש",
  "footer.legal.disclosure": "גילוי נאות",
  "footer.legal.privacy": "מדיניות פרטיות",
  "footer.legal.accessibility": "הצהרת נגישות",

  "lang.switchLabel": "שפה",
  "lang.he": "עברית",
  "lang.en": "English",

  "common.stars": "5 מתוך 5 כוכבים",
  "common.cta": "לתיאום שיחת היכרות",

  "hero.kicker": "סוכנות לפיננסים, פנסיה וביטוח • חולון",
  "hero.title": "ליווי אישי בפנסיה, בחיסכון ובביטוח,",
  "hero.titleSince": "מאז {year}.",
  "hero.lead":
    "כסף, פנסיה וביטוח משפיעים זה על זה, אבל לרוב מנוהלים כל אחד לחוד. אנחנו מרכזים את התמונה, מסבירים בשפה פשוטה מה קיים ומה חסר, ונשארים לצדכם גם אחרי שההחלטות התקבלו.",
  "hero.ctaServices": "לכל השירותים שלנו",
  "hero.factsLabel": "BALOUL בעובדות",
  "hero.factRating": "דירוג ב־Google, מעל 100 ביקורות",
  "hero.factYears": "פעילות מקצועית, {years} שנה",
  "hero.factAgency": "סוכנות פיננסים, פנסיה וביטוח",
  "hero.imageAlt": "צוות BALOUL במשרד",

  "services.title": "לפני שמתחילים, כדאי להבין.",
  "services.lead": "לא מתחילים ממוצר. מתחילים מהמצב שלכם, ומחברים בין כסף, פנסיה וביטוח לפי מה שבאמת נדרש.",
  "services.more": "לפרטים",

  "process.eyebrow": "איך עובדים איתנו",
  "process.title": "מה קורה אחרי שפונים?",
  "process.lead": "תהליך מסודר וברור, בקצב שלכם. בכל שלב אתם יודעים מה נבדק, למה, ומה הצעד הבא.",
  "process.note": "שיחה קצרה, בלי התחייבות.",

  "about.step": "מי אנחנו",
  "about.title": "יותר מעשרים שנה של ליווי לקוחות.",
  "about.intro":
    "היא סוכנות לפיננסים, פנסיה וביטוח הפועלת בחולון. הפעילות המקצועית החלה בשנת {founded}, ובשנת {agency} התרחבה לסוכנות שמלווה לקוחות בכל התחומים האלה יחד.",
  "about.more": "לקריאה נוספת עלינו",
  "about.timelineLabel": "ציוני דרך",
  "about.modalTitle": "ליווי אישי. ראייה רחבה.",
  "about.modalClose": "סגירת אודות",
  "about.teamAlt": "צוות BALOUL",

  "reviews.title": "מה אומרים עלינו לקוחות.",
  "reviews.lead": "כמה משפטים מתוך המלצות אמיתיות. את כל הביקורות, כפי שנכתבו, אפשר לקרוא ב־Google.",
  "reviews.googleLabel": "דירוג ב־Google",
  "reviews.allLink": "לכל הביקורות ב־Google",

  "knowledge.title": "שאלות שעולות כמעט בכל שיחה.",
  "knowledge.lead": "תשובות קצרות ובשפה ברורה. שאלות על פנסיה, ביטוח, חיסכון ותכנון נמצאות בעמוד של כל תחום.",
  "knowledge.byTopic": "שאלות לפי תחום:",

  "contact.title": "רוצים שנבדוק את זה יחד?",
  "contact.lead": "השאירו שם וטלפון ונחזור אליכם לשיחת היכרות קצרה. אפשר גם להתקשר או לכתוב לנו ישירות.",
  "contact.phone": "טלפון במשרד",
  "contact.email": "דוא״ל",
  "contact.office": "משרד",
  "contact.formTitle": "השאירו פרטים",
  "contact.nextLabel": "מה קורה אחרי השליחה",
  "contact.next1": "אחרי השליחה ייפתח WhatsApp עם הפרטים שמילאתם, ותוכלו להוסיף מה שתרצו.",
  "contact.next2": "נחזור אליכם לשיחה קצרה כדי להבין מה נכון לבדוק.",

  "form.name": "שם מלא",
  "form.phone": "טלפון",
  "form.topic": "במה נוכל לעזור?",
  "form.submit": "שליחה והמשך ב־WhatsApp",
  "form.notePre": "מסירת הפרטים נעשית מרצונכם ומשמשת לטיפול בפנייה וליצירת קשר. מידע נוסף ב",
  "form.noteLink": "מדיניות הפרטיות",
  "form.notePost": ".",
  "form.phoneError": "נא להזין מספר טלפון ישראלי תקין, למשל 050-1234567",
  "form.sent": "הפרטים התקבלו. WhatsApp נפתח להמשך השיחה.",
  "form.honeypot": "לא למלא",

  "popup.close": "סגירת חלון",
  "popup.eyebrow": "רוצים שנחזור אליכם?",
  "popup.title": "שיחה קצרה יכולה לעשות הרבה סדר.",
  "popup.text": "השאירו שם וטלפון ונחזור אליכם כדי להבין מה נכון לבדוק.",
  "popup.namePlaceholder": "איך קוראים לכם",
  "popup.topic": "מה תרצו לבדוק?",
  "popup.privacy": "הפרטים משמשים רק לחזרה אליכם ולמענה לפנייה.",

  "consent.title": "האתר משתמש בעוגיות",
  "consent.text": "למדידה ולשיפור החוויה.",
  "consent.accept": "אישור",
  "consent.decline": "דחייה",

  "wa.call": "התקשרו אלינו",
  "wa.menuTitle": "אשמח ליצור קשר בנושא:",
  "wa.close": "סגירה",
  "wa.note": "ייפתח WhatsApp עם הודעה מוכנה, ואפשר לשנות אותה לפני השליחה.",

  "service.crumbsLabel": "מיקום באתר",
  "service.factsLabel": "BALOUL בקצרה",
  "service.factActive": "פעילות מקצועית",
  "service.factSince": "מאז {year}",
  "service.factOffice": "משרד בחולון",
  "service.street": "אהוד מנור 15",
  "service.situationsEyebrow": "מתי פונים אלינו בנושא הזה",
  "service.situationsTitle": "נשמע מוכר?",
  "service.situationLink": "לשיחה על זה",
  "service.checksEyebrow": "מה כולל השירות",
  "service.faqTitle": "שאלות על {topic}",
  "service.faqLead": "המידע כללי. לכל מצב אישי נשמח לענות בשיחה.",
  "service.contactLead": "השאירו שם וטלפון ונחזור אליכם לשיחת היכרות קצרה על {topic}. אפשר גם להתקשר או לכתוב לנו ישירות.",
  "service.others": "תחומים נוספים",

  "common.home": "עמוד הבית",
  "common.backHome": "חזרה לעמוד הבית",
  "legal.kicker": "BALOUL • מידע משפטי",
  "legal.tabsLabel": "מסמכים משפטיים",
  "legal.notice": "",
  "notFound.title": "העמוד לא נמצא",

  "stepper.label": "התקדמות בדף",
} as const;

export type DictKey = keyof typeof he;

/** English copy. An empty entry shows the Hebrew text. */
export const en: Record<DictKey, string> = {
  "skip.main": "Skip to main content",

  "brand.homeLabel": "BALOUL home page",
  "brand.logoAlt": "BALOUL finance, pensions and insurance",
  "brand.tagline": "Finance • Pensions • Insurance",

  "nav.home": "Home",
  "nav.services": "Services",
  "nav.process": "How we work",
  "nav.about": "About us",
  "nav.reviews": "Reviews",
  "nav.knowledge": "FAQ",
  "nav.contact": "Contact us",
  "nav.call": "Prefer to talk?",
  "nav.service-pension": "Pension and retirement",
  "nav.service-insurance": "Insurance",
  "nav.service-savings": "Savings and investments",
  "nav.service-financial": "Financial planning",

  "menu.open": "Open navigation menu",
  "menu.text": "Menu",
  "menu.mainLabel": "Main navigation",
  "menu.mobileLabel": "Mobile navigation",

  "footer.about": "An agency for finance, pensions and insurance. Serving clients since {founded}, a full agency since {agency}.",
  "footer.mailLabel": "Email",
  "footer.servicesTitle": "Services",
  "footer.siteTitle": "Explore",
  "footer.legalTitle": "Legal",
  "footer.contactTitle": "Get in touch",
  "footer.knowledge": "FAQ",
  "footer.phone": "Phone: {phone}",
  "footer.address": "15 Ehud Manor St., Holon",
  "footer.copyright": "© All rights reserved BALOUL",
  "footer.cookies": "Cookie settings",
  "footer.legal.terms": "Terms of use",
  "footer.legal.disclosure": "Disclosure",
  "footer.legal.privacy": "Privacy policy",
  "footer.legal.accessibility": "Accessibility statement",

  "lang.switchLabel": "Language",
  "lang.he": "עברית",
  "lang.en": "English",

  "common.stars": "5 out of 5 stars",
  "common.cta": "Book an introductory call",

  "hero.kicker": "An agency for finance, pensions and insurance • Holon",
  "hero.title": "Personal guidance on pensions, savings and insurance,",
  "hero.titleSince": "since {year}.",
  "hero.lead":
    "Money, pensions and insurance affect one another, yet each is usually managed on its own. We bring the picture together, explain in plain words what you have and what is missing, and stay by your side after the decisions are made.",
  "hero.ctaServices": "All our services",
  "hero.factsLabel": "BALOUL in facts",
  "hero.factRating": "Google rating, over 100 reviews",
  "hero.factYears": "{years} years of experience",
  "hero.factAgency": "Finance, pensions and insurance agency",
  "hero.imageAlt": "The BALOUL team at the office",

  "services.title": "Understand first, then decide.",
  "services.lead":
    "We don't start with a product. We start with your situation, and connect money, pensions and insurance according to what is really needed.",
  "services.more": "Details",

  "process.eyebrow": "How we work with you",
  "process.title": "What happens after you reach out?",
  "process.lead": "A clear, orderly process at your pace. At every stage you know what is being checked, why, and what comes next.",
  "process.note": "A short call, no obligation.",

  "about.step": "Who we are",
  "about.title": "More than twenty years of supporting clients.",
  "about.intro":
    "is an agency for finance, pensions and insurance based in Holon. Our professional work began in {founded}, and in {agency} it grew into an agency that supports clients across all of these areas together.",
  "about.more": "Read more about us",
  "about.timelineLabel": "Milestones",
  "about.modalTitle": "Personal service. The full picture.",
  "about.modalClose": "Close about",
  "about.teamAlt": "The BALOUL team",

  "reviews.title": "What our clients say.",
  "reviews.lead": "A few lines from real recommendations. You can read all the reviews, as they were written, on Google.",
  "reviews.googleLabel": "Google rating",
  "reviews.allLink": "All reviews on Google",

  "knowledge.title": "Questions that come up in almost every call.",
  "knowledge.lead":
    "Short answers in clear language. Questions about pensions, insurance, savings and planning are on each service's page.",
  "knowledge.byTopic": "Questions by topic:",

  "contact.title": "Want us to look at it together?",
  "contact.lead": "Leave your name and phone number and we'll get back to you for a short introductory call. You can also call or message us directly.",
  "contact.phone": "Office phone",
  "contact.email": "Email",
  "contact.office": "Office",
  "contact.formTitle": "Leave your details",
  "contact.nextLabel": "What happens after you send",
  "contact.next1": "After you send, WhatsApp opens with the details you filled in, and you can add anything you like.",
  "contact.next2": "We'll call you back for a short chat to understand what is worth checking.",

  "form.name": "Full name",
  "form.phone": "Phone",
  "form.topic": "How can we help?",
  "form.submit": "Send and continue on WhatsApp",
  "form.notePre": "You share your details by choice; we use them to handle your request and contact you. More in our ",
  "form.noteLink": "privacy policy",
  "form.notePost": ".",
  "form.phoneError": "Please enter a valid Israeli phone number, for example 050-1234567",
  "form.sent": "Details received. WhatsApp opened to continue the conversation.",
  "form.honeypot": "Do not fill",

  "popup.close": "Close window",
  "popup.eyebrow": "Want us to call you back?",
  "popup.title": "A short call can bring real clarity.",
  "popup.text": "Leave your name and phone number and we'll get back to you to understand what is worth checking.",
  "popup.namePlaceholder": "Your name",
  "popup.topic": "What would you like to check?",
  "popup.privacy": "Your details are used only to get back to you and answer your request.",

  "consent.title": "This site uses cookies",
  "consent.text": "We use them to measure and improve your experience.",
  "consent.accept": "Accept",
  "consent.decline": "Decline",

  "wa.call": "Call us",
  "wa.menuTitle": "I'd like to get in touch about:",
  "wa.close": "Close",
  "wa.note": "WhatsApp opens with a ready message, and you can edit it before sending.",

  "service.crumbsLabel": "Breadcrumb",
  "service.factsLabel": "BALOUL at a glance",
  "service.factActive": "Experience",
  "service.factSince": "Since {year}",
  "service.factOffice": "Office in Holon",
  "service.street": "15 Ehud Manor St.",
  "service.situationsEyebrow": "When people come to us about this",
  "service.situationsTitle": "Sounds familiar?",
  "service.situationLink": "Let's talk about it",
  "service.checksEyebrow": "What the service includes",
  "service.faqTitle": "Questions about {topic}",
  "service.faqLead": "This is general information. We'll gladly answer about your own situation in a call.",
  "service.contactLead":
    "Leave your name and phone number and we'll get back to you for a short introductory call about {topic}. You can also call or message us directly.",
  "service.others": "Other services",

  "common.home": "Home",
  "common.backHome": "Back to the home page",
  "legal.kicker": "BALOUL • Legal",
  "legal.tabsLabel": "Legal documents",
  "legal.notice": "This English version is provided for convenience. The Hebrew version is the binding one.",
  "notFound.title": "Page not found",

  "stepper.label": "Page progress",
};

const dictionaries: Record<Lang, Record<DictKey, string>> = { he, en };

/** The entry for a key, with {name} placeholders filled. An empty English entry falls back to Hebrew. */
export function translate(lang: Lang, key: DictKey, vars?: Record<string, string | number>): string {
  const text = dictionaries[lang][key] || he[key];
  return vars ? text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m)) : text;
}
