"use client";

import { useCallback, useSyncExternalStore } from "react";
import { type Primitive, STORAGE_EVENT, readStorage, writeStorage } from "./storage";

/** Values for keys the browser refused to store (private mode), so the choice still holds for this page view. */
const memory = new Map<string, Primitive>();

function storage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * A primitive value kept in localStorage. Built on useSyncExternalStore: the server and the first hydration
 * render use serverValue (no mismatch), then the stored value takes over. Stays in sync across components,
 * with other tabs (native "storage" event) and within this tab (STORAGE_EVENT).
 * Primitives only: the snapshot is compared with Object.is, so an object would re-render forever.
 */
export function useLocalStorage<T extends Primitive>(
  key: string,
  parse: (raw: string | null) => T,
  serverValue: T,
): [T, (next: T) => void] {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const onStorage = (e: StorageEvent) => (e.key === key || e.key === null) && onChange();
      const onLocal = (e: Event) => (e as CustomEvent<{ key: string }>).detail?.key === key && onChange();
      window.addEventListener("storage", onStorage);
      window.addEventListener(STORAGE_EVENT, onLocal);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(STORAGE_EVENT, onLocal);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(
    () => (memory.has(key) ? (memory.get(key) as T) : readStorage(storage(), key, parse)),
    [key, parse],
  );

  const value = useSyncExternalStore(subscribe, getSnapshot, () => serverValue);

  const setValue = useCallback(
    (next: T) => {
      if (writeStorage(storage(), key, String(next))) memory.delete(key);
      else memory.set(key, next);
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
    },
    [key],
  );

  return [value, setValue];
}
