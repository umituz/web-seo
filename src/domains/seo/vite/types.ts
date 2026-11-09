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

export interface RouteMeta {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  canonical?: string;
  robots?: string;
  lang?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
    siteName?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    site?: string;
    creator?: string;
  };
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export interface PrerenderOptions {
  routes?: Record<string, RouteMeta>;
  fallbackMeta?: RouteMeta;
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
  prerender?: PrerenderOptions;
  silent?: boolean;
}
