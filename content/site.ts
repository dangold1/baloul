/** Business details used across the site, the schema markup and the lead flow. */
export const site = {
  name: "BALOUL",
  /** The deployed address: Netlify's URL at build time (see next.config.ts), else the real domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://baloul.co.il",
  title: "BALOUL | סוכנות לפנסיה, ביטוח ותכנון פיננסי בחולון, מאז 2003",
  description:
    "BALOUL מלווה לקוחות פרטיים, משפחות ועסקים בפנסיה ותכנון פרישה, חיסכון והשקעות, ביטוח ותביעות. פעילות מקצועית מאז 2003, משרד בחולון, דירוג 5.0 ב־Google.",
  /** Short description for social shares. */
  shareDescription: "ליווי אישי בפנסיה, בחיסכון ובביטוח, מאז 2003. משרד בחולון.",
  tagline: "פיננסים • פנסיה • ביטוח",
  foundedYear: 2003,
  /** The year the activity grew into a full agency. */
  agencyYear: 2014,
  phone: { display: "03-6510298", href: "tel:+97236510298", e164: "+97236510298" },
  whatsapp: { display: "054-9194771", number: "972549194771" },
  email: "baloulassistance@gmail.com",
  address: {
    street: "אהוד מנור 15",
    city: "חולון",
    country: "IL",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%D7%90%D7%94%D7%95%D7%93%20%D7%9E%D7%A0%D7%95%D7%A8%2015%20%D7%97%D7%95%D7%9C%D7%95%D7%9F",
  },
  social: {
    facebook: "https://www.facebook.com/BALOUL14/?locale=he_IL",
  },
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=%D7%91%D7%9C%D7%95%D7%9C%20%D7%A1%D7%95%D7%9B%D7%A0%D7%95%D7%AA%20%D7%9C%D7%91%D7%99%D7%98%D7%95%D7%97%20%D7%95%D7%A4%D7%99%D7%A0%D7%A0%D7%A1%D7%99%D7%9D%20%D7%90%D7%94%D7%95%D7%93%20%D7%9E%D7%A0%D7%95%D7%A8%2015%20%D7%97%D7%95%D7%9C%D7%95%D7%9F",
  images: {
    logo: { src: "/images/logo.webp", width: 480, height: 463 },
    hero: { src: "/images/hero.webp", width: 1536, height: 1024 },
    team: { src: "/images/team.webp", width: 1400, height: 933 },
    /** Link preview (WhatsApp, Facebook): the About team photo, 1200x630. */
    share: "/assets/share-team.jpg",
  },
} as const;

/** Cookie banner placement. "modal" pops up on entry, "bar" sits at the bottom. */
export const consentConfig = {
  variant: "bar" as "modal" | "bar",
};

/** English counterparts of the site-wide texts above (titles, descriptions). BALOUL is the agency's name in both languages. */
export const siteEn = {
  title: "BALOUL | Pension, Insurance and Financial Planning Agency in Holon, Since 2003",
  description:
    "BALOUL is an agency in Holon supporting individuals, families and businesses with pensions and retirement planning, savings and investments, insurance and claims. Serving clients since 2003, rated 5.0 on Google.",
  shareDescription: "Personal guidance on pensions, savings and insurance, since 2003. Office in Holon.",
};
