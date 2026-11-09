
export { SEO } from "./domains/seo/components/SEO.js";
export { JsonLd } from "./domains/seo/components/JsonLd.js";
export { RouteSEO } from "./domains/seo/components/RouteSEO.js";
export type { RouteSEOProps } from "./domains/seo/components/RouteSEO.js";
export { useSEO } from "./domains/seo/hooks/useSEO.js";
export { useJsonLd } from "./domains/seo/hooks/useJsonLd.js";
export { initSEO } from "./domains/seo/core/init.js";

export { updateSEO, clearSEO, getCurrentSEOState } from "./domains/seo/utils/dom/index.js";

export type { RouteMeta, SitemapRouteItem } from "./domains/seo/vite/types.js";

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


export type {
  MetaTag,
  LinkTag,
  SEOptions,
  SEOConfig,

  RobotsMeta,
  RobotsDirective,

  HreflangEntry,

  PreloadHint,
  PreconnectOrigin,
  DnsPrefetchDomain,

  ArticleMeta,
  ProductMeta,
  BreadcrumbItem,

  OpenGraphImage,

  SEOValidationResult,
} from "./domains/seo/types/index.js";

export type {
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
