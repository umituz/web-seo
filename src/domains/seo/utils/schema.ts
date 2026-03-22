/**
 * Schema.org JSON-LD Generators
 *
 * Helper functions to generate valid Schema.org structured data
 * for various content types like articles, products, organizations, etc.
 */

import type {
  ArticleJsonLd,
  ProductJsonLd,
  OrganizationJsonLd,
  LocalBusinessJsonLd,
  BreadcrumbJsonLd,
  FAQJsonLd,
  WebSiteJsonLd,
  PersonJsonLd,
  VideoJsonLd,
  SchemaGeneratorOptions,
} from "../types/schema.js";

const DEFAULT_CONTEXT = "https://schema.org";

// ============================================================================
// Validation Helpers
// ============================================================================

const validateRequired = (value: any, fieldName: string, strict = false) => {
  if (!value) {
    const message = `[SEO] Schema validation: Required field "${fieldName}" is missing or empty`;
    if (strict) {
      throw new Error(message);
    }
    if (typeof console !== "undefined" && console.warn) {
      console.warn(message);
    }
    return false;
  }
  return true;
};

// ============================================================================
// Article Schema Generator
// ============================================================================

export interface ArticleSchemaInput {
  headline: string;
  description?: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  authorType?: "Person" | "Organization";
  publisherName: string;
  publisherLogo: string;
  publisherUrl?: string;
  url?: string;
  articleSection?: string;
  wordCount?: number;
  keywords?: string | string[];
  inLanguage?: string;
  type?: "Article" | "NewsArticle" | "BlogPosting";
}

export const generateArticleSchema = (
  input: ArticleSchemaInput,
  options?: SchemaGeneratorOptions
): ArticleJsonLd => {
  const { strict, validate = true } = options || {};

  if (validate) {
    validateRequired(input.headline, "headline", strict);
    validateRequired(input.image, "image", strict);
    validateRequired(input.datePublished, "datePublished", strict);
    validateRequired(input.authorName, "authorName", strict);
    validateRequired(input.publisherName, "publisherName", strict);
    validateRequired(input.publisherLogo, "publisherLogo", strict);
  }

  return {
    "@context": DEFAULT_CONTEXT,
    "@type": input.type || "Article",
    headline: input.headline,
    name: input.headline, // Required by Thing
    description: input.description,
    image: input.image,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@type": input.authorType || "Person",
      name: input.authorName,
      url: input.authorUrl,
    },
    publisher: {
      "@context": DEFAULT_CONTEXT,
      "@type": "Organization",
      name: input.publisherName,
      logo: input.publisherLogo,
      url: input.publisherUrl,
    },
    url: input.url,
    articleSection: input.articleSection,
    wordCount: input.wordCount,
    keywords: Array.isArray(input.keywords) ? input.keywords.join(", ") : input.keywords,
    inLanguage: input.inLanguage,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
  } as ArticleJsonLd;
};

// ============================================================================
// Product Schema Generator
// ============================================================================

export interface ProductSchemaInput {
  name: string;
  description?: string;
  image: string | string[];
  price: number;
  priceCurrency: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url?: string;
  brandName?: string;
  sku?: string;
  gtin?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export const generateProductSchema = (
  input: ProductSchemaInput,
  options?: SchemaGeneratorOptions
): ProductJsonLd => {
  const { strict, validate = true } = options || {};

  if (validate) {
    validateRequired(input.name, "name", strict);
    validateRequired(input.image, "image", strict);
    validateRequired(input.price, "price", strict);
    validateRequired(input.priceCurrency, "priceCurrency", strict);
  }

  const schema: ProductJsonLd = {
    "@context": DEFAULT_CONTEXT,
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.image,
    offers: {
      "@type": "Offer",
      price: input.price.toString(),
      priceCurrency: input.priceCurrency,
      availability: input.availability
        ? `https://schema.org/${input.availability}`
        : undefined,
      url: input.url,
    },
  };

  if (input.brandName) {
    schema.brand = {
      "@type": "Brand",
      name: input.brandName,
    };
  }

  if (input.sku) schema.sku = input.sku;
  if (input.gtin) schema.gtin = input.gtin;

  if (input.aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: input.aggregateRating.ratingValue,
      reviewCount: input.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
};

// ============================================================================
// Organization Schema Generator
// ============================================================================

export interface OrganizationSchemaInput {
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  }[];
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

export const generateOrganizationSchema = (
  input: OrganizationSchemaInput,
  options?: SchemaGeneratorOptions
): OrganizationJsonLd => {
  const { strict, validate = true } = options || {};

  if (validate) {
    validateRequired(input.name, "name", strict);
  }

  const schema: OrganizationJsonLd = {
    "@context": DEFAULT_CONTEXT,
    "@type": "Organization",
    name: input.name,
    description: input.description,
    url: input.url,
    logo: input.logo,
    sameAs: input.sameAs,
  } as OrganizationJsonLd;

  if (input.contactPoint) {
    schema.contactPoint = input.contactPoint.map((cp) => ({
      "@type": "ContactPoint",
      telephone: cp.telephone,
      contactType: cp.contactType,
      email: cp.email,
    }));
  }

  if (input.address) {
    schema.address = {
      "@type": "PostalAddress",
      ...input.address,
    };
  }

  return schema;
};

// ============================================================================
// Local Business Schema Generator
// ============================================================================

export interface LocalBusinessSchemaInput extends OrganizationSchemaInput {
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: {
    dayOfWeek: string | string[];
    opens: string;
    closes: string;
  }[];
  priceRange?: string;
  type?: "LocalBusiness" | "Restaurant" | "Store" | "Dentist" | "Hospital";
}

export const generateLocalBusinessSchema = (
  input: LocalBusinessSchemaInput,
  options?: SchemaGeneratorOptions
): LocalBusinessJsonLd => {
  const { strict, validate = true } = options || {};

  if (validate) {
    validateRequired(input.name, "name", strict);
    validateRequired(input.address, "address", strict);
  }

  const schema: any = {
    "@context": DEFAULT_CONTEXT,
    "@type": input.type || "LocalBusiness",
    name: input.name,
    description: input.description,
    url: input.url,
    logo: input.logo,
    address: {
      "@type": "PostalAddress",
      ...input.address,
    },
    priceRange: input.priceRange,
  };

  if (input.geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: input.geo.latitude,
      longitude: input.geo.longitude,
    };
  }

  if (input.openingHours) {
    schema.openingHoursSpecification = input.openingHours.map((oh) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: oh.dayOfWeek,
      opens: oh.opens,
      closes: oh.closes,
    }));
  }

  if (input.contactPoint) {
    schema.contactPoint = input.contactPoint.map((cp) => ({
      "@type": "ContactPoint",
      telephone: cp.telephone,
      contactType: cp.contactType,
      email: cp.email,
    }));
  }

  if (input.sameAs) {
    schema.sameAs = input.sameAs;
  }

  return schema as LocalBusinessJsonLd;
};

// ============================================================================
// Breadcrumb Schema Generator
// ============================================================================

export const generateBreadcrumbSchema = (
  items: Array<{ name: string; item: string; position?: number }>,
  options?: SchemaGeneratorOptions
): BreadcrumbJsonLd => {
  const { strict, validate = true } = options || {};

  if (validate && items.length === 0) {
    const message = "[SEO] Breadcrumb schema requires at least one item";
    if (strict) {
      throw new Error(message);
    }
    console.warn(message);
  }

  return {
    "@context": DEFAULT_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position || index + 1,
      name: item.name,
      item: item.item,
    })),
  };
};

// ============================================================================
// FAQ Schema Generator
// ============================================================================

export interface FAQItemInput {
  question: string;
  answer: string;
}

export const generateFAQSchema = (
  faqs: FAQItemInput[],
  options?: SchemaGeneratorOptions
): FAQJsonLd => {
  const { strict, validate = true } = options || {};

  if (validate) {
    validateRequired(faqs, "faqs", strict);
    if (faqs.length === 0) {
      const message = "[SEO] FAQ schema requires at least one FAQ item";
      if (strict) {
        throw new Error(message);
      }
      console.warn(message);
    }
  }

  return {
    "@context": DEFAULT_CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

// ============================================================================
// WebSite Schema Generator
// ============================================================================

export interface WebSiteSchemaInput {
  name: string;
  url: string;
  description?: string;
  searchTarget?: string;
  searchQueryParam?: string;
  publisher?: {
    name: string;
    logo?: string;
  };
}

export const generateWebSiteSchema = (
  input: WebSiteSchemaInput,
  options?: SchemaGeneratorOptions
): WebSiteJsonLd => {
  const { strict, validate = true } = options || {};

  if (validate) {
    validateRequired(input.name, "name", strict);
    validateRequired(input.url, "url", strict);
  }

  const schema: WebSiteJsonLd = {
    "@context": DEFAULT_CONTEXT,
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    description: input.description,
  };

  if (input.searchTarget) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: input.searchTarget,
      "query-input": input.searchQueryParam || "required name=search_term_string",
    };
  }

  if (input.publisher) {
    schema.publisher = {
      "@context": DEFAULT_CONTEXT,
      "@type": "Organization",
      name: input.publisher.name,
      logo: input.publisher.logo,
    };
  }

  return schema;
};

// ============================================================================
// Person Schema Generator
// ============================================================================

export interface PersonSchemaInput {
  name: string;
  givenName?: string;
  familyName?: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  url?: string;
  sameAs?: string[];
  email?: string;
  telephone?: string;
  worksFor?: {
    name: string;
    url?: string;
  };
}

export const generatePersonSchema = (
  input: PersonSchemaInput,
  options?: SchemaGeneratorOptions
): PersonJsonLd => {
  const { strict, validate = true } = options || {};

  if (validate) {
    validateRequired(input.name, "name", strict);
  }

  const schema: PersonJsonLd = {
    "@context": DEFAULT_CONTEXT,
    "@type": "Person",
    name: input.name,
    givenName: input.givenName,
    familyName: input.familyName,
    jobTitle: input.jobTitle,
    description: input.description,
    image: input.image,
    url: input.url,
    sameAs: input.sameAs,
    email: input.email,
    telephone: input.telephone,
  };

  if (input.worksFor) {
    schema.worksFor = {
      "@context": DEFAULT_CONTEXT,
      "@type": "Organization",
      name: input.worksFor.name,
      url: input.worksFor.url,
    };
  }

  return schema;
};

// ============================================================================
// Video Schema Generator
// ============================================================================

export interface VideoSchemaInput {
  name: string;
  description?: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  embedUrl?: string;
  viewCount?: number;
}

export const generateVideoSchema = (
  input: VideoSchemaInput,
  options?: SchemaGeneratorOptions
): VideoJsonLd => {
  const { strict, validate = true } = options || {};

  if (validate) {
    validateRequired(input.name, "name", strict);
    validateRequired(input.thumbnailUrl, "thumbnailUrl", strict);
    validateRequired(input.uploadDate, "uploadDate", strict);
  }

  const schema: VideoJsonLd = {
    "@context": DEFAULT_CONTEXT,
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    thumbnailUrl: input.thumbnailUrl,
    uploadDate: input.uploadDate,
    duration: input.duration,
  };

  if (input.viewCount) {
    schema.interactionStatistic = {
      "@type": "InteractionCounter",
      interactionType: {
        "@type": "WatchAction",
      },
      userInteractionCount: input.viewCount,
    };
  }

  return schema;
};
