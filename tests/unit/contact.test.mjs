// contactLink: one source for every phone, WhatsApp, mail and maps link. Run: node --test tests/unit/
import { test } from "node:test";
import assert from "node:assert/strict";
import { contactLink } from "../../lib/contact.ts";
import { greetingFor } from "../../lib/whatsapp.ts";
import { site } from "../../content/site.ts";

test("phone uses the site tel link", () => assert.equal(contactLink("phone", "he").href, site.phone.href));
test("email is a mailto link", () => assert.ok(contactLink("email", "en").href.startsWith("mailto:")));
test("whatsapp is external and carries the greeting", () => {
  const link = contactLink("whatsapp", "en");
  assert.equal(link.external, true);
  assert.ok(decodeURIComponent(link.href).includes(greetingFor("en")));
});
test("address uses the maps url and a translated display", () => {
  assert.equal(contactLink("address", "he").href, site.address.mapsUrl);
  assert.equal(contactLink("address", "en").display, "15 Ehud Manor St., Holon");
});
