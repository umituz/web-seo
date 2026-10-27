import type { LocalBusinessJsonLd } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { LocalBusinessSchemaInput } from "../types.js";

export const generateLocalBusinessSchema = createBuilder<LocalBusinessSchemaInput, LocalBusinessJsonLd>((input, ctx) => {
  ctx.required(input.name, "name");
  ctx.required(input.address, "address");

  ctx.set(withContext(input.type ?? "LocalBusiness"));
  ctx.set({
    name: input.name,
    description: input.description,
    url: input.url,
    logo: input.logo,
    address: { "@type": "PostalAddress" as const, ...input.address },
    priceRange: input.priceRange,
  } as Partial<LocalBusinessJsonLd>);

  if (input.geo) {
    ctx.set({
      geo: {
        "@type": "GeoCoordinates" as const,
        latitude: input.geo.latitude,
        longitude: input.geo.longitude,
      },
    });
  }
  if (input.openingHours) {
    ctx.set({
      openingHoursSpecification: input.openingHours.map((oh) => ({
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: oh.dayOfWeek,
        opens: oh.opens,
        closes: oh.closes,
      })),
    });
  }
  if (input.contactPoint) {
    ctx.set({
      contactPoint: input.contactPoint.map((cp) => ({
        "@type": "ContactPoint" as const,
        telephone: cp.telephone,
        contactType: cp.contactType,
        email: cp.email,
      })),
    });
  }
  if (input.sameAs) ctx.set({ sameAs: input.sameAs });
});
