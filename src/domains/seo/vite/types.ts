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

export interface HreflangAlternate {
  lang: string;
  href: string;
}

export interface RouteMeta {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  canonical?: string;
  robots?: string;
  lang?: string;
  alternates?: HreflangAlternate[];
  og?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
    siteName?: string;
    locale?: string;
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
  bodyHtml?: string;
}

export interface PrerenderOptions {
  routes?: Record<string, RouteMeta>;
  fallbackMeta?: RouteMeta;
}

export type DynamicRouteSource =
  | Array<string | SitemapRouteItem>
  | (() => Array<string | SitemapRouteItem> | Promise<Array<string | SitemapRouteItem>>);

export interface ViteSEOPluginOptions {
  siteUrl: string;
  routes?: Array<string | SitemapRouteItem>;
  dynamicRoutes?: DynamicRouteSource;
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
