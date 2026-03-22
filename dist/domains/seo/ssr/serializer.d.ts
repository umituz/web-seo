/**
 * SEO Serializer
 *
 * Serialization utilities for SEO data.
 * Used for server-side rendering and hydration.
 */
import type { SEOptions } from "../types/index.js";
/**
 * Serialize SEO options to a string for transmission/hydration
 */
export declare const serializeSEO: (options: SEOptions) => string;
/**
 * Deserialize SEO options from a string
 */
export declare const deserializeSEO: (data: string) => SEOptions;
/**
 * Serialize SEO options to base64 for safe URL transmission
 */
export declare const serializeSEOToBase64: (options: SEOptions) => string;
/**
 * Deserialize SEO options from base64
 */
export declare const deserializeSEOFromBase64: (base64: string) => SEOptions;
interface SEOState {
    options: SEOptions;
    timestamp: number;
}
/**
 * Create SEO state with timestamp
 */
export declare const createSEOState: (options: SEOptions) => SEOState;
/**
 * Serialize SEO state
 */
export declare const serializeSEOState: (state: SEOState) => string;
/**
 * Deserialize SEO state
 */
export declare const deserializeSEOState: (data: string) => SEOState;
/**
 * Check if SEO state is stale (older than specified milliseconds)
 */
export declare const isSEOStateStale: (state: SEOState, maxAge?: number) => boolean;
/**
 * Compress SEO options using simple compression
 * Removes undefined values and empty arrays
 */
export declare const compressSEO: (options: SEOptions) => SEOptions;
/**
 * Decompress SEO options (identity function, kept for API consistency)
 */
export declare const decompressSEO: (options: SEOptions) => SEOptions;
/**
 * Serialize SEO options to URL-safe query string
 * Only includes essential SEO data for social sharing previews
 */
export declare const serializeSEOToQueryString: (options: SEOptions) => string;
/**
 * Deserialize SEO options from query string
 */
export declare const deserializeSEOFromQueryString: (queryString: string) => Partial<SEOptions>;
/**
 * Validate serialized SEO data before deserialization
 */
export declare const validateSerializedSEO: (data: string) => boolean;
/**
 * Safe deserialize with validation
 */
export declare const safeDeserializeSEO: (data: string) => SEOptions | null;
export {};
//# sourceMappingURL=serializer.d.ts.map