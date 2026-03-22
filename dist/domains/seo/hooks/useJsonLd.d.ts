/**
 * useJsonLd Hook
 *
 * React hook for managing JSON-LD structured data.
 * Provides a programmatic way to add/update/remove structured data.
 */
import type { JsonLdTypes } from "../types/schema.js";
interface UseJsonLdOptions {
    /** Strategy for when to inject the script tag */
    strategy?: "afterInteractive" | "beforeInteractive" | "idle";
    /** Unique identifier for this JSON-LD block */
    id?: string;
}
export declare const useJsonLd: (data: JsonLdTypes | JsonLdTypes[], options?: UseJsonLdOptions) => {
    injectJsonLd: (jsonData: JsonLdTypes | JsonLdTypes[]) => void;
    removeJsonLd: () => void;
};
export default useJsonLd;
//# sourceMappingURL=useJsonLd.d.ts.map