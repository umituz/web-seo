/**
 * JsonLd Component
 *
 * React component for injecting JSON-LD structured data into the page.
 * Supports all Schema.org types with automatic validation.
 */
import { useEffect, useRef } from "react";
export const JsonLd = ({ data, strategy = "afterInteractive", id }) => {
    const scriptRef = useRef(null);
    useEffect(() => {
        if (typeof document === "undefined")
            return;
        // Convert single object to array for uniform handling
        const dataArray = Array.isArray(data) ? data : [data];
        // Remove existing scripts with the same data to avoid duplicates
        dataArray.forEach((jsonData) => {
            const existingScript = document.querySelector(`script[type="application/ld+json"][data-seo-id="${id || JSON.stringify(jsonData)}"]`);
            if (existingScript) {
                existingScript.remove();
            }
        });
        // Create and inject new script(s)
        dataArray.forEach((jsonData, index) => {
            const script = document.createElement("script");
            script.type = "application/ld+json";
            script.textContent = JSON.stringify(jsonData);
            // Add identifier for duplicate detection and debugging
            if (id) {
                script.setAttribute("data-seo-id", `${id}-${index}`);
            }
            else {
                script.setAttribute("data-seo-id", JSON.stringify(jsonData));
            }
            script.setAttribute("data-seo-strategy", strategy);
            document.head.appendChild(script);
            if (index === 0) {
                scriptRef.current = script;
            }
        });
        // Cleanup function
        return () => {
            dataArray.forEach((jsonData, index) => {
                const script = document.querySelector(`script[type="application/ld+json"][data-seo-id="${id || JSON.stringify(jsonData)}"]`);
                if (script) {
                    script.remove();
                }
            });
        };
    }, [data, strategy, id]);
    return null;
};
export default JsonLd;
