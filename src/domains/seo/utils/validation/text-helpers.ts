/**
 * Text helpers used by SEO concerns.
 *
 * Slug generation lives here because it's a generic string utility
 * that the package's callers often reuse.
 */

export const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
