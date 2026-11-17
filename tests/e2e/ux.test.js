// Calmer first visit (design review, Nov 2026): cookie bar instead of a blocking dialog, no automatic popup on phones,
// popup on desktop only after the reviews, one submit style, a grouped mobile menu and no repeated domain strip.
// Run after `npm run build`: node tests/e2e/ux.test.js
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const serve = require("./serve");

const PORT = 4332;
const HOME = `http://localhost:${PORT}/`;

async function setup(browser, errs, options, { consent = true } = {}) {
  const ctx = await browser.newContext(options);
  if (consent) {
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("baloul-consent-v1", "denied");
      } catch {}
    });
  }
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  return page;
}

const scrollTo = (page, y) => page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
/** A press and click on the page body, outside every menu and dialog. */
const pressOutside = (page) =>
  page.evaluate(() => {
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    document.body.click();
  });

(async () => {
  const server = await serve("out", PORT);
  const browser = await chromium.launch();
  const errs = [];
  let step = "start";
  try {
    const desk = { viewport: { width: 1440, height: 900 } };
    const phone = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

    step = "first visit: cookie notice is a bottom bar, the page stays usable";
    const fresh = await setup(browser, errs, phone, { consent: false });
    await fresh.goto(HOME);
    await fresh.waitForSelector(".b-consent[data-open='true']");
    assert.equal(await fresh.locator(".b-consent--bar").count(), 1);
    assert.equal(await fresh.locator(".b-consent-backdrop").count(), 0);
    await fresh.click(".b-consent-decline");
    assert.equal(await fresh.locator(".b-consent").count(), 0);

    step = "phones: no automatic popup, even at the bottom of the page";
    const mobile = await setup(browser, errs, phone);
    await mobile.goto(HOME);
    for (const f of [0.3, 0.55, 0.8, 1]) {
      await mobile.evaluate((r) => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * r, behavior: "instant" }), f);
      await mobile.waitForTimeout(250);
    }
    await mobile.waitForTimeout(700);
    assert.equal(await mobile.locator(".b-lead-pop.open").count(), 0);

    step = "phones: top line has no duplicate call / WhatsApp links";
    assert.equal(await mobile.locator(".b-utility-links").isVisible(), false);

    step = "phones: menu groups the four service pages under one heading, CTA last";
    await scrollTo(mobile, 0);
    await mobile.click(".b-menu");
    assert.equal(await mobile.locator(".b-mobile-group a").count(), 4);
    assert.equal(await mobile.locator(".b-mobile-group-title").textContent(), "תחומי פעילות");
    assert.equal(await mobile.locator(".b-mobile > a:last-child").getAttribute("class"), "b-mobile-cta");

    step = "phones: Escape and a press outside close the menu";
    // <details> reports opening with an async "toggle" event; give it a frame, as a person always would.
    await mobile.waitForTimeout(100);
    await mobile.keyboard.press("Escape");
    assert.equal(await mobile.locator("#bMobileMenu[open]").count(), 0, "Escape closes the menu");
    await mobile.click(".b-menu");
    assert.equal(await mobile.locator("#bMobileMenu[open]").count(), 1, "the menu opens again");
    await mobile.waitForTimeout(100);
    await pressOutside(mobile);
    assert.equal(await mobile.locator("#bMobileMenu[open]").count(), 0, "a press outside closes the menu");

    step = "home: the domain strip is gone (services are not listed three times)";
    assert.equal(await mobile.locator(".b-domain-nav").count(), 0);

    step = "desktop: popup waits until the reviews are behind the visitor";
    const page = await setup(browser, errs, desk);
    await page.goto(HOME);
    await page.evaluate(() => document.getElementById("reviews").scrollIntoView({ block: "start", behavior: "instant" }));
    await page.waitForTimeout(800);
    assert.equal(await page.locator(".b-lead-pop.open").count(), 0, "popup must not cover the reviews");
    await page.evaluate(() => {
      const r = document.getElementById("reviews").getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.bottom, behavior: "instant" });
    });
    await page.waitForSelector(".b-lead-pop.open", { timeout: 3000 });

    step = "popup: focus goes to the close button, submit uses the green WhatsApp button style";
    assert.equal(await page.evaluate(() => document.activeElement?.className), "b-lead-pop-close");
    const bg = (sel) => page.$eval(sel, (e) => getComputedStyle(e).backgroundColor);
    assert.equal(await bg(".b-lead-pop-submit"), await bg(".b-contact .b-btn-wa"));
    assert.equal(await bg(".b-lead-pop-submit"), "rgb(21, 128, 61)");
    // White WhatsApp icon first, so in RTL it sits on the right of the text.
    assert.equal(await page.$eval(".b-lead-pop-submit", (b) => b.firstElementChild.tagName.toLowerCase()), "svg");
    assert.equal(await page.$eval(".b-lead-pop-submit svg", (s) => getComputedStyle(s).color), "rgb(255, 255, 255)");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".b-lead-pop.open").count(), 0);

    step = "dialogs: Escape closes the About dialog and focus returns to the link that opened it";
    const dlg = await setup(browser, errs, desk);
    await dlg.goto(HOME);
    const opener = dlg.locator('main a[href="#about-modal"]').first();
    await opener.scrollIntoViewIfNeeded();
    await opener.evaluate((a) => (a.dataset.testOpener = "1"));
    await opener.focus();
    await opener.press("Enter");
    await dlg.waitForSelector("#about-modal.open");
    await dlg.waitForTimeout(50);
    assert.equal(await dlg.evaluate(() => document.activeElement?.classList.contains("b-modal-close")), true);
    await dlg.keyboard.press("Escape");
    assert.equal(await dlg.locator("#about-modal.open").count(), 0);
    assert.equal(await dlg.evaluate(() => document.activeElement?.dataset.testOpener), "1");

    step = "dialogs: one Escape closes only the top layer (About over the open services menu)";
    await scrollTo(dlg, 0);
    await dlg.click(".b-services-menu > summary");
    await dlg.waitForTimeout(100);
    await dlg.evaluate(() => window.dispatchEvent(new Event("baloul:open-about")));
    await dlg.waitForSelector("#about-modal.open");
    await dlg.keyboard.press("Escape");
    assert.equal(await dlg.locator("#about-modal.open").count(), 0);
    assert.equal(await dlg.locator(".b-services-menu[open]").count(), 1, "the menu under the dialog stays open");
    await dlg.keyboard.press("Escape");
    assert.equal(await dlg.locator(".b-services-menu[open]").count(), 0);

    step = "menus: a press outside closes the services menu; Escape and a press outside close the language menu";
    await dlg.click(".b-services-menu > summary");
    await dlg.waitForTimeout(100);
    await pressOutside(dlg);
    assert.equal(await dlg.locator(".b-services-menu[open]").count(), 0, "a press outside closes the services menu");
    await dlg.click(".b-lang-trigger");
    assert.equal(await dlg.locator(".b-lang[data-open]").count(), 1);
    await dlg.keyboard.press("Escape");
    assert.equal(await dlg.locator(".b-lang[data-open]").count(), 0, "Escape closes the language menu");
    assert.equal(await dlg.evaluate(() => document.activeElement?.className), "b-lang-trigger");
    await dlg.click(".b-lang-trigger");
    await pressOutside(dlg);
    assert.equal(await dlg.locator(".b-lang[data-open]").count(), 0, "a press outside closes the language menu");

    step = "dialogs: the lead popup waits while another dialog is open";
    await dlg.evaluate(() => {
      const r = document.getElementById("reviews").getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.bottom, behavior: "instant" });
      window.dispatchEvent(new Event("baloul:open-about"));
    });
    await dlg.waitForTimeout(1000);
    assert.equal(await dlg.locator(".b-lead-pop.open").count(), 0, "popup must not open over the About dialog");
    await dlg.keyboard.press("Escape");
    await dlg.evaluate(() => window.scrollBy({ top: 40, behavior: "instant" }));
    await dlg.waitForSelector(".b-lead-pop.open", { timeout: 3000 });

    step = "lead forms: no duplicate ids with the popup open, labels point at their fields";
    const ids = await dlg.evaluate(() => {
      const all = [...document.querySelectorAll("[id]")].map((el) => el.id);
      const dupes = all.filter((id, i) => all.indexOf(id) !== i);
      const orphans = [...document.querySelectorAll("#bForm label, #bLeadPopForm label")]
        .filter((l) => l.htmlFor && !document.getElementById(l.htmlFor))
        .map((l) => l.htmlFor);
      return { dupes, orphans };
    });
    assert.deepEqual(ids.dupes, [], "duplicate ids");
    assert.deepEqual(ids.orphans, [], "labels without a field");
    await dlg.click('label[for="bLeadPopName"]');
    assert.equal(await dlg.evaluate(() => document.activeElement?.id), "bLeadPopName", "the popup label focuses its field");
    await dlg.context().close();

    step = "service page: facts panel replaces the icon circle";
    await page.goto(`${HOME}pension-retirement`);
    assert.equal(await page.locator(".b-service-hero-icon").count(), 0);
    assert.equal(await page.locator(".b-service-facts > div").count(), 3);

    step = "no horizontal scroll on mobile service page";
    await mobile.goto(`${HOME}pension-retirement`);
    assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

    step = "home: the four service rows fit in one screen (small laptop and phone)";
    for (const vp of [{ width: 1280, height: 720 }, { width: 390, height: 664 }]) {
      const p = await setup(browser, errs, { viewport: vp, hasTouch: vp.width < 500, isMobile: vp.width < 500 });
      await p.goto(HOME);
      const fit = await p.evaluate(() => {
        const list = document.querySelector("#services .b-solution-list").getBoundingClientRect().height;
        const header = document.querySelector(".b-header").getBoundingClientRect().height;
        const bar = document.querySelector(".b-floating");
        const bottom = bar && getComputedStyle(bar).display === "grid" ? bar.getBoundingClientRect().height : 0;
        const s = document.querySelector("#services");
        const block = s.querySelector(".b-solution-list").getBoundingClientRect().bottom - s.querySelector(".b-eyebrow").getBoundingClientRect().top;
        return { list, block, room: innerHeight - header - bottom };
      });
      assert.ok(fit.list <= fit.room, `${vp.width}px: list ${fit.list}px > room ${fit.room}px`);
      if (vp.width >= 1280) assert.ok(fit.block <= fit.room, `${vp.width}px: heading + list ${fit.block}px > room ${fit.room}px`);
      await p.context().close();
    }

    step = "faq keeps one open";
    const faq = await setup(browser, errs, desk);
    await faq.goto(HOME);
    await faq.click("#knowledge .b-faq-item:nth-child(1) > summary");
    await faq.click("#knowledge .b-faq-item:nth-child(2) > summary");
    await faq.waitForTimeout(100);
    assert.equal(await faq.locator("#knowledge .b-faq-item[open]").count(), 1);
    assert.equal(await faq.locator("#knowledge .b-faq-item:nth-child(2)[open]").count(), 1);

    // Smooth scrolling takes longer on some runs: wait for the hash and the form in view, not a fixed time.
    const contactReached = () =>
      faq
        .waitForFunction(() => location.hash === "#contact" && Math.abs(document.getElementById("contact").getBoundingClientRect().top) < 200, null, {
          timeout: 10000,
        })
        .catch(() => {});

    for (const path of ["", "en", "pension-retirement", "en/pension-retirement"]) {
      step = `cta reaches contact form (/${path})`;
      await faq.goto(HOME + path);
      await faq.click(".b-hero-actions a");
      await contactReached();
      assert.ok(faq.url().endsWith("#contact"), faq.url());
      assert.ok(await faq.locator("#contact #bForm").isVisible());
      assert.ok(await faq.evaluate(() => Math.abs(document.getElementById("contact").getBoundingClientRect().top) < 200));
    }

    step = "faq keeps one open (service page)";
    await faq.goto(`${HOME}pension-retirement`);
    await faq.click(".b-knowledge .b-faq-item:nth-child(1) > summary");
    await faq.click(".b-knowledge .b-faq-item:nth-child(2) > summary");
    await faq.waitForTimeout(100);
    assert.equal(await faq.locator(".b-knowledge .b-faq-item[open]").count(), 1);
    assert.equal(await faq.locator(".b-knowledge .b-faq-item:nth-child(2)[open]").count(), 1);
    await faq.context().close();

    step = "no console errors";
    assert.deepEqual(errs, []);
    step = "floating WhatsApp: hover opens a bubble of topics, each with a ready message";
    const wa = await setup(browser, errs, desk);
    await wa.goto(HOME);
    assert.equal(await wa.isVisible(".b-wa-menu"), false);
    await wa.hover(".b-floating a.b-wa");
    await wa.waitForTimeout(500);
    assert.equal(await wa.isVisible(".b-wa-menu"), true);
    assert.equal(await wa.textContent(".b-wa-menu-title"), "אשמח ליצור קשר בנושא:");
    const topics = await wa.$$eval(".b-wa-menu li a", (as) => as.map((a) => [a.textContent, decodeURIComponent(a.href)]));
    assert.equal(topics.length, 5);
    assert.equal(topics[0][0], "פנסיה ופרישה");
    assert.ok(topics[0][1].includes("אשמח לבדוק את הפנסיה ותכנון הפרישה שלי."), topics[0][1]);
    step = "floating WhatsApp: moving up into the bubble keeps it open, leaving closes it";
    await wa.hover(".b-wa-menu li:first-child a");
    await wa.waitForTimeout(500);
    assert.equal(await wa.isVisible(".b-wa-menu"), true);
    await wa.mouse.move(700, 300);
    await wa.waitForTimeout(800);
    assert.equal(await wa.isVisible(".b-wa-menu"), false);
    step = "floating WhatsApp: keyboard focus opens the bubble too";
    await wa.focus(".b-floating a.b-wa");
    await wa.waitForTimeout(300);
    assert.equal(await wa.isVisible(".b-wa-menu"), true);
    step = "floating WhatsApp: desktop bubble has no X, Escape closes it";
    assert.equal(await wa.isVisible(".b-wa-menu-close"), false);
    await wa.keyboard.press("Escape");
    await wa.waitForTimeout(400);
    assert.equal(await wa.isVisible(".b-wa-menu"), false);
    await wa.context().close();
    step = "floating WhatsApp: on phones, tapping WhatsApp opens the topics as a sheet with an X";
    const waPhone = await setup(browser, errs, phone);
    await waPhone.goto(HOME);
    await waPhone.waitForTimeout(300);
    assert.equal(await waPhone.isVisible(".b-wa-menu"), false);
    assert.equal(await waPhone.isVisible(".b-floating .b-call"), true);
    await waPhone.tap(".b-floating a.b-wa");
    await waPhone.waitForTimeout(400);
    assert.equal(waPhone.url(), HOME);
    assert.equal(await waPhone.isVisible(".b-wa-menu"), true);
    assert.equal(await waPhone.getAttribute(".b-floating a.b-wa", "aria-expanded"), "true");
    assert.equal(await waPhone.$$eval(".b-wa-menu li a", (as) => as.length), 5);
    const sheet = await waPhone.locator(".b-wa-menu").boundingBox();
    const bar = await waPhone.locator(".b-floating .b-call").boundingBox();
    assert.ok(sheet.x >= 0 && sheet.x + sheet.width <= 390 && sheet.y + sheet.height <= bar.y, JSON.stringify({ sheet, bar }));
    await waPhone.tap(".b-wa-menu-close");
    await waPhone.waitForTimeout(400);
    assert.equal(await waPhone.isVisible(".b-wa-menu"), false);
    step = "floating WhatsApp: on phones, tapping outside also closes the sheet";
    await waPhone.tap(".b-floating a.b-wa");
    await waPhone.waitForTimeout(400);
    await waPhone.tap("h1");
    await waPhone.waitForTimeout(400);
    assert.equal(await waPhone.isVisible(".b-wa-menu"), false);
    await waPhone.context().close();

    console.log("PASS ux");
  } catch (e) {
    process.exitCode = 1;
    console.error("FAIL at: " + step);
    console.error(e.message);
  } finally {
    await browser.close();
    server.close();
  }
})();
