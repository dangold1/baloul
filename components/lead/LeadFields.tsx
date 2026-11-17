"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { topicLabel } from "@/content/services";

/**
 * Name, phone and topic, shared by the contact form and the lead popup.
 * IDs are `${idPrefix}Name`, `${idPrefix}Phone` and `${idPrefix}Topic`, so the two forms never clash on one page.
 */
export function LeadFields({
  idPrefix,
  topics,
  defaultTopic,
  namePlaceholder,
  topicQuestion,
  onPhoneInput,
}: {
  idPrefix: string;
  topics: readonly string[];
  defaultTopic?: string;
  namePlaceholder?: string;
  /** The topic label; defaults to the contact form's question. */
  topicQuestion?: string;
  onPhoneInput: React.FormEventHandler<HTMLInputElement>;
}) {
  const { lang, t } = useLanguage();
  return (
    <>
      <div className="b-field">
        <label htmlFor={`${idPrefix}Name`}>{t("form.name")}</label>
        <input id={`${idPrefix}Name`} name="name" autoComplete="name" required placeholder={namePlaceholder} />
      </div>
      <div className="b-field">
        <label htmlFor={`${idPrefix}Phone`}>{t("form.phone")}</label>
        <input id={`${idPrefix}Phone`} name="phone" autoComplete="tel" inputMode="tel" type="tel" dir="ltr" placeholder="050-0000000" required onInput={onPhoneInput} />
      </div>
      <div className="b-field full">
        <label htmlFor={`${idPrefix}Topic`}>{topicQuestion ?? t("form.topic")}</label>
        <select id={`${idPrefix}Topic`} name="topic" defaultValue={defaultTopic}>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topicLabel(topic, lang)}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
