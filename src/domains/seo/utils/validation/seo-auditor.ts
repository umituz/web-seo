/**
 * Comprehensive SEO validation and audit.
 *
 * `validateSEO` returns a structured result; `auditSEO` adds a dev-friendly
 * console summary. Neither mutates inputs.
 */

import type { SEOValidationResult, SEOptions } from "../../types/index.js";
import { validateHreflangEntry } from "./hreflang-validator.js";
import { validateOpenGraphImage } from "./image-validator.js";
import { validateDescriptionLength, validateTitleLength } from "./length-validator.js";
import { validateJsonLd } from "./jsonld-validator.js";
import { validateUrl } from "./url-validator.js";

export const validateSEO = (options: SEOptions): SEOValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Title
  if (options.title) {
    const error = validateTitleLength(options.title);
    if (error) warnings.push(error);
  } else {
    errors.push("Title is missing");
  }

  // Description
  if (options.description) {
    const error = validateDescriptionLength(options.description);
    if (error) warnings.push(error);
  } else {
    warnings.push("Description is missing");
  }

  // Canonical
  if (options.canonical) {
    const error = validateUrl(options.canonical, "Canonical URL");
    if (error) errors.push(error);
  } else {
    suggestions.push("Add a canonical URL to prevent duplicate content issues");
  }

  // Language
  if (!options.lang) {
    warnings.push("Language attribute is missing");
    suggestions.push('Add lang attribute (e.g., <html lang="en">)');
  }

  // Open Graph
  if (!options.openGraph) {
    suggestions.push("Add Open Graph tags for better social media sharing");
  } else if (!options.openGraph.image) {
    suggestions.push("Add Open Graph image for better social media previews");
  } else {
    const imageUrl = typeof options.openGraph.image === "string"
      ? options.openGraph.image
      : options.openGraph.image[0]?.url ?? "";
    const imageError = validateOpenGraphImage(imageUrl);
    if (imageError) warnings.push(imageError);
  }

  // Twitter
  if (!options.twitter) {
    suggestions.push("Add Twitter Card tags for better Twitter sharing");
  }

  // Hreflang
  if (options.hreflang && options.hreflang.length > 0) {
    options.hreflang.forEach((entry, index) => {
      const error = validateHreflangEntry(entry);
      if (error) errors.push(`Hreflang entry ${index + 1}: ${error}`);
    });

    if (!options.hreflang.some((entry) => entry.lang === "x-default")) {
      suggestions.push('Add hreflang="x-default" for language fallback');
    }
  }

  // JSON-LD
  if (options.jsonLd && options.jsonLd.length > 0) {
    options.jsonLd.forEach((data, index) => {
      validateJsonLd(data).forEach((error) => {
        errors.push(`JSON-LD entry ${index + 1}: ${error}`);
      });
    });
  } else {
    suggestions.push("Add JSON-LD structured data for rich snippets in search results");
  }

  // Favicon + theme color
  if (!options.favicon) {
    suggestions.push("Add a favicon for better brand recognition in browser tabs");
  }
  if (!options.themeColor) {
    suggestions.push("Add a theme color for better mobile browser integration");
  }

  // Performance
  if (!options.preconnect || options.preconnect.length === 0) {
    suggestions.push("Add preconnect hints for external resources to improve performance");
  }

  return { valid: errors.length === 0, errors, warnings, suggestions };
};

const STYLE = {
  error: "color: #d32f2f; font-weight: bold;",
  warning: "color: #f57c00; font-weight: bold;",
  success: "color: #388e3c; font-weight: bold;",
  info: "color: #1976d2; font-weight: bold;",
} as const;

/**
 * Validate SEO options and print a human-readable report to the console.
 * Opt-in: pass `enableConsole: true` to actually log.
 *
 * Browser-safe: does not read `process.env` (which is undefined in some
 * browser bundles). Use Vite's `import.meta.env.DEV` or a build-time
 * constant if you want dev-only output.
 */
export const auditSEO = (options: SEOptions, enableConsole = true): SEOValidationResult => {
  const result = validateSEO(options);

  if (!enableConsole || typeof console === "undefined") return result;

  console.group("%cSEO Audit Results", STYLE.info);

  if (result.valid) {
    console.log("%cAll required SEO elements are present.", STYLE.success);
  } else {
    console.log("%cSEO validation failed", STYLE.error);
  }

  if (result.errors.length > 0) {
    console.group("%cErrors (must fix)", STYLE.error);
    result.errors.forEach((error) => console.error(error));
    console.groupEnd();
  }
  if (result.warnings.length > 0) {
    console.group("%cWarnings (should fix)", STYLE.warning);
    result.warnings.forEach((warning) => console.warn(warning));
    console.groupEnd();
  }
  if (result.suggestions.length > 0) {
    console.group("%cSuggestions (nice to have)", STYLE.info);
    result.suggestions.forEach((suggestion) => console.log(suggestion));
    console.groupEnd();
  }

  console.groupEnd();
  return result;
};
