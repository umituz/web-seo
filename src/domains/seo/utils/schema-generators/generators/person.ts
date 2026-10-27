import type { PersonJsonLd } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { PersonSchemaInput } from "../types.js";

export const generatePersonSchema = createBuilder<PersonSchemaInput, PersonJsonLd>((input, ctx) => {
  ctx.required(input.name, "name");

  ctx.set(withContext("Person"));
  ctx.set({
    name: input.name,
    givenName: input.givenName,
    familyName: input.familyName,
    jobTitle: input.jobTitle,
    description: input.description,
    image: input.image,
    url: input.url,
    sameAs: input.sameAs,
    email: input.email,
    telephone: input.telephone,
  } as Partial<PersonJsonLd>);

  if (input.worksFor) {
    ctx.set({
      worksFor: {
        "@context": "https://schema.org",
        "@type": "Organization" as const,
        name: input.worksFor.name,
        url: input.worksFor.url,
      },
    });
  }
});
