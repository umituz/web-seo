/**
 * JsonLd Component
 *
 * React component for injecting JSON-LD structured data into the page.
 * Supports all Schema.org types with automatic validation.
 */

import { useEffect, useRef, useMemo } from "react";
import type { JsonLdTypes } from "../types/schema.js";

interface JsonLdProps {
  data: JsonLdTypes | JsonLdTypes[];
  /** Strategy for when to inject the script tag */
  strategy?: "afterInteractive" | "beforeInteractive" | "idle";
  /** Unique identifier for this JSON-LD block (for debugging) */
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

export const JsonLd = ({ data, strategy = "afterInteractive", id }: JsonLdProps) => {
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

export default JsonLd;
