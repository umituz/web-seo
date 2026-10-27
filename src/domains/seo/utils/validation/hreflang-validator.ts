/**
 * Hreflang validation.
 */

import { isValidLanguageCode } from "./language-code.js";
import { validateUrl } from "./url-validator.js";

export const validateHreflangEntry = (entry: { lang: string; url: string }): string | null => {
  if (!entry.lang) return "Hreflang language code is required";
  if (!isValidLanguageCode(entry.lang)) {
    return `Invalid language code: ${entry.lang}`;
  }
  return validateUrl(entry.url, "Hreflang URL");
};
