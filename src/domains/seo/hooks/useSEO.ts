import { useEffect, useMemo } from "react";
import type { SEOptions } from "../types/index.js";
import { updateSEO } from "../utils/dom.js";

export const useSEO = (options: SEOptions) => {
  // Memoize dependencies for better performance
  const dependencies = useMemo(() => [
    options.title,
    options.description,
    options.lang,
    options.canonical,
    options.themeColor,
    options.favicon,
    JSON.stringify(options.meta),
    JSON.stringify(options.link),
    JSON.stringify(options.openGraph),
    JSON.stringify(options.twitter),
    JSON.stringify(options.jsonLd),
    JSON.stringify(options.hreflang),
    JSON.stringify(options.preload),
    JSON.stringify(options.preconnect),
    JSON.stringify(options.dnsPrefetch),
    JSON.stringify(options.robots),
    JSON.stringify(options.breadcrumbs),
    options.viewport,
  ], [
    options.title,
    options.description,
    options.lang,
    options.canonical,
    options.themeColor,
    options.favicon,
    options.meta,
    options.link,
    options.openGraph,
    options.twitter,
    options.jsonLd,
    options.hreflang,
    options.preload,
    options.preconnect,
    options.dnsPrefetch,
    options.robots,
    options.breadcrumbs,
    options.viewport,
  ]);

  useEffect(() => {
    updateSEO(options);
  }, dependencies);
};
