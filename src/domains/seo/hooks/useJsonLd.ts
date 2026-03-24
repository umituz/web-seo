/**
 * useJsonLd Hook
 *
 * React hook for managing JSON-LD structured data.
 * Provides a programmatic way to add/update/remove structured data.
 */

import { useEffect, useCallback, useMemo } from "react";
import type { JsonLdTypes } from "../types/schema.js";

interface UseJsonLdOptions {
  /** Strategy for when to inject the script tag */
  strategy?: "afterInteractive" | "beforeInteractive" | "idle";
  /** Unique identifier for this JSON-LD block */
  id?: string;
}

// Generate a stable hash from JSON-LD data for consistent identification
// Optimized with better hashing algorithm and memoization
const hashCache = new WeakMap<JsonLdTypes, string>();

const generateDataId = (data: JsonLdTypes): string => {
  // Check cache first for better performance
  if (hashCache.has(data)) {
    return hashCache.get(data)!;
  }

  // Use base64 encoding for faster, more reliable hashing
  const str = JSON.stringify(data);

  // Optimized hashing using cyrb53 algorithm (better distribution & performance)
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hash = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  const result = `jsonld-${hash}`;

  // Cache the result for future use
  hashCache.set(data, result);

  return result;
};

export const useJsonLd = (data: JsonLdTypes | JsonLdTypes[], options?: UseJsonLdOptions) => {
  const { strategy = "afterInteractive", id } = options || {};

  // Generate stable IDs for data items
  const dataIds = useMemo(() => {
    const dataArray = Array.isArray(data) ? data : [data];
    return dataArray.map((item) => id ? `${id}-${dataArray.indexOf(item)}` : generateDataId(item));
  }, [data, id]);

  const injectJsonLd = useCallback((jsonData: JsonLdTypes | JsonLdTypes[]) => {
    if (typeof document === "undefined") return;

    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
    const ids = Array.isArray(jsonData) && !id
      ? dataArray.map(generateDataId)
      : dataIds;

    dataArray.forEach((item, index) => {
      // Remove existing script if present
      const existingScript = document.querySelector(
        `script[type="application/ld+json"][data-seo-id="${ids[index]}"]`
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Create and inject new script
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(item);
      script.setAttribute("data-seo-id", ids[index]);
      script.setAttribute("data-seo-strategy", strategy);

      document.head.appendChild(script);
    });
  }, [id, strategy, dataIds]);

  const removeJsonLd = useCallback(() => {
    if (typeof document === "undefined") return;

    dataIds.forEach((dataId) => {
      const script = document.querySelector(
        `script[type="application/ld+json"][data-seo-id="${dataId}"]`
      );
      if (script) {
        script.remove();
      }
    });
  }, [dataIds]);

  useEffect(() => {
    if (data) {
      injectJsonLd(data);
    }

    return () => {
      removeJsonLd();
    };
  }, [data, injectJsonLd, removeJsonLd]);

  return {
    injectJsonLd,
    removeJsonLd,
  };
};

export default useJsonLd;
