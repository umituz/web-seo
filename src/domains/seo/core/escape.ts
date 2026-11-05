
import { DEFAULT_CACHE_LIMIT } from "./constants.js";

const escapeCache = new Map<string, string>();

const pushCached = (key: string, value: string): string => {
  if (escapeCache.size < DEFAULT_CACHE_LIMIT) {
    escapeCache.set(key, value);
  }
  return value;
};

export const escapeHTML = (str: string): string => {
  if (!str) return "";
  if (escapeCache.has(str)) return escapeCache.get(str)!;

  const escaped = str.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return char;
    }
  });

  return pushCached(str, escaped);
};

export const escapeJSONForScript = (json: string): string => {
  const cacheKey = `json:${json}`;
  if (escapeCache.has(cacheKey)) return escapeCache.get(cacheKey)!;
  return pushCached(cacheKey, json.replace(/<\/script>/gi, "<\\/script>"));
};
