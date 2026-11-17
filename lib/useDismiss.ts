"use client";

import { useEffect, useRef } from "react";

export type DismissReason = "escape" | "outside";

/** Everything open right now, newest last. Escape closes only the newest one. */
const openStack: object[] = [];
/** Escape presses already used, so closing the top layer cannot pass the same press on to the one below it. */
const handled = new WeakSet<Event>();

/**
 * Closes a menu, popover or dialog while `active`: on Escape (topmost layer only)
 * and, unless `outside` is false, on a pointer press outside `ref`.
 */
export function useDismiss(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: (reason: DismissReason) => void,
  opts: { outside?: boolean } = {},
) {
  const outside = opts.outside !== false;
  const latest = useRef(onDismiss);
  useEffect(() => {
    latest.current = onDismiss;
  });

  useEffect(() => {
    if (!active) return;
    const layer = {};
    openStack.push(layer);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || handled.has(e) || openStack.at(-1) !== layer) return;
      handled.add(e);
      latest.current("escape");
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) latest.current("outside");
    };
    document.addEventListener("keydown", onKey);
    if (outside) document.addEventListener("pointerdown", onDown);
    return () => {
      openStack.splice(openStack.indexOf(layer), 1);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [active, outside, ref]);
}
