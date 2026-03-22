/**
 * Schema.org JSON-LD Generators
 *
 * Helper functions to generate valid Schema.org structured data
 * for various content types like articles, products, organizations, etc.
 */
import type { ArticleJsonLd, ProductJsonLd, OrganizationJsonLd, LocalBusinessJsonLd, BreadcrumbJsonLd, FAQJsonLd, WebSiteJsonLd, PersonJsonLd, VideoJsonLd, SchemaGeneratorOptions } from "../types/schema.js";
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
export declare const generateArticleSchema: (input: ArticleSchemaInput, options?: SchemaGeneratorOptions) => ArticleJsonLd;
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
export declare const generateProductSchema: (input: ProductSchemaInput, options?: SchemaGeneratorOptions) => ProductJsonLd;
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
export declare const generateOrganizationSchema: (input: OrganizationSchemaInput, options?: SchemaGeneratorOptions) => OrganizationJsonLd;
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
export declare const generateLocalBusinessSchema: (input: LocalBusinessSchemaInput, options?: SchemaGeneratorOptions) => LocalBusinessJsonLd;
export declare const generateBreadcrumbSchema: (items: Array<{
    name: string;
    item: string;
    position?: number;
}>, options?: SchemaGeneratorOptions) => BreadcrumbJsonLd;
export interface FAQItemInput {
    question: string;
    answer: string;
}
export declare const generateFAQSchema: (faqs: FAQItemInput[], options?: SchemaGeneratorOptions) => FAQJsonLd;
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
export declare const generateWebSiteSchema: (input: WebSiteSchemaInput, options?: SchemaGeneratorOptions) => WebSiteJsonLd;
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
export declare const generatePersonSchema: (input: PersonSchemaInput, options?: SchemaGeneratorOptions) => PersonJsonLd;
export interface VideoSchemaInput {
    name: string;
    description?: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration?: string;
    embedUrl?: string;
    viewCount?: number;
}
export declare const generateVideoSchema: (input: VideoSchemaInput, options?: SchemaGeneratorOptions) => VideoJsonLd;
//# sourceMappingURL=schema.d.ts.map