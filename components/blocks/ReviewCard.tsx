import type { Review } from "@/content/reviews";
import { Stars } from "@/components/ui/Stars";

export function ReviewCard({ review, starsLabel }: { review: Review; starsLabel: string }) {
  return (
    <figure className="b-review-card">
      <Stars label={starsLabel} />
      <blockquote>
        <p>{review.quote}</p>
      </blockquote>
      <figcaption>{review.author}</figcaption>
    </figure>
  );
}
