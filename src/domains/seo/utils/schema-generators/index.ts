/**
 * Schema.org Generators
 *
 * Public surface for structured-data generation. One file per generator
 * (see ./generators/*) plus a factory for dynamic dispatch.
 */

export { generateArticleSchema } from "./generators/article.js";
export { generateProductSchema } from "./generators/product.js";
export { generateOrganizationSchema } from "./generators/organization.js";
export { generateLocalBusinessSchema } from "./generators/local-business.js";
export { generateBreadcrumbSchema } from "./generators/breadcrumb.js";
export { generateFAQSchema } from "./generators/faq.js";
export { generateWebSiteSchema } from "./generators/website.js";
export { generatePersonSchema } from "./generators/person.js";
export { generateVideoSchema } from "./generators/video.js";
export { generateCourseSchema } from "./generators/course.js";

export { schemaFactory } from "./factory.js";
export type { SchemaKind } from "./factory.js";

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
  ContactPointInput,
  PostalAddressInput,
} from "./types.js";
