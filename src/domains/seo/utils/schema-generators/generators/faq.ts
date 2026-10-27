import type { FAQJsonLd, SchemaGeneratorOptions } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { FAQItemInput } from "../types.js";

export const generateFAQSchema = (
  faqs: FAQItemInput[],
  options?: SchemaGeneratorOptions
): FAQJsonLd =>
  createBuilder<FAQItemInput[], FAQJsonLd>((input, ctx) => {
    ctx.required(input, "faqs");
    if (ctx.options.validate && input.length === 0) {
      const message = "[SEO] FAQ schema requires at least one FAQ item";
      if (ctx.options.strict) throw new Error(message);
      console.warn(message);
    }

    ctx.set(withContext("FAQPage"));
    ctx.set({
      mainEntity: input.map((faq) => ({
        "@type": "Question" as const,
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer" as const,
          text: faq.answer,
        },
      })),
    });
  })(faqs, options);
