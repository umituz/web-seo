/**
 * `<JsonLd>` component.
 *
 * Injects one or more JSON-LD <script> tags into the document head.
 * Each payload gets a stable id (cyrb53 hash) so re-renders with the
 * same content re-use the existing node instead of appending a new one.
 */

import { memo, useEffect, useMemo, useRef } from "react";
import { deepEqual } from "../core/deep-equal.js";
import { generateDataId } from "../core/hash.js";
import type { JsonLdTypes } from "../types/schema.js";

interface JsonLdProps {
  data: JsonLdTypes | JsonLdTypes[];
  /** Strategy label, attached as `data-seo-strategy` for debugging. */
  strategy?: "afterInteractive" | "beforeInteractive" | "idle";
  /** Optional explicit id; otherwise one is derived from the payload. */
  id?: string;
}

const SCRIPT_TYPE = "application/ld+json";

const JsonLdComponent = ({ data, strategy = "afterInteractive", id }: JsonLdProps) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const dataIds = useMemo(() => {
    const items = Array.isArray(data) ? data : [data];
    return items.map((item, index) => id ? `${id}-${index}` : generateDataId(item));
  }, [data, id]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const items = Array.isArray(data) ? data : [data];

    for (let index = 0; index < items.length; index++) {
      const existing = document.querySelector(
        `script[type="${SCRIPT_TYPE}"][data-seo-id="${dataIds[index]}"]`
      );
      existing?.remove();

      const script = document.createElement("script");
      script.type = SCRIPT_TYPE;
      script.textContent = JSON.stringify(items[index]);
      script.setAttribute("data-seo-id", dataIds[index]);
      script.setAttribute("data-seo-strategy", strategy);
      document.head.appendChild(script);

      if (index === 0) scriptRef.current = script;
    }

    return () => {
      for (const dataId of dataIds) {
        document
          .querySelector(`script[type="${SCRIPT_TYPE}"][data-seo-id="${dataId}"]`)
          ?.remove();
      }
    };
  }, [data, strategy, dataIds]);

  return null;
};

export const JsonLd = memo(
  JsonLdComponent,
  (prev, next) =>
    prev.strategy === next.strategy &&
    prev.id === next.id &&
    deepEqual(prev.data, next.data)
);
