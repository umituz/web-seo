import { describe, expect, it } from "vitest";
import { generateSoftwareApplicationSchema } from "./software-application.js";
import { schemaFactory } from "../factory.js";

describe("generateSoftwareApplicationSchema", () => {
  it("generates minimal SoftwareApplication schema", () => {
    const result = generateSoftwareApplicationSchema({
      name: "Hangora Platform",
      url: "https://hangora.app",
    });

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("SoftwareApplication");
    expect(result.name).toBe("Hangora Platform");
    expect(result.operatingSystem).toBe("All");
  });

  it("supports WebApplication type override and rich metadata", () => {
    const result = generateSoftwareApplicationSchema({
      name: "Polaris Real Estate",
      url: "https://polaris.umituz.com",
      description: "Real estate investment and 3D architectural platform",
      type: "WebApplication",
      applicationCategory: "BusinessApplication",
      browserRequirements: "Requires WebGL support",
      price: "0",
      priceCurrency: "USD",
      featureList: ["3D Tour", "Financial Feasibility", "Market Intelligence"],
      aggregateRating: {
        ratingValue: 4.9,
        reviewCount: 120,
      },
    });

    expect(result["@type"]).toBe("WebApplication");
    expect(result.name).toBe("Polaris Real Estate");
    expect(result.applicationCategory).toBe("BusinessApplication");
    expect(result.browserRequirements).toBe("Requires WebGL support");
    expect(result.offers).toEqual({
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: "https://polaris.umituz.com",
    });
    expect(result.aggregateRating?.ratingValue).toBe(4.9);
    expect(result.aggregateRating?.reviewCount).toBe(120);
    expect(result.featureList).toHaveLength(3);
  });

  it("generates through schemaFactory for SoftwareApplication and WebApplication", () => {
    const app = schemaFactory.generate("SoftwareApplication", {
      name: "Nexora Studio",
      url: "https://nexora.app",
      price: "29",
      priceCurrency: "USD",
    }) as { name?: string; "@type": string };
    expect(app["@type"]).toBe("SoftwareApplication");
    expect(app.name).toBe("Nexora Studio");

    const web = schemaFactory.generate("WebApplication", {
      name: "Agromera Cloud",
      url: "https://agromera.app",
    }) as { name?: string; "@type": string };
    expect(web["@type"]).toBe("WebApplication");
    expect(web.name).toBe("Agromera Cloud");
  });
});
