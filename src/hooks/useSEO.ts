import { useEffect } from "react";
import { updateSEO, SEOptions } from "../utils/dom.js";

export const useSEO = (options: SEOptions) => {
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
