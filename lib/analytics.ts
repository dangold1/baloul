/**
 * Analytics events go to the GTM dataLayer. GA4, Google Ads conversions and
 * Meta Pixel are mapped to these events inside GTM, not in code.
 *
 * Events:
 *  - generate_lead   { form: "contact" | "popup", topic, page }  page = path the lead came from ("/", "/insurance"...)
 *  - click_whatsapp  { location }
 *  - click_phone     { location }
 *  - click_email     { location }
 *  - popup_view
 *  - lead_submit_error { form }
 */
type DataLayerEvent = { event: string } & Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const payload: DataLayerEvent = { event, ...params };
  window.dataLayer.push(payload);
}
