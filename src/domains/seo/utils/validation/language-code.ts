/**
 * BCP-47 language code validation.
 *
 * Accepts ISO 639-1/2/3 codes with an optional region (e.g. `en`, `en-US`)
 * and the special `x-default` value used by hreflang.
 */

const LANG_CODE_REGEX = /^(?:[a-z]{2,3}(?:-[A-Z]{2})?|x-default)$/;

export const isValidLanguageCode = (code: string): boolean => LANG_CODE_REGEX.test(code);
