/**
 * SEO SSR Renderer
 *
 * Server-side rendering utilities for SEO.
 * Generates HTML strings for meta tags and structured data.
 */

import type { SEOptions } from "../types/index.js";

// ============================================================================
// HTML Escaping (Security)
// ============================================================================

/**
 * Escape HTML special characters to prevent XSS attacks
 */
const escapeHTML = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// ============================================================================
// Main SEO Renderer
// ============================================================================

export interface RenderedSEO {
  /** Title tag */
  title: string;
  /** All meta tags as HTML */
  meta: string;
  /** All link tags as HTML */
  link: string;
  /** All JSON-LD scripts as HTML */
  jsonLd: string;
  /** Complete HTML head content */
  toHTML(): string;
  /** Convert to string (same as toHTML) */
  toString(): string;
}

/**
 * Render SEO options to HTML strings for server-side rendering
 */
export const renderSEO = (options: SEOptions): RenderedSEO => {
  const metaTags: string[] = [];
  const linkTags: string[] = [];
  const jsonLdScripts: string[] = [];

  // Title
  const title = options.titleTemplate
    ? escapeHTML(options.titleTemplate.replace("%s", options.title || ""))
    : escapeHTML(options.title || "");

  // Charset
  metaTags.push('<meta charset="utf-8" />');
  metaTags.push('<meta name="viewport" content="width=device-width, initial-scale=1" />');

  // Description
  if (options.description) {
    metaTags.push(`<meta name="description" content="${escapeHTML(options.description)}" />`);
  }

  // Robots
  if (options.robots !== undefined) {
    let robotsContent = "";
    if (typeof options.robots === "boolean") {
      robotsContent = options.robots ? "index, follow" : "noindex, nofollow";
    } else if (Array.isArray(options.robots)) {
      robotsContent = options.robots.join(", ");
    } else {
      const directives: string[] = [];
      if (options.robots.index !== undefined) directives.push(options.robots.index ? "index" : "noindex");
      if (options.robots.follow !== undefined) directives.push(options.robots.follow ? "follow" : "nofollow");
      if (options.robots.archive !== undefined) directives.push(options.robots.archive ? "all" : "noarchive");
      if (options.robots.snippet !== undefined) directives.push(options.robots.snippet ? "all" : "nosnippet");
      robotsContent = directives.join(", ");
    }
    metaTags.push(`<meta name="robots" content="${robotsContent}" />`);
  }

  // Canonical
  if (options.canonical) {
    linkTags.push(`<link rel="canonical" href="${escapeHTML(options.canonical)}" />`);
  }

  // Theme color
  if (options.themeColor) {
    metaTags.push(`<meta name="theme-color" content="${escapeHTML(options.themeColor)}" />`);
  }

  // Favicon
  if (options.favicon) {
    linkTags.push(`<link rel="icon" type="image/x-icon" href="${escapeHTML(options.favicon)}" />`);
  }
  if (options.appleTouchIcon) {
    linkTags.push(`<link rel="apple-touch-icon" sizes="180x180" href="${escapeHTML(options.appleTouchIcon)}" />`);
  }
  if (options.maskIcon) {
    linkTags.push(`<link rel="mask-icon" href="${escapeHTML(options.maskIcon)}" />`);
  }

  // Hreflang
  if (options.hreflang && options.hreflang.length > 0) {
    options.hreflang.forEach((entry) => {
      linkTags.push(`<link rel="alternate" hreflang="${escapeHTML(entry.lang)}" href="${escapeHTML(entry.url)}" />`);
    });
  }

  // Preload
  if (options.preload && options.preload.length > 0) {
    options.preload.forEach((preload) => {
      const attrs = [`rel="preload"`, `href="${escapeHTML(preload.href)}"`, `as="${escapeHTML(preload.as)}"`];
      if (preload.type) attrs.push(`type="${escapeHTML(preload.type)}"`);
      if (preload.crossOrigin) attrs.push(`crossorigin="${escapeHTML(preload.crossOrigin)}"`);
      if (preload.integrity) attrs.push(`integrity="${escapeHTML(preload.integrity)}"`);
      linkTags.push(`<link ${attrs.join(" ")} />`);
    });
  }

  // Preconnect
  if (options.preconnect && options.preconnect.length > 0) {
    options.preconnect.forEach((origin) => {
      const attrs = [`rel="preconnect"`, `href="${escapeHTML(origin.href)}"`];
      if (origin.crossOrigin) attrs.push(`crossorigin="${escapeHTML(origin.crossOrigin)}"`);
      linkTags.push(`<link ${attrs.join(" ")} />`);
    });
  }

  // DNS Prefetch
  if (options.dnsPrefetch && options.dnsPrefetch.length > 0) {
    options.dnsPrefetch.forEach((domain) => {
      linkTags.push(`<link rel="dns-prefetch" href="${escapeHTML(domain.href)}" />`);
    });
  }

  // Custom meta tags
  if (options.meta && options.meta.length > 0) {
    options.meta.forEach((m) => {
      if (m.name) {
        metaTags.push(`<meta name="${escapeHTML(m.name)}" content="${escapeHTML(m.content)}" />`);
      }
      if (m.property) {
        metaTags.push(`<meta property="${escapeHTML(m.property)}" content="${escapeHTML(m.content)}" />`);
      }
      if (m.httpEquiv) {
        metaTags.push(`<meta http-equiv="${escapeHTML(m.httpEquiv)}" content="${escapeHTML(m.content)}" />`);
      }
    });
  }

  // Custom link tags
  if (options.link && options.link.length > 0) {
    options.link.forEach((link) => {
      const attrs = [`rel="${escapeHTML(link.rel)}"`, `href="${escapeHTML(link.href)}"`];
      if (link.type) attrs.push(`type="${escapeHTML(link.type)}"`);
      if (link.sizes) attrs.push(`sizes="${escapeHTML(link.sizes)}"`);
      if (link.media) attrs.push(`media="${escapeHTML(link.media)}"`);
      if (link.crossOrigin) attrs.push(`crossorigin="${escapeHTML(link.crossOrigin)}"`);
      if (link.as) attrs.push(`as="${escapeHTML(link.as)}"`);
      linkTags.push(`<link ${attrs.join(" ")} />`);
    });
  }

  // Open Graph
  if (options.openGraph) {
    if (options.openGraph.title) metaTags.push(`<meta property="og:title" content="${escapeHTML(options.openGraph.title)}" />`);
    if (options.openGraph.description) metaTags.push(`<meta property="og:description" content="${escapeHTML(options.openGraph.description)}" />`);
    if (options.openGraph.url) metaTags.push(`<meta property="og:url" content="${escapeHTML(options.openGraph.url)}" />`);
    if (options.openGraph.type) metaTags.push(`<meta property="og:type" content="${escapeHTML(options.openGraph.type)}" />`);
    if (options.openGraph.siteName) metaTags.push(`<meta property="og:site_name" content="${escapeHTML(options.openGraph.siteName)}" />`);
    if (options.openGraph.locale) metaTags.push(`<meta property="og:locale" content="${escapeHTML(options.openGraph.locale)}" />`);

    // Images
    if (options.openGraph.image) {
      if (Array.isArray(options.openGraph.image)) {
        options.openGraph.image.forEach((img) => {
          metaTags.push(`<meta property="og:image" content="${escapeHTML(img.url)}" />`);
          if (img.alt) metaTags.push(`<meta property="og:image:alt" content="${escapeHTML(img.alt)}" />`);
        });
      } else {
        metaTags.push(`<meta property="og:image" content="${escapeHTML(options.openGraph.image)}" />`);
      }
    }
  }

  // Twitter Card
  if (options.twitter) {
    if (options.twitter.cardType) metaTags.push(`<meta name="twitter:card" content="${escapeHTML(options.twitter.cardType)}" />`);
    if (options.twitter.site) metaTags.push(`<meta name="twitter:site" content="${escapeHTML(options.twitter.site)}" />`);
    if (options.twitter.handle) metaTags.push(`<meta name="twitter:creator" content="${escapeHTML(options.twitter.handle)}" />`);
    if (options.twitter.title) metaTags.push(`<meta name="twitter:title" content="${escapeHTML(options.twitter.title)}" />`);
    if (options.twitter.description) metaTags.push(`<meta name="twitter:description" content="${escapeHTML(options.twitter.description)}" />`);
    if (options.twitter.image) metaTags.push(`<meta name="twitter:image" content="${escapeHTML(options.twitter.image)}" />`);
    if (options.twitter.imageAlt) metaTags.push(`<meta name="twitter:image:alt" content="${escapeHTML(options.twitter.imageAlt)}" />`);
  }

  // JSON-LD
  if (options.jsonLd && options.jsonLd.length > 0) {
    options.jsonLd.forEach((data) => {
      jsonLdScripts.push(`<script type="application/ld+json">${JSON.stringify(data)}</script>`);
    });
  }

  return {
    title,
    meta: metaTags.join("\n    "),
    link: linkTags.join("\n    "),
    jsonLd: jsonLdScripts.join("\n    "),
    toHTML() {
      return `    <title>${this.title}</title>\n${this.meta ? `    ${this.meta}\n` : ""}${this.link ? `    ${this.link}\n` : ""}${this.jsonLd ? `    ${this.jsonLd}\n` : ""}`;
    },
    toString() {
      return this.toHTML();
    },
  };
};

// ============================================================================
// SSR SEO Utilities
// ============================================================================

/**
 * Generate complete HTML head with SEO tags
 */
export const generateHead = (options: SEOptions): string => {
  const rendered = renderSEO(options);
  return `  <head${options.lang ? ` lang="${escapeHTML(options.lang)}"` : ""}>
${rendered.toHTML().split("\n").map(line => `  ${line}`).join("\n")}
  </head>`;
};

/**
 * Extract SEO data for hydration
 */
export const extractSEOData = (options: SEOptions): string => {
  return JSON.stringify(options);
};

/**
 * Hydrate SEO on client side
 * @throws {SyntaxError} If serializedData is not valid JSON
 */
export const hydrateSEO = (serializedData: string): void => {
  if (typeof window === "undefined") return;

  let options: SEOptions;
  try {
    options = JSON.parse(serializedData) as SEOptions;
  } catch (error) {
    console.error("[SEO] Failed to hydrate SEO data:", error);
    return;
  }

  // Import updateSEO dynamically to avoid circular dependencies
  import("../utils/dom.js").then(({ updateSEO }) => {
    updateSEO(options);
  });
};

// ============================================================================
// Helmet-like API for compatibility
// ============================================================================

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

/**
 * Render SEO in Helmet-compatible format
 */
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
