import type { ProductJsonLd } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { ProductSchemaInput } from "../types.js";

export const generateProductSchema = createBuilder<ProductSchemaInput, ProductJsonLd>((input, ctx) => {
  ctx.required(input.name, "name");
  ctx.required(input.image, "image");
  ctx.required(input.price, "price");
  ctx.required(input.priceCurrency, "priceCurrency");

  ctx.set(withContext("Product"));
  ctx.set({
    name: input.name,
    description: input.description,
    image: input.image,
    offers: {
      "@type": "Offer" as const,
      price: input.price.toString(),
      priceCurrency: input.priceCurrency,
      availability: input.availability
        ? `https://schema.org/${input.availability}`
        : undefined,
      url: input.url,
    },
  } as Partial<ProductJsonLd>);

  if (input.brandName) {
    ctx.set({ brand: { "@type": "Brand" as const, name: input.brandName } });
  }
  if (input.sku) ctx.set({ sku: input.sku });
  if (input.gtin) ctx.set({ gtin: input.gtin });
  if (input.aggregateRating) {
    ctx.set({
      aggregateRating: {
        "@type": "AggregateRating" as const,
        ratingValue: input.aggregateRating.ratingValue,
        reviewCount: input.aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    });
  }
});
