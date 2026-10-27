/**
 * Title and description length validation + truncation helpers.
 *
 * Bounds are exported from `core/constants` so all SEO concerns agree on
 * the recommended ranges.
 */

import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "../../core/constants.js";

const ELLIPSIS = "...";

export const validateTitleLength = (title: string): string | null => {
  if (!title) return "Title is required";
  if (title.length < TITLE_MIN_LENGTH) {
    return `Title is too short (${title.length} chars). Recommended: ${TITLE_MIN_LENGTH}-${TITLE_MAX_LENGTH} chars`;
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return `Title is too long (${title.length} chars). Recommended: ${TITLE_MIN_LENGTH}-${TITLE_MAX_LENGTH} chars`;
  }
  return null;
};

export const validateDescriptionLength = (description: string): string | null => {
  if (!description) return "Description is required";
  if (description.length < DESCRIPTION_MIN_LENGTH) {
    return `Description is too short (${description.length} chars). Recommended: ${DESCRIPTION_MIN_LENGTH}-${DESCRIPTION_MAX_LENGTH} chars`;
  }
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return `Description is too long (${description.length} chars). Recommended: ${DESCRIPTION_MIN_LENGTH}-${DESCRIPTION_MAX_LENGTH} chars`;
  }
  return null;
};

export const truncateToTitle = (text: string): string => {
  if (text.length <= TITLE_MAX_LENGTH) return text;
  return text.substring(0, TITLE_MAX_LENGTH - ELLIPSIS.length) + ELLIPSIS;
};

export const truncateToDescription = (text: string): string => {
  if (text.length <= DESCRIPTION_MAX_LENGTH) return text;
  return text.substring(0, DESCRIPTION_MAX_LENGTH - ELLIPSIS.length) + ELLIPSIS;
};
