import type { ItemListJsonLd, ListItemJsonLd } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { ItemListSchemaInput } from "../types.js";

export const generateItemListSchema = createBuilder<ItemListSchemaInput, ItemListJsonLd>((input, ctx) => {
  ctx.required(input.itemListElement, "itemListElement");

  ctx.set(withContext("ItemList"));
  if (input.name) ctx.set({ name: input.name });
  if (input.description) ctx.set({ description: input.description });
  if (input.itemListOrder) ctx.set({ itemListOrder: input.itemListOrder });

  const elements: ListItemJsonLd[] = input.itemListElement.map((item, index) => ({
    "@type": "ListItem" as const,
    position: item.position ?? index + 1,
    name: item.name,
    ...(item.url ? { url: item.url } : {}),
    ...(item.description ? { description: item.description } : {}),
    ...(item.image ? { image: item.image } : {}),
  }));

  ctx.set({
    numberOfItems: input.numberOfItems ?? elements.length,
    itemListElement: elements,
  });
});
