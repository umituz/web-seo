/**
 * JsonLd Component
 *
 * React component for injecting JSON-LD structured data into the page.
 * Supports all Schema.org types with automatic validation.
 */

import { useEffect, useRef, useMemo, memo } from "react";
import type { JsonLdTypes } from "../types/schema.js";

interface JsonLdProps {
  data: JsonLdTypes | JsonLdTypes[];
  /** Strategy for when to inject the script tag */
  strategy?: "afterInteractive" | "beforeInteractive" | "idle";
  /** Unique identifier for this JSON-LD block (for debugging) */
  id?: string;
}

// Optimized hash generation with caching using cyrb53 algorithm
const hashCache = new WeakMap<JsonLdTypes, string>();

const generateDataId = (data: JsonLdTypes): string => {
  // Check cache first for better performance
  if (hashCache.has(data)) {
    return hashCache.get(data)!;
  }

  // Use optimized hashing using cyrb53 algorithm (better distribution & performance)
  const str = JSON.stringify(data);
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

/**
 * Deep comparison for JSON-LD data
 */
const deepEqual = (a: JsonLdTypes | JsonLdTypes[], b: JsonLdTypes | JsonLdTypes[]): boolean => {
  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  // Handle single objects
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return false;
};

const JsonLdComponent = ({ data, strategy = "afterInteractive", id }: JsonLdProps) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Generate stable IDs for data items
  const dataIds = useMemo(() => {
    const dataArray = Array.isArray(data) ? data : [data];
    return dataArray.map((item) => id ? `${id}-${dataArray.indexOf(item)}` : generateDataId(item));
  }, [data, id]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Convert single object to array for uniform handling
    const dataArray = Array.isArray(data) ? data : [data];

    // Remove existing scripts with matching IDs
    dataIds.forEach((dataId) => {
      const existingScript = document.querySelector(
        `script[type="application/ld+json"][data-seo-id="${dataId}"]`
      );
      if (existingScript) {
        existingScript.remove();
      }
    });

    // Create and inject new script(s)
    dataArray.forEach((jsonData, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonData);

      // Add identifier for duplicate detection and debugging
      script.setAttribute("data-seo-id", dataIds[index]);
      script.setAttribute("data-seo-strategy", strategy);

      document.head.appendChild(script);

      if (index === 0) {
        scriptRef.current = script;
      }
    });

    // Cleanup function
    return () => {
      dataIds.forEach((dataId) => {
        const script = document.querySelector(
          `script[type="application/ld+json"][data-seo-id="${dataId}"]`
        );
        if (script) {
          script.remove();
        }
      });
    };
  }, [data, strategy, dataIds]);

  return null;
};

// Memoize component with custom comparison to prevent unnecessary re-renders
export const JsonLd = memo(JsonLdComponent, (prevProps, nextProps) => {
  return (
    prevProps.strategy === nextProps.strategy &&
    prevProps.id === nextProps.id &&
    deepEqual(prevProps.data, nextProps.data)
  );
});

export default JsonLd;
