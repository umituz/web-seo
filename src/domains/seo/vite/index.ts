/**
 * Vite plugin entry point.
 *
 * Lives behind a subpath import (`@umituz/web-seo/vite`) to keep Node-only
 * dependencies out of the main browser bundle.
 */

export { viteSEOPlugin } from "./plugin.js";
export { quickSEOSetup } from "./presets.js";
export type { ViteSEOPluginOptions } from "./types.js";
