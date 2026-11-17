export type Faq = {
  question: string;
  answer: string;
  /** Service page that shows this question. General questions have no service and appear on the home page. */
  serviceId?: string;
};

/** Knowledge center questions. Each page publishes the ones it shows as FAQPage structured data. */
export const faqs: Faq[] = [
  // General (home page)
  {
    question: "איך מתחילים לעשות סדר פיננסי?",
    answer:
      "מתחילים מריכוז ההכנסות, ההתחייבויות, החסכונות, הנכסים והמטרות. לאחר שהתמונה ברורה אפשר לקבוע סדר עדיפויות ולהחליט מה דורש שינוי ומה נכון להשאיר.",
  },
  {
    question: "מה צריך להכין לשיחה הראשונה?",
    answer:
      "כמעט כלום. בשיחה הראשונה מספיק לספר על המצב ועל מה שמטריד אתכם. אם יש בהישג יד דוחות שנתיים מקרן הפנסיה או רשימת ביטוחים, זה עוזר, אבל את רוב המידע אפשר לרכז יחד בהמשך.",
  },
  {
    question: "כמה זה עולה?",
    answer:
      "שיחת ההיכרות והבדיקה הראשונית הן ללא עלות וללא התחייבות. כסוכנות, התגמול שלנו מגיע מהגופים המוסדיים ומחברות הביטוח, לפי הדין, ואנחנו מפרטים את זה בעמוד גילוי נאות. אם במקרה מסוים נדרש שירות בתשלום, אומרים את זה מראש.",
  },
  {
    question: "איפה נפגשים?",
    answer:
      "המשרד שלנו נמצא ברחוב אהוד מנור 15 בחולון. אפשר להיפגש במשרד, וחלק גדול מהעבודה השוטפת נעשה גם בטלפון וב־WhatsApp, לפי מה שנוח לכם.",
  },

  // Pension and retirement
  {
    serviceId: "service-pension",
    question: "מתי כדאי לבדוק מחדש את הפנסיה?",
    answer:
      "שינוי מקום עבודה, שכר, מצב משפחתי או התקרבות לפרישה הם נקודות טבעיות לבדיקה. חשוב לוודא שההפקדות, המסלולים, הכיסויים ודמי הניהול עדיין מתאימים.",
  },
  {
    serviceId: "service-pension",
    question: "מה זה טופס 161 ולמה הוא חשוב?",
    answer:
      "טופס 161 הוא הטופס שהמעסיק ממלא בסיום העבודה, והוא קובע איך ימוסו כספי הפיצויים. הסימון שבוחרים בו (משיכה, רצף פיצויים או רצף קצבה) משפיע על המס גם שנים קדימה, ולכן כדאי להחליט עליו עם מישהו שרואה את התמונה המלאה.",
  },
  {
    serviceId: "service-pension",
    question: "מה זה קיבוע זכויות?",
    answer:
      "בגיל הפרישה בוחרים איך לנצל את הפטור ממס שמגיע לכם: על הקצבה החודשית, על משיכת כספים הוניים, או שילוב. הבחירה נעשית פעם אחת מול פקיד השומה וקשה לשנות אותה, ולכן מתכננים אותה מראש.",
  },
  {
    serviceId: "service-pension",
    question: "החלפתי מקום עבודה. מה קורה לפנסיה ולקרן ההשתלמות?",
    answer:
      "הכספים נשארים שלכם, אבל הקופה עוברת למעמד לא פעיל, הכיסויים הביטוחיים שבפנסיה עלולים להיפסק אחרי כמה חודשים, ודמי הניהול יכולים להשתנות. כדאי לבדוק מה קורה עם הקופה הישנה ולהחליט אם לאחד אותה עם החדשה.",
  },

  // Insurance
  {
    serviceId: "service-insurance",
    question: "איך בודקים אם מעטפת הביטוח מתאימה?",
    answer:
      "מרכזים את הכיסויים הקיימים, בודקים בריאות, חיים, הכנסה, נכסים ועסק, מזהים כפילויות ופערים ומתאימים את המעטפת לצרכים של היום ולשנים הבאות.",
  },
  {
    serviceId: "service-insurance",
    question: "מה קורה כשצריך להגיש תביעת ביטוח?",
    answer:
      "מלווים אתכם לאורך כל הדרך: עוזרים לאסוף את המסמכים, עובדים מול חברת הביטוח ועוקבים אחרי הטיפול עד שהוא מסתיים, כדי שלא תצטרכו להתמודד עם זה לבד.",
  },
  {
    serviceId: "service-insurance",
    question: "יש לי ביטוח בריאות דרך קרן הפנסיה וגם פרטי. זה כפל?",
    answer:
      "לא תמיד, אבל לעיתים קרובות כן. ביטוחי בריאות, מחלות קשות ואובדן כושר עבודה נמכרים גם בתוך הפנסיה וגם בנפרד, ואפשר לשלם פעמיים על כיסוי שמשולם רק פעם אחת. בודקים את כל הפוליסות יחד ומבטלים מה שמיותר.",
  },
  {
    serviceId: "service-insurance",
    question: "אני עצמאי. איזה ביטוח הכי חשוב לי?",
    answer:
      "לרוב העצמאים הפער הגדול הוא אובדן כושר עבודה: אין מעסיק שמשלם בזמן מחלה או פציעה. אחריו באים ביטוח בריאות, ביטוח חיים אם יש תלויים, וביטוח לעסק עצמו ולאחריות מקצועית, לפי התחום.",
  },

  // Savings and investments
  {
    serviceId: "service-savings",
    question: "מה חשוב לבדוק לפני שינוי חיסכון או השקעה?",
    answer:
      "בוחנים את טווח ההשקעה, הצורך בנזילות, רמת הסיכון, מסלולי ההשקעה, העלויות והשלכות הפעולה. המטרה היא להתאים את המבנה לצורך בפועל ולא רק להסתכל על ביצועי עבר.",
  },
  {
    serviceId: "service-savings",
    question: "קרן ההשתלמות שלי נזילה. למשוך או להשאיר?",
    answer:
      "קרן השתלמות נזילה היא אחד החסכונות היחידים שפטורים ממס רווחי הון, ולכן לרוב כדאי להשאיר את הכסף בה אם לא צריכים אותו. מה שכן כדאי לבדוק הוא המסלול ודמי הניהול, שאפשר לשנות בלי למשוך.",
  },
  {
    serviceId: "service-savings",
    question: "מה זה תיקון 190?",
    answer:
      "תיקון 190 מאפשר למי שעבר גיל 60 להפקיד כסף לקופת גמל וליהנות ממיסוי מופחת על הרווחים, ובתנאים מסוימים גם מקצבה פטורה ממס. הוא מתאים בעיקר למי שיש לו כבר קצבה מינימלית ורוצה לנהל כסף פנוי בצורה יעילה.",
  },
  {
    serviceId: "service-savings",
    question: "מה ההבדל בין גמל להשקעה לפוליסת חיסכון?",
    answer:
      "שניהם מוצרי חיסכון נזילים עם מסלולי השקעה ודחיית מס עד למשיכה. ההבדלים הם בתקרת ההפקדה השנתית, באפשרות להפוך את הכסף לקצבה פטורה ממס בפרישה (קיימת בגמל להשקעה) ובדמי הניהול. הבחירה תלויה בסכום ובמטרה.",
  },

  // Financial planning
  {
    serviceId: "service-financial",
    question: "כמה כסף צריך בקרן חירום?",
    answer:
      "כלל אצבע הוא שלושה עד שישה חודשי הוצאות, במקום נזיל שאפשר להגיע אליו מיד. לעצמאים או למי שההכנסה שלו משתנה, לרוב נכון לכוון לחלק הגבוה של הטווח.",
  },
  {
    serviceId: "service-financial",
    question: "כדאי לסגור הלוואות מהחיסכון?",
    answer:
      "תלוי בריבית על ההלוואה מול התשואה והנזילות של החיסכון, וגם במס שתשלמו על משיכה. הלוואה יקרה לרוב כדאי לסגור, אבל לא על חשבון קרן החירום או חיסכון עם הטבת מס. את זה בודקים מספרית, לא לפי תחושה.",
  },
  {
    serviceId: "service-financial",
    question: "כל כמה זמן צריך לעדכן את התוכנית?",
    answer:
      "פעם בשנה, וגם אחרי כל שינוי משמעותי: שינוי בהכנסה, לידה, דירה, עסק חדש או פרישה מתקרבת. אנחנו חוזרים אליכם לבדיקה כשמשהו כזה קורה.",
  },
];

/** Questions shown on the home page. */
export const homeFaqs = faqs.filter((f) => !f.serviceId);
/** Questions for one service page. */
export const faqsFor = (serviceId: string) => faqs.filter((f) => f.serviceId === serviceId);

/** English for the questions, keyed by the Hebrew question. A question without an entry stays Hebrew. */
export const faqEn: Record<string, Pick<Faq, "question" | "answer">> = {
  "איך מתחילים לעשות סדר פיננסי?": {
    question: "How do I start getting my finances in order?",
    answer:
      "Start by gathering your income, commitments, savings, assets and goals. Once the picture is clear, you can set priorities and decide what needs to change and what is right to leave as it is.",
  },
  "מה צריך להכין לשיחה הראשונה?": {
    question: "What should I prepare for the first call?",
    answer:
      "Almost nothing. In the first call it is enough to tell us about your situation and what is on your mind. If you have annual statements from your pension fund or a list of your insurance policies at hand, that helps, but we can gather most of the information together later.",
  },
  "כמה זה עולה?": {
    question: "How much does it cost?",
    answer:
      "The introductory call and the initial review are free and carry no obligation. As an agency, we are paid by the institutional bodies and insurance companies, as the law sets out, and we detail this on our disclosure page. If a particular case calls for a paid service, we say so up front.",
  },
  "איפה נפגשים?": {
    question: "Where do we meet?",
    answer:
      "Our office is at 15 Ehud Manor Street in Holon. You can meet us at the office, and much of the day-to-day work is also done by phone and WhatsApp, whichever suits you.",
  },
};

export const localizeFaq = (f: Faq, lang: "he" | "en"): Faq => (lang === "en" && faqEn[f.question] ? { ...f, ...faqEn[f.question] } : f);

Object.assign(faqEn, {
  "מתי כדאי לבדוק מחדש את הפנסיה?": {
    question: "When should I review my pension again?",
    answer:
      "A new job, a change in salary or family status, or approaching retirement are natural points to check. Make sure the contributions, investment tracks, cover and management fees still fit.",
  },
  "מה זה טופס 161 ולמה הוא חשוב?": {
    question: "What is Form 161 and why does it matter?",
    answer:
      "Form 161 is filled in by your employer when you leave a job, and it determines how your severance pay is taxed. The option you choose (withdrawal, severance continuity or pension continuity) affects your tax for years to come, so it is worth deciding with someone who sees the full picture.",
  },
  "מה זה קיבוע זכויות?": {
    question: "What is Kibua Zchuyot (tax-exemption allocation)?",
    answer:
      "At retirement age you choose how to use the tax exemption you are entitled to: on the monthly pension, on lump-sum withdrawals, or a mix. The choice is made once with the tax assessor and is hard to change, so it is planned in advance.",
  },
  "החלפתי מקום עבודה. מה קורה לפנסיה ולקרן ההשתלמות?": {
    question: "I changed jobs. What happens to my pension and study fund (Keren Hishtalmut)?",
    answer:
      "The money stays yours, but the fund becomes inactive, the insurance cover inside the pension may stop after a few months, and management fees can change. It is worth checking what happens with the old fund and deciding whether to merge it with the new one.",
  },
  "איך בודקים אם מעטפת הביטוח מתאימה?": {
    question: "How do I check whether my insurance fits?",
    answer:
      "We gather your existing cover, review health, life, income, property and business, spot duplicates and gaps, and adjust the coverage to your needs today and in the years ahead.",
  },
  "מה קורה כשצריך להגיש תביעת ביטוח?": {
    question: "What happens when I need to file an insurance claim?",
    answer:
      "We support you all the way: we help gather the documents, work with the insurance company and follow the claim until it is settled, so you don't have to handle it alone.",
  },
  "יש לי ביטוח בריאות דרך קרן הפנסיה וגם פרטי. זה כפל?": {
    question: "I have health insurance through my pension fund and a private one. Is that double cover?",
    answer:
      "Not always, but often yes. Health, critical illness and loss-of-earning-capacity insurance are sold both inside pension funds and separately, and you can end up paying twice for cover that only pays out once. We review all the policies together and cancel what is unnecessary.",
  },
  "אני עצמאי. איזה ביטוח הכי חשוב לי?": {
    question: "I'm self-employed. Which insurance matters most?",
    answer:
      "For most self-employed people the biggest gap is loss of earning capacity: there is no employer paying during illness or injury. After that come health insurance, life insurance if you have dependants, and insurance for the business itself and professional liability, depending on your field.",
  },
  "מה חשוב לבדוק לפני שינוי חיסכון או השקעה?": {
    question: "What should I check before changing a savings plan or investment?",
    answer:
      "Look at the time frame, the need for liquidity, the level of risk, the investment tracks, the costs and the consequences of the move. The aim is to fit the structure to your actual need, not just to look at past performance.",
  },
  "קרן ההשתלמות שלי נזילה. למשוך או להשאיר?": {
    question: "My study fund (Keren Hishtalmut) is now liquid. Should I withdraw or keep it?",
    answer:
      "A liquid study fund is one of the only savings exempt from capital gains tax, so it is usually worth keeping the money there if you don't need it. What is worth checking is the investment track and management fees, which you can change without withdrawing.",
  },
  "מה זה תיקון 190?": {
    question: "What is Amendment 190?",
    answer:
      "Amendment 190 lets people over 60 deposit money into a provident fund and enjoy reduced tax on the gains, and under certain conditions a tax-free pension as well. It mainly suits people who already have a minimum pension and want to manage spare money efficiently.",
  },
  "מה ההבדל בין גמל להשקעה לפוליסת חיסכון?": {
    question: "What's the difference between an investment provident fund and a savings policy?",
    answer:
      "Both are liquid savings products with investment tracks and tax deferral until withdrawal. The differences are the annual deposit cap, the option to turn the money into a tax-free pension at retirement (available in an investment provident fund) and the management fees. The choice depends on the amount and the goal.",
  },
  "כמה כסף צריך בקרן חירום?": {
    question: "How much should I keep in an emergency fund?",
    answer:
      "A rule of thumb is three to six months of expenses, somewhere liquid you can reach immediately. If you are self-employed or your income varies, aim for the higher end of the range.",
  },
  "כדאי לסגור הלוואות מהחיסכון?": {
    question: "Should I pay off loans from my savings?",
    answer:
      "It depends on the loan's interest compared with the return and liquidity of the savings, and on the tax you would pay on a withdrawal. An expensive loan is usually worth closing, but not at the expense of your emergency fund or tax-advantaged savings. We check this with numbers, not by feel.",
  },
  "כל כמה זמן צריך לעדכן את התוכנית?": {
    question: "How often should the plan be updated?",
    answer:
      "Once a year, and after any significant change: a change in income, a new baby, a new home, a new business or approaching retirement. We get back to you for a review when something like that happens.",
  },
});
