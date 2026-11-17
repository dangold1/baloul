"use client";

import { Section } from "@/components/layout/ActiveSection";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { site } from "@/content/site";
import { googleRating, googleRatingEn, reviews, reviewsEn } from "@/content/reviews";
import { pick } from "@/lib/i18n/languages";
import { ButtonLink } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { SectionHead } from "@/components/ui/SectionHeading";

export function Reviews() {
  const { lang, t } = useLanguage();
  const rating = pick(lang, googleRating, googleRatingEn);
  return (
    <Section id="reviews" step={t("nav.reviews")} className="b-section b-reviews" labelledBy="reviewsTitle">
      <div className="b-container">
        <SectionHead eyebrow={t("nav.reviews")} title={t("reviews.title")} titleId="reviewsTitle" lead={t("reviews.lead")} />
        <div className="b-review-grid">
          <aside className="b-google-card" aria-label={t("reviews.googleLabel")}>
            <div className="b-google-big">{rating.score}</div>
            <Stars label={t("common.stars")} />
            <div className="b-google-count">{rating.countLabel}</div>
            <ButtonLink variant="secondary" className="b-google-link" href={site.googleReviewsUrl} rel="noopener" target="_blank">
              {t("reviews.allLink")}
            </ButtonLink>
          </aside>
          {pick(lang, reviews, reviewsEn).map((r, i) => (
            <figure key={i} className="b-review-card">
              <Stars label={t("common.stars")} />
              <blockquote>
                <p>{r.quote}</p>
              </blockquote>
              <figcaption>{r.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  );
}
