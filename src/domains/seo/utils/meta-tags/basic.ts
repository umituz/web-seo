/**
 * Basic Meta Tag Operations
 *
 * Core functions for setting meta and link tags
 */

import type { RobotsMeta } from "../../types/index.js";

/**
 * Set a meta tag attribute
 */
export const setMetaTag = (
  attrName: "name" | "property" | "httpEquiv" | "charset",
  attrValue: string,
  content?: string
) => {
  if (typeof document === "undefined") return;

  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }

  if (content) {
    element.setAttribute("content", content);
  }
};

/**
 * Set a link tag attribute
 */
export const setLinkTag = (attrs: Record<string, string>) => {
  if (typeof document === "undefined") return;

  const rel = attrs.rel;
  if (!rel) return;

  // Build selector based on rel and other identifying attributes
  let selector = `link[rel="${rel}"]`;
  if (attrs.href) selector += `[href="${attrs.href}"]`;
  if (attrs.sizes) selector += `[sizes="${attrs.sizes}"]`;
  if (attrs.type) selector += `[type="${attrs.type}"]`;

  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
};

/**
 * Set robots meta tag
 */
export const setRobotsMeta = (robots: RobotsMeta | boolean) => {
  if (typeof document === "undefined") return;

  let content = "";

  if (typeof robots === "boolean") {
    content = robots ? "index, follow" : "noindex, nofollow";
  } else {
    const directives: string[] = [];

    if (robots.index !== undefined) {
      directives.push(robots.index ? "index" : "noindex");
    }
    if (robots.follow !== undefined) {
      directives.push(robots.follow ? "follow" : "nofollow");
    }
    if (robots.archive !== undefined) {
      directives.push(robots.archive ? "all" : "noarchive");
    }
    if (robots.snippet !== undefined) {
      directives.push(robots.snippet ? "all" : "nosnippet");
    }
    if (robots.translate !== undefined) {
      directives.push(robots.translate ? "all" : "notranslate");
    }
    if (robots.imageIndex !== undefined) {
      directives.push(robots.imageIndex ? "all" : "noimageindex");
    }
    if (robots.maxSnippet !== undefined) {
      directives.push(`max-snippet:${robots.maxSnippet}`);
    }
    if (robots.maxImagePreview !== undefined) {
      directives.push(`max-image-preview:${robots.maxImagePreview}`);
    }
    if (robots.maxVideoPreview !== undefined) {
      directives.push(`max-video-preview:${robots.maxVideoPreview}`);
    }
    if (robots.unavailableAfter !== undefined) {
      directives.push(`unavailable_after:${robots.unavailableAfter}`);
    }

    content = directives.join(", ");
  }

  setMetaTag("name", "robots", content);
};
