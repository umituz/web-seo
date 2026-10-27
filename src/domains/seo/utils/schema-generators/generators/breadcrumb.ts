import type { BreadcrumbJsonLd, SchemaGeneratorOptions } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";

export const generateBreadcrumbSchema = (
  items: Array<{ name: string; item: string; position?: number }>,
  options?: SchemaGeneratorOptions
): BreadcrumbJsonLd =>
  createBuilder<typeof items, BreadcrumbJsonLd>((input, ctx) => {
    if (ctx.options.validate && input.length === 0) {
      const message = "[SEO] Breadcrumb schema requires at least one item";
      if (ctx.options.strict) throw new Error(message);
      console.warn(message);
    }

    ctx.set(withContext("BreadcrumbList"));
    ctx.set({
      itemListElement: input.map((item, index) => ({
        "@type": "ListItem" as const,
        position: item.position ?? index + 1,
        name: item.name,
        item: item.item,
      })),
    });
  })(items, options);
