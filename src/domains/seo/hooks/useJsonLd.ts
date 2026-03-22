/**
 * useJsonLd Hook
 *
 * React hook for managing JSON-LD structured data.
 * Provides a programmatic way to add/update/remove structured data.
 */

import { useEffect, useCallback } from "react";
import type { JsonLdTypes } from "../types/schema.js";

interface UseJsonLdOptions {
  /** Strategy for when to inject the script tag */
  strategy?: "afterInteractive" | "beforeInteractive" | "idle";
  /** Unique identifier for this JSON-LD block */
  id?: string;
}

export const useJsonLd = (data: JsonLdTypes | JsonLdTypes[], options?: UseJsonLdOptions) => {
  const { strategy = "afterInteractive", id } = options || {};

  const injectJsonLd = useCallback((jsonData: JsonLdTypes | JsonLdTypes[]) => {
    if (typeof document === "undefined") return;

    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

    dataArray.forEach((item, index) => {
      // Remove existing script if present
      const existingScript = document.querySelector(
        `script[type="application/ld+json"][data-seo-id="${id || JSON.stringify(item)}"]`
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Create and inject new script
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(item);

      if (id) {
        script.setAttribute("data-seo-id", `${id}-${index}`);
      } else {
        script.setAttribute("data-seo-id", JSON.stringify(item));
      }
      script.setAttribute("data-seo-strategy", strategy);

      document.head.appendChild(script);
    });
  }, [id, strategy]);

  const removeJsonLd = useCallback(() => {
    if (typeof document === "undefined") return;

    const scripts = document.querySelectorAll(
      `script[type="application/ld+json"][data-seo-id*="${id || ''}"]`
    );
    scripts.forEach((script) => script.remove());
  }, [id]);

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
