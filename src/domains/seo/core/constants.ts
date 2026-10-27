/**
 * SEO Constants
 *
 * Centralized length and size thresholds for SEO validation.
 * Used by both the validator and the generator modules.
 */

export const TITLE_MIN_LENGTH = 30;
export const TITLE_MAX_LENGTH = 60;
export const DESCRIPTION_MIN_LENGTH = 120;
export const DESCRIPTION_MAX_LENGTH = 160;

export const OG_IMAGE_MIN_WIDTH = 1200;
export const OG_IMAGE_MIN_HEIGHT = 630;
export const OG_IMAGE_MAX_SIZE = 8 * 1024 * 1024; // 8MB

export const SCHEMA_CONTEXT = "https://schema.org";

export const DEFAULT_CACHE_LIMIT = 1000;
