
export interface ViteSEOPluginOptions {
  siteUrl: string;
  routes?: string[];
  discoverRoutes?: boolean;
  sitemap?: {
    filename?: string;
    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority?: number;
    lastmod?: string;
  };
  robotsTxt?: {
    filename?: string;
    userAgent?: string | Record<string, string[]>;
    disallow?: string | string[];
    allow?: string | string[];
    sitemap?: string;
    crawlDelay?: number;
  };
  silent?: boolean;
}
