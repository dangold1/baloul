// Which part of the home page is being read (Dan, 2026-11-10). Run: node --test tests/unit/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readingLine, resolveStep } from "../../lib/steps.ts";
import { sectionHref } from "../../content/sections.ts";

const boxes = [
  { id: "top", top: -500 },
  { id: "services", top: -100 },
  { id: "process", top: 200 },
  { id: "about-inline", top: 600 },
];

test("picks last box above the line", () => assert.equal(resolveStep(boxes, 300, false), "process"));
test("before first box picks first", () =>
  assert.equal(resolveStep(boxes.map((b) => ({ ...b, top: b.top + 2000 })), 300, false), "top"));
test("bottom of page picks last", () => assert.equal(resolveStep(boxes, 300, true), "about-inline"));
test("order independent", () => assert.equal(resolveStep([...boxes].reverse(), 300, false), "process"));
test("empty", () => assert.equal(resolveStep([], 300, false), null));
test("reading line", () => assert.equal(readingLine(80, 900), 367));
test("section href in place", () => assert.equal(sectionHref("process"), "#process"));
test("section href with base", () => assert.equal(sectionHref("contact", "/"), "/#contact"));
