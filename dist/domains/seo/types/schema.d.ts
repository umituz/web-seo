export interface BaseJsonLd {
    "@context": string;
    "@type": SchemaType;
}
export interface Thing extends BaseJsonLd {
    name: string;
    description?: string;
    url?: string;
    image?: string | string[];
    identifier?: string;
    sameAs?: string | string[];
}
export interface ArticleJsonLd extends Thing {
    "@type": "Article" | "NewsArticle" | "BlogPosting";
    headline: string;
    image: string | string[];
    datePublished: string;
    dateModified?: string;
    author: PersonOrOrganization;
    publisher: OrganizationJsonLd;
    articleSection?: string;
    wordCount?: number;
    keywords?: string | string[];
    inLanguage?: string;
    thumbnailUrl?: string;
}
export interface PersonOrOrganization {
    "@type": "Person" | "Organization";
    name: string;
    url?: string;
    image?: string;
}
export interface ProductJsonLd extends Thing {
    "@type": "Product";
    offers: Offer;
    brand?: {
        "@type": "Brand";
        name: string;
    };
    sku?: string;
    gtin?: string;
    aggregateRating?: AggregateRating;
    review?: Review[];
}
export interface Offer {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    availability?: "https://schema.org/InStock" | "https://schema.org/OutOfStock" | "https://schema.org/PreOrder";
    url?: string;
    seller?: {
        "@type": "Organization";
        name: string;
    };
    priceValidUntil?: string;
    condition?: "NewCondition" | "UsedCondition" | "RefurbishedCondition";
}
export interface AggregateRating {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
}
export interface Review {
    "@type": "Review";
    author: PersonOrOrganization;
    reviewRating: {
        "@type": "Rating";
        ratingValue: number;
        bestRating?: number;
        worstRating?: number;
    };
    reviewBody?: string;
    datePublished?: string;
}
export interface OrganizationJsonLd extends Thing {
    "@type": "Organization" | "LocalBusiness" | "Restaurant" | "Store" | "Dentist" | "Hospital";
    logo?: string;
    contactPoint?: ContactPoint[];
    address?: PostalAddress;
    sameAs?: string[];
    foundingDate?: string;
    founder?: PersonOrOrganization;
    areaServed?: string | string[];
    knowsAbout?: string | string[];
}
export interface ContactPoint {
    "@type": "ContactPoint";
    telephone: string;
    contactType: string;
    email?: string;
    areaServed?: string | string[];
    availableLanguage?: string | string[];
}
export interface PostalAddress {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
}
export interface LocalBusinessJsonLd extends OrganizationJsonLd {
    "@type": "LocalBusiness" | "Restaurant" | "Store" | "Dentist" | "Hospital";
    address: PostalAddress;
    geo?: GeoCoordinates;
    openingHoursSpecification?: OpeningHoursSpecification[];
    priceRange?: string;
}
export interface GeoCoordinates {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
}
export interface OpeningHoursSpecification {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string | string[];
    opens: string;
    closes: string;
    validFrom?: string;
    validThrough?: string;
}
export interface BreadcrumbJsonLd extends BaseJsonLd {
    "@type": "BreadcrumbList";
    itemListElement: BreadcrumbItem[];
}
export interface BreadcrumbItem {
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
}
export interface FAQJsonLd extends BaseJsonLd {
    "@type": "FAQPage";
    mainEntity: FAQItem[];
}
export interface FAQItem {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
        "@type": "Answer";
        text: string;
    };
}
export interface WebSiteJsonLd extends Thing {
    "@type": "WebSite";
    url: string;
    potentialAction?: {
        "@type": "SearchAction";
        target: string;
        "query-input"?: string;
    };
    publisher?: OrganizationJsonLd;
}
export interface PersonJsonLd extends Thing {
    "@type": "Person";
    givenName?: string;
    familyName?: string;
    jobTitle?: string;
    worksFor?: OrganizationJsonLd;
    email?: string;
    telephone?: string;
    url?: string;
    sameAs?: string[];
    birthDate?: string;
    birthPlace?: {
        "@type": "Place";
        address: PostalAddress;
    };
}
export interface VideoJsonLd extends Thing {
    "@type": "VideoObject";
    thumbnailUrl: string;
    uploadDate: string;
    duration?: string;
    expires?: string;
    transcript?: string;
    interactionStatistic?: {
        "@type": "InteractionCounter";
        interactionType: {
            "@type": "WatchAction";
        };
        userInteractionCount: number;
    };
}
export interface AudioJsonLd extends Thing {
    "@type": "AudioObject";
    duration?: string;
    transcript?: string;
    uploadDate?: string;
    encodingFormat?: string;
}
export interface BookJsonLd extends Thing {
    "@type": "Book";
    author: PersonOrOrganization;
    isbn?: string;
    numberOfPages?: number;
    datePublished?: string;
    inLanguage?: string;
    bookFormat?: "AudiobookFormat" | "EBook" | "Hardcover" | "Paperback";
    aggregateRating?: AggregateRating;
}
export type JsonLdTypes = ArticleJsonLd | ProductJsonLd | OrganizationJsonLd | LocalBusinessJsonLd | BreadcrumbJsonLd | FAQJsonLd | WebSiteJsonLd | PersonJsonLd | VideoJsonLd | AudioJsonLd | BookJsonLd;
export type SchemaType = JsonLdTypes["@type"];
export interface SchemaGeneratorOptions {
    /** Strict mode - throws errors instead of warnings */
    strict?: boolean;
    /** Validate generated schema against Schema.org requirements */
    validate?: boolean;
}
//# sourceMappingURL=schema.d.ts.map