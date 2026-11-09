
import { viteSEOPlugin } from "./plugin.js";
import type { RouteMeta, SitemapRouteItem, ViteSEOPluginOptions } from "./types.js";

const baseDisallow = ["/api", "/admin"];
const blogDisallow = [...baseDisallow, "/private"];
const ecommerceDisallow = [...baseDisallow, "/cart", "/checkout", "/account"];
const saasDisallow = ["/api/", "/auth/"];

const withRoutes = (routes?: string[]): string[] => ["/", ...(routes ?? [])];

export interface SaasSEOOptions {
  landing?: Array<string | SitemapRouteItem>;
  prerender?: Record<string, RouteMeta>;
  brand?: string;
  image?: string;
  disallow?: string[];
}

export const saasSEOOptions = (siteUrl: string, opts: SaasSEOOptions = {}): ViteSEOPluginOptions => ({
  siteUrl,
  routes: [
    "/",
    ...(opts.landing ?? Object.keys(opts.prerender ?? { "/": {} }).filter((r) => r !== "/")),
  ],
  sitemap: { filename: "sitemap.xml" },
  robotsTxt: {
    filename: "robots.txt",
    allow: "/",
    disallow: opts.disallow ?? saasDisallow,
    sitemap: `${siteUrl}/sitemap.xml`,
  },
  prerender: {
    fallbackMeta: {
      ...(opts.brand || opts.image
        ? {
            og: {
              ...(opts.brand ? { siteName: opts.brand } : {}),
              ...(opts.image ? { image: opts.image } : {}),
            },
            ...(opts.image ? { twitter: { card: "summary_large_image", image: opts.image } } : {}),
          }
        : {}),
    },
    routes: opts.prerender ?? { "/": {} },
  },
});

export const quickSEOSetup = {
  basic: (siteUrl: string, routes?: string[]) =>
    viteSEOPlugin({
      siteUrl,
      routes,
      discoverRoutes: true,
      sitemap: { changefreq: "weekly", priority: 0.8 },
      robotsTxt: { disallow: baseDisallow },
    }),

  blog: (siteUrl: string, routes?: string[]) =>
    viteSEOPlugin({
      siteUrl,
      routes: withRoutes(routes),
      discoverRoutes: true,
      sitemap: { changefreq: "daily", priority: 0.9 },
      robotsTxt: { disallow: blogDisallow },
    }),

  ecommerce: (siteUrl: string, routes?: string[]) =>
    viteSEOPlugin({
      siteUrl,
      routes: withRoutes(routes),
      discoverRoutes: true,
      sitemap: { changefreq: "hourly", priority: 1.0 },
      robotsTxt: { disallow: ecommerceDisallow, crawlDelay: 1 },
    }),

  saas: (siteUrl: string, opts: SaasSEOOptions = {}) => viteSEOPlugin(saasSEOOptions(siteUrl, opts)),
} as const;

export type QuickSetupKey = keyof typeof quickSEOSetup;

export type { ViteSEOPluginOptions };
