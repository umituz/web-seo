import type { ArticleJsonLd, SchemaGeneratorOptions } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { ArticleSchemaInput } from "../types.js";

export const generateArticleSchema = createBuilder<ArticleSchemaInput, ArticleJsonLd>((input, ctx) => {
  ctx.required(input.headline, "headline");
  ctx.required(input.image, "image");
  ctx.required(input.datePublished, "datePublished");
  ctx.required(input.authorName, "authorName");
  ctx.required(input.publisherName, "publisherName");
  ctx.required(input.publisherLogo, "publisherLogo");

  ctx.set(withContext(input.type ?? "Article"));
  ctx.set({
    headline: input.headline,
    name: input.headline, // required by base Thing schema
    description: input.description,
    image: input.image,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@type": input.authorType ?? "Person",
      name: input.authorName,
      url: input.authorUrl,
    },
    publisher: {
      "@context": "https://schema.org",
      "@type": "Organization" as const,
      name: input.publisherName,
      logo: input.publisherLogo,
      url: input.publisherUrl,
    },
    url: input.url,
    articleSection: input.articleSection,
    wordCount: input.wordCount,
    keywords: Array.isArray(input.keywords) ? input.keywords.join(", ") : input.keywords,
    inLanguage: input.inLanguage,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
  } as Partial<ArticleJsonLd>);
});

export type { ArticleSchemaInput, SchemaGeneratorOptions };
