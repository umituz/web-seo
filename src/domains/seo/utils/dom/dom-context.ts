
import type { DOMContext } from "../../core/seo-strategy.js";

export const createDOMContext = (): DOMContext => {
  const setMeta = (name: string, content: string | undefined): void => {
    if (typeof document === "undefined") return;
    if (content === undefined) return;

    let element = document.querySelector(`meta[name="${name}"]`)
      ?? document.querySelector(`meta[property="${name}"]`);

    if (!element) {
      element = document.createElement("meta");
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

  const setJsonLd = (data: unknown[]): void => {
    if (typeof document === "undefined") return;

    document
      .querySelectorAll('script[type="application/ld+json"][data-seo="true"]')
      .forEach((el) => el.remove());

    for (const item of data) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    }
  };

  return { setMeta, setLink, setJsonLd };
};
