/**
 * SEO tag strategies (Strategy pattern).
 *
 * One strategy per concern. The same strategy is consumed by:
 *   - `dom/dom-mutator.ts`     – applies the change to the live DOM
 *   - `ssr/renderer.ts`        – serializes the change to an HTML string
 *
 * Replaces the historical god-functions in `dom.ts` and `renderer.ts` and
 * fixes the divergence where SSR silently dropped OG image width/height.
 */

import type { RobotsDirective, RobotsMeta, SEOptions } from "../types/index.js";
import { escapeHTML, escapeJSONForScript } from "./escape.js";
import type { Strategy } from "./seo-strategy.js";

const ATTR = {
  rel: "rel",
  href: "href",
  type: "type",
  sizes: "sizes",
  media: "media",
  as: "as",
  crossorigin: "crossorigin",
  hreflang: "hreflang",
  color: "color",
} as const;

const robotsDirectivesToMeta = (directives: RobotsDirective[]): RobotsMeta => {
  const meta: RobotsMeta = {};
  for (const directive of directives) {
    switch (directive) {
      case "index":             meta.index = true; break;
      case "noindex":           meta.index = false; break;
      case "follow":            meta.follow = true; break;
      case "nofollow":          meta.follow = false; break;
      case "noarchive":         meta.archive = false; break;
      case "nosnippet":         meta.snippet = false; break;
      case "notranslate":       meta.translate = false; break;
      case "noimageindex":      meta.imageIndex = false; break;
      // "unavailable_after" needs a date and is exposed via RobotsMeta only.
    }
  }
  return meta;
};

const robotsMetaToString = (robots: RobotsMeta | RobotsDirective[]): string => {
  if (Array.isArray(robots)) {
    return robots.join(", ");
  }

  const directives: string[] = [];
  const push = (cond: boolean | undefined, yes: string, no: string) => {
    if (cond === undefined) return;
    directives.push(cond ? yes : no);
  };
  push(robots.index,        "index",        "noindex");
  push(robots.follow,       "follow",       "nofollow");
  push(robots.archive,      "all",          "noarchive");
  push(robots.snippet,      "all",          "nosnippet");
  push(robots.translate,    "all",          "notranslate");
  push(robots.imageIndex,   "all",          "noimageindex");

  if (robots.maxSnippet !== undefined)     directives.push(`max-snippet:${robots.maxSnippet}`);
  if (robots.maxImagePreview !== undefined) directives.push(`max-image-preview:${robots.maxImagePreview}`);
  if (robots.maxVideoPreview !== undefined)  directives.push(`max-video-preview:${robots.maxVideoPreview}`);
  if (robots.unavailableAfter !== undefined) directives.push(`unavailable_after:${robots.unavailableAfter}`);

  return directives.join(", ");
};

// ============================================================================
// Title
// ============================================================================

export const titleStrategy: Strategy = {
  id: "title",
  applies: (o) => Boolean(o.title || o.titleTemplate),
  applyDOM: (o) => {
    const value = o.titleTemplate ? o.titleTemplate.replace("%s", o.title ?? "") : o.title;
    if (value) document.title = value;
  },
  applyHTML: (o, ctx) => {
    const value = o.titleTemplate ? o.titleTemplate.replace("%s", o.title ?? "") : o.title;
    ctx.meta.unshift(`<title>${escapeHTML(value ?? "")}</title>`);
  },
};

// ============================================================================
// Language
// ============================================================================

export const langStrategy: Strategy = {
  id: "lang",
  applies: (o) => Boolean(o.lang),
  applyDOM: (o) => {
    if (o.lang) document.documentElement.lang = o.lang;
  },
  applyHTML: (o, ctx) => {
    // <html lang> is emitted by the renderer wrapper, but we expose lang
    // through a special sentinel line that the head wrapper reads.
    if (o.lang) ctx.meta.push(`<!-- lang:${o.lang} -->`);
  },
};

// ============================================================================
// Description
// ============================================================================

export const descriptionStrategy: Strategy = {
  id: "description",
  applies: (o) => Boolean(o.description),
  applyDOM: (o, ctx) => {
    if (o.description) ctx.setMeta("description", o.description);
  },
  applyHTML: (o, ctx) => {
    if (o.description) ctx.meta.push(`<meta name="description" content="${escapeHTML(o.description)}" />`);
  },
};

// ============================================================================
// Canonical
// ============================================================================

export const canonicalStrategy: Strategy = {
  id: "canonical",
  applies: (o) => Boolean(o.canonical),
  applyDOM: (o, ctx) => {
    if (o.canonical) ctx.setLink({ [ATTR.rel]: "canonical", [ATTR.href]: o.canonical });
  },
  applyHTML: (o, ctx) => {
    if (o.canonical) ctx.link.push(`<link rel="canonical" href="${escapeHTML(o.canonical)}" />`);
  },
};

// ============================================================================
// Robots
// ============================================================================

export const robotsStrategy: Strategy = {
  id: "robots",
  applies: (o) => o.robots !== undefined,
  applyDOM: (o, ctx) => {
    if (o.robots === undefined) return;
    const meta = Array.isArray(o.robots) ? robotsDirectivesToMeta(o.robots) : o.robots;
    ctx.setMeta("robots", robotsMetaToString(meta));
  },
  applyHTML: (o, ctx) => {
    if (o.robots === undefined) return;
    const meta = Array.isArray(o.robots) ? robotsDirectivesToMeta(o.robots) : o.robots;
    ctx.meta.push(`<meta name="robots" content="${escapeHTML(robotsMetaToString(meta))}" />`);
  },
};

// ============================================================================
// Viewport
// ============================================================================

export const viewportStrategy: Strategy = {
  id: "viewport",
  applies: (o) => Boolean(o.viewport),
  applyDOM: (o, ctx) => {
    if (o.viewport) ctx.setMeta("viewport", o.viewport);
  },
  applyHTML: (o, ctx) => {
    if (o.viewport) ctx.meta.push(`<meta name="viewport" content="${escapeHTML(o.viewport)}" />`);
  },
};

// ============================================================================
// Theme color
// ============================================================================

export const themeColorStrategy: Strategy = {
  id: "theme-color",
  applies: (o) => Boolean(o.themeColor),
  applyDOM: (o, ctx) => {
    if (o.themeColor) ctx.setMeta("theme-color", o.themeColor);
  },
  applyHTML: (o, ctx) => {
    if (o.themeColor) ctx.meta.push(`<meta name="theme-color" content="${escapeHTML(o.themeColor)}" />`);
  },
};

// ============================================================================
// Favicons
// ============================================================================

export const faviconStrategy: Strategy = {
  id: "favicons",
  applies: (o) => Boolean(o.favicon || o.appleTouchIcon || o.maskIcon),
  applyDOM: (o, ctx) => {
    if (o.favicon)         ctx.setLink({ [ATTR.rel]: "icon", [ATTR.type]: "image/x-icon", [ATTR.href]: o.favicon });
    if (o.appleTouchIcon)  ctx.setLink({ [ATTR.rel]: "apple-touch-icon", [ATTR.sizes]: "180x180", [ATTR.href]: o.appleTouchIcon });
    if (o.maskIcon)        ctx.setLink({ [ATTR.rel]: "mask-icon", [ATTR.href]: o.maskIcon });
  },
  applyHTML: (o, ctx) => {
    if (o.favicon)        ctx.link.push(`<link rel="icon" type="image/x-icon" href="${escapeHTML(o.favicon)}" />`);
    if (o.appleTouchIcon) ctx.link.push(`<link rel="apple-touch-icon" sizes="180x180" href="${escapeHTML(o.appleTouchIcon)}" />`);
    if (o.maskIcon)       ctx.link.push(`<link rel="mask-icon" href="${escapeHTML(o.maskIcon)}" />`);
  },
};

// ============================================================================
// Hreflang
// ============================================================================

export const hreflangStrategy: Strategy = {
  id: "hreflang",
  applies: (o) => Boolean(o.hreflang && o.hreflang.length > 0),
  applyDOM: (o, ctx) => {
    if (!o.hreflang) return;
    // Drop stale hreflang tags first.
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    for (const entry of o.hreflang) {
      ctx.setLink({ [ATTR.rel]: "alternate", [ATTR.hreflang]: entry.lang, [ATTR.href]: entry.url });
    }
  },
  applyHTML: (o, ctx) => {
    if (!o.hreflang) return;
    for (const entry of o.hreflang) {
      ctx.link.push(
        `<link rel="alternate" hreflang="${escapeHTML(entry.lang)}" href="${escapeHTML(entry.url)}" />`
      );
    }
  },
};

// ============================================================================
// Preload / Preconnect / DNS prefetch
// ============================================================================

const buildPreloadAttrs = (preload: NonNullable<SEOptions["preload"]>[number]): Record<string, string> => {
  const attrs: Record<string, string> = { [ATTR.rel]: "preload", [ATTR.href]: preload.href, [ATTR.as]: preload.as };
  if (preload.type)        attrs[ATTR.type] = preload.type;
  if (preload.crossOrigin) attrs[ATTR.crossorigin] = preload.crossOrigin;
  if (preload.integrity)   attrs.integrity = preload.integrity;
  return attrs;
};

const buildPreconnectAttrs = (origin: NonNullable<SEOptions["preconnect"]>[number]): Record<string, string> => {
  const attrs: Record<string, string> = { [ATTR.rel]: "preconnect", [ATTR.href]: origin.href };
  if (origin.crossOrigin) attrs[ATTR.crossorigin] = origin.crossOrigin;
  return attrs;
};

const htmlAttrs = (attrs: Record<string, string>): string =>
  Object.entries(attrs).map(([k, v]) => `${k}="${escapeHTML(v)}"`).join(" ");

export const preloadStrategy: Strategy = {
  id: "preload",
  applies: (o) => Boolean(o.preload && o.preload.length > 0),
  applyDOM: (o, ctx) => {
    if (!o.preload) return;
    for (const preload of o.preload) {
      const existing = document.querySelector(`link[rel="preload"][href="${preload.href}"]`);
      if (existing) existing.remove();
      ctx.setLink(buildPreloadAttrs(preload));
    }
  },
  applyHTML: (o, ctx) => {
    if (!o.preload) return;
    for (const preload of o.preload) {
      ctx.link.push(`<link ${htmlAttrs(buildPreloadAttrs(preload))} />`);
    }
  },
};

export const preconnectStrategy: Strategy = {
  id: "preconnect",
  applies: (o) => Boolean(o.preconnect && o.preconnect.length > 0),
  applyDOM: (o, ctx) => {
    if (!o.preconnect) return;
    for (const origin of o.preconnect) ctx.setLink(buildPreconnectAttrs(origin));
  },
  applyHTML: (o, ctx) => {
    if (!o.preconnect) return;
    for (const origin of o.preconnect) ctx.link.push(`<link ${htmlAttrs(buildPreconnectAttrs(origin))} />`);
  },
};

export const dnsPrefetchStrategy: Strategy = {
  id: "dns-prefetch",
  applies: (o) => Boolean(o.dnsPrefetch && o.dnsPrefetch.length > 0),
  applyDOM: (o, ctx) => {
    if (!o.dnsPrefetch) return;
    for (const domain of o.dnsPrefetch) {
      ctx.setLink({ [ATTR.rel]: "dns-prefetch", [ATTR.href]: domain.href });
    }
  },
  applyHTML: (o, ctx) => {
    if (!o.dnsPrefetch) return;
    for (const domain of o.dnsPrefetch) {
      ctx.link.push(`<link rel="dns-prefetch" href="${escapeHTML(domain.href)}" />`);
    }
  },
};

// ============================================================================
// Custom meta tags
// ============================================================================

export const customMetaStrategy: Strategy = {
  id: "custom-meta",
  applies: (o) => Boolean(o.meta && o.meta.length > 0),
  applyDOM: (o, ctx) => {
    if (!o.meta) return;
    for (const m of o.meta) {
      if (m.name)      ctx.setMeta(m.name, m.content);
      else if (m.property) ctx.setMeta(m.property, m.content);
      else if (m.httpEquiv) ctx.setMeta(m.httpEquiv, m.content);
    }
  },
  applyHTML: (o, ctx) => {
    if (!o.meta) return;
    for (const m of o.meta) {
      if (m.name)         ctx.meta.push(`<meta name="${escapeHTML(m.name)}" content="${escapeHTML(m.content)}" />`);
      else if (m.property) ctx.meta.push(`<meta property="${escapeHTML(m.property)}" content="${escapeHTML(m.content)}" />`);
      else if (m.httpEquiv) ctx.meta.push(`<meta http-equiv="${escapeHTML(m.httpEquiv)}" content="${escapeHTML(m.content)}" />`);
    }
  },
};

// ============================================================================
// Custom link tags
// ============================================================================

export const customLinkStrategy: Strategy = {
  id: "custom-link",
  applies: (o) => Boolean(o.link && o.link.length > 0),
  applyDOM: (o, ctx) => {
    if (!o.link) return;
    for (const link of o.link) {
      const attrs: Record<string, string> = { [ATTR.rel]: link.rel, [ATTR.href]: link.href };
      if (link.type)        attrs[ATTR.type] = link.type;
      if (link.sizes)       attrs[ATTR.sizes] = link.sizes;
      if (link.media)       attrs[ATTR.media] = link.media;
      if (link.crossOrigin) attrs[ATTR.crossorigin] = link.crossOrigin;
      if (link.as)          attrs[ATTR.as] = link.as;
      ctx.setLink(attrs);
    }
  },
  applyHTML: (o, ctx) => {
    if (!o.link) return;
    for (const link of o.link) {
      const attrs: Record<string, string> = { [ATTR.rel]: link.rel, [ATTR.href]: link.href };
      if (link.type)        attrs[ATTR.type] = link.type;
      if (link.sizes)       attrs[ATTR.sizes] = link.sizes;
      if (link.media)       attrs[ATTR.media] = link.media;
      if (link.crossOrigin) attrs[ATTR.crossorigin] = link.crossOrigin;
      if (link.as)          attrs[ATTR.as] = link.as;
      ctx.link.push(`<link ${htmlAttrs(attrs)} />`);
    }
  },
};

// ============================================================================
// Open Graph
// ============================================================================

const ogProperty = (name: string, value: string | undefined, ctx: { meta: string[] }): void => {
  if (!value) return;
  ctx.meta.push(`<meta property="og:${name}" content="${escapeHTML(value)}" />`);
};

const ogImageTags = (image: NonNullable<SEOptions["openGraph"]>["image"]): { meta: string[] } => {
  const sink: { meta: string[] } = { meta: [] };
  if (!image) return sink;

  if (Array.isArray(image)) {
    // Spec: emit one <meta property="og:image" ...> per image, plus
    // per-image og:image:width / :height / :alt / :type.
    for (const img of image) {
      ogProperty("image", img.url, sink);
      if (img.width)  ogProperty("image:width",  String(img.width), sink);
      if (img.height) ogProperty("image:height", String(img.height), sink);
      if (img.alt)    ogProperty("image:alt",    img.alt, sink);
      if (img.type)   ogProperty("image:type",   img.type, sink);
      if (img.secureUrl) ogProperty("image:secure_url", img.secureUrl, sink);
    }
  } else {
    ogProperty("image", image, sink);
  }
  return sink;
};

export const openGraphStrategy: Strategy = {
  id: "open-graph",
  applies: (o) => Boolean(o.openGraph),
  applyDOM: (o, ctx) => {
    const og = o.openGraph;
    if (!og) return;

    if (og.title)        ctx.setMeta("og:title", og.title);
    if (og.description)  ctx.setMeta("og:description", og.description);
    if (og.url)          ctx.setMeta("og:url", og.url);
    if (og.type)         ctx.setMeta("og:type", og.type);
    if (og.siteName)     ctx.setMeta("og:site_name", og.siteName);
    if (og.locale)       ctx.setMeta("og:locale", og.locale);

    if (og.image) {
      if (Array.isArray(og.image)) {
        for (const img of og.image) {
          ctx.setMeta("og:image", img.url);
          if (img.secureUrl) ctx.setMeta("og:image:secure_url", img.secureUrl);
          if (img.type)      ctx.setMeta("og:image:type", img.type);
          if (img.width)     ctx.setMeta("og:image:width", String(img.width));
          if (img.height)    ctx.setMeta("og:image:height", String(img.height));
          if (img.alt)       ctx.setMeta("og:image:alt", img.alt);
        }
      } else {
        ctx.setMeta("og:image", og.image);
      }
    }

    if (og.alternateLocale) {
      og.alternateLocale.forEach((locale, index) => {
        ctx.setMeta(`og:locale:alternate${index > 0 ? `:${index}` : ""}`, locale);
      });
    }

    if (og.type === "article" && og.article) {
      ctx.setMeta("og:article:published_time",  og.article.publishedTime);
      ctx.setMeta("og:article:modified_time",   og.article.modifiedTime);
      ctx.setMeta("og:article:expiration_time", og.article.expirationTime);
      ctx.setMeta("og:article:author",          og.article.author);
      ctx.setMeta("og:article:section",         og.article.section);
      og.article.tag?.forEach((tag, index) => {
        ctx.setMeta(`og:article:tag${index > 0 ? `:${index}` : ""}`, tag);
      });
    }

    if (og.type === "product" && og.product) {
      ctx.setMeta("og:product:price:amount",    String(og.product.price));
      ctx.setMeta("og:product:price:currency",  og.product.priceCurrency);
      ctx.setMeta("og:product:availability",    og.product.availability);
      ctx.setMeta("og:product:brand",           og.product.brand);
      ctx.setMeta("og:product:sku",             og.product.sku);
      ctx.setMeta("og:product:condition",       og.product.condition);
    }

    if (og.type === "profile") {
      ctx.setMeta("og:profile:first_name", og.firstName);
      ctx.setMeta("og:profile:last_name",  og.lastName);
      ctx.setMeta("og:profile:username",   og.username);
    }

    if (og.type === "music" && og.music) {
      ctx.setMeta("og:music:album",         og.music.album);
      ctx.setMeta("og:music:musician",      og.music.musician);
      ctx.setMeta("og:music:song",          og.music.song);
      ctx.setMeta("og:music:release_date",  og.music.releaseDate);
      ctx.setMeta("og:music:duration",      og.music.duration);
      ctx.setMeta("og:music:creator",       og.music.creator);
    }
  },
  applyHTML: (o, ctx) => {
    const og = o.openGraph;
    if (!og) return;

    ogProperty("title", og.title, ctx);
    ogProperty("description", og.description, ctx);
    ogProperty("url", og.url, ctx);
    ogProperty("type", og.type, ctx);
    ogProperty("site_name", og.siteName, ctx);
    ogProperty("locale", og.locale, ctx);

    const imageSink = ogImageTags(og.image);
    ctx.meta.push(...imageSink.meta);

    og.alternateLocale?.forEach((locale, index) => {
      ctx.meta.push(`<meta property="og:locale:alternate${index > 0 ? `:${index}` : ""}" content="${escapeHTML(locale)}" />`);
    });

    if (og.type === "article" && og.article) {
      ogProperty("article:published_time",  og.article.publishedTime, ctx);
      ogProperty("article:modified_time",   og.article.modifiedTime, ctx);
      ogProperty("article:expiration_time", og.article.expirationTime, ctx);
      ogProperty("article:author",          og.article.author, ctx);
      ogProperty("article:section",         og.article.section, ctx);
      og.article.tag?.forEach((tag, index) => {
        ctx.meta.push(`<meta property="og:article:tag${index > 0 ? `:${index}` : ""}" content="${escapeHTML(tag)}" />`);
      });
    }

    if (og.type === "product" && og.product) {
      ogProperty("product:price:amount",   String(og.product.price), ctx);
      ogProperty("product:price:currency", og.product.priceCurrency, ctx);
      ogProperty("product:availability",   og.product.availability, ctx);
      ogProperty("product:brand",          og.product.brand, ctx);
      ogProperty("product:sku",            og.product.sku, ctx);
      ogProperty("product:condition",      og.product.condition, ctx);
    }

    if (og.type === "profile") {
      ogProperty("profile:first_name", og.firstName, ctx);
      ogProperty("profile:last_name",  og.lastName, ctx);
      ogProperty("profile:username",   og.username, ctx);
    }

    if (og.type === "music" && og.music) {
      ogProperty("music:album",        og.music.album, ctx);
      ogProperty("music:musician",     og.music.musician, ctx);
      ogProperty("music:song",         og.music.song, ctx);
      ogProperty("music:release_date", og.music.releaseDate, ctx);
      ogProperty("music:duration",     og.music.duration, ctx);
      ogProperty("music:creator",      og.music.creator, ctx);
    }
  },
};

// ============================================================================
// Twitter Card
// ============================================================================

/**
 * Twitter cards should fall back to OpenGraph values for the common
 * title/description/image fields when those are omitted. We only pick
 * the overlapping fields — Twitter has no concept of OG's `firstName`,
 * `product`, etc.
 */
const twitterFallback = (
  twitter: NonNullable<SEOptions["twitter"]>,
  openGraph: SEOptions["openGraph"]
): NonNullable<SEOptions["twitter"]> => ({
  cardType: twitter.cardType,
  site: twitter.site,
  handle: twitter.handle,
  title: twitter.title ?? openGraph?.title,
  description: twitter.description ?? openGraph?.description,
  image: twitter.image ?? (typeof openGraph?.image === "string" ? openGraph.image : undefined),
  imageAlt: twitter.imageAlt,
  player: twitter.player,
  playerWidth: twitter.playerWidth,
  playerHeight: twitter.playerHeight,
  playerStream: twitter.playerStream,
  playerStreamContentType: twitter.playerStreamContentType,
  app: twitter.app,
});

export const twitterStrategy: Strategy = {
  id: "twitter",
  applies: (o) => Boolean(o.twitter),
  applyDOM: (o, ctx) => {
    if (!o.twitter) return;
    const tw = twitterFallback(o.twitter, o.openGraph);
    if (tw.cardType)    ctx.setMeta("twitter:card", tw.cardType);
    if (tw.site)        ctx.setMeta("twitter:site", tw.site);
    if (tw.handle)      ctx.setMeta("twitter:creator", tw.handle);
    if (tw.title)       ctx.setMeta("twitter:title", tw.title);
    if (tw.description) ctx.setMeta("twitter:description", tw.description);
    if (tw.image)       ctx.setMeta("twitter:image", tw.image);
    if (tw.imageAlt)    ctx.setMeta("twitter:image:alt", tw.imageAlt);

    if (tw.cardType === "player") {
      ctx.setMeta("twitter:player", tw.player);
      ctx.setMeta("twitter:player:width", tw.playerWidth);
      ctx.setMeta("twitter:player:height", tw.playerHeight);
      ctx.setMeta("twitter:player:stream", tw.playerStream);
      ctx.setMeta("twitter:player:stream:content_type", tw.playerStreamContentType);
    }

    if (tw.app?.iphone) {
      ctx.setMeta("twitter:app:name:iphone", tw.app.iphone.name);
      ctx.setMeta("twitter:app:id:iphone",   tw.app.iphone.id);
      ctx.setMeta("twitter:app:url:iphone",  tw.app.iphone.url);
    }
    if (tw.app?.ipad) {
      ctx.setMeta("twitter:app:name:ipad", tw.app.ipad.name);
      ctx.setMeta("twitter:app:id:ipad",   tw.app.ipad.id);
      ctx.setMeta("twitter:app:url:ipad",  tw.app.ipad.url);
    }
    if (tw.app?.googleplay) {
      ctx.setMeta("twitter:app:name:googleplay", tw.app.googleplay.name);
      ctx.setMeta("twitter:app:id:googleplay",   tw.app.googleplay.id);
      ctx.setMeta("twitter:app:url:googleplay",  tw.app.googleplay.url);
    }
  },
  applyHTML: (o, ctx) => {
    if (!o.twitter) return;
    const tw = twitterFallback(o.twitter, o.openGraph);
    const push = (name: string, value: string | undefined) => {
      if (value) ctx.meta.push(`<meta name="twitter:${name}" content="${escapeHTML(value)}" />`);
    };
    push("card",        tw.cardType);
    push("site",        tw.site);
    push("creator",     tw.handle);
    push("title",       tw.title);
    push("description", tw.description);
    push("image",       tw.image);
    push("image:alt",   tw.imageAlt);

    if (tw.cardType === "player") {
      push("player",                    tw.player);
      push("player:width",              tw.playerWidth);
      push("player:height",             tw.playerHeight);
      push("player:stream",             tw.playerStream);
      push("player:stream:content_type", tw.playerStreamContentType);
    }

    if (tw.app?.iphone) {
      push("app:name:iphone", tw.app.iphone.name);
      push("app:id:iphone",   tw.app.iphone.id);
      push("app:url:iphone",  tw.app.iphone.url);
    }
    if (tw.app?.ipad) {
      push("app:name:ipad", tw.app.ipad.name);
      push("app:id:ipad",   tw.app.ipad.id);
      push("app:url:ipad",  tw.app.ipad.url);
    }
    if (tw.app?.googleplay) {
      push("app:name:googleplay", tw.app.googleplay.name);
      push("app:id:googleplay",   tw.app.googleplay.id);
      push("app:url:googleplay",  tw.app.googleplay.url);
    }
  },
};

// ============================================================================
// JSON-LD
// ============================================================================

export const jsonLdStrategy: Strategy = {
  id: "json-ld",
  applies: (o) => Boolean(o.jsonLd && o.jsonLd.length > 0),
  applyDOM: () => {
    // JSON-LD injection is owned by the JsonLd component / useJsonLd hook
    // because each <script> needs a stable id, conflict resolution, and
    // cleanup on unmount. A strategy that "applies" it would have to
    // duplicate all of that logic, so we no-op here intentionally.
  },
  applyHTML: (o, ctx) => {
    if (!o.jsonLd) return;
    for (const data of o.jsonLd) {
      ctx.jsonLd.push(
        `<script type="application/ld+json">${escapeJSONForScript(JSON.stringify(data))}</script>`
      );
    }
  },
};

// ============================================================================
// Registry
// ============================================================================

export const SEO_STRATEGIES: readonly Strategy[] = Object.freeze([
  titleStrategy,
  descriptionStrategy,
  canonicalStrategy,
  robotsStrategy,
  viewportStrategy,
  themeColorStrategy,
  faviconStrategy,
  hreflangStrategy,
  preloadStrategy,
  preconnectStrategy,
  dnsPrefetchStrategy,
  customMetaStrategy,
  customLinkStrategy,
  openGraphStrategy,
  twitterStrategy,
  jsonLdStrategy,
]);
