import { useEffect } from "react";
import { updateSEO } from "../utils/dom.js";
export const SEO = (props) => {
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
