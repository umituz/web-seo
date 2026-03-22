import { updateSEO } from "../utils/dom.js";

interface SEOConfig {
  i18n?: any; // The i18next instance
  titleKey?: string;
  descriptionKey?: string;
  defaultImage?: string;
  canonicalPrefix?: string;
  twitterHandle?: string;
}

export const initSEO = (config: SEOConfig) => {
  if (typeof window === "undefined") return;

  const update = () => {
    const lang = config.i18n?.language?.split("-")[0] || "en";
    const title = config.i18n ? config.i18n.t(config.titleKey || "app.title") : document.title;
    const description = config.i18n ? config.i18n.t(config.descriptionKey || "app.description") : "";
    const canonical = config.canonicalPrefix ? `${config.canonicalPrefix}/${lang}` : undefined;

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
      }
    });
  };

  // Initial call
  update();

  // Listen for language changes if i18next is provided
  if (config.i18n && typeof config.i18n.on === "function") {
    config.i18n.on("languageChanged", update);
  }
};
