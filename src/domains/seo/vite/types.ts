/**
 * Public types for the Vite plugin.
 */

export interface ViteSEOPluginOptions {
  /** Base URL of your site (e.g., https://example.com) */
  siteUrl: string;
  /** Array of routes to include in sitemap */
  routes?: string[];
  /** Automatically discover routes from build output */
  discoverRoutes?: boolean;
  /** Sitemap options */
  sitemap?: {
    filename?: string;
    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority?: number;
    lastmod?: string;
  };
  /** Robots.txt options */
  robotsTxt?: {
    filename?: string;
    userAgent?: string | Record<string, string[]>;
    disallow?: string | string[];
    allow?: string | string[];
    sitemap?: string;
    crawlDelay?: number;
  };
  /** Suppress console output */
  silent?: boolean;
}
