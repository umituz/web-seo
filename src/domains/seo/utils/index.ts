/**
 * SEO Utils
 *
 * Public utility surface for SEO management.
 */

// Core DOM operations
export { updateSEO, clearSEO, getCurrentSEOState } from "./dom/index.js";

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
  truncateToTitle,
  truncateToDescription,
  generateSlug,
} from "./validation/index.js";
