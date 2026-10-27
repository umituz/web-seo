/**
 * JSON-LD payload validation.
 *
 * Each Schema.org type has its own set of required fields. We use a
 * small type-specific validator per `@type` rather than a giant switch
 * to keep each branch easy to extend.
 */

import type { JsonLdTypes } from "../../types/schema.js";

type JsonLdRecord = Record<string, unknown>;

const has = (obj: JsonLdRecord, key: string): boolean => {
  const value = obj[key];
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

const articleRules = (jsonLd: JsonLdRecord, errors: string[]): void => {
  if (!has(jsonLd, "headline"))     errors.push("Article must have a headline");
  if (!has(jsonLd, "image"))        errors.push("Article must have an image");
  if (!has(jsonLd, "datePublished")) errors.push("Article must have datePublished");
  if (!has(jsonLd, "author"))       errors.push("Article must have an author");
  if (!has(jsonLd, "publisher"))    errors.push("Article must have a publisher");
};

const productRules = (jsonLd: JsonLdRecord, errors: string[]): void => {
  if (!has(jsonLd, "name"))   errors.push("Product must have a name");
  if (!has(jsonLd, "offers")) errors.push("Product must have offers");
};

const organizationRules = (jsonLd: JsonLdRecord, errors: string[]): void => {
  if (!has(jsonLd, "name")) errors.push("Organization must have a name");
};

const breadcrumbRules = (jsonLd: JsonLdRecord, errors: string[]): void => {
  if (!has(jsonLd, "itemListElement")) errors.push("BreadcrumbList must have itemListElement");
};

const faqRules = (jsonLd: JsonLdRecord, errors: string[]): void => {
  if (!has(jsonLd, "mainEntity")) errors.push("FAQPage must have mainEntity");
};

const videoRules = (jsonLd: JsonLdRecord, errors: string[]): void => {
  if (!has(jsonLd, "name"))         errors.push("Video must have a name");
  if (!has(jsonLd, "thumbnailUrl")) errors.push("Video must have thumbnailUrl");
  if (!has(jsonLd, "uploadDate"))   errors.push("Video must have uploadDate");
};

const TYPE_RULES: Record<string, (jsonLd: JsonLdRecord, errors: string[]) => void> = {
  Article: articleRules,
  NewsArticle: articleRules,
  BlogPosting: articleRules,
  Product: productRules,
  Organization: organizationRules,
  BreadcrumbList: breadcrumbRules,
  FAQPage: faqRules,
  VideoObject: videoRules,
};

export const validateJsonLd = (jsonLd: JsonLdTypes): string[] => {
  const errors: string[] = [];
  const record = jsonLd as unknown as JsonLdRecord;

  if (!record["@context"]) errors.push('JSON-LD must have a "@context" property');
  if (!record["@type"])    errors.push('JSON-LD must have a "@type" property');

  const type = record["@type"];
  if (typeof type === "string") {
    TYPE_RULES[type]?.(record, errors);
  }

  return errors;
};
