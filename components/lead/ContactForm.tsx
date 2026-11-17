"use client";

import { WhatsAppIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/components/i18n/LanguageProvider";

import { LeadFields } from "./LeadFields";
import { NetlifyFields } from "./Honeypot";
import { useLeadSubmit } from "./useLeadSubmit";

const FORM_NAME = "contact-lead";

/** The home page offers all topics; a service page passes its own topic as defaultTopic. */
export function ContactForm({ topics, defaultTopic }: { topics: readonly string[]; defaultTopic?: string }) {
  const { status, onSubmit, onPhoneInput } = useLeadSubmit(FORM_NAME);
  const { t, href } = useLanguage();

  return (
    <form className="b-form" id="bForm" name={FORM_NAME} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit} noValidate={false}>
      <NetlifyFields formName={FORM_NAME} label={t("form.honeypot")} />
      <div className="b-form-grid">
        <LeadFields idPrefix="b" topics={topics} defaultTopic={defaultTopic} onPhoneInput={onPhoneInput} />
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
