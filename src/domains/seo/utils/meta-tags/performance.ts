/**
 * Performance Hints
 *
 * Functions for preload, preconnect, and DNS prefetch hints
 */

import type { PreloadHint, PreconnectOrigin, DnsPrefetchDomain } from "../../types/index.js";
import { setLinkTag } from "./basic.js";

/**
 * Set preload hints
 */
export const setPreloadHints = (preloads: PreloadHint[]) => {
  if (typeof document === "undefined") return;

  // Remove existing preload hints for same resources
  preloads.forEach((preload) => {
    const existing = document.querySelector(`link[rel="preload"][href="${preload.href}"]`);
    if (existing) existing.remove();
  });

  // Add preload hints
  preloads.forEach((preload) => {
    const attrs: Record<string, string> = {
      rel: "preload",
      href: preload.href,
      as: preload.as,
    };

    if (preload.type) attrs.type = preload.type;
    if (preload.crossOrigin) attrs.crossorigin = preload.crossOrigin;
    if (preload.integrity) attrs.integrity = preload.integrity;

    setLinkTag(attrs);
  });
};

/**
 * Set preconnect hints
 */
export const setPreconnectHints = (origins: PreconnectOrigin[]) => {
  if (typeof document === "undefined") return;

  origins.forEach((origin) => {
    const attrs: Record<string, string> = {
      rel: "preconnect",
      href: origin.href,
    };

    if (origin.crossOrigin) attrs.crossorigin = origin.crossOrigin;

    setLinkTag(attrs);
  });
};

/**
 * Set DNS prefetch hints
 */
export const setDnsPrefetchHints = (domains: DnsPrefetchDomain[]) => {
  if (typeof document === "undefined") return;

  domains.forEach((domain) => {
    setLinkTag({
      rel: "dns-prefetch",
      href: domain.href,
    });
  });
};
