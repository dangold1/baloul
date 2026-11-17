// Scroll stepper (Dan, 2026-11-10): a rail on the right on desktop, a progress bar below 1200px.
// The steps come from the components; the current one must match where the visitor actually is.
// Run after `npm run build`: node tests/e2e/stepper.test.js
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const serve = require("./serve");

const PORT = 4333;
const HOME = `http://localhost:${PORT}/`;

async function open(browser, options) {
  const ctx = await browser.newContext(options);
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("baloul-consent-v1", "denied");
      // The lead popup has its own test; here it would cover the rail after the sweep passes the reviews.
      sessionStorage.setItem("baloulLeadShown", "1");
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(HOME);
  // Steps are registered by the components after hydration.
  await page.waitForSelector(".b-stepper-step", { state: "attached" });
  return page;
}
const current = (page) => page.getAttribute('.b-stepper [aria-current="step"]', "href");
// The step a visitor is reading, computed independently from the page geometry (same rule as lib/steps.ts).
const expected = (page) =>
  page.evaluate(() => {
    const header = Math.max(0, document.querySelector(".b-header").getBoundingClientRect().bottom);
    const line = header + (innerHeight - header) * 0.35;
    const parts = [...document.querySelectorAll("[data-step]")].map((el) => ({ id: el.dataset.step, top: el.getBoundingClientRect().top }));
    const doc = document.documentElement;
    if (scrollY > 0 && scrollY + innerHeight >= doc.scrollHeight - 2) return "#" + parts[parts.length - 1].id;
    let id = parts[0].id;
    for (const p of parts) if (p.top <= line) id = p.id;
    return "#" + id;
  });
async function sweep(page, stride) {
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const ys = [];
  for (let y = 0; y <= max + stride; y += stride) ys.push(Math.min(y, max));
  const misses = [];
  for (const y of [...ys, ...[...ys].reverse()]) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(120);
    const [got, want] = [await current(page), await expected(page)];
    if (got !== want) misses.push(`y=${y} got ${got} want ${want}`);
  }
  return misses;
}
const scrollToId = (page, id) =>
  page.evaluate((i) => {
    const el = document.getElementById(i);
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: "instant" });
  }, id);

(async () => {
  const server = await serve("out", PORT);
  const browser = await chromium.launch();
  let step = "start";
  try {
    const desk = await open(browser, { viewport: { width: 1440, height: 900 } });

    step = "desktop: rail is visible with seven steps, the hero is the current step";
    assert.ok(await desk.isVisible('nav.b-stepper[aria-label="התקדמות בדף"]'));
    assert.equal(await desk.locator(".b-stepper-step").count(), 7);
    assert.equal(await current(desk), "#top");

    step = "desktop: steps and their names come from the components, in page order";
    assert.deepEqual(
      await desk.$$eval(".b-stepper-step", (els) => els.map((e) => [e.getAttribute("href"), e.textContent])),
      [
        ["#top", "בית"],
        ["#services", "תחומי פעילות"],
        ["#process", "איך עובדים"],
        ["#about-inline", "מי אנחנו"],
        ["#reviews", "לקוחות מספרים"],
        ["#knowledge", "שאלות נפוצות"],
        ["#contact", "צור קשר"],
      ],
    );

    step = "desktop: the rail sits on the right edge";
    const rail = await desk.locator("nav.b-stepper").boundingBox();
    assert.ok(1440 - rail.x <= 60 && rail.x + rail.width <= 1440 - 8, `rail ${rail.x}..${rail.x + rail.width}`);

    step = "desktop 1440: sweep down and up, small and fast, always matches geometry";
    for (const stride of [150, 600]) assert.deepEqual(await sweep(desk, stride), [], `stride ${stride}`);

    step = "desktop: scrolling moves the current step and marks earlier steps as passed";
    await scrollToId(desk, "process");
    await desk.waitForTimeout(400);
    assert.equal(await current(desk), "#process");
    assert.equal(await desk.getAttribute('.b-stepper a[href="#services"]', "data-state"), "past");
    assert.equal(await desk.getAttribute('.b-stepper a[href="#reviews"]', "data-state"), "next");

    step = "desktop: the rail switches to its light colours over the reviews band";
    await scrollToId(desk, "reviews");
    await desk.waitForTimeout(400);
    assert.equal(await desk.getAttribute(".b-stepper-root", "data-tone"), "dark");

    step = "desktop: clicking a dot jumps to that part and marks it";
    await desk.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await desk.waitForTimeout(300);
    await desk.click('.b-stepper a[href="#knowledge"]');
    await desk.waitForTimeout(1500);
    const top = await desk.evaluate(() => document.getElementById("knowledge").getBoundingClientRect().top);
    assert.ok(top >= 0 && top < 200, `knowledge top ${top}`);
    assert.equal(await current(desk), "#knowledge");

    step = "desktop: a far jump (home to contact) holds the target all the way";
    await desk.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await desk.waitForTimeout(300);
    await desk.evaluate(() => {
      window.__ended = false;
      addEventListener("scrollend", () => (window.__ended = true), { once: true });
    });
    await desk.click('.b-stepper a[href="#contact"]');
    const seen = new Set();
    for (let t = 0; t < 60 && !(await desk.evaluate(() => window.__ended)); t++) {
      seen.add(await current(desk));
      await desk.waitForTimeout(50);
    }
    await desk.waitForTimeout(300);
    seen.add(await current(desk));
    assert.deepEqual([...seen], ["#contact"]);

    step = "desktop: resizing recomputes the step";
    await scrollToId(desk, "process");
    await desk.waitForTimeout(300);
    await desk.setViewportSize({ width: 1280, height: 600 });
    await desk.waitForTimeout(300);
    assert.equal(await current(desk), await expected(desk));

    step = "desktop: every step change is announced once, in order";
    await desk.setViewportSize({ width: 1440, height: 900 });
    await desk.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await desk.waitForTimeout(300);
    await desk.evaluate(() => {
      window.__steps = [];
      addEventListener("baloul:step", (e) => window.__steps.push(e.detail));
    });
    await desk.evaluate(() => window.scrollTo({ top: document.getElementById("services").offsetTop - 60, behavior: "instant" }));
    await desk.waitForTimeout(250);
    await scrollToId(desk, "process");
    await desk.waitForTimeout(250);
    assert.deepEqual(await desk.evaluate(() => window.__steps), [
      { id: "services", prev: "top" },
      { id: "process", prev: "services" },
    ]);
    await desk.context().close();

    step = "desktop 1280x720: sweep matches geometry";
    const lap = await open(browser, { viewport: { width: 1280, height: 720 } });
    for (const stride of [150, 600]) assert.deepEqual(await sweep(lap, stride), [], `stride ${stride}`);
    await lap.context().close();

    step = "deep link: /#knowledge starts on that step";
    const deep = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await deep.goto(HOME + "#knowledge");
    await deep.waitForTimeout(500);
    assert.equal(await current(deep), "#knowledge");
    await deep.close();

    step = "small laptop 1100: no rail, the bar appears after the hero";
    const mid = await open(browser, { viewport: { width: 1100, height: 800 } });
    assert.equal(await mid.isVisible("nav.b-stepper"), false);
    await scrollToId(mid, "process");
    await mid.waitForTimeout(400);
    assert.equal(await mid.$eval(".b-stepper-mobile", (e) => getComputedStyle(e).opacity), "1");
    await mid.context().close();

    step = "phone: no rail, the progress bar appears after the hero";
    const phone = await open(browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    assert.equal(await phone.isVisible("nav.b-stepper"), false);
    assert.equal(await phone.$eval(".b-stepper-mobile", (e) => getComputedStyle(e).opacity), "0");
    await scrollToId(phone, "process");
    await phone.waitForTimeout(400);
    assert.equal(await phone.$eval(".b-stepper-mobile", (e) => getComputedStyle(e).opacity), "1");
    assert.equal(await phone.textContent(".b-stepper-mobile-label"), "איך עובדים");
    await phone.context().close();

    console.log("PASS stepper");
  } catch (e) {
    process.exitCode = 1;
    console.error("FAIL at: " + step);
    console.error(e.message);
  } finally {
    await browser.close();
    server.close();
  }
})();
