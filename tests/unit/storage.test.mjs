// localStorage access that never throws (Dan, 2026-11-16). Run: node --test tests/unit/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readStorage, writeStorage } from "../../lib/storage.ts";

const parse = (r) => (r === "en" ? "en" : "he");
const fake = (init = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), m };
};
const throwing = {
  getItem() {
    throw new Error("blocked");
  },
  setItem() {
    throw new Error("blocked");
  },
};

test("read returns parsed value", () => assert.equal(readStorage(fake({ k: "en" }), "k", parse), "en"));
test("read missing key", () => assert.equal(readStorage(fake(), "k", parse), "he"));
test("read survives throwing storage", () => assert.equal(readStorage(throwing, "k", parse), "he"));
test("read without storage", () => assert.equal(readStorage(undefined, "k", parse), "he"));
test("write stores string", () => {
  const s = fake();
  assert.equal(writeStorage(s, "k", "en"), true);
  assert.equal(s.m.get("k"), "en");
});
test("write survives throwing storage", () => assert.equal(writeStorage(throwing, "k", "en"), false));
