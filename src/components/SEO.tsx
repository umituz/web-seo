import React, { useEffect } from "react";
import { updateSEO, SEOptions } from "../utils/dom.js";

export const SEO: React.FC<SEOptions> = (props) => {
  useEffect(() => {
    updateSEO(props);
  }, [
    props.title,
    props.description,
    props.lang,
    props.canonical,
    JSON.stringify(props.meta),
    JSON.stringify(props.openGraph),
    JSON.stringify(props.twitter),
  ]);

  return null; // Component does not render anything
};
