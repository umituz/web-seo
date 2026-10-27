/**
 * Open Graph image validation.
 *
 * All four parameters are optional so callers can progressively validate
 * as soon as they know each value.
 */

import {
  OG_IMAGE_MAX_SIZE,
  OG_IMAGE_MIN_HEIGHT,
  OG_IMAGE_MIN_WIDTH,
} from "../../core/constants.js";
import { isValidUrl } from "./url-validator.js";

export const validateOpenGraphImage = (
  imageUrl: string,
  width?: number,
  height?: number,
  size?: number
): string | null => {
  if (!imageUrl) return "Open Graph image URL is required";
  if (!isValidUrl(imageUrl)) return "Open Graph image URL must be valid";

  if (width !== undefined && width < OG_IMAGE_MIN_WIDTH) {
    return `Open Graph image width should be at least ${OG_IMAGE_MIN_WIDTH}px (current: ${width}px)`;
  }
  if (height !== undefined && height < OG_IMAGE_MIN_HEIGHT) {
    return `Open Graph image height should be at least ${OG_IMAGE_MIN_HEIGHT}px (current: ${height}px)`;
  }
  if (size !== undefined && size > OG_IMAGE_MAX_SIZE) {
    return `Open Graph image size should not exceed ${OG_IMAGE_MAX_SIZE / 1024 / 1024}MB`;
  }
  return null;
};
