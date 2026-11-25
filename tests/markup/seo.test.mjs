// SEO gate on the built site: per page title, description, h1, canonical and hreflang, structured data;
// site-wide sitemap, robots, manifest and llms.txt. Run: npm run build && npm run test:markup
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const out = "out";
const finderCopy = / \d+\.html$/;
/** Pages that are built but must not rank: the 404 (noindex) and the Netlify Forms detection page. */
const notIndexed = new Set(["404.html", "_not-found.html", "__forms.html"]);
const TITLE_MAX = 70;
const DESCRIPTION_MAX = 160;

if (!existsSync(out)) throw new Error("run npm run build first");

const pages = readdirSync(out, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith(".html") && !finderCopy.test(f) && !notIndexed.has(f))
  .sort();

const read = (file) => readFileSync(join(out, file), "utf8");
const head = (html) => html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
const all = (html, re) => html.match(re) ?? [];
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "";
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/** The file a URL is exported to: / → index.html, /en → en.html, /en/x → en/x.html. */
function fileOf(url) {
  const path = new URL(url).pathname.replace(/\/$/, "");
  return path === "" ? "index.html" : `${path.slice(1)}.html`;
}

const canonicals = new Map();

for (const file of pages) {
  test(`seo ${file}`, () => {
    const html = read(file);
    const h = head(html);

    const titles = all(h, /<title>([^<]*)<\/title>/g);
    assert.equal(titles.length, 1, "exactly one <title>");
    const title = decode(titles[0].slice(7, -8));
    assert.ok(title.length > 0 && title.length <= TITLE_MAX, `title is ${title.length} chars (max ${TITLE_MAX}): ${title}`);

    const descriptions = all(h, /<meta name="description" content="[^"]*"\/?>/g);
    assert.equal(descriptions.length, 1, "exactly one meta description");
    const description = decode(attr(descriptions[0], "content"));
    assert.ok(
      description.length > 0 && description.length <= DESCRIPTION_MAX,
      `description is ${description.length} chars (max ${DESCRIPTION_MAX}): ${description}`,
    );

    assert.equal(all(html, /<h1[\s>]/g).length, 1, "exactly one <h1>");

    const canonical = all(h, /<link rel="canonical" href="[^"]*"\/?>/g);
    assert.equal(canonical.length, 1, "exactly one canonical");
    canonicals.set(file, attr(canonical[0], "href"));
    for (const lang of ["he", "en", "x-default"]) {
      assert.match(h, new RegExp(`<link rel="alternate" hrefLang="${lang}" href="[^"]+"`), `hreflang ${lang}`);
    }
    assert.match(h, /<meta name="robots" content="index, follow"\/?>/, "robots index, follow");
    assert.match(h, /<meta name="googlebot" content="[^"]*max-image-preview:large/, "googlebot large image preview");
    assert.match(h, /<meta property="og:title"/, "Open Graph title");

    const blocks = all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    assert.ok(blocks.length > 0, "structured data present");
    for (const block of blocks) {
      const data = JSON.parse(block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""));
      assert.equal(data["@context"], "https://schema.org");
      assert.ok(data["@type"], "ld+json has @type");
    }
  });
}

test("sitemap lists every indexable page, and only those, with lastmod", () => {
  const xml = read("sitemap.xml");
  const locs = all(xml, /<loc>[^<]*<\/loc>/g).map((l) => l.slice(5, -6));
  assert.deepEqual(locs.map(fileOf).sort(), pages);
  assert.equal(all(xml, /<lastmod>/g).length, locs.length, "lastmod on every url");
  assert.equal(all(xml, /hreflang="x-default"/g).length, locs.length, "x-default alternate on every url");
  for (const [file, canonical] of canonicals) {
    assert.ok(locs.includes(canonical) || locs.includes(`${canonical}/`), `${file}: canonical ${canonical} is in the sitemap`);
  }
});

test("robots.txt allows every crawler, names the AI crawlers and the sitemap", () => {
  const txt = read("robots.txt");
  assert.match(txt, /^User-Agent: \*$/m);
  assert.match(txt, /^Allow: \/$/m);
  assert.doesNotMatch(txt, /^Disallow: \/\s*$/m, "nothing blocks the whole site");
  assert.match(txt, /^Sitemap: https?:\/\/.+\/sitemap\.xml$/m);
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) assert.match(txt, new RegExp(`^User-Agent: ${bot}$`, "m"), bot);
});

test("manifest has identity, description and icons", () => {
  const manifest = JSON.parse(read("manifest.webmanifest"));
  assert.ok(manifest.name && manifest.short_name && manifest.description, "name, short_name, description");
  assert.equal(manifest.start_url, "/");
  assert.ok(manifest.icons.length >= 2, "two icons or more");
});

test("llms.txt covers every page in both languages", () => {
  const txt = read("llms.txt");
  const slugs = pages.filter((f) => !f.startsWith("en/") && f !== "index.html" && f !== "en.html").map((f) => f.replace(/\.html$/, ""));
  assert.ok(slugs.length >= 4, "service pages found");
  for (const slug of slugs) {
    assert.match(txt, new RegExp(`/${slug}\\)`), `Hebrew /${slug}`);
    assert.match(txt, new RegExp(`/en/${slug}\\)`), `English /en/${slug}`);
  }
});
