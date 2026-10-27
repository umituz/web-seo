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

// DOM operations
export { updateSEO, clearSEO, getCurrentSEOState } from "./domains/seo/utils/dom/index.js";

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
  generateCourseSchema,
  schemaFactory,
} from "./domains/seo/utils/schema-generators/index.js";

// Validators + text helpers
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
} from "./domains/seo/utils/validation/index.js";

// SSR
export {
  renderSEO,
  generateHead,
  extractSEOData,
  hydrateSEO,
  renderAsHelmet,
  serializeSEO,
  deserializeSEO,
  serializeSEOToBase64,
  deserializeSEOFromBase64,
  safeDeserializeSEO,
} from "./domains/seo/ssr/index.js";

// Vite Plugin - NOT exported from main entry to avoid Node.js dependencies in browser
// Use: import { viteSEOPlugin } from "@umituz/web-seo/vite" instead

// Types
export type {
  // Core
  MetaTag,
  LinkTag,
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
  CourseJsonLd,
  CourseInstance,
  SchemaType,
  SchemaGeneratorOptions,
} from "./domains/seo/types/schema.js";

// Schema generator input types
export type {
  ArticleSchemaInput,
  ProductSchemaInput,
  OrganizationSchemaInput,
  LocalBusinessSchemaInput,
  FAQItemInput,
  WebSiteSchemaInput,
  PersonSchemaInput,
  VideoSchemaInput,
  CourseSchemaInput,
  CourseInstanceInput,
} from "./domains/seo/utils/schema-generators/types.js";

export type { SchemaKind } from "./domains/seo/utils/schema-generators/factory.js";
