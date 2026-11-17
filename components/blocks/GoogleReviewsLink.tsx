import { getContent } from "@/content/localized";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";

/** "All reviews on Google": a secondary button on the home page, a text link on a service page. */
export function GoogleReviewsLink({ lang, variant }: { lang: Lang; variant: "button" | "text" }) {
  const label = makeI18n(lang).t("reviews.allLink");
  const url = getContent(lang).site.googleReviewsUrl;
  if (variant === "button") {
    return (
      <ButtonLink variant="secondary" className="b-google-link" href={url} rel="noopener" target="_blank">
        {label}
      </ButtonLink>
    );
  }
  return (
    <a className="b-text-link" href={url} rel="noopener" target="_blank">
      {label}
      <ArrowIcon />
    </a>
  );
}
