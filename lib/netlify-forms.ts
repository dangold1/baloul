/**
 * Submits a form to Netlify Forms in the background.
 * Netlify detects the form names from public/__forms.html at deploy time.
 * keepalive lets the request finish even if the page hands off to WhatsApp.
 */
export function submitToNetlify(form: HTMLFormElement): Promise<boolean> {
  const body = new URLSearchParams();
  new FormData(form).forEach((value, key) => body.append(key, String(value)));
  return fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    keepalive: true,
  })
    .then((res) => res.ok)
    .catch(() => false);
}

/** Israeli phone: 9-10 digits starting with 0, or +972. Spaces and dashes allowed. */
export function isValidIsraeliPhone(value: string): boolean {
  const digits = value.replace(/[\s-]/g, "").replace(/^\+972/, "0");
  return /^0\d{8,9}$/.test(digits);
}
