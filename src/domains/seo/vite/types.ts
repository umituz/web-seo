
export type SitemapChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapRouteItem {
  url: string;
  priority?: number;
  changefreq?: SitemapChangeFreq;
  lastmod?: string;
}

export interface ViteSEOPluginOptions {
  siteUrl: string;
  routes?: Array<string | SitemapRouteItem>;
  discoverRoutes?: boolean;
  sitemap?: {
    filename?: string;
    changefreq?: SitemapChangeFreq;
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
