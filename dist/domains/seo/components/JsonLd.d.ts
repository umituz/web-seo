/**
 * JsonLd Component
 *
 * React component for injecting JSON-LD structured data into the page.
 * Supports all Schema.org types with automatic validation.
 */
import type { JsonLdTypes } from "../types/schema.js";
interface JsonLdProps {
    data: JsonLdTypes | JsonLdTypes[];
    /** Strategy for when to inject the script tag */
    strategy?: "afterInteractive" | "beforeInteractive" | "idle";
    /** Unique identifier for this JSON-LD block (for debugging) */
    id?: string;
}
export declare const JsonLd: React.FC<JsonLdProps>;
export default JsonLd;
//# sourceMappingURL=JsonLd.d.ts.map