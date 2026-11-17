// Active-section state: clicking a section or its nav link marks it, scrolling follows, one at a time.
// Run after `npm run build`: node tests/e2e/active-section.test.js
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const serve = require("./serve");

const PORT = 4330;
const HOME = `http://localhost:${PORT}/`;

async function setup(browser, errs, options) {
  const ctx = await browser.newContext(options);
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("baloul-consent-v1", "denied");
      sessionStorage.setItem("baloulLeadShown", "1");
    } catch {}
    document.addEventListener("DOMContentLoaded", () => {
      document.documentElement.style.scrollBehavior = "auto";
    });
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  return page;
}

(async () => {
  const server = await serve("out", PORT);
  const browser = await chromium.launch();
  const errs = [];
  let step = "start";
  try {
    const page = await setup(browser, errs, { viewport: { width: 1440, height: 900 } });
    const mobile = await setup(browser, errs, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await page.goto(HOME);
    await mobile.goto(HOME);

    step = "starts with nothing active";
    assert.equal(await page.$$eval("[data-active]", (els) => els.length), 0);

    step = "clicking inside a section activates it, and only it";
    await page.click("#process h2");
    assert.ok(await page.$("#process[data-active]"));
    assert.equal(await page.$$eval("[data-active]", (els) => els.length), 1);
    await page.click("#reviews h2");
    assert.ok(await page.$("#reviews[data-active]"));
    assert.equal(await page.$("#process[data-active]"), null);

    step = "keeps form values";
    await page.fill("#bName", "בדיקה");
    await page.click("#contact h2");
    assert.equal(await page.inputValue("#bName"), "בדיקה");

    step = "navigates from inside a section";
    await page.click('#services a[href="/pension-retirement"] >> nth=0');
    await page.waitForLoadState();
    assert.ok(page.url().endsWith("/pension-retirement"), page.url());

    step = "service page renders without provider";
    assert.ok(await page.isVisible("h1"));

    step = "deep link activates on load";
    await page.goto(HOME + "#knowledge");
    await page.waitForTimeout(300);
    assert.ok(await page.$("#knowledge[data-active]"));

    step = "nav reflects the active section";
    await page.click("#reviews h2");
    assert.equal(await page.getAttribute('.b-links a[href="#reviews"]', "aria-current"), "true");
    assert.equal(await page.getAttribute('.b-links a[href="#process"]', "aria-current"), null);

    step = "nav click activates its target immediately and still scrolls";
    await page.click('.b-links a[href="#process"]');
    await page.waitForTimeout(50);
    assert.ok(await page.$("#process[data-active]"));
    await page.waitForTimeout(1500);
    assert.ok(await page.evaluate(() => Math.abs(document.getElementById("process").getBoundingClientRect().top) < 120));

    step = "header CTA marks contact";
    await page.click(".b-nav-cta");
    await page.waitForTimeout(50);
    assert.equal(await page.getAttribute(".b-nav-cta", "aria-current"), "true");

    step = "mobile menu link activates its target";
    await mobile.click(".b-menu");
    await mobile.click('.b-mobile a[href="#knowledge"]');
    await mobile.waitForTimeout(50);
    assert.equal(await mobile.$$eval("#knowledge[data-active]", (e) => e.length), 1);

    step = "active section is not tinted (Dan, 2026-11-10), only its nav link is underlined";
    const looks = () =>
      page.$eval("#process", (e) => [getComputedStyle(e).backgroundColor, getComputedStyle(e.querySelector(".b-eyebrow")).color]);
    const before = await looks();
    await page.click("#process h2");
    await page.waitForTimeout(400);
    assert.ok(await page.$("#process[data-active]"));
    assert.deepEqual(await looks(), before);
    assert.equal(await page.$eval('.b-links a[href="#process"]', (e) => getComputedStyle(e, "::after").transform), "matrix(1, 0, 0, 1, 0, 0)");
    assert.equal(await page.$eval('.b-links a[href="#reviews"]', (e) => getComputedStyle(e, "::after").transform), "matrix(0, 0, 0, 1, 0, 0)");

    step = "scrolling updates the active section";
    await page.evaluate(() => document.getElementById("knowledge").scrollIntoView({ block: "center" }));
    await page.waitForTimeout(400);
    assert.ok(await page.$("#knowledge[data-active]"));
    assert.equal(await page.getAttribute('.b-links a[href="#knowledge"]', "aria-current"), "true");

    step = "click wins over scroll for 800ms";
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    });
    await page.click('.b-links a[href="#reviews"]');
    await page.waitForTimeout(400);
    assert.ok(await page.$("#reviews[data-active]"));
    await page.waitForTimeout(1200);
    assert.ok(await page.$("#reviews[data-active]"));

    step = "active-section works on /en";
    await page.goto(HOME + "en");
    assert.equal(await page.$$eval("[data-active]", (els) => els.length), 0);
    await page.click("#process h2");
    assert.ok(await page.$("#process[data-active]"));
    assert.equal(await page.$$eval("[data-active]", (els) => els.length), 1);
    await page.click("#reviews h2");
    assert.ok(await page.$("#reviews[data-active]"));
    assert.equal(await page.$("#process[data-active]"), null);

    step = "no console errors";
    assert.deepEqual(errs, []);
    console.log("PASS active-section");
  } catch (e) {
    process.exitCode = 1;
    console.error("FAIL at: " + step);
    console.error(e.message);
  } finally {
    await browser.close();
    server.close();
  }
})();
