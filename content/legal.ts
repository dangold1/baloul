export type LegalSection = { heading: string; paragraphs: string[]; items: string[] };
export type LegalDoc = { slug: string; title: string; tabLabel: string; intro: string; sections: LegalSection[] };

export const legalDocs: LegalDoc[] = [
  {
    "slug": "terms",
    "title": "תנאי שימוש",
    "intro": "ברוכים הבאים לאתר BALOUL. השימוש באתר כפוף לתנאים שלהלן.",
    "sections": [
      {
        "heading": "1. מטרת האתר",
        "paragraphs": [
          "האתר נועד להציג מידע כללי על הסוכנות, תחומי הפעילות והשירותים, ולאפשר יצירת קשר. השימוש באתר כפוף לדין החל בישראל."
        ],
        "items": []
      },
      {
        "heading": "2. המידע באתר אינו ייעוץ אישי",
        "paragraphs": [
          "התוכן באתר הוא מידע כללי בלבד ואינו מהווה ייעוץ השקעות, ייעוץ מס, ייעוץ משפטי או המלצה אישית לביצוע פעולה. החלטות בנושאי פיננסים, פנסיה וביטוח מחייבות בחינה פרטנית של נתוני הלקוח, צרכיו ומטרותיו."
        ],
        "items": []
      },
      {
        "heading": "3. מידע על מוצרים וגופים חיצוניים",
        "paragraphs": [
          "מידע הנוגע למוצרים של חברות ביטוח, גופים מוסדיים, בתי השקעות או ספקים אחרים עשוי להשתנות. התנאים המחייבים הם התנאים והמסמכים של הגוף הרלוונטי במועד ההתקשרות."
        ],
        "items": []
      },
      {
        "heading": "4. פנייה דרך האתר",
        "paragraphs": [
          "שליחת טופס, הודעת WhatsApp או דוא״ל אינה יוצרת כיסוי ביטוחי, אינה מבצעת פעולה פיננסית או פנסיונית ואינה מהווה אישור עסקה. פעולה תושלם רק לאחר ביצוע התהליך הנדרש וקבלת האישורים הרלוונטיים."
        ],
        "items": []
      },
      {
        "heading": "5. קניין רוחני ושימוש באתר",
        "paragraphs": [
          "העיצוב, הלוגו, הטקסטים והחומרים באתר מוגנים בדין. אין להעתיק או לעשות בהם שימוש מסחרי ללא אישור מראש. אין לעשות באתר שימוש בלתי חוקי או לנסות לפגוע בפעילותו."
        ],
        "items": []
      },
      {
        "heading": "6. קישורים ושירותים של צדדים שלישיים",
        "paragraphs": [
          "האתר עשוי לכלול קישורים למערכות ושירותים חיצוניים. השימוש בהם כפוף לתנאים ולמדיניות של אותם צדדים."
        ],
        "items": []
      },
      {
        "heading": "7. פרטיות",
        "paragraphs": [
          "מידע אישי שיימסר באתר יטופל בהתאם למדיניות הפרטיות ולהוראות הדין."
        ],
        "items": []
      },
      {
        "heading": "8. זמינות ועדכונים",
        "paragraphs": [
          "אנו פועלים לשמור על האתר מדויק וזמין, אך ייתכנו שינויים, טעויות או תקלות. תנאים אלה עשויים להתעדכן מעת לעת."
        ],
        "items": []
      }
    ],
    "tabLabel": "תנאי שימוש"
  },
  {
    "slug": "disclosure",
    "title": "גילוי נאות",
    "intro": "מידע כללי על אופי פעילות BALOUL, השירותים המוצעים והקשרים עם גופים פיננסיים וביטוחיים.",
    "sections": [
      {
        "heading": "1. פעילות הסוכנות",
        "paragraphs": [
          "BALOUL פועלת בתחומי הביטוח, הפנסיה והפיננסים בהתאם לדין ובאמצעות בעלי רישיון מתאימים לפי סוג השירות."
        ],
        "items": []
      },
      {
        "heading": "2. אופי השירות",
        "paragraphs": [
          "הסוכנות מסייעת בבחינת צרכים, התאמת פתרונות, טיפול ושירות בתחומי ביטוח, פנסיה וחיסכון פיננסי. התאמה אישית נעשית במסגרת תהליך מסודר ובהתחשב בנתוני הלקוח."
        ],
        "items": []
      },
      {
        "heading": "3. התקשרויות ותגמול",
        "paragraphs": [
          "הסוכנות עשויה לעבוד עם חברות ביטוח, גופים מוסדיים ובתי השקעות, ועשויה לקבל מהם עמלות או תגמולים בהתאם להסכמים ולהוראות הדין. היקף ותנאי התגמול עשויים להשתנות בין גופים ומוצרים."
        ],
        "items": []
      },
      {
        "heading": "4. ניגודי עניינים",
        "paragraphs": [
          "כאשר עשויה להתקיים זיקה או עניין שיש בהם להשפיע על השירות, נפעל בהתאם לחובות החלות עלינו, לרבות חובות גילוי, תיעוד והתאמה לפי העניין."
        ],
        "items": []
      },
      {
        "heading": "5. סיכונים ותשואות",
        "paragraphs": [
          "אין התחייבות להשגת תשואה כלשהי. ביצועי עבר אינם מבטיחים ביצועים עתידיים, ומוצרים פיננסיים ופנסיוניים עשויים להיות חשופים לסיכוני שוק, מיסוי, רגולציה, דמי ניהול ותנאים נוספים."
        ],
        "items": []
      },
      {
        "heading": "6. מידע באתר",
        "paragraphs": [
          "התוכן באתר הוא מידע כללי ואינו מחליף בחינה אישית המתחשבת בצרכים, בנתונים ובמאפיינים של כל לקוח."
        ],
        "items": []
      }
    ],
    "tabLabel": "גילוי נאות"
  },
  {
    "slug": "privacy",
    "title": "מדיניות פרטיות",
    "intro": "מדיניות זו מסבירה איזה מידע עשוי להיאסף באתר, כיצד הוא משמש ובאילו נסיבות הוא עשוי להימסר.",
    "sections": [
      {
        "heading": "1. פרטים שאתם מוסרים",
        "paragraphs": [
          "כאשר אתם פונים אלינו, ייתכן שנקבל פרטים כגון שם, טלפון, דוא״ל ותוכן הפנייה, וכן מידע נוסף שתבחרו למסור לצורך טיפול בבקשה."
        ],
        "items": []
      },
      {
        "heading": "2. מידע טכני",
        "paragraphs": [
          "בעת גלישה עשוי להיאסף מידע טכני בסיסי כגון כתובת IP, סוג מכשיר ודפדפן, זמני גישה ונתוני אבטחה. האתר עשוי להשתמש בעוגיות או בכלי מדידה, ככל שיופעלו."
        ],
        "items": []
      },
      {
        "heading": "3. מטרות השימוש",
        "paragraphs": [],
        "items": [
          "מענה לפניות ותיאום שיחות או פגישות.",
          "מתן שירות ותיעוד טיפול בפנייה.",
          "תפעול, אבטחה ושיפור האתר.",
          "עמידה בדרישות דין ורגולציה."
        ]
      },
      {
        "heading": "4. מסירת מידע לצדדים שלישיים",
        "paragraphs": [
          "מידע עשוי להימסר לספקי שירות המסייעים בתפעול האתר והעסק, או לגופים מקצועיים ומוסדיים כאשר הדבר נדרש לצורך שירות שביקשתם ובהתאם לדין. איננו מוכרים מידע אישי לצדדים שלישיים."
        ],
        "items": []
      },
      {
        "heading": "5. שמירת מידע וזכויות",
        "paragraphs": [
          "מידע יישמר למשך הזמן הדרוש למטרות שלשמן נאסף ובהתאם לחובות החלות עלינו. בכפוף לדין, ניתן לפנות אלינו בבקשה לעיין במידע, לתקנו או לבקש את מחיקתו כאשר הדבר אפשרי."
        ],
        "items": []
      },
      {
        "heading": "6. אבטחת מידע",
        "paragraphs": [
          "אנו נוקטים אמצעים סבירים להגנה על מידע, אך אין מערכת מקוונת החסינה לחלוטין מסיכונים."
        ],
        "items": []
      },
      {
        "heading": "7. עוגיות וכלי מדידה",
        "paragraphs": [
          "בכניסה לאתר תתבקשו לאשר או לדחות שימוש בעוגיות למדידה ולשיווק (כגון Google Analytics, Google Ads ו-Meta). כלים אלה מופעלים רק לאחר אישורכם. עוגיות הכרחיות לתפעול האתר אינן דורשות אישור.",
          "ניתן לשנות את הבחירה בכל עת דרך הקישור \"הגדרות עוגיות\" בתחתית האתר."
        ],
        "items": []
      }
    ],
    "tabLabel": "פרטיות"
  },
  {
    "slug": "accessibility",
    "title": "הצהרת נגישות",
    "intro": "BALOUL רואה חשיבות במתן שירות נגיש ושוויוני ופועלת לשיפור נגישות האתר והשירותים הדיגיטליים.",
    "sections": [
      {
        "heading": "1. התאמות באתר",
        "paragraphs": [
          "האתר נבנה במטרה לתמוך בגלישה ברורה ונוחה במחשב ובמובייל, תוך התייחסות למבנה תוכן, ניגודיות, תוויות, ניווט מקלדת וטקסטים חלופיים לתמונות משמעותיות."
        ],
        "items": []
      },
      {
        "heading": "2. רכיבי צד שלישי",
        "paragraphs": [
          "ייתכנו באתר רכיבים חיצוניים כגון מפות, רשתות חברתיות או מערכות טפסים. אנו משתדלים לבחור פתרונות נגישים ככל האפשר, אך ייתכנו מגבלות שאינן בשליטתנו."
        ],
        "items": []
      },
      {
        "heading": "3. נגישות וקבלת שירות",
        "paragraphs": [
          "אם אתם זקוקים להתאמת נגישות לצורך פגישה או קבלת שירות, ניתן ליצור איתנו קשר מראש כדי שנוכל לתאם מענה מתאים."
        ],
        "items": []
      },
      {
        "heading": "4. פנייה בנושא נגישות",
        "paragraphs": [
          "אם נתקלתם בקושי נגישות באתר, נשמח לקבל פנייה עם תיאור הבעיה והעמוד שבו נתקלתם בה, כדי שנוכל לבדוק ולשפר."
        ],
        "items": []
      }
    ],
    "tabLabel": "נגישות"
  }
];

export const getLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);

/** English translations, same order and slugs as legalDocs. The Hebrew text is the binding version (shown as a notice on the English pages). */
export const legalDocsEn: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of use",
    tabLabel: "Terms of use",
    intro: "Welcome to the BALOUL website. Use of the site is subject to the terms below.",
    sections: [
      { heading: "1. Purpose of the site", paragraphs: ["The site presents general information about the agency, its areas of activity and its services, and allows you to contact us. Use of the site is subject to the laws of Israel."], items: [] },
      {
        heading: "2. The information on the site is not personal advice",
        paragraphs: [
          "The content on the site is general information only and is not investment advice, tax advice, legal advice or a personal recommendation to take any action. Decisions about finance, pensions and insurance require an individual review of the client's details, needs and goals.",
        ],
        items: [],
      },
      {
        heading: "3. Information about external products and bodies",
        paragraphs: [
          "Information about products of insurance companies, institutional bodies, investment houses or other providers may change. The binding terms are the terms and documents of the relevant body at the time of the engagement.",
        ],
        items: [],
      },
      {
        heading: "4. Contacting us through the site",
        paragraphs: [
          "Sending a form, a WhatsApp message or an email does not create insurance cover, does not carry out any financial or pension action and is not confirmation of a transaction. An action is completed only after the required process has been carried out and the relevant approvals received.",
        ],
        items: [],
      },
      {
        heading: "5. Intellectual property and use of the site",
        paragraphs: [
          "The design, logo, texts and materials on the site are protected by law. They may not be copied or used commercially without prior permission. The site may not be used unlawfully or in any attempt to harm its operation.",
        ],
        items: [],
      },
      { heading: "6. Third-party links and services", paragraphs: ["The site may include links to external systems and services. Their use is subject to the terms and policies of those parties."], items: [] },
      { heading: "7. Privacy", paragraphs: ["Personal information provided on the site will be handled in accordance with the privacy policy and the law."], items: [] },
      { heading: "8. Availability and updates", paragraphs: ["We work to keep the site accurate and available, but changes, errors or faults may occur. These terms may be updated from time to time."], items: [] },
    ],
  },
  {
    slug: "disclosure",
    title: "Disclosure",
    tabLabel: "Disclosure",
    intro: "General information about the nature of BALOUL's activity, the services offered and its relationships with financial and insurance bodies.",
    sections: [
      { heading: "1. The agency's activity", paragraphs: ["BALOUL operates in insurance, pensions and finance in accordance with the law and through holders of the appropriate licenses for each type of service."], items: [] },
      {
        heading: "2. Nature of the service",
        paragraphs: [
          "The agency helps review needs, match solutions, and handle and service matters in insurance, pensions and financial savings. Personal matching is done through an orderly process that takes the client's details into account.",
        ],
        items: [],
      },
      {
        heading: "3. Engagements and compensation",
        paragraphs: [
          "The agency may work with insurance companies, institutional bodies and investment houses, and may receive commissions or compensation from them in accordance with agreements and the law. The scope and terms of compensation may vary between bodies and products.",
        ],
        items: [],
      },
      {
        heading: "4. Conflicts of interest",
        paragraphs: [
          "Where there may be a connection or interest that could affect the service, we will act in accordance with the duties that apply to us, including duties of disclosure, documentation and suitability, as relevant.",
        ],
        items: [],
      },
      {
        heading: "5. Risks and returns",
        paragraphs: [
          "There is no commitment to achieve any return. Past performance does not guarantee future performance, and financial and pension products may be exposed to market, tax, regulatory, management-fee and other risks.",
        ],
        items: [],
      },
      { heading: "6. Information on the site", paragraphs: ["The content on the site is general information and does not replace a personal review that takes into account each client's needs, details and characteristics."], items: [] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    tabLabel: "Privacy",
    intro: "This policy explains what information may be collected on the site, how it is used and in what circumstances it may be shared.",
    sections: [
      {
        heading: "1. Details you provide",
        paragraphs: [
          "When you contact us, we may receive details such as your name, phone number, email and the content of your request, as well as any other information you choose to provide so we can handle it.",
        ],
        items: [],
      },
      {
        heading: "2. Technical information",
        paragraphs: [
          "While you browse, basic technical information may be collected, such as IP address, device and browser type, access times and security data. The site may use cookies or measurement tools, if enabled.",
        ],
        items: [],
      },
      {
        heading: "3. Purposes of use",
        paragraphs: [],
        items: [
          "Answering requests and scheduling calls or meetings.",
          "Providing service and documenting how a request was handled.",
          "Operating, securing and improving the site.",
          "Meeting legal and regulatory requirements.",
        ],
      },
      {
        heading: "4. Sharing information with third parties",
        paragraphs: [
          "Information may be shared with service providers that help operate the site and the business, or with professional and institutional bodies when required for a service you requested and in accordance with the law. We do not sell personal information to third parties.",
        ],
        items: [],
      },
      {
        heading: "5. Retention and your rights",
        paragraphs: [
          "Information is kept for as long as needed for the purposes it was collected for and in line with our obligations. Subject to the law, you may contact us to review your information, correct it or ask for it to be deleted where possible.",
        ],
        items: [],
      },
      { heading: "6. Information security", paragraphs: ["We take reasonable measures to protect information, but no online system is completely immune to risk."], items: [] },
      {
        heading: "7. Cookies and measurement tools",
        paragraphs: [
          "When you enter the site you will be asked to accept or decline cookies for measurement and marketing (such as Google Analytics, Google Ads and Meta). These tools run only after you accept. Cookies essential to operating the site do not require consent.",
          "You can change your choice at any time through the \"Cookie settings\" link at the bottom of the site.",
        ],
        items: [],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility statement",
    tabLabel: "Accessibility",
    intro: "BALOUL considers accessible and equal service important and works to improve the accessibility of its site and digital services.",
    sections: [
      {
        heading: "1. Adjustments on the site",
        paragraphs: [
          "The site was built to support clear, comfortable browsing on desktop and mobile, with attention to content structure, contrast, labels, keyboard navigation and alternative text for meaningful images.",
        ],
        items: [],
      },
      {
        heading: "2. Third-party components",
        paragraphs: [
          "The site may include external components such as maps, social networks or form systems. We try to choose solutions that are as accessible as possible, but there may be limitations outside our control.",
        ],
        items: [],
      },
      {
        heading: "3. Accessibility when receiving service",
        paragraphs: ["If you need an accessibility adjustment for a meeting or to receive service, you can contact us in advance so we can arrange a suitable response."],
        items: [],
      },
      {
        heading: "4. Contacting us about accessibility",
        paragraphs: [
          "If you ran into an accessibility difficulty on the site, we would be glad to hear from you with a description of the problem and the page where it happened, so we can check and improve it.",
        ],
        items: [],
      },
    ],
  },
];
