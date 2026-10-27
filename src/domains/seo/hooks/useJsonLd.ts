/**
 * `useJsonLd(data, options?)` hook.
 *
 * Programmatic JSON-LD injection. Returns `inject`/`remove` callbacks
 * so the caller can re-fire the injection on demand (e.g. after a route
 * transition) or clean up manually.
 */

import { useCallback, useEffect, useMemo } from "react";
import { generateDataId } from "../core/hash.js";
import type { JsonLdTypes } from "../types/schema.js";

interface UseJsonLdOptions {
  strategy?: "afterInteractive" | "beforeInteractive" | "idle";
  id?: string;
}

const SCRIPT_TYPE = "application/ld+json";

export const useJsonLd = (
  data: JsonLdTypes | JsonLdTypes[],
  options?: UseJsonLdOptions
) => {
  const { strategy = "afterInteractive", id } = options ?? {};

  const dataIds = useMemo(() => {
    const items = Array.isArray(data) ? data : [data];
    return items.map((item, index) => id ? `${id}-${index}` : generateDataId(item));
  }, [data, id]);

  const injectJsonLd = useCallback(
    (payload: JsonLdTypes | JsonLdTypes[]) => {
      if (typeof document === "undefined") return;
      const items = Array.isArray(payload) ? payload : [payload];
      const ids = Array.isArray(payload) && !id
        ? items.map(generateDataId)
        : dataIds;

      items.forEach((item, index) => {
        document
          .querySelector(`script[type="${SCRIPT_TYPE}"][data-seo-id="${ids[index]}"]`)
          ?.remove();

        const script = document.createElement("script");
        script.type = SCRIPT_TYPE;
        script.textContent = JSON.stringify(item);
        script.setAttribute("data-seo-id", ids[index]);
        script.setAttribute("data-seo-strategy", strategy);
        document.head.appendChild(script);
      });
    },
    [id, strategy, dataIds]
  );

  const removeJsonLd = useCallback(() => {
    if (typeof document === "undefined") return;
    for (const dataId of dataIds) {
      document
        .querySelector(`script[type="${SCRIPT_TYPE}"][data-seo-id="${dataId}"]`)
        ?.remove();
    }
  }, [dataIds]);

  useEffect(() => {
    if (data) injectJsonLd(data);
    return () => removeJsonLd();
  }, [data, injectJsonLd, removeJsonLd]);

  return { injectJsonLd, removeJsonLd };
};
