/**
 * Advanced Meta Tag Operations
 *
 * Functions for hreflang, favicon, theme color, and viewport
 */

import type { HreflangEntry } from "../../types/index.js";
import { setLinkTag } from "./basic.js";

/**
 * Set hreflang tags for international SEO
 */
export const setHreflangTags = (hreflang: HreflangEntry[]) => {
  if (typeof document === "undefined") return;

  // Remove existing hreflang tags
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

  // Add new hreflang tags
  hreflang.forEach((entry) => {
    setLinkTag({
      rel: "alternate",
      hreflang: entry.lang,
      href: entry.url,
    });
  });
};

/**
 * Set favicon
 */
export const setFavicon = (href: string) => {
  if (typeof document === "undefined") return;
  setLinkTag({ rel: "icon", href, type: "image/x-icon" });
};

/**
 * Set Apple touch icon
 */
export const setAppleTouchIcon = (href: string) => {
  if (typeof document === "undefined") return;
  setLinkTag({ rel: "apple-touch-icon", href, sizes: "180x180" });
};

/**
 * Set mask icon for Safari
 */
export const setMaskIcon = (href: string, color?: string) => {
  if (typeof document === "undefined") return;
  setLinkTag({ rel: "mask-icon", href, ...(color && { color }) });
};

/**
 * Set theme color
 */
export const setThemeColor = (color: string) => {
  if (typeof document === "undefined") return;

  let element = document.querySelector('meta[name="theme-color"]');
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", "theme-color");
    document.head.appendChild(element);
  }
  element.setAttribute("content", color);
};

/**
 * Set viewport
 */
export const setViewport = (content: string) => {
  if (typeof document === "undefined") return;

  let element = document.querySelector('meta[name="viewport"]');
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", "viewport");
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};
