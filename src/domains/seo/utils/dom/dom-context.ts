/**
 * DOMContext implementation.
 *
 * Implements the low-level `setMeta` / `setLink` operations that the SEO
 * strategies call into. Each call is idempotent: it finds the existing
 * <meta>/<link> node by attribute and updates it in place, or creates a
 * new one tagged with `data-seo="true"` so `clearSEO` can remove it.
 *
 * Tagged with `data-seo` so `clearSEO` can later remove only the nodes
 * this library owns, leaving user-added tags untouched.
 */

import type { DOMContext } from "../../core/seo-strategy.js";

export const createDOMContext = (): DOMContext => {
  const setMeta = (name: string, content: string | undefined): void => {
    if (typeof document === "undefined") return;
    if (content === undefined) return;

    let element = document.querySelector(`meta[name="${name}"]`)
      ?? document.querySelector(`meta[property="${name}"]`);

    if (!element) {
      element = document.createElement("meta");
      // Decide whether the tag uses name= or property= based on the prefix
      // so a single API works for both classic <meta name> and OG <meta property>.
      if (name.startsWith("og:") || name.startsWith("article:") || name.startsWith("profile:") || name.startsWith("music:") || name.startsWith("product:")) {
        element.setAttribute("property", name);
      } else {
        element.setAttribute("name", name);
      }
      element.setAttribute("data-seo", "true");
      document.head.appendChild(element);
    }

    element.setAttribute("content", content);
  };

  const setLink = (attrs: Record<string, string>): void => {
    if (typeof document === "undefined") return;

    const rel = attrs.rel;
    if (!rel) return;

    // Build a precise selector so we replace only the matching node.
    const parts = [`link[rel="${rel}"]`];
    if (attrs.href)     parts.push(`[href="${attrs.href}"]`);
    if (attrs.sizes)    parts.push(`[sizes="${attrs.sizes}"]`);
    if (attrs.type)     parts.push(`[type="${attrs.type}"]`);
    if (attrs.hreflang) parts.push(`[hreflang="${attrs.hreflang}"]`);

    let element = document.querySelector(parts.join(""));
    if (!element) {
      element = document.createElement("link");
      element.setAttribute("data-seo", "true");
      document.head.appendChild(element);
    }

    for (const [key, value] of Object.entries(attrs)) {
      element.setAttribute(key, value);
    }
  };

  return { setMeta, setLink };
};
