/** "When do people call us": real-life moments, each tagged with the service that answers them. */
export type Situation = { text: string; serviceId: string };

export const situations: Situation[] = [
  { text: "החלפתם מקום עבודה ולא בטוחים מה קרה לפנסיה ולקרן ההשתלמות.", serviceId: "service-pension" },
  { text: "הפרישה מתקרבת ואתם רוצים לדעת כמה תקבלו בפועל וכמה מס תשלמו.", serviceId: "service-pension" },
  { text: "קיבלתם טופס 161 מהמעסיק ולא ברור מה לסמן ומה המשמעות למס.", serviceId: "service-pension" },
  { text: "אתם משלמים על ביטוחים כל חודש ולא בטוחים מה בדיוק הם מכסים.", serviceId: "service-insurance" },
  { text: "קרה מקרה ביטוח ואתם צריכים מישהו שילווה את התביעה עד הסוף.", serviceId: "service-insurance" },
  { text: "פתחתם עסק או התחלתם לעבוד כעצמאים, ואין לכם ביטוח מפני אובדן כושר עבודה.", serviceId: "service-insurance" },
  { text: "יש כסף בצד ואתם רוצים להחליט איפה נכון להחזיק אותו.", serviceId: "service-savings" },
  { text: "קרן ההשתלמות נזילה כבר שנים ואף אחד לא בדק באיזה מסלול היא ומה דמי הניהול.", serviceId: "service-savings" },
  { text: "נולד ילד, קניתם דירה או פתחתם עסק, וצריך לעשות סדר מחדש.", serviceId: "service-financial" },
  { text: "יש כמה הלוואות במקביל ולא ברור אם נכון לאחד, לסגור או להשאיר.", serviceId: "service-financial" },
];

/** Six situations once shown on the home page (section removed 2026-11-10). Situations now appear only on the service pages. */
export const homeSituations = situations.filter((_, i) => [0, 1, 3, 4, 6, 8].includes(i));

/** How working with us looks, step by step. */
export type Step = { title: string; text: string };

export const steps: Step[] = [
  {
    title: "שיחת היכרות",
    text: "שיחה קצרה בטלפון, ב־WhatsApp או במשרד בחולון. מספרים לנו מה מטריד אתכם ומה חשוב לכם.",
  },
  {
    title: "מיפוי של מה שכבר יש",
    text: "בהרשאתכם מרכזים במקום אחד את הקופות, הפוליסות והחסכונות, כדי לראות את התמונה המלאה.",
  },
  {
    title: "הסבר והמלצות בשפה פשוטה",
    text: "מסבירים מה מצאנו, מה כדאי לשנות ומה נכון להשאיר כמו שהוא. ההחלטה נשארת אצלכם.",
  },
  {
    title: "ליווי לאורך השנים",
    text: "מטפלים בביצוע, זמינים לשאלות וחוזרים לבדוק כשמשהו משתנה בחיים.",
  },
];

export const stepsEn: Step[] = [
  {
    title: "An introductory call",
    text: "A short chat by phone, on WhatsApp or at our office in Holon. Tell us what worries you and what matters to you.",
  },
  {
    title: "Mapping what you already have",
    text: "With your permission we gather your funds, policies and savings in one place, so we can see the full picture.",
  },
  {
    title: "Plain-language advice",
    text: "We explain what we found, what is worth changing and what is right to leave as it is. The decision stays with you.",
  },
  {
    title: "Support over the years",
    text: "We handle the paperwork, stay available for questions and check in again when something in your life changes.",
  },
];

/** English for each situation, keyed by the Hebrew text. */
export const situationsEn: Record<string, string> = {
  "החלפתם מקום עבודה ולא בטוחים מה קרה לפנסיה ולקרן ההשתלמות.": "You changed jobs and aren't sure what happened to your pension and study fund (Keren Hishtalmut).",
  "הפרישה מתקרבת ואתם רוצים לדעת כמה תקבלו בפועל וכמה מס תשלמו.": "Retirement is getting close and you want to know how much you'll actually receive and how much tax you'll pay.",
  "קיבלתם טופס 161 מהמעסיק ולא ברור מה לסמן ומה המשמעות למס.": "You received Form 161 from your employer and it's not clear what to choose or what it means for your tax.",
  "אתם משלמים על ביטוחים כל חודש ולא בטוחים מה בדיוק הם מכסים.": "You pay for insurance every month and aren't sure what exactly it covers.",
  "קרה מקרה ביטוח ואתם צריכים מישהו שילווה את התביעה עד הסוף.": "Something happened and you need someone to see the claim through to the end.",
  "פתחתם עסק או התחלתם לעבוד כעצמאים, ואין לכם ביטוח מפני אובדן כושר עבודה.": "You opened a business or went self-employed, and you have no loss-of-earning-capacity insurance.",
  "יש כסף בצד ואתם רוצים להחליט איפה נכון להחזיק אותו.": "You have money set aside and want to decide where it's best to keep it.",
  "קרן ההשתלמות נזילה כבר שנים ואף אחד לא בדק באיזה מסלול היא ומה דמי הניהול.": "Your study fund has been liquid for years and nobody has checked its track or management fees.",
  "נולד ילד, קניתם דירה או פתחתם עסק, וצריך לעשות סדר מחדש.": "A baby arrived, you bought a home or opened a business, and things need sorting out again.",
  "יש כמה הלוואות במקביל ולא ברור אם נכון לאחד, לסגור או להשאיר.": "You have several loans at once and it's not clear whether to consolidate, close or keep them.",
};
