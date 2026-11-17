export type ConsentChoice = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "baloul-consent-v1";
export const CONSENT_EVENT = "baloul:consent";
export const OPEN_CONSENT_EVENT = "baloul:open-consent";

export function readConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* private mode: the choice lasts for this page view only */
  }
  const state = choice === "granted" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: state,
    analytics_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  });
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

/**
 * Runs before anything else in <head>: sets Consent Mode v2 defaults to denied
 * and restores a stored choice, so no tag can read or write cookies first.
 */
export const consentBootstrapScript = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
try{var c=localStorage.getItem('${CONSENT_STORAGE_KEY}');if(c==='granted'){gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}}catch(e){}
`;
