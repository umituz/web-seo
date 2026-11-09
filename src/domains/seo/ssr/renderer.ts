
import { escapeHTML } from "../core/escape.js";
import { SEO_STRATEGIES } from "../core/seo-strategies.js";
import type { HTMLContext } from "../core/seo-strategy.js";
import type { SEOptions } from "../types/index.js";
import { updateSEO } from "../utils/dom/index.js";

export interface RenderedSEO {
  title: string;
  meta: string;
  link: string;
  jsonLd: string;
  toHTML(): string;
  toString(): string;
}

const buildHTMLContext = (): HTMLContext => ({ meta: [], link: [], jsonLd: [] });

const SEPARATOR = "\n    ";

const joinTags = (ctx: HTMLContext): { meta: string; link: string; jsonLd: string } => ({
  meta: ctx.meta.join(SEPARATOR),
  link: ctx.link.join(SEPARATOR),
  jsonLd: ctx.jsonLd.join(SEPARATOR),
});

const findTitle = (meta: string): string => {
  const match = meta.match(/<title>([\s\S]*?)<\/title>/);
  return match ? match[1] ?? "" : "";
};

const stripTitle = (meta: string): string =>
  meta.replace(/<title>[\s\S]*?<\/title>\n?/, "");

export const renderSEO = (options: SEOptions): RenderedSEO => {
  const ctx = buildHTMLContext();
  for (const strategy of SEO_STRATEGIES) {
    if (!strategy.applies(options)) continue;
    strategy.applyHTML(options, ctx);
  }

  const joined = joinTags(ctx);
  const title = findTitle(joined.meta);
  const meta = stripTitle(joined.meta);

  return {
    title,
    meta,
    link: joined.link,
    jsonLd: joined.jsonLd,
    toHTML() {
      const parts: string[] = [`    <title>${this.title}</title>`];
      if (this.meta)   parts.push(`    ${this.meta}`);
      if (this.link)   parts.push(`    ${this.link}`);
      if (this.jsonLd) parts.push(`    ${this.jsonLd}`);
      return parts.join("\n");
    },
    toString() {
      return this.toHTML();
    },
  };
};

export const generateHead = (options: SEOptions): string => {
  const rendered = renderSEO(options);
  const langAttr = options.lang ? ` lang="${escapeHTML(options.lang)}"` : "";
  const indented = rendered
    .toHTML()
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
  return `  <head${langAttr}>\n${indented}\n  </head>`;
};

export const extractSEOData = (options: SEOptions): string => JSON.stringify(options);

export const hydrateSEO = (serializedData: string): void => {
  if (typeof window === "undefined") return;

  let options: SEOptions;
  try {
    options = JSON.parse(serializedData) as SEOptions;
  } catch (error) {
    console.error("[SEO] Failed to hydrate SEO data:", error);
    return;
  }

  try {
    updateSEO(options);
  } catch (error) {
    console.error("[SEO] Failed to apply hydrated SEO data:", error);
  }
};
