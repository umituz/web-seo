
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const validateUrl = (url: string, fieldName = "URL"): string | null => {
  if (!url) {
    return `${fieldName} is required`;
  }
  if (!isValidUrl(url)) {
    return `${fieldName} must be a valid HTTP/HTTPS URL`;
  }
  return null;
};
