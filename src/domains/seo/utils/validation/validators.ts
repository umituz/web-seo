/**
 * SEO Validators
 *
 * Validation utilities for SEO configuration and content.
 * Helps catch common SEO issues before they affect search rankings.
 */

import type { SEOptions, SEOValidationResult, JsonLdTypes } from "../../types/index.js";

// ============================================================================
// URL Validation
// ============================================================================

export const isValidUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const validateUrl = (url: string, fieldName: string = "URL"): string | null => {
  if (!url) {
    return `${fieldName} is required`;
  }

  if (!isValidUrl(url)) {
    return `${fieldName} must be a valid HTTP/HTTPS URL`;
  }

  return null;
};

// ============================================================================
// Content Length Validation
// ============================================================================

export const TITLE_MIN_LENGTH = 30;
export const TITLE_MAX_LENGTH = 60;
export const DESCRIPTION_MIN_LENGTH = 120;
export const DESCRIPTION_MAX_LENGTH = 160;

export const validateTitleLength = (title: string): string | null => {
  if (!title) {
    return "Title is required";
  }

  if (title.length < TITLE_MIN_LENGTH) {
    return `Title is too short (${title.length} chars). Recommended: ${TITLE_MIN_LENGTH}-${TITLE_MAX_LENGTH} chars`;
  }

  if (title.length > TITLE_MAX_LENGTH) {
    return `Title is too long (${title.length} chars). Recommended: ${TITLE_MIN_LENGTH}-${TITLE_MAX_LENGTH} chars`;
  }

  return null;
};

export const validateDescriptionLength = (description: string): string | null => {
  if (!description) {
    return "Description is required";
  }

  if (description.length < DESCRIPTION_MIN_LENGTH) {
    return `Description is too short (${description.length} chars). Recommended: ${DESCRIPTION_MIN_LENGTH}-${DESCRIPTION_MAX_LENGTH} chars`;
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return `Description is too long (${description.length} chars). Recommended: ${DESCRIPTION_MIN_LENGTH}-${DESCRIPTION_MAX_LENGTH} chars`;
  }

  return null;
};

// ============================================================================
// Image Validation for Social Sharing
// ============================================================================

export const OG_IMAGE_MIN_WIDTH = 1200;
export const OG_IMAGE_MIN_HEIGHT = 630;
export const OG_IMAGE_MAX_SIZE = 8 * 1024 * 1024; // 8MB

export const validateOpenGraphImage = (
  imageUrl: string,
  width?: number,
  height?: number,
  size?: number
): string | null => {
  if (!imageUrl) {
    return "Open Graph image URL is required";
  }

  if (!isValidUrl(imageUrl)) {
    return "Open Graph image URL must be valid";
  }

  if (width !== undefined && width < OG_IMAGE_MIN_WIDTH) {
    return `Open Graph image width should be at least ${OG_IMAGE_MIN_WIDTH}px (current: ${width}px)`;
  }

  if (height !== undefined && height < OG_IMAGE_MIN_HEIGHT) {
    return `Open Graph image height should be at least ${OG_IMAGE_MIN_HEIGHT}px (current: ${height}px)`;
  }

  if (size !== undefined && size > OG_IMAGE_MAX_SIZE) {
    return `Open Graph image size should not exceed ${OG_IMAGE_MAX_SIZE / 1024 / 1024}MB`;
  }

  return null;
};

// ============================================================================
// Hreflang Validation
// ============================================================================

export const isValidLanguageCode = (code: string): boolean => {
  // Check if it's a valid language code (e.g., "en", "en-US", "x-default")
  const langCodeRegex = /^(?:[a-z]{2,3}(?:-[A-Z]{2})?|x-default)$/;
  return langCodeRegex.test(code);
};

export const validateHreflangEntry = (entry: { lang: string; url: string }): string | null => {
  if (!entry.lang) {
    return "Hreflang language code is required";
  }

  if (!isValidLanguageCode(entry.lang)) {
    return `Invalid language code: ${entry.lang}`;
  }

  const urlError = validateUrl(entry.url, "Hreflang URL");
  if (urlError) {
    return urlError;
  }

  return null;
};

// ============================================================================
// JSON-LD Validation
// ============================================================================

export const validateJsonLd = (jsonLd: JsonLdTypes): string[] => {
  const errors: string[] = [];

  // Check @context
  if (!jsonLd["@context"]) {
    errors.push('JSON-LD must have a "@context" property');
  }

  // Check @type
  if (!jsonLd["@type"]) {
    errors.push('JSON-LD must have a "@type" property');
  }

  // Type-specific validation
  const type = jsonLd["@type"];

  switch (type) {
    case "Article":
    case "NewsArticle":
    case "BlogPosting": {
      const article = jsonLd as unknown as Record<string, unknown>;
      if (!article.headline) errors.push("Article must have a headline");
      if (!article.image) errors.push("Article must have an image");
      if (!article.datePublished) errors.push("Article must have datePublished");
      if (!article.author) errors.push("Article must have an author");
      if (!article.publisher) errors.push("Article must have a publisher");
      break;
    }

    case "Product": {
      const product = jsonLd as unknown as Record<string, unknown>;
      if (!product.name) errors.push("Product must have a name");
      if (!product.offers) errors.push("Product must have offers");
      break;
    }

    case "Organization": {
      const org = jsonLd as unknown as Record<string, unknown>;
      if (!org.name) errors.push("Organization must have a name");
      break;
    }

    case "BreadcrumbList": {
      const breadcrumb = jsonLd as unknown as Record<string, unknown>;
      if (!breadcrumb.itemListElement || (Array.isArray(breadcrumb.itemListElement) && breadcrumb.itemListElement.length === 0)) {
        errors.push("BreadcrumbList must have itemListElement");
      }
      break;
    }

    case "FAQPage": {
      const faq = jsonLd as unknown as Record<string, unknown>;
      if (!faq.mainEntity || (Array.isArray(faq.mainEntity) && faq.mainEntity.length === 0)) {
        errors.push("FAQPage must have mainEntity");
      }
      break;
    }

    case "VideoObject": {
      const video = jsonLd as unknown as Record<string, unknown>;
      if (!video.name) errors.push("Video must have a name");
      if (!video.thumbnailUrl) errors.push("Video must have thumbnailUrl");
      if (!video.uploadDate) errors.push("Video must have uploadDate");
      break;
    }
  }

  return errors;
};

// ============================================================================
// Comprehensive SEO Validation
// ============================================================================

export const validateSEO = (options: SEOptions): SEOValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Title validation
  if (options.title) {
    const titleError = validateTitleLength(options.title);
    if (titleError) {
      if (options.title === "" || !options.title) {
        errors.push(titleError);
      } else {
        warnings.push(titleError);
      }
    }
  } else {
    errors.push("Title is missing");
  }

  // Description validation
  if (options.description) {
    const descError = validateDescriptionLength(options.description);
    if (descError) {
      if (options.description === "" || !options.description) {
        errors.push(descError);
      } else {
        warnings.push(descError);
      }
    }
  } else {
    warnings.push("Description is missing");
  }

  // Canonical URL validation
  if (options.canonical) {
    const canonicalError = validateUrl(options.canonical, "Canonical URL");
    if (canonicalError) {
      errors.push(canonicalError);
    }
  } else {
    suggestions.push("Add a canonical URL to prevent duplicate content issues");
  }

  // Language validation
  if (!options.lang) {
    warnings.push("Language attribute is missing");
    suggestions.push('Add lang attribute (e.g., <html lang="en">)');
  }

  // Open Graph validation
  if (!options.openGraph) {
    suggestions.push("Add Open Graph tags for better social media sharing");
  } else {
    if (!options.openGraph.image) {
      suggestions.push("Add Open Graph image for better social media previews");
    } else {
      const imageError = validateOpenGraphImage(
        typeof options.openGraph.image === "string"
          ? options.openGraph.image
          : options.openGraph.image[0]?.url || ""
      );
      if (imageError) {
        warnings.push(imageError);
      }
    }
  }

  // Twitter Card validation
  if (!options.twitter) {
    suggestions.push("Add Twitter Card tags for better Twitter sharing");
  }

  // Hreflang validation
  if (options.hreflang && options.hreflang.length > 0) {
    options.hreflang.forEach((entry, index) => {
      const error = validateHreflangEntry(entry);
      if (error) {
        errors.push(`Hreflang entry ${index + 1}: ${error}`);
      }
    });

    // Check for x-default
    const hasDefault = options.hreflang.some((entry) => entry.lang === "x-default");
    if (!hasDefault) {
      suggestions.push('Add hreflang="x-default" for language fallback');
    }
  }

  // JSON-LD validation
  if (options.jsonLd && options.jsonLd.length > 0) {
    options.jsonLd.forEach((jsonLd, index) => {
      const jsonLdErrors = validateJsonLd(jsonLd);
      jsonLdErrors.forEach((error) => {
        errors.push(`JSON-LD entry ${index + 1}: ${error}`);
      });
    });
  } else {
    suggestions.push("Add JSON-LD structured data for rich snippets in search results");
  }

  // Favicon validation
  if (!options.favicon) {
    suggestions.push("Add a favicon for better brand recognition in browser tabs");
  }

  // Theme color validation
  if (!options.themeColor) {
    suggestions.push("Add a theme color for better mobile browser integration");
  }

  // Performance hints
  if (!options.preconnect || options.preconnect.length === 0) {
    suggestions.push("Add preconnect hints for external resources to improve performance");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
};

// ============================================================================
// SEO Audit
// ============================================================================

export const auditSEO = (options: SEOptions) => {
  const result = validateSEO(options);

  // Console output in development
  if (typeof console !== "undefined") {
    const style = {
      error: "color: #d32f2f; font-weight: bold;",
      warning: "color: #f57c00; font-weight: bold;",
      success: "color: #388e3c; font-weight: bold;",
      info: "color: #1976d2; font-weight: bold;",
    };

    console.group("%c🔍 SEO Audit Results", style.info);

    if (result.valid) {
      console.log("%c✅ All required SEO elements are present!", style.success);
    } else {
      console.log("%c❌ SEO validation failed", style.error);
    }

    if (result.errors.length > 0) {
      console.group("%c🚨 Errors (must fix)", style.error);
      result.errors.forEach((error) => console.error(error));
      console.groupEnd();
    }

    if (result.warnings.length > 0) {
      console.group("%c⚠️ Warnings (should fix)", style.warning);
      result.warnings.forEach((warning) => console.warn(warning));
      console.groupEnd();
    }

    if (result.suggestions.length > 0) {
      console.group("%c💡 Suggestions (nice to have)", style.info);
      result.suggestions.forEach((suggestion) => console.log(suggestion));
      console.groupEnd();
    }

    console.groupEnd();
  }

  return result;
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Truncate text to fit within SEO best practices
 */
export const truncateForSEO = {
  title: (text: string): string => {
    if (text.length <= TITLE_MAX_LENGTH) return text;
    return text.substring(0, TITLE_MAX_LENGTH - 3) + "...";
  },

  description: (text: string): string => {
    if (text.length <= DESCRIPTION_MAX_LENGTH) return text;
    return text.substring(0, DESCRIPTION_MAX_LENGTH - 3) + "...";
  },
};

/**
 * Generate a slug from text for URL-friendly content
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
