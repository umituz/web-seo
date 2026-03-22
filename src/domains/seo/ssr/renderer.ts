/**
 * SEO SSR Renderer
 *
 * Server-side rendering utilities for SEO.
 * Generates HTML strings for meta tags and structured data.
 */

import type { SEOptions } from "../types/index.js";

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
    ? options.titleTemplate.replace("%s", options.title || "")
    : options.title || "";

  // Charset
  metaTags.push('<meta charset="utf-8" />');
  metaTags.push('<meta name="viewport" content="width=device-width, initial-scale=1" />');

  // Description
  if (options.description) {
    metaTags.push(`<meta name="description" content="${options.description}" />`);
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
    linkTags.push(`<link rel="canonical" href="${options.canonical}" />`);
  }

  // Theme color
  if (options.themeColor) {
    metaTags.push(`<meta name="theme-color" content="${options.themeColor}" />`);
  }

  // Favicon
  if (options.favicon) {
    linkTags.push(`<link rel="icon" type="image/x-icon" href="${options.favicon}" />`);
  }
  if (options.appleTouchIcon) {
    linkTags.push(`<link rel="apple-touch-icon" sizes="180x180" href="${options.appleTouchIcon}" />`);
  }
  if (options.maskIcon) {
    linkTags.push(`<link rel="mask-icon" href="${options.maskIcon}" />`);
  }

  // Hreflang
  if (options.hreflang && options.hreflang.length > 0) {
    options.hreflang.forEach((entry) => {
      linkTags.push(`<link rel="alternate" hreflang="${entry.lang}" href="${entry.url}" />`);
    });
  }

  // Preload
  if (options.preload && options.preload.length > 0) {
    options.preload.forEach((preload) => {
      const attrs = [`rel="preload"`, `href="${preload.href}"`, `as="${preload.as}"`];
      if (preload.type) attrs.push(`type="${preload.type}"`);
      if (preload.crossOrigin) attrs.push(`crossorigin="${preload.crossOrigin}"`);
      if (preload.integrity) attrs.push(`integrity="${preload.integrity}"`);
      linkTags.push(`<link ${attrs.join(" ")} />`);
    });
  }

  // Preconnect
  if (options.preconnect && options.preconnect.length > 0) {
    options.preconnect.forEach((origin) => {
      const attrs = [`rel="preconnect"`, `href="${origin.href}"`];
      if (origin.crossOrigin) attrs.push(`crossorigin="${origin.crossOrigin}"`);
      linkTags.push(`<link ${attrs.join(" ")} />`);
    });
  }

  // DNS Prefetch
  if (options.dnsPrefetch && options.dnsPrefetch.length > 0) {
    options.dnsPrefetch.forEach((domain) => {
      linkTags.push(`<link rel="dns-prefetch" href="${domain.href}" />`);
    });
  }

  // Custom meta tags
  if (options.meta && options.meta.length > 0) {
    options.meta.forEach((m) => {
      if (m.name) {
        metaTags.push(`<meta name="${m.name}" content="${m.content}" />`);
      }
      if (m.property) {
        metaTags.push(`<meta property="${m.property}" content="${m.content}" />`);
      }
      if (m.httpEquiv) {
        metaTags.push(`<meta http-equiv="${m.httpEquiv}" content="${m.content}" />`);
      }
    });
  }

  // Custom link tags
  if (options.link && options.link.length > 0) {
    options.link.forEach((link) => {
      const attrs = [`rel="${link.rel}"`, `href="${link.href}"`];
      if (link.type) attrs.push(`type="${link.type}"`);
      if (link.sizes) attrs.push(`sizes="${link.sizes}"`);
      if (link.media) attrs.push(`media="${link.media}"`);
      if (link.crossOrigin) attrs.push(`crossorigin="${link.crossOrigin}"`);
      if (link.as) attrs.push(`as="${link.as}"`);
      linkTags.push(`<link ${attrs.join(" ")} />`);
    });
  }

  // Open Graph
  if (options.openGraph) {
    if (options.openGraph.title) metaTags.push(`<meta property="og:title" content="${options.openGraph.title}" />`);
    if (options.openGraph.description) metaTags.push(`<meta property="og:description" content="${options.openGraph.description}" />`);
    if (options.openGraph.url) metaTags.push(`<meta property="og:url" content="${options.openGraph.url}" />`);
    if (options.openGraph.type) metaTags.push(`<meta property="og:type" content="${options.openGraph.type}" />`);
    if (options.openGraph.siteName) metaTags.push(`<meta property="og:site_name" content="${options.openGraph.siteName}" />`);
    if (options.openGraph.locale) metaTags.push(`<meta property="og:locale" content="${options.openGraph.locale}" />`);

    // Images
    if (options.openGraph.image) {
      if (Array.isArray(options.openGraph.image)) {
        options.openGraph.image.forEach((img) => {
          metaTags.push(`<meta property="og:image" content="${img.url}" />`);
          if (img.alt) metaTags.push(`<meta property="og:image:alt" content="${img.alt}" />`);
        });
      } else {
        metaTags.push(`<meta property="og:image" content="${options.openGraph.image}" />`);
      }
    }
  }

  // Twitter Card
  if (options.twitter) {
    if (options.twitter.cardType) metaTags.push(`<meta name="twitter:card" content="${options.twitter.cardType}" />`);
    if (options.twitter.site) metaTags.push(`<meta name="twitter:site" content="${options.twitter.site}" />`);
    if (options.twitter.handle) metaTags.push(`<meta name="twitter:creator" content="${options.twitter.handle}" />`);
    if (options.twitter.title) metaTags.push(`<meta name="twitter:title" content="${options.twitter.title}" />`);
    if (options.twitter.description) metaTags.push(`<meta name="twitter:description" content="${options.twitter.description}" />`);
    if (options.twitter.image) metaTags.push(`<meta name="twitter:image" content="${options.twitter.image}" />`);
    if (options.twitter.imageAlt) metaTags.push(`<meta name="twitter:image:alt" content="${options.twitter.imageAlt}" />`);
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
  return `  <head${options.lang ? ` lang="${options.lang}"` : ""}>
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
 */
export const hydrateSEO = (serializedData: string): void => {
  if (typeof window === "undefined") return;

  const options = JSON.parse(serializedData) as SEOptions;

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
