/**
 * `initSEO(config)` — application-level SEO bootstrap.
 *
 * Sets default SEO options on first call and re-applies them whenever
 * the i18n instance reports a language change. Returns a cleanup
 * function that detaches the listener.
 *
 * i18n is modeled as a Strategy via the `I18nInstance` interface; any
 * adapter exposing `t`, `on`, and `language` works (i18next, react-intl,
 * etc.) without a hard dependency.
 */

import type { SEOConfig } from "../types/index.js";
import { updateSEO } from "../utils/dom/index.js";

interface I18nInstance {
  language?: string;
  t: (key: string) => string;
  on: (event: string, callback: () => void) => void;
  off?: (event: string, callback: () => void) => void;
}

interface InitConfig {
  i18n?: I18nInstance;
  titleKey?: string;
  descriptionKey?: string;
  defaultImage?: string;
  canonicalPrefix?: string;
  twitterHandle?: string;
  defaults?: Partial<SEOConfig>;
}

export const initSEO = (config: InitConfig): (() => void) => {
  if (typeof window === "undefined") return () => undefined;

  const resolve = (): {
    title: string;
    description: string;
    lang: string;
    canonical?: string;
  } => {
    const lang = config.i18n?.language?.split("-")[0] ?? "en";
    const title = config.i18n
      ? config.i18n.t(config.titleKey ?? "app.title")
      : document.title;
    const description = config.i18n
      ? config.i18n.t(config.descriptionKey ?? "app.description")
      : "";
    const canonical = config.canonicalPrefix
      ? `${config.canonicalPrefix}/${lang}`
      : undefined;
    return { title, description, lang, canonical };
  };

  const apply = (): void => {
    const { title, description, lang, canonical } = resolve();
    updateSEO({
      title,
      description,
      lang,
      canonical,
      openGraph: {
        title,
        description,
        type: "website",
        image: config.defaultImage,
        url: canonical,
      },
      twitter: {
        cardType: "summary_large_image",
        site: config.twitterHandle,
      },
    });
  };

  apply();

  let cleanup: (() => void) | undefined;
  if (config.i18n && typeof config.i18n.on === "function") {
    config.i18n.on("languageChanged", apply);
    cleanup = () => {
      if (typeof config.i18n?.off === "function") {
        config.i18n.off("languageChanged", apply);
      }
    };
  }

  return cleanup ?? (() => undefined);
};
