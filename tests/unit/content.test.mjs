// Server i18n core: makeI18n and getContent. Run: node --test tests/unit/
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeI18n } from "../../lib/i18n/i18n.ts";
import { getContent } from "../../content/localized.ts";
import { services, servicesEn } from "../../content/services.ts";
import { reviews } from "../../content/reviews.ts";

test("makeI18n href, dir and t", () => {
  assert.equal(makeI18n("en").href("/pension"), "/en/pension");
  assert.equal(makeI18n("he").dir, "rtl");
  assert.equal(makeI18n("en").t("nav.process"), "How we work");
});
test("getContent localizes services", () => {
  assert.equal(getContent("en").services[0].title, servicesEn[services[0].id].title);
});
test("English faqsFor has no Hebrew questions", () => {
  for (const f of getContent("en").faqsFor(services[0].id)) assert.doesNotMatch(f.question, /[֐-׿]/);
});
test("reviewForService cycles through reviews", () => {
  const c = getContent("he");
  services.forEach((s, i) => assert.deepEqual(c.reviewForService(s.id), reviews[i % reviews.length]));
});
test("Hebrew google count label uses maqaf", () => assert.ok(getContent("he").googleRating.countLabel.includes("ב־Google")));
