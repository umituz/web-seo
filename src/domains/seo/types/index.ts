import { JsonLdTypes } from "./schema.js";

// ============================================================================
// Core Types
// ============================================================================

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
  charset?: string;
}

export interface LinkTag {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  media?: string;
  crossOrigin?: string;
  as?: string;
}

export interface ScriptTag {
  type: string;
  innerHTML: string;
}

// ============================================================================
// Robots Meta Tags
// ============================================================================

export type RobotsDirective =
  | "index"
  | "noindex"
  | "follow"
  | "nofollow"
  | "noarchive"
  | "nosnippet"
  | "notranslate"
  | "noimageindex"
  | "unavailable_after";

export interface RobotsMeta {
  index?: boolean;
  follow?: boolean;
  archive?: boolean;
  snippet?: boolean;
  translate?: boolean;
  imageIndex?: boolean;
  maxSnippet?: number;
  maxImagePreview?: "none" | "standard" | "large";
  maxVideoPreview?: number;
  unavailableAfter?: string;
}

// ============================================================================
// Hreflang Support
// ============================================================================

export interface HreflangEntry {
  lang: string;
  url: string;
}

// ============================================================================
// Performance Hints
// ============================================================================

export interface PreloadHint {
  href: string;
  as: "script" | "style" | "font" | "fetch" | "image";
  type?: string;
  crossOrigin?: string;
  integrity?: string;
}

export interface PreconnectOrigin {
  href: string;
  crossOrigin?: string;
}

export interface DnsPrefetchDomain {
  href: string;
}

// ============================================================================
// Article/Blog Post Specific
// ============================================================================

export interface ArticleMeta {
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  author?: string;
  section?: string;
  tag?: string[];
}

// ============================================================================
// Product Specific
// ============================================================================

export interface ProductMeta {
  price?: number;
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  brand?: string;
  sku?: string;
  condition?: "NewCondition" | "UsedCondition" | "RefurbishedCondition";
}

// ============================================================================
// Breadcrumb
// ============================================================================

export interface BreadcrumbItem {
  name: string;
  item: string;
  position?: number;
}

// ============================================================================
// Extended SEO Options
// ============================================================================

export interface SEOptions {
  // Basic
  title?: string;
  titleTemplate?: string;
  description?: string;
  lang?: string;
  canonical?: string;

  // Robots
  robots?: RobotsMeta | RobotsDirective[];

  // Meta Tags
  meta?: MetaTag[];
  link?: LinkTag[];

  // Open Graph (Enhanced)
  openGraph?: {
    type?: "website" | "article" | "product" | "profile" | "music" | "video" | "book";
    url?: string;
    title?: string;
    description?: string;
    image?: string | OpenGraphImage[];
    audio?: string;
    video?: string;
    determiner?: string;
    locale?: string;
    alternateLocale?: string[];
    siteName?: string;
    // Article specific
    article?: ArticleMeta;
    // Product specific
    product?: ProductMeta;
    // Profile
    firstName?: string;
    lastName?: string;
    username?: string;
    // Music
    music?: {
      album?: string;
      musician?: string;
      song?: string;
      releaseDate?: string;
      duration?: string;
      creator?: string;
    };
  };

  // Twitter Card (Enhanced)
  twitter?: {
    cardType?: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    handle?: string;
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    player?: string;
    playerWidth?: string;
    playerHeight?: string;
    playerStream?: string;
    playerStreamContentType?: string;
    app?: {
      iphone?: {
        id: string;
        name: string;
        url?: string;
      };
      ipad?: {
        id: string;
        name: string;
        url?: string;
      };
      googleplay?: {
        id: string;
        name: string;
        url?: string;
      };
    };
  };

  // Structured Data
  jsonLd?: JsonLdTypes[];

  // International SEO
  hreflang?: HreflangEntry[];

  // Performance
  preload?: PreloadHint[];
  preconnect?: PreconnectOrigin[];
  dnsPrefetch?: DnsPrefetchDomain[];

  // Breadcrumb
  breadcrumbs?: BreadcrumbItem[];

  // Favicon
  favicon?: string;
  appleTouchIcon?: string;
  maskIcon?: string;
  themeColor?: string;

  // Viewport
  viewport?: string;
}

// ============================================================================
// Open Graph Image
// ============================================================================

export interface OpenGraphImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: string;
  secureUrl?: string;
}

// ============================================================================
// SEO Configuration
// ============================================================================

export interface SEOConfig {
  // Site defaults
  defaultTitle?: string;
  titleTemplate?: string;
  defaultDescription?: string;
  defaultImage?: string;
  defaultCanonicalPrefix?: string;

  // Site info
  siteName?: string;
  siteUrl?: string;
  twitterHandle?: string;

  // Theme
  themeColor?: string;

  // Favicon
  favicon?: string;
  appleTouchIcon?: string;

  // i18n
  i18n?: {
    language?: string;
    t: (key: string) => string;
    on: (event: string, callback: () => void) => void;
  };
  defaultLanguage?: string;

  // Robots
  defaultRobots?: RobotsMeta;

  // Performance
  preconnectOrigins?: string[];
  dnsPrefetchDomains?: string[];

  // Validation
  strictMode?: boolean;
  devWarnings?: boolean;
}

// ============================================================================
// Validation Results
// ============================================================================

export interface SEOValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

// ============================================================================
// Schema.org Types
// ============================================================================

export type SchemaType =
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
  | "AudioObject"
  | "Book"
  | "Review"
  | "AggregateRating";

// Re-export JsonLdTypes for convenience
export type { JsonLdTypes } from "./schema.js";
