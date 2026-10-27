/**
 * Sitemap XML generation.
 */

import * as fs from "fs";
import * as path from "path";

export interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

const escapeXML = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const generateSitemapXML = (urls: SitemapURL[]): string => {
  const urlElements = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXML(url.loc)}</loc>
    ${url.lastmod    ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};

/**
 * Walk the build output and collect every directory that produced an
 * `index.html`. Each one becomes a sitemap entry.
 */
export const discoverRoutesFromBuild = (outDir: string): string[] => {
  const routes = new Set<string>("/");

  const traverse = (dir: string, basePath = ""): void => {
    let files: string[];
    try {
      files = fs.readdirSync(dir);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.warn(`[vite-plugin-seo] Could not traverse ${dir}:`, error);
      }
      return;
    }

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath, path.join(basePath, file));
      } else if (file === "index.html") {
        routes.add(basePath || "/");
      }
    }
  };

  traverse(outDir);
  return Array.from(routes);
};
