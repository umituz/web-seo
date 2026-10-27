/**
 * Convenience presets for common SEO setups.
 *
 * Each preset returns a fully-configured Vite plugin instance.
 */

import { viteSEOPlugin } from "./plugin.js";
import type { ViteSEOPluginOptions } from "./types.js";

const baseDisallow = ["/api", "/admin"];
const blogDisallow = [...baseDisallow, "/private"];
const ecommerceDisallow = [...baseDisallow, "/cart", "/checkout", "/account"];

const withRoutes = (routes?: string[]): string[] => ["/", ...(routes ?? [])];

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
} as const;

export type QuickSetupKey = keyof typeof quickSEOSetup;

/** Re-export so plugin.ts can satisfy Vite's plugin shape without a circular import. */
export type { ViteSEOPluginOptions };
