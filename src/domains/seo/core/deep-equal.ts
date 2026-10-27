/**
 * Deep equality for SEO options and JSON-LD payloads.
 *
 * Used by React component memoization, the useSEO hook, and the JsonLd hook
 * to avoid re-running DOM mutations or re-injecting <script> tags when the
 * incoming object reference changes but the content is structurally equal.
 */

export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const recordA = a as Record<string, unknown>;
    const recordB = b as Record<string, unknown>;
    const keysA = Object.keys(recordA);
    const keysB = Object.keys(recordB);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(
      (key) => keysB.includes(key) && deepEqual(recordA[key], recordB[key])
    );
  }

  return false;
};
