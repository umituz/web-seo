/**
 * Vite SEO Plugin
 *
 * Build-time SEO optimization plugin for Vite applications.
 * Generates sitemap.xml, robots.txt, and other SEO assets.
 */
import type { Plugin } from "vite";
export interface ViteSEOPluginOptions {
    /** Base URL of your site (e.g., https://example.com) */
    siteUrl: string;
    /** Array of routes to include in sitemap */
    routes?: string[];
    /** Automatically discover routes from build output */
    discoverRoutes?: boolean;
    /** Sitemap options */
    sitemap?: {
        /** Output filename */
        filename?: string;
        /** Changefreq for all URLs */
        changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
        /** Priority for all URLs (0.0-1.0) */
        priority?: number;
        /** Last modified date */
        lastmod?: string;
    };
    /** Robots.txt options */
    robotsTxt?: {
        /** Output filename */
        filename?: string;
        /** User-agent rules */
        userAgent?: string | Record<string, string[]>;
        /** Disallow rules */
        disallow?: string | string[];
        /** Allow rules */
        allow?: string | string[];
        /** Sitemap location */
        sitemap?: string;
        /** Crawl delay */
        crawlDelay?: number;
    };
}
export declare const viteSEOPlugin: (options: ViteSEOPluginOptions) => Plugin;
export default viteSEOPlugin;
/**
 * Quick setup for common SEO scenarios
 */
export declare const quickSEOSetup: {
    /**
     * Basic setup for a simple website
     */
    basic: (siteUrl: string, routes?: string[]) => Plugin<any>;
    /**
     * Setup for a blog
     */
    blog: (siteUrl: string, routes?: string[]) => Plugin<any>;
    /**
     * Setup for an e-commerce site
     */
    ecommerce: (siteUrl: string, routes?: string[]) => Plugin<any>;
};
//# sourceMappingURL=plugin.d.ts.map