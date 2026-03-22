/**
 * SEO SSR Renderer
 *
 * Server-side rendering utilities for SEO.
 * Generates HTML strings for meta tags and structured data.
 */
import type { SEOptions } from "../types/index.js";
interface RenderedMetaTag {
    toHTML(): string;
    toString(): string;
}
export interface RenderedSEO {
    /** Title tag */
    title: string;
    /** All meta tags as HTML */
    meta: string;
    /** All link tags as HTML */
    link: string;
    /** All JSON-LD scripts as HTML */
    jsonLd: string;
    /** Complete HTML head content */
    toHTML(): string;
    /** Convert to string (same as toHTML) */
    toString(): string;
}
/**
 * Render SEO options to HTML strings for server-side rendering
 */
export declare const renderSEO: (options: SEOptions) => RenderedSEO;
/**
 * Generate complete HTML head with SEO tags
 */
export declare const generateHead: (options: SEOptions) => string;
/**
 * Extract SEO data for hydration
 */
export declare const extractSEOData: (options: SEOptions) => string;
/**
 * Hydrate SEO on client side
 */
export declare const hydrateSEO: (serializedData: string) => void;
export interface HelmetData {
    base: RenderedMetaTag[];
    bodyAttributes: Record<string, string>;
    htmlAttributes: Record<string, string>;
    link: RenderedMetaTag[];
    meta: RenderedMetaTag[];
    noscript: RenderedMetaTag[];
    script: RenderedMetaTag[];
    style: RenderedMetaTag[];
    title: string;
    titleAttributes: Record<string, string>;
}
/**
 * Render SEO in Helmet-compatible format
 */
export declare const renderAsHelmet: (options: SEOptions) => HelmetData;
export {};
//# sourceMappingURL=renderer.d.ts.map