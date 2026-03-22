/**
 * Meta Tags Module
 *
 * All meta tag related utilities
 */

export { setMetaTag, setLinkTag, setRobotsMeta } from "./basic.js";
export {
  setHreflangTags,
  setFavicon,
  setAppleTouchIcon,
  setMaskIcon,
  setThemeColor,
  setViewport,
} from "./advanced.js";
export { setOpenGraph, setTwitterCard } from "./social.js";
export {
  setPreloadHints,
  setPreconnectHints,
  setDnsPrefetchHints,
} from "./performance.js";
