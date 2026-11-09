
import { queueDOMUpdate } from "../../core/dom-queue.js";
import { SEO_STRATEGIES } from "../../core/seo-strategies.js";
import type { LinkTag, MetaTag, SEOptions } from "../../types/index.js";
import { createDOMContext } from "./dom-context.js";

export const updateSEO = (options: SEOptions): void => {
  if (typeof document === "undefined") return;

  queueDOMUpdate(() => {
    const ctx = createDOMContext();
    for (const strategy of SEO_STRATEGIES) {
      if (!strategy.applies(options)) continue;
      try {
        strategy.applyDOM(options, ctx);
      } catch (error) {
        console.error(`[SEO] Strategy "${strategy.id}" failed:`, error);
      }
    }
  });
};

export const clearSEO = (): void => {
  if (typeof document === "undefined") return;

  document.querySelectorAll('meta[data-seo="true"]').forEach((el) => el.remove());
  document.querySelectorAll('link[data-seo="true"]').forEach((el) => el.remove());
  document.querySelectorAll('script[type="application/ld+json"][data-seo="true"]').forEach((el) => el.remove());
  document.title = "";
};

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
