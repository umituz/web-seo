import type { VideoJsonLd } from "../../../types/schema.js";
import { createBuilder, withContext } from "../base.js";
import type { VideoSchemaInput } from "../types.js";

export const generateVideoSchema = createBuilder<VideoSchemaInput, VideoJsonLd>((input, ctx) => {
  ctx.required(input.name, "name");
  ctx.required(input.thumbnailUrl, "thumbnailUrl");
  ctx.required(input.uploadDate, "uploadDate");

  ctx.set(withContext("VideoObject"));
  ctx.set({
    name: input.name,
    description: input.description,
    thumbnailUrl: input.thumbnailUrl,
    uploadDate: input.uploadDate,
    duration: input.duration,
  } as Partial<VideoJsonLd>);

  if (input.viewCount) {
    ctx.set({
      interactionStatistic: {
        "@type": "InteractionCounter" as const,
        interactionType: { "@type": "WatchAction" as const },
        userInteractionCount: input.viewCount,
      },
    });
  }
});
