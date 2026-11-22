import type { SoftwareApplicationJsonLd } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { SoftwareApplicationSchemaInput } from "../types.js";

export const generateSoftwareApplicationSchema = createBuilder<SoftwareApplicationSchemaInput, SoftwareApplicationJsonLd>((input, ctx) => {
  ctx.required(input.name, "name");

  const schemaType = input.type ?? "SoftwareApplication";
  ctx.set(withContext(schemaType));

  const data: Partial<SoftwareApplicationJsonLd> = {
    name: input.name,
    url: input.url,
    description: input.description,
    image: input.image,
    applicationCategory: input.applicationCategory,
    operatingSystem: input.operatingSystem ?? "All",
    featureList: input.featureList,
    screenshot: input.screenshot,
    softwareVersion: input.softwareVersion,
    browserRequirements: input.browserRequirements,
  };

  if (input.offers) {
    data.offers = input.offers;
  } else if (input.price !== undefined && input.priceCurrency) {
    data.offers = {
      "@type": "Offer",
      price: String(input.price),
      priceCurrency: input.priceCurrency,
      url: input.url,
    };
  }

  if (input.aggregateRating) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: input.aggregateRating.ratingValue,
      reviewCount: input.aggregateRating.reviewCount,
      bestRating: input.aggregateRating.bestRating,
      worstRating: input.aggregateRating.worstRating,
    };
  }

  ctx.set(data);
});
