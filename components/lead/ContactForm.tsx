"use client";

import { WhatsAppIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { topicLabel } from "@/content/services";

import { NetlifyFields } from "./Honeypot";
import { useLeadSubmit } from "./useLeadSubmit";

const FORM_NAME = "contact-lead";

/** The home page offers all topics; a service page passes its own topic as defaultTopic. */
export function ContactForm({ topics, defaultTopic }: { topics: string[]; defaultTopic?: string }) {
  const { status, onSubmit, onPhoneInput } = useLeadSubmit(FORM_NAME);
  const { lang, t, href } = useLanguage();

  return (
    <form className="b-form" id="bForm" name={FORM_NAME} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit} noValidate={false}>
      <NetlifyFields formName={FORM_NAME} />
      <div className="b-form-grid">
        <div className="b-field">
          <label htmlFor="bName">{t("form.name")}</label>
          <input id="bName" name="name" autoComplete="name" required />
        </div>
        <div className="b-field">
          <label htmlFor="bPhone">{t("form.phone")}</label>
          <input id="bPhone" name="phone" autoComplete="tel" inputMode="tel" type="tel" dir="ltr" placeholder="050-0000000" required onInput={onPhoneInput} />
        </div>
        <div className="b-field full">
          <label htmlFor="bTopic">{t("form.topic")}</label>
          <select id="bTopic" name="topic" defaultValue={defaultTopic}>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topicLabel(topic, lang)}
              </option>
            ))}
          </select>
        </div>
        <div className="b-field full">
          <button className="b-btn b-btn-wa b-btn-block" type="submit">
            <WhatsAppIcon />
            <span>{t("form.submit")}</span>
          </button>
          <div className="b-form-status" id="bFormStatus" aria-live="polite">
            {status}
          </div>
          <p className="b-note">
            {t("form.notePre")}
            <a href={href("/privacy")}>{t("form.noteLink")}</a>
            {t("form.notePost")}
          </p>
        </div>
      </div>
    </form>
  );
}
