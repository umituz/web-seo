/**
 * useJsonLd Hook
 *
 * React hook for managing JSON-LD structured data.
 * Provides a programmatic way to add/update/remove structured data.
 */
import { useEffect, useCallback } from "react";
export const useJsonLd = (data, options) => {
    const { strategy = "afterInteractive", id } = options || {};
    const injectJsonLd = useCallback((jsonData) => {
        if (typeof document === "undefined")
            return;
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        dataArray.forEach((item, index) => {
            // Remove existing script if present
            const existingScript = document.querySelector(`script[type="application/ld+json"][data-seo-id="${id || JSON.stringify(item)}"]`);
            if (existingScript) {
                existingScript.remove();
            }
            // Create and inject new script
            const script = document.createElement("script");
            script.type = "application/ld+json";
            script.textContent = JSON.stringify(item);
            if (id) {
                script.setAttribute("data-seo-id", `${id}-${index}`);
            }
            else {
                script.setAttribute("data-seo-id", JSON.stringify(item));
            }
            script.setAttribute("data-seo-strategy", strategy);
            document.head.appendChild(script);
        });
    }, [id, strategy]);
    const removeJsonLd = useCallback(() => {
        if (typeof document === "undefined")
            return;
        const scripts = document.querySelectorAll(`script[type="application/ld+json"][data-seo-id*="${id || ''}"]`);
        scripts.forEach((script) => script.remove());
    }, [id]);
    useEffect(() => {
        if (data) {
            injectJsonLd(data);
        }
        return () => {
            removeJsonLd();
        };
    }, [data, injectJsonLd, removeJsonLd]);
    return {
        injectJsonLd,
        removeJsonLd,
    };
};
export default useJsonLd;
