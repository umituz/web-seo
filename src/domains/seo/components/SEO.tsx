import React, { useEffect, useMemo } from "react";
import type { SEOptions } from "../types/index.js";
import { updateSEO } from "../utils/dom.js";

export const SEO: React.FC<SEOptions> = (props) => {
  // Memoize dependencies for better performance
  const dependencies = useMemo(() => [
    props.title,
    props.description,
    props.lang,
    props.canonical,
    props.themeColor,
    props.favicon,
    JSON.stringify(props.meta),
    JSON.stringify(props.link),
    JSON.stringify(props.openGraph),
    JSON.stringify(props.twitter),
    JSON.stringify(props.jsonLd),
    JSON.stringify(props.hreflang),
    JSON.stringify(props.preload),
    JSON.stringify(props.preconnect),
    JSON.stringify(props.dnsPrefetch),
    JSON.stringify(props.robots),
    JSON.stringify(props.breadcrumbs),
    props.viewport,
  ], [
    props.title,
    props.description,
    props.lang,
    props.canonical,
    props.themeColor,
    props.favicon,
    props.meta,
    props.link,
    props.openGraph,
    props.twitter,
    props.jsonLd,
    props.hreflang,
    props.preload,
    props.preconnect,
    props.dnsPrefetch,
    props.robots,
    props.breadcrumbs,
    props.viewport,
  ]);

  useEffect(() => {
    updateSEO(props);
  }, dependencies);

  return null; // Component does not render anything
};
