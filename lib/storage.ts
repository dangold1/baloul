export type Primitive = string | number | boolean;

/** Fired on window when this tab writes a key through writeStorage: detail { key }. Other tabs get the native "storage" event. */
export const STORAGE_EVENT = "baloul:storage";

/** Reads and parses a key. A missing storage, a blocked one (private mode) or a missing key all give parse(null). */
export function readStorage<T extends Primitive>(
  storage: Pick<Storage, "getItem"> | undefined,
  key: string,
  parse: (raw: string | null) => T,
): T {
  try {
    return parse(storage ? storage.getItem(key) : null);
  } catch {
    return parse(null);
  }
}

/** Writes a key. Returns false when there is no storage or it refuses the write. */
export function writeStorage(storage: Pick<Storage, "setItem"> | undefined, key: string, value: string): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
