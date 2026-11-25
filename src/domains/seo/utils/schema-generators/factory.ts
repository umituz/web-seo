
import type { JsonLdTypes, SchemaGeneratorOptions } from "../../types/schema.js";
import { generateArticleSchema } from "./generators/article.js";
import type { ArticleSchemaInput } from "./types.js";
import { generateBreadcrumbSchema } from "./generators/breadcrumb.js";
import { generateFAQSchema } from "./generators/faq.js";
import type { FAQItemInput } from "./types.js";
import { generateLocalBusinessSchema } from "./generators/local-business.js";
import type { LocalBusinessSchemaInput } from "./types.js";
import { generateOrganizationSchema } from "./generators/organization.js";
import type { OrganizationSchemaInput } from "./types.js";
import { generatePersonSchema } from "./generators/person.js";
import type { PersonSchemaInput } from "./types.js";
import { generateProductSchema } from "./generators/product.js";
import type { ProductSchemaInput } from "./types.js";
import { generateVideoSchema } from "./generators/video.js";
import type { VideoSchemaInput } from "./types.js";
import { generateWebSiteSchema } from "./generators/website.js";
import type { WebSiteSchemaInput } from "./types.js";
import { generateCourseSchema } from "./generators/course.js";
import type { CourseSchemaInput } from "./types.js";
import { generateSoftwareApplicationSchema } from "./generators/software-application.js";
import type { SoftwareApplicationSchemaInput } from "./types.js";
import { generateEducationalOrganizationSchema } from "./generators/educational-organization.js";
import type { EducationalOrganizationSchemaInput } from "./types.js";
import { generateItemListSchema } from "./generators/item-list.js";
import type { ItemListSchemaInput } from "./types.js";

export type SchemaKind =
  | "Article"
  | "NewsArticle"
  | "BlogPosting"
  | "Product"
  | "Organization"
  | "LocalBusiness"
  | "BreadcrumbList"
  | "FAQPage"
  | "WebSite"
  | "Person"
  | "VideoObject"
  | "Course"
  | "SoftwareApplication"
  | "WebApplication"
  | "EducationalOrganization"
  | "School"
  | "ItemList";

type GeneratorInput<K extends SchemaKind> =
  K extends "Article" | "NewsArticle" | "BlogPosting" ? ArticleSchemaInput :
  K extends "Product" ? ProductSchemaInput :
  K extends "Organization" ? OrganizationSchemaInput :
  K extends "LocalBusiness" ? LocalBusinessSchemaInput :
  K extends "FAQPage" ? FAQItemInput[] :
  K extends "WebSite" ? WebSiteSchemaInput :
  K extends "Person" ? PersonSchemaInput :
  K extends "VideoObject" ? VideoSchemaInput :
  K extends "BreadcrumbList" ? Array<{ name: string; item: string; position?: number }> :
  K extends "Course" ? CourseSchemaInput :
  K extends "SoftwareApplication" | "WebApplication" ? SoftwareApplicationSchemaInput :
  K extends "EducationalOrganization" | "School" ? EducationalOrganizationSchemaInput :
  K extends "ItemList" ? ItemListSchemaInput :
  never;

export const schemaFactory = {
  generate<K extends SchemaKind>(
    kind: K,
    input: GeneratorInput<K>,
    options?: SchemaGeneratorOptions
  ): JsonLdTypes {
    switch (kind) {
      case "Article":
      case "NewsArticle":
      case "BlogPosting":
        return generateArticleSchema(input as ArticleSchemaInput, options);
      case "Product":
        return generateProductSchema(input as ProductSchemaInput, options);
      case "Course":
        return generateCourseSchema(input as CourseSchemaInput, options);
      case "SoftwareApplication":
      case "WebApplication":
        return generateSoftwareApplicationSchema(
          { ...(input as SoftwareApplicationSchemaInput), type: kind },
          options
        );
      case "Organization":
        return generateOrganizationSchema(input as OrganizationSchemaInput, options);
      case "LocalBusiness":
        return generateLocalBusinessSchema(input as LocalBusinessSchemaInput, options);
      case "BreadcrumbList":
        return generateBreadcrumbSchema(
          input as Array<{ name: string; item: string; position?: number }>,
          options
        );
      case "FAQPage":
        return generateFAQSchema(input as FAQItemInput[], options);
      case "WebSite":
        return generateWebSiteSchema(input as WebSiteSchemaInput, options);
      case "Person":
        return generatePersonSchema(input as PersonSchemaInput, options);
      case "VideoObject":
        return generateVideoSchema(input as VideoSchemaInput, options);
      case "EducationalOrganization":
      case "School":
        return generateEducationalOrganizationSchema(
          { ...(input as EducationalOrganizationSchemaInput), type: kind },
          options
        );
      case "ItemList":
        return generateItemListSchema(input as ItemListSchemaInput, options);
      default: {
        const _exhaustive: never = kind;
        throw new Error(`[SEO] Unknown schema kind: ${String(_exhaustive)}`);
      }
    }
  },
};

