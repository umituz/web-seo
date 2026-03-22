import { useEffect } from "react";
import { updateSEO } from "../utils/dom.js";
export const useSEO = (options) => {
    useEffect(() => {
        updateSEO(options);
    }, [
        options.title,
        options.description,
        options.lang,
        options.canonical,
        JSON.stringify(options.meta),
        JSON.stringify(options.openGraph),
        JSON.stringify(options.twitter),
    ]);
};
