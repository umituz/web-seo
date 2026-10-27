/**
 * DOM mutator.
 *
 * Public entry point for applying SEO options to the live DOM. All work
 * is delegated to the strategy registry; this file is just a thin
 * orchestrator + the few operations that don't fit the Strategy shape
 * (clear, snapshot).
 */

import { queueDOMUpdate } from "../../core/dom-queue.js";
import { SEO_STRATEGIES } from "../../core/seo-strategies.js";
import type { LinkTag, MetaTag, SEOptions } from "../../types/index.js";
import { createDOMContext } from "./dom-context.js";

/**
 * Apply SEO options to the live DOM.
 *
 * Mutations are batched in a single requestAnimationFrame pass to avoid
 * layout thrashing and to give us a single try/catch boundary.
 */
export const updateSEO = (options: SEOptions): void => {
  if (typeof document === "undefined") return;

  queueDOMUpdate(() => {
    const ctx = createDOMContext();
    for (const strategy of SEO_STRATEGIES) {
      if (!strategy.applies(options)) continue;
      try {
        strategy.applyDOM(options, ctx);
      } catch (error) {
        // Surface strategy failures: the DOM is left in whatever state the
        // previous strategy achieved, but that's recoverable on the next
        // render. Silently swallowing would be much worse.
        console.error(`[SEO] Strategy "${strategy.id}" failed:`, error);
      }
    }
  });
};

/**
 * Remove every node the library has injected and reset the document title.
 * Useful for tests, SPAs that swap the entire head, or "reset" buttons.
 */
export const clearSEO = (): void => {
  if (typeof document === "undefined") return;

  document.querySelectorAll('meta[data-seo="true"]').forEach((el) => el.remove());
  document.querySelectorAll('link[data-seo="true"]').forEach((el) => el.remove());
  document.title = "";
};

/**
 * Snapshot the current SEO-relevant head into a plain object.
 * Mostly useful for tests and SSR hydration debugging.
 */
export const getCurrentSEOState = (): {
  title: string;
  lang: string;
  metaTags: MetaTag[];
  linkTags: LinkTag[];
} | null => {
  if (typeof document === "undefined") return null;

  const metaTags: MetaTag[] = [];
  document.querySelectorAll("meta").forEach((meta) => {
    const name = meta.getAttribute("name");
    const property = meta.getAttribute("property");
    const content = meta.getAttribute("content");
    if (!content) return;
    if (name)      metaTags.push({ name, content });
    else if (property) metaTags.push({ property, content });
  });

  const linkTags: LinkTag[] = [];
  document.querySelectorAll("link").forEach((link) => {
    const rel = link.getAttribute("rel");
    const href = link.getAttribute("href");
    if (!rel || !href) return;

    const tag: LinkTag = { rel, href };
    const type = link.getAttribute("type");
    const sizes = link.getAttribute("sizes");
    if (type)  tag.type = type;
    if (sizes) tag.sizes = sizes;
    linkTags.push(tag);
  });

  return {
    title: document.title,
    lang: document.documentElement.lang,
    metaTags,
    linkTags,
  };
};
