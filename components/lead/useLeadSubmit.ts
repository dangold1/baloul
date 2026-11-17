"use client";

import { useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { isValidIsraeliPhone, submitToNetlify } from "@/lib/netlify-forms";
import { leadMessage, openWhatsApp } from "@/lib/whatsapp";
import { LEAD_SUBMITTED_KEY } from "@/lib/ui-events";
import { useLanguage } from "@/components/i18n/LanguageProvider";


/**
 * Shared lead flow for the contact form and the popup:
 * validate → record the conversion → save to Netlify in the background → hand off to WhatsApp.
 * WhatsApp opens inside the submit handler itself so browsers do not block it.
 */
export function useLeadSubmit(formName: "contact-lead" | "popup-lead", onDone?: () => void) {
  const [status, setStatus] = useState("");
  const { lang, t } = useLanguage();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement | null;
    if (phoneInput) phoneInput.setCustomValidity(isValidIsraeliPhone(phoneInput.value) ? "" : t("form.phoneError"));
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const lead = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      topic: String(data.get("topic") ?? ""),
    };
    const source = formName === "contact-lead" ? "contact" : "popup";

    track("generate_lead", { form: source, topic: lead.topic, page: window.location.pathname });
    submitToNetlify(form).then((ok) => {
      if (!ok) track("lead_submit_error", { form: source });
    });
    try {
      sessionStorage.setItem(LEAD_SUBMITTED_KEY, "1");
    } catch {
      /* storage unavailable */
    }

    setStatus(t("form.sent"));
    openWhatsApp(leadMessage(lead, lang));
    form.reset();
    onDone?.();
  };

  /** Clears the custom phone error as soon as the user edits the field. */
  const onPhoneInput = (e: FormEvent<HTMLInputElement>) => e.currentTarget.setCustomValidity("");

  return { status, onSubmit, onPhoneInput };
}
