import type { WebSiteJsonLd } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { WebSiteSchemaInput } from "../types.js";

export const generateWebSiteSchema = createBuilder<WebSiteSchemaInput, WebSiteJsonLd>((input, ctx) => {
  ctx.required(input.name, "name");
  ctx.required(input.url, "url");

  ctx.set(withContext("WebSite"));
  ctx.set({
    name: input.name,
    url: input.url,
    description: input.description,
  } as Partial<WebSiteJsonLd>);

  if (input.searchTarget) {
    ctx.set({
      potentialAction: {
        "@type": "SearchAction" as const,
        target: input.searchTarget,
        "query-input": input.searchQueryParam ?? "required name=search_term_string",
      },
    });
  }
  if (input.publisher) {
    ctx.set({
      publisher: {
        "@context": "https://schema.org",
        "@type": "Organization" as const,
        name: input.publisher.name,
        logo: input.publisher.logo,
      },
    });
  }
});
