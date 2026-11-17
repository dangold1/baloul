import { test } from "node:test";
import assert from "node:assert/strict";
import { cx } from "../../lib/cx.ts";

test("cx joins truthy parts", () => assert.equal(cx("a", false, null, undefined, "b"), "a b"));
test("cx with no parts is empty", () => assert.equal(cx(), ""));
test("cx drops empty strings", () => assert.equal(cx("a", ""), "a"));
