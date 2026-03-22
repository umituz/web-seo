/**
 * SEO Utils
 *
 * Utility functions for SEO management
 */

// Core DOM operations
export { updateSEO, clearSEO, getCurrentSEOState } from "./dom.js";

// Meta tag utilities
export * from "./meta-tags/index.js";

// Schema generators
export {
  generateArticleSchema,
  generateProductSchema,
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateWebSiteSchema,
  generatePersonSchema,
  generateVideoSchema,
} from "./schema-generators/index.js";

// Validators
export {
  validateSEO,
  auditSEO,
  isValidUrl,
  validateUrl,
  validateTitleLength,
  validateDescriptionLength,
  validateOpenGraphImage,
  validateHreflangEntry,
  truncateForSEO,
  generateSlug,
} from "./validation/index.js";
