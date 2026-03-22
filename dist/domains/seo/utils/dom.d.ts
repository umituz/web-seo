/**
 * SEO DOM Utilities
 *
 * Core utilities for manipulating DOM elements related to SEO.
 * Handles meta tags, link tags, structured data, and performance hints.
 */
import type { SEOptions, MetaTag, LinkTag } from "../types/index.js";
export declare const updateSEO: (options: SEOptions) => void;
/**
 * Remove all SEO meta tags added by this library
 */
export declare const clearSEO: () => void;
/**
 * Get current SEO state from DOM
 */
export declare const getCurrentSEOState: () => {
    title: string;
    lang: string;
    metaTags: MetaTag[];
    linkTags: LinkTag[];
} | null;
//# sourceMappingURL=dom.d.ts.map