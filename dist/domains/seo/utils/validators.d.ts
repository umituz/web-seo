/**
 * SEO Validators
 *
 * Validation utilities for SEO configuration and content.
 * Helps catch common SEO issues before they affect search rankings.
 */
import type { SEOptions, SEOValidationResult, JsonLdTypes } from "../types/index.js";
export declare const isValidUrl: (url: string) => boolean;
export declare const validateUrl: (url: string, fieldName?: string) => string | null;
export declare const TITLE_MIN_LENGTH = 30;
export declare const TITLE_MAX_LENGTH = 60;
export declare const DESCRIPTION_MIN_LENGTH = 120;
export declare const DESCRIPTION_MAX_LENGTH = 160;
export declare const validateTitleLength: (title: string) => string | null;
export declare const validateDescriptionLength: (description: string) => string | null;
export declare const OG_IMAGE_MIN_WIDTH = 1200;
export declare const OG_IMAGE_MIN_HEIGHT = 630;
export declare const OG_IMAGE_MAX_SIZE: number;
export declare const validateOpenGraphImage: (imageUrl: string, width?: number, height?: number, size?: number) => string | null;
export declare const isValidLanguageCode: (code: string) => boolean;
export declare const validateHreflangEntry: (entry: {
    lang: string;
    url: string;
}) => string | null;
export declare const validateJsonLd: (jsonLd: JsonLdTypes) => string[];
export declare const validateSEO: (options: SEOptions) => SEOValidationResult;
export declare const auditSEO: (options: SEOptions) => SEOValidationResult;
/**
 * Truncate text to fit within SEO best practices
 */
export declare const truncateForSEO: {
    title: (text: string) => string;
    description: (text: string) => string;
};
/**
 * Generate a slug from text for URL-friendly content
 */
export declare const generateSlug: (text: string) => string;
//# sourceMappingURL=validators.d.ts.map