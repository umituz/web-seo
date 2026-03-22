/**
 * Social Media Tag Operations
 *
 * Functions for Open Graph and Twitter Card tags
 */

import type { SEOptions } from "../../types/index.js";
import { setMetaTag } from "./basic.js";

/**
 * Set Open Graph tags
 */
export const setOpenGraph = (openGraph: SEOptions["openGraph"]) => {
  if (!openGraph) return;

  const setOG = (property: string, content: string | undefined) => {
    if (content) setMetaTag("property", `og:${property}`, content);
  };

  setOG("title", openGraph.title);
  setOG("description", openGraph.description);
  setOG("url", openGraph.url);
  setOG("type", openGraph.type);
  setOG("site_name", openGraph.siteName);
  setOG("locale", openGraph.locale);

  // Handle multiple images
  if (openGraph.image) {
    if (Array.isArray(openGraph.image)) {
      openGraph.image.forEach((img, index) => {
        const suffix = index > 0 ? `:${index}` : "";
        setOG(`image${suffix}`, img.url);
        if (img.secureUrl) setOG(`image:secure_url${suffix}`, img.secureUrl);
        if (img.type) setOG(`image:type${suffix}`, img.type);
        if (img.width) setOG(`image:width${suffix}`, String(img.width));
        if (img.height) setOG(`image:height${suffix}`, String(img.height));
        if (img.alt) setOG(`image:alt${suffix}`, img.alt);
      });
    } else {
      setOG("image", openGraph.image);
    }
  }

  // Alternate locales
  if (openGraph.alternateLocale) {
    openGraph.alternateLocale.forEach((locale, index) => {
      setMetaTag("property", `og:locale:alternate${index > 0 ? `:${index}` : ""}`, locale);
    });
  }

  // Article specific
  if (openGraph.type === "article" && openGraph.article) {
    setOG("article:published_time", openGraph.article.publishedTime);
    setOG("article:modified_time", openGraph.article.modifiedTime);
    setOG("article:expiration_time", openGraph.article.expirationTime);
    setOG("article:author", openGraph.article.author);
    setOG("article:section", openGraph.article.section);
    if (openGraph.article.tag) {
      openGraph.article.tag.forEach((tag, index) => {
        setMetaTag("property", `og:article:tag${index > 0 ? `:${index}` : ""}`, tag);
      });
    }
  }

  // Product specific
  if (openGraph.type === "product" && openGraph.product) {
    setOG("product:price:amount", String(openGraph.product.price));
    setOG("product:price:currency", openGraph.product.priceCurrency);
    setOG("product:availability", openGraph.product.availability);
    setOG("product:brand", openGraph.product.brand);
    setOG("product:sku", openGraph.product.sku);
    setOG("product:condition", openGraph.product.condition);
  }

  // Profile
  if (openGraph.type === "profile") {
    setOG("profile:first_name", openGraph.firstName);
    setOG("profile:last_name", openGraph.lastName);
    setOG("profile:username", openGraph.username);
  }

  // Music
  if (openGraph.type === "music" && openGraph.music) {
    setOG("music:album", openGraph.music.album);
    setOG("music:musician", openGraph.music.musician);
    setOG("music:song", openGraph.music.song);
    setOG("music:release_date", openGraph.music.releaseDate);
    setOG("music:duration", openGraph.music.duration);
    setOG("music:creator", openGraph.music.creator);
  }
};

/**
 * Set Twitter Card tags
 */
export const setTwitterCard = (
  twitter: SEOptions["twitter"],
  __openGraphImage?: SEOptions["openGraph"]
) => {
  if (!twitter) return;

  const setTW = (name: string, content: string | undefined) => {
    if (content) setMetaTag("name", `twitter:${name}`, content);
  };

  setTW("card", twitter.cardType);
  setTW("site", twitter.site);
  setTW("creator", twitter.handle);
  setTW("title", twitter.title);
  setTW("description", twitter.description);
  setTW("image", twitter.image);
  setTW("image:alt", twitter.imageAlt);

  // Player
  if (twitter.cardType === "player") {
    setTW("player", twitter.player);
    setTW("player:width", twitter.playerWidth);
    setTW("player:height", twitter.playerHeight);
    setTW("player:stream", twitter.playerStream);
    setTW("player:stream:content_type", twitter.playerStreamContentType);
  }

  // App
  if (twitter.app) {
    if (twitter.app.iphone) {
      setTW("app:name:iphone", twitter.app.iphone.name);
      setTW("app:id:iphone", twitter.app.iphone.id);
      setTW("app:url:iphone", twitter.app.iphone.url);
    }
    if (twitter.app.ipad) {
      setTW("app:name:ipad", twitter.app.ipad.name);
      setTW("app:id:ipad", twitter.app.ipad.id);
      setTW("app:url:ipad", twitter.app.ipad.url);
    }
    if (twitter.app.googleplay) {
      setTW("app:name:googleplay", twitter.app.googleplay.name);
      setTW("app:id:googleplay", twitter.app.googleplay.id);
      setTW("app:url:googleplay", twitter.app.googleplay.url);
    }
  }
};
