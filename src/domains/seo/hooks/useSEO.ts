import { useEffect, useRef } from "react";
import type { SEOptions } from "../types/index.js";
import { updateSEO } from "../utils/dom.js";

/**
 * Deep comparison function for objects and arrays
 * Performs efficient structural equality check
 */
const deepEqual = (a: unknown, b: unknown): boolean => {
  // Primitive values and same reference
  if (a === b) return true;

  // Handle null/undefined
  if (a == null || b == null) return a === b;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  // Handle objects
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key =>
      keysB.includes(key) && deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    );
  }

  return false;
};

export const useSEO = (options: SEOptions) => {
  // Use ref to store the previous options for deep comparison
  const prevOptionsRef = useRef<SEOptions | null>(null);

  useEffect(() => {
    // Only update if options have actually changed
    if (!prevOptionsRef.current || !deepEqual(prevOptionsRef.current, options)) {
      prevOptionsRef.current = options;
      updateSEO(options);
    }
  }, [options]);
};
