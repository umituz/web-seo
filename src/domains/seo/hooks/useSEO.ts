/**
 * `useSEO(options)` hook.
 *
 * Imperative alternative to the `<SEO>` component for callers that need
 * to derive SEO options from arbitrary React state without a wrapper.
 */

import { useEffect, useRef } from "react";
import { deepEqual } from "../core/deep-equal.js";
import type { SEOptions } from "../types/index.js";
import { updateSEO } from "../utils/dom/index.js";

export const useSEO = (options: SEOptions): void => {
  const prevOptionsRef = useRef<SEOptions | null>(null);

  useEffect(() => {
    if (!prevOptionsRef.current || !deepEqual(prevOptionsRef.current, options)) {
      prevOptionsRef.current = options;
      updateSEO(options);
    }
  }, [options]);
};
