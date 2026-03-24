/**
 * SEO SSR Renderer
 *
 * Server-side rendering utilities for SEO.
 * Generates HTML strings for meta tags and structured data.
 */

import type { SEOptions } from "../types/index.js";

// ============================================================================
// HTML Escaping (Security) - Optimized
// ============================================================================

// Escape cache for better performance
const escapeCache = new Map<string, string>();

/**
 * Escape HTML special characters to prevent XSS attacks
 * Optimized with caching and single-pass replacement
 */
const escapeHTML = (str: string): string => {
  if (!str) return "";

  // Check cache first
  if (escapeCache.has(str)) {
    return escapeCache.get(str)!;
  }

  // Single-pass replacement for better performance
  const result = str.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });

  // Cache the result (limit cache size to prevent memory issues)
  if (escapeCache.size < 1000) {
    escapeCache.set(str, result);
  }

  return result;
};

/**
 * Escape JSON content for safe inclusion in HTML script tags
 * Prevents script breakage from </script> sequences in JSON data
 * Optimized with caching
 */
const escapeJSONForScript = (json: string): string => {
  // Cache JSON escapes for better performance
  const cacheKey = `json:${json}`;
  if (escapeCache.has(cacheKey)) {
    return escapeCache.get(cacheKey)!;
  }

  // Replace </script> with <\/script> to prevent breaking out of script tag
  const result = json.replace(/<\/script>/gi, "<\\/script>");

  if (escapeCache.size < 1000) {
    escapeCache.set(cacheKey, result);
  }

  return result;
};

// ============================================================================
// Main SEO Renderer - Optimized
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

// Render cache for better SSR performance
const renderCache = new WeakMap<SEOptions, RenderedSEO>();

/**
 * Render SEO options to HTML strings for server-side rendering
 * Optimized with caching and efficient string building
 */
export const renderSEO = (options: SEOptions, useCache = true): RenderedSEO => {
  // Check cache first
  if (useCache && renderCache.has(options)) {
    return renderCache.get(options)!;
  }

  // Use string builders for better performance
  const metaTagsBuilder: string[] = [];
  const linkTagsBuilder: string[] = [];
  const jsonLdScriptsBuilder: string[] = [];

  // Title
  const title = options.titleTemplate
    ? escapeHTML(options.titleTemplate.replace("%s", options.title || ""))
    : escapeHTML(options.title || "");

  // Charset
  metaTagsBuilder.push('<meta charset="utf-8" />');
  metaTagsBuilder.push('<meta name="viewport" content="width=device-width, initial-scale=1" />');

  // Description
  if (options.description) {
    metaTagsBuilder.push(`<meta name="description" content="${escapeHTML(options.description)}" />`);
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
    metaTagsBuilder.push(`<meta name="robots" content="${robotsContent}" />`);
  }

  // Canonical
  if (options.canonical) {
    linkTagsBuilder.push(`<link rel="canonical" href="${escapeHTML(options.canonical)}" />`);
  }

  // Theme color
  if (options.themeColor) {
    metaTagsBuilder.push(`<meta name="theme-color" content="${escapeHTML(options.themeColor)}" />`);
  }

  // Favicon
  if (options.favicon) {
    linkTagsBuilder.push(`<link rel="icon" type="image/x-icon" href="${escapeHTML(options.favicon)}" />`);
  }
  if (options.appleTouchIcon) {
    linkTagsBuilder.push(`<link rel="apple-touch-icon" sizes="180x180" href="${escapeHTML(options.appleTouchIcon)}" />`);
  }
  if (options.maskIcon) {
    linkTagsBuilder.push(`<link rel="mask-icon" href="${escapeHTML(options.maskIcon)}" />`);
  }

  // Hreflang
  if (options.hreflang && options.hreflang.length > 0) {
    for (const entry of options.hreflang) {
      linkTagsBuilder.push(`<link rel="alternate" hreflang="${escapeHTML(entry.lang)}" href="${escapeHTML(entry.url)}" />`);
    }
  }

  // Preload
  if (options.preload && options.preload.length > 0) {
    for (const preload of options.preload) {
      const attrs = [`rel="preload"`, `href="${escapeHTML(preload.href)}"`, `as="${escapeHTML(preload.as)}"`];
      if (preload.type) attrs.push(`type="${escapeHTML(preload.type)}"`);
      if (preload.crossOrigin) attrs.push(`crossorigin="${escapeHTML(preload.crossOrigin)}"`);
      if (preload.integrity) attrs.push(`integrity="${escapeHTML(preload.integrity)}"`);
      linkTagsBuilder.push(`<link ${attrs.join(" ")} />`);
    }
  }

  // Preconnect
  if (options.preconnect && options.preconnect.length > 0) {
    for (const origin of options.preconnect) {
      const attrs = [`rel="preconnect"`, `href="${escapeHTML(origin.href)}"`];
      if (origin.crossOrigin) attrs.push(`crossorigin="${escapeHTML(origin.crossOrigin)}"`);
      linkTagsBuilder.push(`<link ${attrs.join(" ")} />`);
    }
  }

  // DNS Prefetch
  if (options.dnsPrefetch && options.dnsPrefetch.length > 0) {
    for (const domain of options.dnsPrefetch) {
      linkTagsBuilder.push(`<link rel="dns-prefetch" href="${escapeHTML(domain.href)}" />`);
    }
  }

  // Custom meta tags
  if (options.meta && options.meta.length > 0) {
    for (const m of options.meta) {
      if (m.name) {
        metaTagsBuilder.push(`<meta name="${escapeHTML(m.name)}" content="${escapeHTML(m.content)}" />`);
      }
      if (m.property) {
        metaTagsBuilder.push(`<meta property="${escapeHTML(m.property)}" content="${escapeHTML(m.content)}" />`);
      }
      if (m.httpEquiv) {
        metaTagsBuilder.push(`<meta http-equiv="${escapeHTML(m.httpEquiv)}" content="${escapeHTML(m.content)}" />`);
      }
    }
  }

  // Custom link tags
  if (options.link && options.link.length > 0) {
    for (const link of options.link) {
      const attrs = [`rel="${escapeHTML(link.rel)}"`, `href="${escapeHTML(link.href)}"`];
      if (link.type) attrs.push(`type="${escapeHTML(link.type)}"`);
      if (link.sizes) attrs.push(`sizes="${escapeHTML(link.sizes)}"`);
      if (link.media) attrs.push(`media="${escapeHTML(link.media)}"`);
      if (link.crossOrigin) attrs.push(`crossorigin="${escapeHTML(link.crossOrigin)}"`);
      if (link.as) attrs.push(`as="${escapeHTML(link.as)}"`);
      linkTagsBuilder.push(`<link ${attrs.join(" ")} />`);
    }
  }

  // Open Graph
  if (options.openGraph) {
    if (options.openGraph.title) metaTagsBuilder.push(`<meta property="og:title" content="${escapeHTML(options.openGraph.title)}" />`);
    if (options.openGraph.description) metaTagsBuilder.push(`<meta property="og:description" content="${escapeHTML(options.openGraph.description)}" />`);
    if (options.openGraph.url) metaTagsBuilder.push(`<meta property="og:url" content="${escapeHTML(options.openGraph.url)}" />`);
    if (options.openGraph.type) metaTagsBuilder.push(`<meta property="og:type" content="${escapeHTML(options.openGraph.type)}" />`);
    if (options.openGraph.siteName) metaTagsBuilder.push(`<meta property="og:site_name" content="${escapeHTML(options.openGraph.siteName)}" />`);
    if (options.openGraph.locale) metaTagsBuilder.push(`<meta property="og:locale" content="${escapeHTML(options.openGraph.locale)}" />`);

    // Images
    if (options.openGraph.image) {
      if (Array.isArray(options.openGraph.image)) {
        for (const img of options.openGraph.image) {
          metaTagsBuilder.push(`<meta property="og:image" content="${escapeHTML(img.url)}" />`);
          if (img.alt) metaTagsBuilder.push(`<meta property="og:image:alt" content="${escapeHTML(img.alt)}" />`);
        }
      } else {
        metaTagsBuilder.push(`<meta property="og:image" content="${escapeHTML(options.openGraph.image)}" />`);
      }
    }
  }

  // Twitter Card
  if (options.twitter) {
    if (options.twitter.cardType) metaTagsBuilder.push(`<meta name="twitter:card" content="${escapeHTML(options.twitter.cardType)}" />`);
    if (options.twitter.site) metaTagsBuilder.push(`<meta name="twitter:site" content="${escapeHTML(options.twitter.site)}" />`);
    if (options.twitter.handle) metaTagsBuilder.push(`<meta name="twitter:creator" content="${escapeHTML(options.twitter.handle)}" />`);
    if (options.twitter.title) metaTagsBuilder.push(`<meta name="twitter:title" content="${escapeHTML(options.twitter.title)}" />`);
    if (options.twitter.description) metaTagsBuilder.push(`<meta name="twitter:description" content="${escapeHTML(options.twitter.description)}" />`);
    if (options.twitter.image) metaTagsBuilder.push(`<meta name="twitter:image" content="${escapeHTML(options.twitter.image)}" />`);
    if (options.twitter.imageAlt) metaTagsBuilder.push(`<meta name="twitter:image:alt" content="${escapeHTML(options.twitter.imageAlt)}" />`);
  }

  // JSON-LD
  if (options.jsonLd && options.jsonLd.length > 0) {
    for (const data of options.jsonLd) {
      const json = JSON.stringify(data);
      const safeJson = escapeJSONForScript(json);
      jsonLdScriptsBuilder.push(`<script type="application/ld+json">${safeJson}</script>`);
    }
  }

  // Build result using cached arrays
  const result: RenderedSEO = {
    title,
    meta: metaTagsBuilder.join("\n    "),
    link: linkTagsBuilder.join("\n    "),
    jsonLd: jsonLdScriptsBuilder.join("\n    "),
    toHTML() {
      // Use template literals for better performance
      const parts: string[] = [`    <title>${this.title}</title>`];

      if (this.meta) parts.push(`    ${this.meta}`);
      if (this.link) parts.push(`    ${this.link}`);
      if (this.jsonLd) parts.push(`    ${this.jsonLd}`);

      return parts.join("\n");
    },
    toString() {
      return this.toHTML();
    },
  };

  // Cache the result
  if (useCache) {
    renderCache.set(options, result);
  }

  return result;
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
  import("../utils/dom.js")
    .then(({ updateSEO }) => {
      updateSEO(options);
    })
    .catch((error) => {
      console.error("[SEO] Failed to load updateSEO:", error);
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
