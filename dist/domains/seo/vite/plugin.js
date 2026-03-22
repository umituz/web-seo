/**
 * Vite SEO Plugin
 *
 * Build-time SEO optimization plugin for Vite applications.
 * Generates sitemap.xml, robots.txt, and other SEO assets.
 */
import * as fs from "fs";
import * as path from "path";
const generateSitemapXML = (urls) => {
    const urlElements = urls
        .map((url) => `  <url>
    <loc>${escapeXML(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`)
        .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};
const escapeXML = (str) => {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};
// ============================================================================
// Robots.txt Generation
// ============================================================================
const generateRobotsTxt = (options) => {
    const lines = [];
    if (!options)
        return "";
    // User-agent
    if (typeof options.userAgent === "string") {
        lines.push(`User-agent: ${options.userAgent}`);
    }
    else if (typeof options.userAgent === "object") {
        Object.entries(options.userAgent).forEach(([agent, rules]) => {
            lines.push(`User-agent: ${agent}`);
            rules.forEach((rule) => lines.push(rule));
        });
    }
    else {
        lines.push("User-agent: *");
    }
    // Disallow
    if (options.disallow) {
        const disallowRules = Array.isArray(options.disallow) ? options.disallow : [options.disallow];
        disallowRules.forEach((rule) => lines.push(`Disallow: ${rule}`));
    }
    // Allow
    if (options.allow) {
        const allowRules = Array.isArray(options.allow) ? options.allow : [options.allow];
        allowRules.forEach((rule) => lines.push(`Allow: ${rule}`));
    }
    // Crawl delay
    if (options.crawlDelay) {
        lines.push(`Crawl-delay: ${options.crawlDelay}`);
    }
    // Sitemap
    if (options.sitemap) {
        lines.push(`Sitemap: ${options.sitemap}`);
    }
    return lines.join("\n") + "\n";
};
// ============================================================================
// Route Discovery
// ============================================================================
const discoverRoutesFromBuild = (outDir) => {
    const routes = new Set("/");
    const traverseDirectory = (dir, basePath = "") => {
        try {
            const files = fs.readdirSync(dir);
            files.forEach((file) => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    traverseDirectory(fullPath, path.join(basePath, file));
                }
                else if (file === "index.html") {
                    routes.add(basePath || "/");
                }
            });
        }
        catch (error) {
            // Directory doesn't exist or isn't accessible yet
        }
    };
    traverseDirectory(outDir);
    return Array.from(routes);
};
// ============================================================================
// Main Plugin
// ============================================================================
export const viteSEOPlugin = (options) => {
    const { siteUrl, routes: manualRoutes = [], discoverRoutes = false, sitemap: sitemapOptions = {}, robotsTxt: robotsOptions = {}, } = options;
    const sitemapFilename = sitemapOptions.filename || "sitemap.xml";
    const robotsFilename = robotsOptions.filename || "robots.txt";
    return {
        name: "vite-plugin-seo",
        enforce: "post",
        configResolved(config) {
            // Store resolved config for later use
            this.publicDir = config.publicDir;
            this.outDir = config.build.outDir;
        },
        generateBundle(_, bundle) {
            const outDir = this.outDir || "dist";
            // Collect routes
            let routes = [...manualRoutes];
            if (discoverRoutes) {
                const discoveredRoutes = discoverRoutesFromBuild(outDir);
                routes = [...new Set([...routes, ...discoveredRoutes])];
            }
            // Ensure at least the root route
            if (routes.length === 0) {
                routes.push("/");
            }
            // Generate sitemap
            const sitemapUrls = routes.map((route) => ({
                loc: `${siteUrl.replace(/\/$/, "")}${route}`,
                lastmod: sitemapOptions.lastmod,
                changefreq: sitemapOptions.changefreq,
                priority: sitemapOptions.priority,
            }));
            const sitemapXML = generateSitemapXML(sitemapUrls);
            // Add sitemap to bundle
            this.emitFile({
                type: "asset",
                fileName: sitemapFilename,
                source: sitemapXML,
            });
            // Generate robots.txt
            const robotsTxtContent = generateRobotsTxt({
                siteUrl,
                ...robotsOptions,
                sitemap: robotsOptions.sitemap || `${siteUrl.replace(/\/$/, "")}/${sitemapFilename}`,
            });
            // Add robots.txt to bundle
            this.emitFile({
                type: "asset",
                fileName: robotsFilename,
                source: robotsTxtContent,
            });
        },
        closeBundle() {
            const outDir = this.outDir || "dist";
            // Log generated files
            console.log(`\n${"=".repeat(50)}`);
            console.log(`🚀 SEO files generated:`);
            console.log(`   📄 ${sitemapFilename}`);
            console.log(`   🤖 ${robotsFilename}`);
            console.log(`${"=".repeat(50)}\n`);
        },
    };
};
export default viteSEOPlugin;
// ============================================================================
// Convenience Exports
// ============================================================================
/**
 * Quick setup for common SEO scenarios
 */
export const quickSEOSetup = {
    /**
     * Basic setup for a simple website
     */
    basic: (siteUrl, routes) => viteSEOPlugin({
        siteUrl,
        routes,
        discoverRoutes: true,
        sitemap: {
            changefreq: "weekly",
            priority: 0.8,
        },
        robotsTxt: {
            disallow: ["/api", "/admin"],
        },
    }),
    /**
     * Setup for a blog
     */
    blog: (siteUrl, routes) => viteSEOPlugin({
        siteUrl,
        routes: ["/", routes || []].flat(),
        discoverRoutes: true,
        sitemap: {
            changefreq: "daily",
            priority: 0.9,
        },
        robotsTxt: {
            disallow: ["/api", "/admin", "/private"],
        },
    }),
    /**
     * Setup for an e-commerce site
     */
    ecommerce: (siteUrl, routes) => viteSEOPlugin({
        siteUrl,
        routes: ["/", routes || []].flat(),
        discoverRoutes: true,
        sitemap: {
            changefreq: "hourly",
            priority: 1.0,
        },
        robotsTxt: {
            disallow: ["/api", "/admin", "/cart", "/checkout", "/account"],
            crawlDelay: 1,
        },
    }),
};
