import { Section } from "@/components/layout/Section";
import { getContent } from "@/content/localized";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { Stars } from "@/components/ui/Stars";
import { SectionHead } from "@/components/ui/SectionHeading";
import { GoogleReviewsLink } from "@/components/blocks/GoogleReviewsLink";
import { ReviewCard } from "@/components/blocks/ReviewCard";

export function Reviews({ lang }: { lang: Lang }) {
  const { t } = makeI18n(lang);
  const { googleRating, reviews } = getContent(lang);
  return (
    <Section id="reviews" step={t("nav.reviews")} className="b-section b-reviews" labelledBy="reviewsTitle">
      <div className="b-container">
        <SectionHead eyebrow={t("nav.reviews")} title={t("reviews.title")} titleId="reviewsTitle" lead={t("reviews.lead")} />
        <div className="b-review-grid">
          <aside className="b-google-card" aria-label={t("reviews.googleLabel")}>
            <div className="b-google-big">{googleRating.score}</div>
            <Stars label={t("common.stars")} />
            <div className="b-google-count">{googleRating.countLabel}</div>
            <GoogleReviewsLink lang={lang} variant="button" />
          </aside>
          {reviews.map((r, i) => (
            <ReviewCard key={i} review={r} starsLabel={t("common.stars")} />
          ))}
        </div>
      </div>
    </Section>
  );
}
