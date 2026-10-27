import type { CourseJsonLd, CourseInstance } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { CourseSchemaInput } from "../types.js";

export const generateCourseSchema = createBuilder<CourseSchemaInput, CourseJsonLd>((input, ctx) => {
  ctx.required(input.name, "name");
  ctx.required(input.description, "description");
  ctx.required(input.providerName, "providerName");

  ctx.set(withContext("Course"));
  ctx.set({
    name: input.name,
    description: input.description,
    provider: {
      "@type": "Organization",
      name: input.providerName,
      url: input.providerUrl,
    },
  } as Partial<CourseJsonLd>);

  if (input.image) ctx.set({ image: input.image });
  if (input.url) ctx.set({ url: input.url });
  if (input.courseCode) ctx.set({ courseCode: input.courseCode });
  if (input.educationalLevel) ctx.set({ educationalLevel: input.educationalLevel });
  if (input.inLanguage) ctx.set({ inLanguage: input.inLanguage });
  if (input.teaches) ctx.set({ teaches: input.teaches });

  if (input.price !== undefined && input.priceCurrency) {
    ctx.set({
      offers: {
        "@type": "Offer",
        price: input.price.toString(),
        priceCurrency: input.priceCurrency,
        availability: "https://schema.org/InStock",
        url: input.url,
      },
    });
  }

  if (input.aggregateRating) {
    ctx.set({
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: input.aggregateRating.ratingValue,
        reviewCount: input.aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    });
  }

  if (input.instances && input.instances.length > 0) {
    const instances: CourseInstance[] = input.instances.map((inst) => ({
      "@type": "CourseInstance",
      courseMode: inst.courseMode ?? "online",
      courseWorkload: inst.courseWorkload,
      inLanguage: inst.inLanguage ?? input.inLanguage,
      startDate: inst.startDate,
      endDate: inst.endDate,
      ...(inst.instructorName
        ? {
            instructor: {
              "@type": "Person",
              name: inst.instructorName,
              url: inst.instructorUrl,
            },
          }
        : {}),
    }));
    ctx.set({ hasCourseInstance: instances });
  }
});
