import { describe, it, expect } from "vitest";
import { generateItemListSchema } from "./item-list.js";
import { schemaFactory } from "../factory.js";

describe("generateItemListSchema", () => {
  it("builds an ItemList with sequential positions", () => {
    const schema = generateItemListSchema({
      name: "Featured Tutors",
      description: "Top certified language tutors",
      itemListElement: [
        { name: "Sarah Connor", url: "https://hangora.app/tutors/sarah" },
        { name: "John Doe", url: "https://hangora.app/tutors/john" },
      ],
    });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("ItemList");
    expect(schema.name).toBe("Featured Tutors");
    expect(schema.numberOfItems).toBe(2);
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Sarah Connor",
      url: "https://hangora.app/tutors/sarah",
    });
    expect(schema.itemListElement[1]?.position).toBe(2);
  });

  it("respects explicit item positions and metadata", () => {
    const schema = generateItemListSchema({
      itemListOrder: "Descending",
      itemListElement: [
        {
          name: "English Masterclass",
          position: 10,
          url: "https://hangora.app/courses/english",
          description: "Full fluency course",
          image: "https://hangora.app/courses/eng.png",
        },
      ],
    });

    expect(schema.itemListOrder).toBe("Descending");
    expect(schema.itemListElement[0]?.position).toBe(10);
    expect(schema.itemListElement[0]?.description).toBe("Full fluency course");
    expect(schema.itemListElement[0]?.image).toBe("https://hangora.app/courses/eng.png");
  });

  it("works with schemaFactory", () => {
    const schema = schemaFactory.generate("ItemList", {
      name: "Schools Directory",
      itemListElement: [{ name: "Alpha School" }],
    }) as { name?: string; numberOfItems?: number; "@type": string };

    expect(schema["@type"]).toBe("ItemList");
    expect(schema.name).toBe("Schools Directory");
    expect(schema.numberOfItems).toBe(1);
  });

});
