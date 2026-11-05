
const LANG_CODE_REGEX = /^(?:[a-z]{2,3}(?:-[A-Z]{2})?|x-default)$/;

export const isValidLanguageCode = (code: string): boolean => LANG_CODE_REGEX.test(code);
