import type { StepId } from "@/content/sections";

/** A registered step and where its top edge is, in viewport pixels. */
export type StepBox = { id: StepId; top: number };

/** Share of the viewport below the sticky header where reading happens. A part is "current" once its top passes this line. */
const READING_SHARE = 0.35;

/** The line, in viewport pixels, that a part's top must pass to become the current step. */
export function readingLine(headerBottom: number, viewportHeight: number): number {
  return headerBottom + (viewportHeight - headerBottom) * READING_SHARE;
}

/**
 * The current step is decided by position only: the last part whose top has passed the reading line.
 * Before the first part, the first one; at the very bottom of the page, the last one (it may be too short to reach the line).
 * Pure, so the same answer comes back whatever order scroll events arrive in.
 */
export function resolveStep(boxes: StepBox[], line: number, atBottom: boolean): StepId | null {
  if (boxes.length === 0) return null;
  const sorted = [...boxes].sort((a, b) => a.top - b.top);
  if (atBottom) return sorted[sorted.length - 1].id;
  let current = sorted[0].id;
  for (const box of sorted) if (box.top <= line) current = box.id;
  return current;
}
