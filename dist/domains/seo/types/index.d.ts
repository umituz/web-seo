import { JsonLdTypes } from "./schema.js";
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
export type RobotsDirective = "index" | "noindex" | "follow" | "nofollow" | "noarchive" | "nosnippet" | "notranslate" | "noimageindex" | "unavailable_after";
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
export interface HreflangEntry {
    lang: string;
    url: string;
}
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
export interface ArticleMeta {
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    author?: string;
    section?: string;
    tag?: string[];
}
export interface ProductMeta {
    price?: number;
    priceCurrency?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
    brand?: string;
    sku?: string;
    condition?: "NewCondition" | "UsedCondition" | "RefurbishedCondition";
}
export interface BreadcrumbItem {
    name: string;
    item: string;
    position?: number;
}
export interface SEOptions {
    title?: string;
    titleTemplate?: string;
    description?: string;
    lang?: string;
    canonical?: string;
    robots?: RobotsMeta | RobotsDirective[];
    meta?: MetaTag[];
    link?: LinkTag[];
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
        article?: ArticleMeta;
        product?: ProductMeta;
        firstName?: string;
        lastName?: string;
        username?: string;
        music?: {
            album?: string;
            musician?: string;
            song?: string;
            releaseDate?: string;
            duration?: string;
            creator?: string;
        };
    };
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
    jsonLd?: JsonLdTypes[];
    hreflang?: HreflangEntry[];
    preload?: PreloadHint[];
    preconnect?: PreconnectOrigin[];
    dnsPrefetch?: DnsPrefetchDomain[];
    breadcrumbs?: BreadcrumbItem[];
    favicon?: string;
    appleTouchIcon?: string;
    maskIcon?: string;
    themeColor?: string;
    viewport?: string;
    additionalMetaTags?: MetaTag[];
    additionalLinkTags?: LinkTag[];
}
export interface OpenGraphImage {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    type?: string;
    secureUrl?: string;
}
export interface SEOConfig {
    defaultTitle?: string;
    titleTemplate?: string;
    defaultDescription?: string;
    defaultImage?: string;
    defaultCanonicalPrefix?: string;
    siteName?: string;
    siteUrl?: string;
    twitterHandle?: string;
    themeColor?: string;
    favicon?: string;
    appleTouchIcon?: string;
    i18n?: any;
    defaultLanguage?: string;
    defaultRobots?: RobotsMeta;
    preconnectOrigins?: string[];
    dnsPrefetchDomains?: string[];
    strictMode?: boolean;
    devWarnings?: boolean;
}
export interface SEOValidationResult {
    valid: boolean;
    warnings: string[];
    errors: string[];
    suggestions: string[];
}
export type SchemaType = "Article" | "NewsArticle" | "BlogPosting" | "Product" | "Organization" | "LocalBusiness" | "BreadcrumbList" | "FAQPage" | "WebSite" | "Person" | "VideoObject" | "AudioObject" | "Book" | "Review" | "AggregateRating";
export type { JsonLdTypes } from "./schema.js";
//# sourceMappingURL=index.d.ts.map