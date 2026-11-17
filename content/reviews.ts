export type Review = { quote: string; author: string };

export const reviews: Review[] = [
  { quote: "״בכל פנייה או צורך, הוא נרתם מיד, מגדיל ראש באמת, בודק לעומק ושואל את השאלות הנכונות.״", author: "יקיר ז. • ביקורת לקוח" },
  { quote: "״הם שמים את האינטרס שלי במקום הראשון. אני סומך עליהם באופן מלא וממליץ ללא היסוס.״", author: "מתוך המלצה של לקוח בפייסבוק" },
];

export const googleRating = { score: "5.0", countLabel: "מעל 100 ביקורות ב Google" };

export const reviewsEn: Review[] = [
  {
    quote: "“Whatever I needed, he got on it right away. He truly goes the extra mile, looks into things in depth and asks the right questions.”",
    author: "Yakir Z. • Client review",
  },
  {
    quote: "“They put my interests first. I trust them completely and recommend them without hesitation.”",
    author: "From a client recommendation on Facebook",
  },
];

export const googleRatingEn = { score: "5.0", countLabel: "Over 100 reviews on Google" };
