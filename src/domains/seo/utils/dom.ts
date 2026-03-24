/**
 * SEO DOM Manager
 *
 * Main entry point for updating SEO elements in the DOM
 */

import type { SEOptions, MetaTag, LinkTag, RobotsMeta } from "../types/index.js";
import { setMetaTag, setLinkTag, setRobotsMeta } from "./meta-tags/basic.js";
import {
  setHreflangTags,
  setFavicon,
  setAppleTouchIcon,
  setMaskIcon,
  setThemeColor,
  setViewport,
} from "./meta-tags/advanced.js";
import { setOpenGraph, setTwitterCard } from "./meta-tags/social.js";
import {
  setPreloadHints,
  setPreconnectHints,
  setDnsPrefetchHints,
} from "./meta-tags/performance.js";

// DOM update batching system
const updateQueue: Array<() => void> = [];
let updateScheduled = false;

const scheduleDOMUpdates = () => {
  if (updateScheduled) return;

  updateScheduled = true;

  // Use requestAnimationFrame to batch DOM updates and prevent layout thrashing
  requestAnimationFrame(() => {
    // Execute all queued updates in a single frame
    const updates = updateQueue.splice(0, updateQueue.length);
    updates.forEach(update => {
      try {
        update();
      } catch (error) {
        console.error('DOM update error:', error);
      }
    });

    updateScheduled = false;

    // Process any updates that were queued during execution
    if (updateQueue.length > 0) {
      scheduleDOMUpdates();
    }
  });
};

const queueDOMUpdate = (update: () => void) => {
  updateQueue.push(update);
  scheduleDOMUpdates();
};

/**
 * Update SEO elements in the DOM with optimized batching
 */
export const updateSEO = (options: SEOptions) => {
  if (typeof document === "undefined") return;

  // Queue all DOM updates for better performance
  queueDOMUpdate(() => {
    // Title with template support
    if (options.title) {
      const title = options.titleTemplate
        ? options.titleTemplate.replace("%s", options.title)
        : options.title;
      document.title = title;
    }

    // Language
    if (options.lang) {
      document.documentElement.lang = options.lang;
    }

    // Description
    if (options.description) {
      setMetaTag("name", "description", options.description);
    }

    // Canonical
    if (options.canonical) {
      setLinkTag({ rel: "canonical", href: options.canonical });
    }

    // Robots
    if (options.robots !== undefined) {
      // Handle both RobotsMeta and RobotsDirective[] types
      if (Array.isArray(options.robots)) {
        // Convert directive array to RobotsMeta object
        const robotsMeta: RobotsMeta = {};
        options.robots.forEach((directive) => {
          switch (directive) {
            case "index":
              robotsMeta.index = true;
              break;
            case "noindex":
              robotsMeta.index = false;
              break;
            case "follow":
              robotsMeta.follow = true;
              break;
            case "nofollow":
              robotsMeta.follow = false;
              break;
            case "noarchive":
              robotsMeta.archive = false;
              break;
            case "nosnippet":
              robotsMeta.snippet = false;
              break;
            case "notranslate":
              robotsMeta.translate = false;
              break;
            case "noimageindex":
              robotsMeta.imageIndex = false;
              break;
          }
        });
        setRobotsMeta(robotsMeta);
      } else {
        setRobotsMeta(options.robots);
      }
    }

    // Viewport
    if (options.viewport) {
      setViewport(options.viewport);
    }

    // Theme Color
    if (options.themeColor) {
      setThemeColor(options.themeColor);
    }

    // Favicon
    if (options.favicon) {
      setFavicon(options.favicon);
    }
    if (options.appleTouchIcon) {
      setAppleTouchIcon(options.appleTouchIcon);
    }
    if (options.maskIcon) {
      setMaskIcon(options.maskIcon);
    }

    // Hreflang
    if (options.hreflang && options.hreflang.length > 0) {
      setHreflangTags(options.hreflang);
    }

    // Performance Hints
    if (options.preload && options.preload.length > 0) {
      setPreloadHints(options.preload);
    }
    if (options.preconnect && options.preconnect.length > 0) {
      setPreconnectHints(options.preconnect);
    }
    if (options.dnsPrefetch && options.dnsPrefetch.length > 0) {
      setDnsPrefetchHints(options.dnsPrefetch);
    }

    // Custom Meta Tags
    if (options.meta && Array.isArray(options.meta)) {
      options.meta.forEach((m) => {
        if (m.name) setMetaTag("name", m.name, m.content);
        if (m.property) setMetaTag("property", m.property, m.content);
        if (m.httpEquiv) setMetaTag("httpEquiv", m.httpEquiv, m.content);
        if (m.charset) setMetaTag("charset", m.charset);
      });
    }

    // Custom Link Tags
    if (options.link && Array.isArray(options.link)) {
      options.link.forEach((link) => {
        const attrs: Record<string, string> = { rel: link.rel, href: link.href };
        if (link.type) attrs.type = link.type;
        if (link.sizes) attrs.sizes = link.sizes;
        if (link.media) attrs.media = link.media;
        if (link.crossOrigin) attrs.crossorigin = link.crossOrigin;
        if (link.as) attrs.as = link.as;
        setLinkTag(attrs);
      });
    }

    // Open Graph
    setOpenGraph(options.openGraph);

    // Twitter Card
    setTwitterCard(options.twitter, options.openGraph);
  });
};

/**
 * Remove all SEO meta tags added by this library
 */
export const clearSEO = () => {
  if (typeof document === "undefined") return;

  // Remove all meta tags with data-seo attribute
  document.querySelectorAll('meta[data-seo="true"]').forEach((el) => el.remove());

  // Remove all link tags with data-seo attribute
  document.querySelectorAll('link[data-seo="true"]').forEach((el) => el.remove());

  // Reset title
  document.title = "";
};

/**
 * Get current SEO state from DOM
 */
export const getCurrentSEOState = () => {
  if (typeof document === "undefined") return null;

  const metaTags: MetaTag[] = [];
  const linkTags: LinkTag[] = [];

  // Get all meta tags
  document.querySelectorAll("meta").forEach((meta) => {
    const name = meta.getAttribute("name");
    const property = meta.getAttribute("property");
    const content = meta.getAttribute("content");

    if (content) {
      if (name) {
        metaTags.push({ name, content });
      } else if (property) {
        metaTags.push({ property, content });
      }
    }
  });

  // Get all link tags
  document.querySelectorAll("link").forEach((link) => {
    const rel = link.getAttribute("rel");
    const href = link.getAttribute("href");
    const type = link.getAttribute("type");
    const sizes = link.getAttribute("sizes");

    if (rel && href) {
      linkTags.push({
        rel,
        href,
        ...(type && { type }),
        ...(sizes && { sizes }),
      });
    }
  });

  return {
    title: document.title,
    lang: document.documentElement.lang,
    metaTags,
    linkTags,
  };
};
