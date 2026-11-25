import { describe, it, expect } from "vitest";
import { generateEducationalOrganizationSchema } from "./educational-organization.js";
import { schemaFactory } from "../factory.js";

describe("generateEducationalOrganizationSchema", () => {
  it("builds an educational organization with required fields", () => {
    const schema = generateEducationalOrganizationSchema({
      name: "Hangora Language Academy",
      url: "https://hangora.app/schools/academy",
    });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("EducationalOrganization");
    expect(schema.name).toBe("Hangora Language Academy");
    expect(schema.url).toBe("https://hangora.app/schools/academy");
  });

  it("supports School subtype and optional metadata", () => {
    const schema = generateEducationalOrganizationSchema({
      name: "Istanbul Language High School",
      url: "https://hangora.app/schools/istanbul",
      type: "School",
      description: "Premier language school in Istanbul",
      logo: "https://hangora.app/logo.png",
      telephone: "+90-212-555-0100",
      email: "info@istanbul.edu.tr",
      numberOfStudents: 1200,
      sameAs: ["https://instagram.com/istanbul_school"],
      address: {
        streetAddress: "Kadikoy Cad. No: 10",
        addressLocality: "Istanbul",
        addressRegion: "Marmara",
        postalCode: "34710",
        addressCountry: "TR",
      },
    });

    expect(schema["@type"]).toBe("School");
    expect(schema.description).toBe("Premier language school in Istanbul");
    expect(schema.telephone).toBe("+90-212-555-0100");
    expect(schema.email).toBe("info@istanbul.edu.tr");
    expect(schema.numberOfStudents).toBe(1200);
    expect(schema.address?.addressLocality).toBe("Istanbul");
    expect(schema.address?.["@type"]).toBe("PostalAddress");
  });

  it("works with schemaFactory", () => {
    const schema = schemaFactory.generate("School", {
      name: "Oxford Online School",
      url: "https://hangora.app/schools/oxford",
    }) as { name?: string; "@type": string };

    expect(schema["@type"]).toBe("School");
    expect(schema.name).toBe("Oxford Online School");
  });

});
