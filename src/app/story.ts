export type Shot = {
  id: string;
  file: string;
  name: string;
  year: string;
  title: string;
  sub: string;
  netWorth: number;
  // Iris origin for the transition INTO this shot, in % of the viewport.
  iris: [number, number];
  brief: string;
};

export const shots: Shot[] = [
  {
    id: "01",
    file: "01-dawn",
    name: "שחר",
    year: "2026",
    title: "כל הון מתחיל בבוקר אחד.",
    sub: "זה הסיפור של תרנגול אחד, ושל החלטות קטנות שהפכו לבית.",
    netWorth: 0,
    iris: [50, 50],
    brief: "תרנגול על עמוד גדר בשחר, קורא קריאת בוקר ומשפיל מבט אל הקש.",
  },
  {
    id: "02",
    file: "02-find",
    name: "פתאום",
    year: "2026",
    title: "ואז, פתאום, כסף.",
    sub: "הכנסה ראשונה. מה עושים איתה חשוב יותר מהסכום עצמו.",
    netWorth: 850,
    iris: [50, 78],
    brief: "התרנגול מגרד בקש, חושף מטבעות ושטרות ומרים מטבע במקור.",
  },
  {
    id: "03",
    file: "03-kupa",
    name: "הקופה",
    year: "2027",
    title: "גרגר לגרגר, הקופה מתמלאת.",
    sub: "הוראת קבע של ‎₪1,500 בחודש. בלי דרמה ובלי לחכות לרגע המושלם.",
    netWorth: 25_120,
    iris: [50, 50],
    brief: "התרנגול מפיל מטבעות לקופת חיסכון קרמית בכחול רויאל עם חריץ זהב.",
  },
  {
    id: "04",
    file: "04-wealth",
    name: "עושר",
    year: "2033",
    title: "וזה מצטבר.",
    sub: "שנים של עקביות, וריבית דריבית שעובדת גם כשהוא ישן.",
    netWorth: 482_300,
    iris: [50, 42],
    brief: "התרנגול עומד בגאווה על ערימת מטבעות זהב וחבילות שטרות, תאורת קונטרה.",
  },
  {
    id: "05",
    file: "05-market",
    name: "שוק ההון",
    year: "2036",
    title: "הכסף יוצא לעבוד.",
    sub: "תיק מפוזר בשוק ההון, מותאם לרמת הסיכון ולטווח הזמן.",
    netWorth: 684_900,
    iris: [62, 45],
    brief: "התרנגול על שולחן עבודה מול שלושה מסכים עם גרפים זוהרים.",
  },
  {
    id: "06",
    file: "06-family",
    name: "משפחה",
    year: "2037",
    title: "ואז הגיעה המשפחה.",
    sub: "כשיש על מי לשמור, ההון צריך גם הגנה.",
    netWorth: 684_900,
    iris: [22, 50],
    brief: "התרנגול, תרנגולת וחמישה אפרוחים בחצר שטופת שמש.",
  },
  {
    id: "07",
    file: "07-coop",
    name: "הלול",
    year: "2038",
    title: "ובסוף, לול משלו.",
    sub: "בית אמיתי, משכנתא שמתאימה להכנסה, ושקט נפשי.",
    netWorth: 684_900,
    iris: [20, 55],
    brief: "לול יוקרתי בעיצוב בית קטן, דלת כחולה, המשפחה נכנסת בשקיעה.",
  },
];

// Public files live under the deploy sub-path on GitHub Pages.
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const ils = new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 });
export const money = (v: number) => `‎₪${ils.format(Math.round(v))}`;
