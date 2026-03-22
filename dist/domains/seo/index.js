// ============================================================================
// SEO Domain - Main Exports
// Domain-Driven Design structure for comprehensive SEO functionality
// ============================================================================
// Components
export { SEO } from "./components/SEO.js";
export { JsonLd } from "./components/JsonLd.js";
// Hooks
export { useSEO } from "./hooks/useSEO.js";
export { useJsonLd } from "./hooks/useJsonLd.js";
// Core
export { initSEO } from "./core/init.js";
// Utils
export { updateSEO, clearSEO, getCurrentSEOState, } from "./utils/dom.js";
export { generateArticleSchema, generateProductSchema, generateOrganizationSchema, generateLocalBusinessSchema, generateBreadcrumbSchema, generateFAQSchema, generateWebSiteSchema, generatePersonSchema, generateVideoSchema, } from "./utils/schema.js";
export { validateSEO, auditSEO, isValidUrl, validateUrl, validateTitleLength, validateDescriptionLength, validateOpenGraphImage, validateHreflangEntry, truncateForSEO, generateSlug, } from "./utils/validators.js";
// SSR
export { renderSEO, generateHead, extractSEOData, hydrateSEO, renderAsHelmet, } from "./ssr/renderer.js";
export { serializeSEO, deserializeSEO, serializeSEOToBase64, deserializeSEOFromBase64, compressSEO, serializeSEOToQueryString, deserializeSEOFromQueryString, safeDeserializeSEO, } from "./ssr/serializer.js";
// Vite Plugin
export { viteSEOPlugin, quickSEOSetup, } from "./vite/plugin.js";
