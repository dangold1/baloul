// Markup snapshot of the built site. Run: npm run build && npm run test:markup (UPDATE=1 rewrites snapshots)
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const out = "out";
const snaps = "tests/markup/snapshots";
const finderCopy = / \d+\.html$/;

export function normalize(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  return (m ? m[1] : html)
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .trim();
}

function pages() {
  if (!existsSync(out)) throw new Error("run npm run build first");
  return readdirSync(out, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith(".html") && !finderCopy.test(f))
    .sort();
}

const allowlist = [
  "עברית",
  "לא למלא", // TODO Task 7: Honeypot label from a prop
];

for (const file of pages()) {
  test(`markup ${file}`, () => {
    const actual = normalize(readFileSync(join(out, file), "utf8"));
    const snap = join(snaps, file);
    if (process.env.UPDATE || !existsSync(snap)) {
      mkdirSync(dirname(snap), { recursive: true });
      writeFileSync(snap, actual);
      if (!process.env.UPDATE) assert.fail(`no snapshot for ${file}; run UPDATE=1 npm run test:markup`);
      return;
    }
    assert.equal(actual, readFileSync(snap, "utf8"));
  });
}

test("en pages contain no hebrew", () => {
  for (const file of pages().filter((f) => f.startsWith("en/") || f === "en.html")) {
    let text = normalize(readFileSync(join(out, file), "utf8")).replace(/<[^>]*>/g, " ");
    for (const a of allowlist) text = text.split(a).join("");
    const m = text.match(/[֐-׿]/);
    assert.ok(!m, `${file}: hebrew near "${m && text.slice(Math.max(0, m.index - 20), m.index + 20)}"`);
  }
});
