
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

      const routes: Array<string | import("./types.js").SitemapRouteItem> = [...manualRoutes];
      if (discoverRoutes) {
        const discovered = discoverRoutesFromBuild(outDir);
        for (const item of discovered) {
          const alreadyExists = routes.some((r) => (typeof r === "string" ? r === item : r.url === item));
          if (!alreadyExists) routes.push(item);
        }
      }
      if (routes.length === 0) routes.push("/");

      const sitemapUrls: SitemapURL[] = routes.map((entry) => {
        if (typeof entry === "string") {
          return {
            loc: `${normalizedSiteUrl}${entry}`,
            lastmod: sitemapOptions.lastmod,
            changefreq: sitemapOptions.changefreq,
            priority: sitemapOptions.priority,
          };
        }
        return {
          loc: `${normalizedSiteUrl}${entry.url}`,
          lastmod: entry.lastmod ?? sitemapOptions.lastmod,
          changefreq: entry.changefreq ?? sitemapOptions.changefreq,
          priority: entry.priority ?? sitemapOptions.priority,
        };
      });

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
