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
const generateDataId = (data: JsonLdTypes): string => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `jsonld-${Math.abs(hash).toString(36)}`;
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
