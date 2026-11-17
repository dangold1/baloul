// Hover states: lift, border, icon tint and arrow nudge on pointer devices; nothing on touch.
// Run after `npm run build`: node tests/e2e/hover.test.js
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const serve = require("./serve");

const PORT = 4331;
const HOME = `http://localhost:${PORT}/`;
const NAVY = "rgb(20, 40, 74)";

async function setup(browser, errs, options) {
  const ctx = await browser.newContext(options);
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("baloul-consent-v1", "denied");
      sessionStorage.setItem("baloulLeadShown", "1");
    } catch {}
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  return page;
}

const style = (page, selector, prop, pseudo) => page.$eval(selector, (e, [p, ps]) => getComputedStyle(e, ps || null)[p], [prop, pseudo]);

(async () => {
  const server = await serve("out", PORT);
  const browser = await chromium.launch();
  const errs = [];
  let step = "start";
  try {
    const page = await setup(browser, errs, { viewport: { width: 1440, height: 900 } });
    const mobile = await setup(browser, errs, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    // Chromium's mobile emulation does not switch the hover media feature on its own.
    const cdp = await mobile.context().newCDPSession(mobile);
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "hover", value: "none" }] });
    await page.goto(HOME);
    await mobile.goto(HOME);

    step = "service row gets a light ground, slides in, fills its icon and nudges the arrow";
    await page.hover(".b-solution >> nth=0");
    await page.waitForTimeout(300);
    assert.equal(await style(page, ".b-solution", "backgroundColor"), "rgb(246, 248, 251)");
    assert.equal(await style(page, ".b-solution .b-solution-body", "transform"), "matrix(1, 0, 0, 1, -6, 0)");
    assert.ok((await style(page, ".b-solution .b-solution-icon", "boxShadow")).includes("rgb(214, 178, 106)"), "emblem gets a gold ring");
    assert.equal(await style(page, ".b-solution .b-solution-arrow", "transform"), "matrix(1, 0, 0, 1, -4, 0)");
    assert.equal(await style(page, ".b-solution .b-solution-arrow", "backgroundColor"), NAVY);

    step = "situation card lifts (service page; the home page no longer has situations)";
    await page.goto(`${HOME}insurance`);
    await page.hover(".b-situation >> nth=0");
    await page.waitForTimeout(300);
    assert.equal(await style(page, ".b-situation", "transform"), "matrix(1, 0, 0, 1, 0, -2)");

    step = "domain link (service page, other services) lifts and fills its icon";
    await page.goto(`${HOME}insurance`);
    await page.hover(".b-domain-link >> nth=0");
    await page.waitForTimeout(300);
    assert.equal(await style(page, ".b-domain-link", "transform"), "matrix(1, 0, 0, 1, 0, -2)");
    assert.equal(await style(page, ".b-domain-link .b-domain-icon", "backgroundColor"), NAVY);
    await page.goto(HOME);

    step = "primary button lifts by 1px";
    await page.hover(".b-hero .b-btn-primary");
    await page.waitForTimeout(300);
    assert.equal(await style(page, ".b-hero .b-btn-primary", "transform"), "matrix(1, 0, 0, 1, 0, -1)");

    step = "desktop WhatsApp button is a round green button";
    assert.equal(await style(page, ".b-floating .b-wa", "borderRadius"), "50%");
    assert.equal(await style(page, ".b-floating .b-wa", "backgroundColor"), "rgb(37, 211, 102)");
    assert.equal(await page.locator(".b-hero a[href*='wa.me']").count(), 0);

    step = "FAQ row gets a paper ground";
    await page.hover(".b-faq-item summary >> nth=0");
    await page.waitForTimeout(300);
    assert.equal(await style(page, ".b-faq-item summary", "backgroundColor"), "rgb(246, 248, 251)");

    step = "nav link underline grows on hover";
    await page.hover('.b-links a[href="#reviews"]');
    await page.waitForTimeout(300);
    assert.equal(await style(page, '.b-links a[href="#reviews"]', "transform", "::after"), "matrix(1, 0, 0, 1, 0, 0)");

    step = "no hover transform on touch";
    assert.equal(await mobile.evaluate(() => matchMedia("(hover:hover)").matches), false);
    await mobile.hover(".b-solution >> nth=0");
    await mobile.waitForTimeout(300);
    assert.equal(await style(mobile, ".b-solution", "backgroundColor"), "rgb(255, 255, 255)");

    step = "no horizontal scroll on mobile";
    assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

    step = "no console errors";
    assert.deepEqual(errs, []);
    console.log("PASS hover");
  } catch (e) {
    process.exitCode = 1;
    console.error("FAIL at: " + step);
    console.error(e.message);
  } finally {
    await browser.close();
    server.close();
  }
})();
