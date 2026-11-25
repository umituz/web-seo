import type { EducationalOrganizationJsonLd } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { EducationalOrganizationSchemaInput } from "../types.js";

export const generateEducationalOrganizationSchema = createBuilder<EducationalOrganizationSchemaInput, EducationalOrganizationJsonLd>((input, ctx) => {
  ctx.required(input.name, "name");
  ctx.required(input.url, "url");

  const type = input.type ?? "EducationalOrganization";
  ctx.set(withContext(type));
  ctx.set({
    name: input.name,
    url: input.url,
    description: input.description,
    logo: input.logo,
    image: input.image,
    telephone: input.telephone,
    email: input.email,
    sameAs: input.sameAs,
    numberOfStudents: input.numberOfStudents,
  } as Partial<EducationalOrganizationJsonLd>);

  if (input.address) {
    ctx.set({ address: { "@type": "PostalAddress" as const, ...input.address } });
  }
});
