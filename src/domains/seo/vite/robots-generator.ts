/**
 * robots.txt generation.
 */

import type { ViteSEOPluginOptions } from "./types.js";

type RobotsOptions = ViteSEOPluginOptions["robotsTxt"] & { siteUrl: string };

export const generateRobotsTxt = (options: RobotsOptions): string => {
  if (!options) return "";

  const lines: string[] = [];

  if (typeof options.userAgent === "string") {
    lines.push(`User-agent: ${options.userAgent}`);
  } else if (typeof options.userAgent === "object" && options.userAgent !== null) {
    for (const [agent, rules] of Object.entries(options.userAgent)) {
      lines.push(`User-agent: ${agent}`);
      for (const rule of rules) lines.push(rule);
    }
  } else {
    lines.push("User-agent: *");
  }

  if (options.disallow) {
    const rules = Array.isArray(options.disallow) ? options.disallow : [options.disallow];
    for (const rule of rules) lines.push(`Disallow: ${rule}`);
  }
  if (options.allow) {
    const rules = Array.isArray(options.allow) ? options.allow : [options.allow];
    for (const rule of rules) lines.push(`Allow: ${rule}`);
  }
  if (options.crawlDelay) lines.push(`Crawl-delay: ${options.crawlDelay}`);
  if (options.sitemap)   lines.push(`Sitemap: ${options.sitemap}`);

  return lines.join("\n") + "\n";
};
