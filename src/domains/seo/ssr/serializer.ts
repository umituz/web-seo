
import type { SEOptions } from "../types/index.js";

export const serializeSEO = (options: SEOptions): string => JSON.stringify(options);

export const deserializeSEO = (data: string): SEOptions => {
  try {
    return JSON.parse(data);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`[SEO] Failed to deserialize SEO data: ${reason}`);
  }
};

const toBase64 = (json: string): string => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json).toString("base64");
  }
  const bytes = new TextEncoder().encode(json);
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
};

const fromBase64 = (base64: string): string => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8");
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
};

export const serializeSEOToBase64 = (options: SEOptions): string =>
  toBase64(serializeSEO(options));

export const deserializeSEOFromBase64 = (base64: string): SEOptions =>
  deserializeSEO(fromBase64(base64));

export const safeDeserializeSEO = (data: string): SEOptions | null => {
  try {
    const parsed = JSON.parse(data);
    if (typeof parsed !== "object" || parsed === null) {
      console.error("[SEO] Invalid serialized data: not an object");
      return null;
    }
    return parsed as SEOptions;
  } catch (error) {
    console.error("[SEO] Error deserializing data:", error);
    return null;
  }
};
