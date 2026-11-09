import fs from "node:fs";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { generateRobotsTxt } from "./robots-generator.js";
import { discoverRoutesFromBuild, generateSitemapXML, type SitemapURL } from "./sitemap-generator.js";
import { injectRouteMeta } from "./html-rewriter.js";
import type { ViteSEOPluginOptions } from "./types.js";

const PLUGIN_NAME = "umituz-web-seo";

export const viteSEOPlugin = (options: ViteSEOPluginOptions): Plugin => {
  const {
    siteUrl,
    routes: manualRoutes = [],
    discoverRoutes = false,
    sitemap: sitemapOptions = {},
    robotsTxt: robotsOptions = {},
    prerender,
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
      const outDir = pluginState.outDir ?? "dist";
      const generatedHtmlPages: string[] = [];

      if (prerender?.routes && Object.keys(prerender.routes).length > 0) {
        const indexPath = path.resolve(outDir, "index.html");
        if (fs.existsSync(indexPath)) {
          const templateHtml = fs.readFileSync(indexPath, "utf-8");

          for (const [routePath, routeMeta] of Object.entries(prerender.routes)) {
            const mergedMeta = { ...prerender.fallbackMeta, ...routeMeta };
            const renderedHtml = injectRouteMeta(
              templateHtml,
              mergedMeta,
              normalizedSiteUrl,
              routePath
            );

            const cleanPath = routePath.replace(/^\/+/, "").replace(/\/+$/, "");
            if (cleanPath === "") {
              fs.writeFileSync(indexPath, renderedHtml, "utf-8");
              generatedHtmlPages.push("index.html");
            } else {
              const targetDir = path.resolve(outDir, cleanPath);
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }
              const targetFile = path.resolve(targetDir, "index.html");
              fs.writeFileSync(targetFile, renderedHtml, "utf-8");
              const directHtmlFile = path.resolve(outDir, `${cleanPath}.html`);
              fs.writeFileSync(directHtmlFile, renderedHtml, "utf-8");
              generatedHtmlPages.push(`${cleanPath}/index.html`);
            }
          }
        }
      }

      if (silent) return;
      console.log(`\n${"=".repeat(50)}`);
      console.log("SEO files generated:");
      console.log(`   ${sitemapFilename}`);
      console.log(`   ${robotsFilename}`);
      if (generatedHtmlPages.length > 0) {
        console.log(`Pre-rendered HTML routes (${generatedHtmlPages.length}):`);
        generatedHtmlPages.forEach((p) => console.log(`   ${p}`));
      }
      console.log(`${"=".repeat(50)}\n`);
    },
  };
};

export default viteSEOPlugin;
