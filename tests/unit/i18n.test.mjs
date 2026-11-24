// Languages and the chrome dictionary (Dan, 2026-11-16). Run: node --test tests/unit/
import { test } from "node:test";
import assert from "node:assert/strict";
import { basePath, dirOf, homeRedirectScript, localePath, parseLang } from "../../lib/i18n/languages.ts";
import { en, he, translate } from "../../content/dictionary.ts";

test("parseLang", () => {
  assert.equal(parseLang("en"), "en");
  assert.equal(parseLang("he"), "he");
  assert.equal(parseLang(null), "he");
  assert.equal(parseLang("fr"), "he");
  assert.equal(parseLang("EN"), "he");
});
test("dirOf", () => {
  assert.equal(dirOf("he"), "rtl");
  assert.equal(dirOf("en"), "ltr");
});
test("every en entry is filled", () => assert.deepEqual(Object.keys(en).filter((k) => !en[k]), []));
test("en is used", () => assert.equal(translate("en", "nav.process"), "How we work"));
test("en value wins when set", () => {
  assert.equal(translate("en", "lang.he"), "עברית");
  assert.equal(translate("en", "lang.en"), "English");
});
test("vars interpolate", () => {
  const s = translate("he", "footer.about", { founded: 2003, agency: 2017 });
  assert.ok(s.includes("2003"));
  assert.ok(!s.includes("{"));
});
test("dictionaries have the same keys", () => assert.deepEqual(Object.keys(en).sort(), Object.keys(he).sort()));

test("localePath", () => {
  assert.equal(localePath("he", "/insurance"), "/insurance");
  assert.equal(localePath("en", "/"), "/en");
  assert.equal(localePath("en", "/insurance"), "/en/insurance");
  assert.equal(localePath("en", "/#process"), "/en#process");
});
test("basePath", () => {
  assert.equal(basePath("/en"), "/");
  assert.equal(basePath("/en/privacy"), "/privacy");
  assert.equal(basePath("/privacy"), "/privacy");
  assert.equal(basePath("/"), "/");
});

const runRedirect = (pathname, stored) => {
  let to = null;
  const location = { pathname, search: "", hash: "#process", replace: (u) => (to = u) };
  const localStorage = { getItem: () => stored };
  new Function("location", "localStorage", homeRedirectScript)(location, localStorage);
  return to;
};
test("home redirect only for a stored English choice on /", () => {
  assert.equal(runRedirect("/", "en"), "/en#process");
  assert.equal(runRedirect("/", "he"), null);
  assert.equal(runRedirect("/", null), null);
  assert.equal(runRedirect("/insurance", "en"), null);
});
