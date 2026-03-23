// ============================================================================
// Main Package Entry Point
// Domain-Driven Design structure
// ============================================================================

// Core SEO functionality
export { SEO } from "./domains/seo/components/SEO.js";
export { JsonLd } from "./domains/seo/components/JsonLd.js";
export { useSEO } from "./domains/seo/hooks/useSEO.js";
export { useJsonLd } from "./domains/seo/hooks/useJsonLd.js";
export { initSEO } from "./domains/seo/core/init.js";

// Utils
export { updateSEO, clearSEO, getCurrentSEOState } from "./domains/seo/utils/dom.js";
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
} from "./domains/seo/utils/schema-generators/schema.js";
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
} from "./domains/seo/utils/validation/validators.js";

// SSR
export {
  renderSEO,
  generateHead,
  extractSEOData,
  hydrateSEO,
  renderAsHelmet,
} from "./domains/seo/ssr/renderer.js";
export {
  serializeSEO,
  deserializeSEO,
  serializeSEOToBase64,
  deserializeSEOFromBase64,
  compressSEO,
  serializeSEOToQueryString,
  deserializeSEOFromQueryString,
  safeDeserializeSEO,
} from "./domains/seo/ssr/serializer.js";

// Vite Plugin - NOT exported from main entry to avoid Node.js dependencies in browser
// Use: import { viteSEOPlugin } from "@umituz/web-seo/vite" instead

// Types
export type {
  // Core
  MetaTag,
  LinkTag,
  ScriptTag,
  SEOptions,
  SEOConfig,

  // Robots
  RobotsMeta,
  RobotsDirective,

  // International
  HreflangEntry,

  // Performance
  PreloadHint,
  PreconnectOrigin,
  DnsPrefetchDomain,

  // Content-specific
  ArticleMeta,
  ProductMeta,
  BreadcrumbItem,

  // Open Graph
  OpenGraphImage,

  // Validation
  SEOValidationResult,
} from "./domains/seo/types/index.js";

export type {
  // Schema.org
  JsonLdTypes,
  ArticleJsonLd,
  ProductJsonLd,
  OrganizationJsonLd,
  LocalBusinessJsonLd,
  BreadcrumbJsonLd,
  FAQJsonLd,
  WebSiteJsonLd,
  PersonJsonLd,
  VideoJsonLd,
  SchemaType,
  SchemaGeneratorOptions,
} from "./domains/seo/types/schema.js";

