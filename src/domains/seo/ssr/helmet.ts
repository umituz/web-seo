/**
 * Helmet-compatible output for libraries that expect a `react-helmet`-style
 * data shape (e.g. older Next.js APIs).
 *
 * This module is intentionally minimal: it only reports the title and html
 * attributes. The full meta/link/JSON-LD output is available via `renderSEO`.
 */

import type { SEOptions } from "../types/index.js";
import { renderSEO } from "./renderer.js";

export interface RenderedMetaTag {
  toString(): string;
  toComponent(): unknown;
}

export interface HelmetData {
  base: RenderedMetaTag[];
  bodyAttributes: Record<string, string>;
  htmlAttributes: Record<string, string>;
  link: RenderedMetaTag[];
  meta: RenderedMetaTag[];
  noscript: RenderedMetaTag[];
  script: RenderedMetaTag[];
  style: RenderedMetaTag[];
  title: string;
  titleAttributes: Record<string, string>;
}

export const renderAsHelmet = (options: SEOptions): HelmetData => {
  const rendered = renderSEO(options);

  return {
    base: [],
    bodyAttributes: {},
    htmlAttributes: options.lang ? { lang: options.lang } : {},
    link: [],
    meta: [],
    noscript: [],
    script: [],
    style: [],
    title: rendered.title,
    titleAttributes: {},
  };
};
