/**
 * SEO Serializer
 *
 * Serialization utilities for SEO data.
 * Used for server-side rendering and hydration.
 */

import type { SEOptions } from "../types/index.js";

// ============================================================================
// Serialization
// ============================================================================

/**
 * Serialize SEO options to a string for transmission/hydration
 */
export const serializeSEO = (options: SEOptions): string => {
  return JSON.stringify(options);
};

/**
 * Deserialize SEO options from a string
 */
export const deserializeSEO = (data: string): SEOptions => {
  return JSON.parse(data);
};

/**
 * Serialize SEO options to base64 for safe URL transmission
 */
export const serializeSEOToBase64 = (options: SEOptions): string => {
  const json = serializeSEO(options);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json).toString("base64");
  }
  // Browser fallback
  return btoa(json);
};

/**
 * Deserialize SEO options from base64
 */
export const deserializeSEOFromBase64 = (base64: string): SEOptions => {
  let json: string;
  if (typeof Buffer !== "undefined") {
    json = Buffer.from(base64, "base64").toString("utf-8");
  } else {
    // Browser fallback
    json = atob(base64);
  }
  return deserializeSEO(json);
};

// ============================================================================
// State Management
// ============================================================================

interface SEOState {
  options: SEOptions;
  timestamp: number;
}

/**
 * Create SEO state with timestamp
 */
export const createSEOState = (options: SEOptions): SEOState => {
  return {
    options,
    timestamp: Date.now(),
  };
};

/**
 * Serialize SEO state
 */
export const serializeSEOState = (state: SEOState): string => {
  return JSON.stringify(state);
};

/**
 * Deserialize SEO state
 */
export const deserializeSEOState = (data: string): SEOState => {
  return JSON.parse(data);
};

/**
 * Check if SEO state is stale (older than specified milliseconds)
 */
export const isSEOStateStale = (state: SEOState, maxAge: number = 3600000): boolean => {
  return Date.now() - state.timestamp > maxAge;
};

// ============================================================================
// Compression (for large SEO datasets)
// ============================================================================

/**
 * Compress SEO options using simple compression
 * Removes undefined values and empty arrays
 */
export const compressSEO = (options: SEOptions): SEOptions => {
  const compressed: Record<string, unknown> = {};

  Object.entries(options).forEach(([key, value]) => {
    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      return;
    }

    // Compress nested objects
    if (typeof value === "object" && !Array.isArray(value)) {
      const compressedNested = compressSEO(value as SEOptions);
      if (Object.keys(compressedNested).length > 0) {
        compressed[key] = compressedNested;
      }
    } else {
      compressed[key] = value;
    }
  });

  return compressed;
};

/**
 * Decompress SEO options (identity function, kept for API consistency)
 */
export const decompressSEO = (options: SEOptions): SEOptions => {
  return options;
};

// ============================================================================
// Query String Serialization
// ============================================================================

/**
 * Serialize SEO options to URL-safe query string
 * Only includes essential SEO data for social sharing previews
 */
export const serializeSEOToQueryString = (options: SEOptions): string => {
  const params = new URLSearchParams();

  if (options.title) params.set("title", options.title);
  if (options.description) params.set("description", options.description);
  if (options.openGraph?.image) {
    const image = Array.isArray(options.openGraph.image)
      ? options.openGraph.image[0]?.url
      : options.openGraph.image;
    if (image) params.set("image", image);
  }

  return params.toString();
};

/**
 * Deserialize SEO options from query string
 */
export const deserializeSEOFromQueryString = (queryString: string): Partial<SEOptions> => {
  const params = new URLSearchParams(queryString);
  const options: Partial<SEOptions> = {};

  if (params.has("title")) options.title = params.get("title")!;
  if (params.has("description")) options.description = params.get("description")!;
  if (params.has("image")) {
    options.openGraph = {
      image: params.get("image")!,
    };
  }

  return options;
};

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate serialized SEO data before deserialization
 */
export const validateSerializedSEO = (data: string): boolean => {
  try {
    const parsed = JSON.parse(data);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
};

/**
 * Safe deserialize with validation
 */
export const safeDeserializeSEO = (data: string): SEOptions | null => {
  if (!validateSerializedSEO(data)) {
    console.error("[SEO] Invalid serialized data");
    return null;
  }

  try {
    return deserializeSEO(data);
  } catch (error) {
    console.error("[SEO] Error deserializing data:", error);
    return null;
  }
};
