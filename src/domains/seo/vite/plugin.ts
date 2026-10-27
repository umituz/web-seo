/**
 * Vite SEO Plugin
 *
 * Build-time SEO asset generator. Emits `sitemap.xml` and `robots.txt`
 * as Vite bundle assets so they land in the build output automatically.
 */

import type { Plugin, ResolvedConfig } from "vite";
import { generateRobotsTxt } from "./robots-generator.js";
import { discoverRoutesFromBuild, generateSitemapXML, type SitemapURL } from "./sitemap-generator.js";
import type { ViteSEOPluginOptions } from "./types.js";

const PLUGIN_NAME = "umituz-web-seo";

export const viteSEOPlugin = (options: ViteSEOPluginOptions): Plugin => {
  const {
    siteUrl,
    routes: manualRoutes = [],
    discoverRoutes = false,
    sitemap: sitemapOptions = {},
    robotsTxt: robotsOptions = {},
    silent = false,
  } = options;

  const sitemapFilename = sitemapOptions.filename ?? "sitemap.xml";
  const robotsFilename = robotsOptions.filename ?? "robots.txt";
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");

  const pluginState: { publicDir?: string; outDir?: string } = {};

  return {
    name: PLUGIN_NAME,
    enforce: "post",

    configResolved(config: ResolvedConfig) {
      pluginState.publicDir = config.publicDir;
      pluginState.outDir = config.build.outDir;
    },

    generateBundle() {
      const outDir = pluginState.outDir ?? "dist";

      let routes = [...manualRoutes];
      if (discoverRoutes) {
        const discovered = discoverRoutesFromBuild(outDir);
        routes = Array.from(new Set([...routes, ...discovered]));
      }
      if (routes.length === 0) routes.push("/");

      const sitemapUrls: SitemapURL[] = routes.map((route) => ({
        loc: `${normalizedSiteUrl}${route}`,
        lastmod: sitemapOptions.lastmod,
        changefreq: sitemapOptions.changefreq,
        priority: sitemapOptions.priority,
      }));

      this.emitFile({
        type: "asset",
        fileName: sitemapFilename,
        source: generateSitemapXML(sitemapUrls),
      });

      this.emitFile({
        type: "asset",
        fileName: robotsFilename,
        source: generateRobotsTxt({
          siteUrl,
          ...robotsOptions,
          sitemap: robotsOptions.sitemap ?? `${normalizedSiteUrl}/${sitemapFilename}`,
        }),
      });
    },

    closeBundle() {
      if (silent) return;
      console.log(`\n${"=".repeat(50)}`);
      console.log("SEO files generated:");
      console.log(`   ${sitemapFilename}`);
      console.log(`   ${robotsFilename}`);
      console.log(`${"=".repeat(50)}\n`);
    },
  };
};

export default viteSEOPlugin;
