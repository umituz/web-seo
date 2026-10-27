/**
 * Schema generator input types.
 * Kept in one place so consumers can import just the shapes they need.
 */

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
  aggregateRating?: { ratingValue: number; reviewCount: number };
}

export interface ContactPointInput {
  telephone: string;
  contactType: string;
  email?: string;
}

export interface PostalAddressInput {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface OrganizationSchemaInput {
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: ContactPointInput[];
  address?: PostalAddressInput;
}

export interface LocalBusinessSchemaInput extends OrganizationSchemaInput {
  address: PostalAddressInput;
  geo?: { latitude: number; longitude: number };
  openingHours?: Array<{ dayOfWeek: string | string[]; opens: string; closes: string }>;
  priceRange?: string;
  type?: "LocalBusiness" | "Restaurant" | "Store" | "Dentist" | "Hospital";
}

export interface FAQItemInput {
  question: string;
  answer: string;
}

export interface WebSiteSchemaInput {
  name: string;
  url: string;
  description?: string;
  searchTarget?: string;
  searchQueryParam?: string;
  publisher?: { name: string; logo?: string };
}

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
  worksFor?: { name: string; url?: string };
}

export interface VideoSchemaInput {
  name: string;
  description?: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  embedUrl?: string;
  viewCount?: number;
}

export interface CourseInstanceInput {
  courseMode?: "online" | "onsite" | "blended" | string;
  courseWorkload?: string;
  instructorName?: string;
  instructorUrl?: string;
  inLanguage?: string;
  startDate?: string;
  endDate?: string;
}

export interface CourseSchemaInput {
  name: string;
  description: string;
  providerName: string;
  providerUrl?: string;
  image?: string | string[];
  url?: string;
  courseCode?: string;
  educationalLevel?: string;
  inLanguage?: string;
  price?: number;
  priceCurrency?: string;
  teaches?: string | string[];
  aggregateRating?: { ratingValue: number; reviewCount: number };
  instances?: CourseInstanceInput[];
}
