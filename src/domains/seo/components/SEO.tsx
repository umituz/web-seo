
import { memo, useEffect, useRef } from "react";
import { deepEqual } from "../core/deep-equal.js";
import type { SEOptions } from "../types/index.js";
import { updateSEO } from "../utils/dom/index.js";

const SEOComponent = (props: SEOptions) => {
  const prevPropsRef = useRef<SEOptions | null>(null);

  useEffect(() => {
    if (!prevPropsRef.current || !deepEqual(prevPropsRef.current, props)) {
      prevPropsRef.current = props;
      updateSEO(props);
    }
  }, [props]);

  return null;
};

export const SEO = memo(SEOComponent, (prev, next) => deepEqual(prev, next));
