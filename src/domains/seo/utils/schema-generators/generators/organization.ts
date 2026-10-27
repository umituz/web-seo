import type { OrganizationJsonLd } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { OrganizationSchemaInput } from "../types.js";

export const generateOrganizationSchema = createBuilder<OrganizationSchemaInput, OrganizationJsonLd>((input, ctx) => {
  ctx.required(input.name, "name");

  ctx.set(withContext("Organization"));
  ctx.set({
    name: input.name,
    description: input.description,
    url: input.url,
    logo: input.logo,
    sameAs: input.sameAs,
  } as Partial<OrganizationJsonLd>);

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
  if (input.address) {
    ctx.set({ address: { "@type": "PostalAddress" as const, ...input.address } });
  }
});
