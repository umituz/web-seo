/**
 * `<SEO>` component.
 *
 * Applies SEO options to the document head on mount and whenever the
 * props change. The deep-compare gate prevents re-running the DOM
 * mutator when a parent re-renders with a structurally-equal object.
 */

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
