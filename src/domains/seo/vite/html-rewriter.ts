import type { RouteMeta } from "./types.js";

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const escapeRegex = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const upsertTag = (
  html: string,
  regex: RegExp,
  newTag: string
): string => {
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  const headClosingIndex = html.toLowerCase().indexOf("</head>");
  if (headClosingIndex !== -1) {
    return `${html.slice(0, headClosingIndex)}    ${newTag}\n  ${html.slice(headClosingIndex)}`;
  }
  return `${html}\n${newTag}`;
};

const upsertMetaTag = (
  html: string,
  attributeName: "name" | "property",
  attributeValue: string,
  content: string
): string => {
  const safeAttrValue = escapeRegex(attributeValue);
  const regex = new RegExp(
    `<meta\\s+[^>]*?${attributeName}=["']${safeAttrValue}["'][^>]*?\\/?>`,
    "i"
  );
  const newTag = `<meta ${attributeName}="${attributeValue}" content="${escapeHtml(content)}" />`;
  return upsertTag(html, regex, newTag);
};

const replaceRootContent = (html: string, newContent: string): string => {
  const rootMatch = html.match(/<div\s+[^>]*?id=["']root["'][^>]*>/i);
  if (!rootMatch || rootMatch.index === undefined) return html;

  const startIdx = rootMatch.index + rootMatch[0].length;
  let depth = 1;
  let pos = startIdx;

  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", pos);
    const nextClose = html.indexOf("</div>", pos);

    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) {
        return `${html.slice(0, startIdx)}\n${newContent}\n    ${html.slice(nextClose)}`;
      }
      pos = nextClose + 6;
    }
  }

  return html;
};

export const injectRouteMeta = (
  htmlTemplate: string,
  meta: RouteMeta,
  siteUrl: string,
  routePath: string
): string => {
  let html = htmlTemplate;

  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const normalizedRoutePath = routePath.startsWith("/") ? routePath : `/${routePath}`;
  const canonicalUrl =
    meta.canonical ??
    `${normalizedSiteUrl}${normalizedRoutePath === "/" ? "" : normalizedRoutePath}`;

  if (meta.lang) {
    const htmlTagRegex = /<html([^>]*)>/i;
    const match = html.match(htmlTagRegex);
    if (match) {
      let attrs = match[1];
      if (/lang=["'][^"']*["']/i.test(attrs)) {
        attrs = attrs.replace(/lang=["'][^"']*["']/i, `lang="${escapeHtml(meta.lang)}"`);
      } else {
        attrs = `${attrs} lang="${escapeHtml(meta.lang)}"`;
      }
      html = html.replace(htmlTagRegex, `<html${attrs}>`);
    }
  }

  if (meta.title) {
    const titleRegex = /<title[^>]*>[\s\S]*?<\/title>/i;
    const newTitle = `<title>${escapeHtml(meta.title)}</title>`;
    html = upsertTag(html, titleRegex, newTitle);
  }

  if (meta.description) {
    html = upsertMetaTag(html, "name", "description", meta.description);
  }

  if (meta.keywords) {
    const kwString = Array.isArray(meta.keywords)
      ? meta.keywords.join(", ")
      : meta.keywords;
    if (kwString) {
      html = upsertMetaTag(html, "name", "keywords", kwString);
    }
  }

  if (meta.robots) {
    html = upsertMetaTag(html, "name", "robots", meta.robots);
  }

  const canonicalRegex = /<link\s+[^>]*?rel=["']canonical["'][^>]*?\/?>/i;
  const newCanonical = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
  html = upsertTag(html, canonicalRegex, newCanonical);

  const ogTitle = meta.og?.title ?? meta.title;
  if (ogTitle) html = upsertMetaTag(html, "property", "og:title", ogTitle);

  const ogDesc = meta.og?.description ?? meta.description;
  if (ogDesc) html = upsertMetaTag(html, "property", "og:description", ogDesc);

  const ogUrl = meta.og?.url ?? canonicalUrl;
  if (ogUrl) html = upsertMetaTag(html, "property", "og:url", ogUrl);

  const ogType = meta.og?.type ?? "website";
  if (ogType) html = upsertMetaTag(html, "property", "og:type", ogType);

  if (meta.og?.siteName) {
    html = upsertMetaTag(html, "property", "og:site_name", meta.og.siteName);
  }

  if (meta.og?.image) {
    html = upsertMetaTag(html, "property", "og:image", meta.og.image);
  }

  const twCard = meta.twitter?.card ?? "summary_large_image";
  if (twCard) html = upsertMetaTag(html, "name", "twitter:card", twCard);

  const twTitle = meta.twitter?.title ?? meta.title;
  if (twTitle) html = upsertMetaTag(html, "name", "twitter:title", twTitle);

  const twDesc = meta.twitter?.description ?? meta.description;
  if (twDesc) html = upsertMetaTag(html, "name", "twitter:description", twDesc);

  const twImage = meta.twitter?.image ?? meta.og?.image;
  if (twImage) html = upsertMetaTag(html, "name", "twitter:image", twImage);

  if (meta.twitter?.site) {
    html = upsertMetaTag(html, "name", "twitter:site", meta.twitter.site);
  }

  if (meta.twitter?.creator) {
    html = upsertMetaTag(html, "name", "twitter:creator", meta.twitter.creator);
  }

  if (meta.jsonLd) {
    const jsonString = JSON.stringify(meta.jsonLd, null, 2);
    const jsonLdTag = `<script type="application/ld+json" data-seo="true">\n${jsonString}\n    </script>`;
    const existingJsonLdRegex = /<script\s+[^>]*?type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i;
    html = upsertTag(html, existingJsonLdRegex, jsonLdTag);
  }

  if (meta.bodyHtml) {
    html = replaceRootContent(html, meta.bodyHtml);
  }

  return html;
};
