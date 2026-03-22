/**
 * SEO DOM Utilities
 *
 * Core utilities for manipulating DOM elements related to SEO.
 * Handles meta tags, link tags, structured data, and performance hints.
 */
// ============================================================================
// Meta Tag Management
// ============================================================================
const setMetaTag = (attrName, attrValue, content) => {
    if (typeof document === "undefined")
        return;
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
    }
    if (content) {
        element.setAttribute("content", content);
    }
};
const setLinkTag = (attrs) => {
    if (typeof document === "undefined")
        return;
    const rel = attrs.rel;
    if (!rel)
        return;
    // Build selector based on rel and other identifying attributes
    let selector = `link[rel="${rel}"]`;
    if (attrs.href)
        selector += `[href="${attrs.href}"]`;
    if (attrs.sizes)
        selector += `[sizes="${attrs.sizes}"]`;
    if (attrs.type)
        selector += `[type="${attrs.type}"]`;
    let element = document.querySelector(selector);
    if (!element) {
        element = document.createElement("link");
        document.head.appendChild(element);
    }
    Object.entries(attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
};
// ============================================================================
// Robots Meta Tag
// ============================================================================
const setRobotsMeta = (robots) => {
    if (typeof document === "undefined")
        return;
    let content = "";
    if (typeof robots === "boolean") {
        content = robots ? "index, follow" : "noindex, nofollow";
    }
    else {
        const directives = [];
        if (robots.index !== undefined) {
            directives.push(robots.index ? "index" : "noindex");
        }
        if (robots.follow !== undefined) {
            directives.push(robots.follow ? "follow" : "nofollow");
        }
        if (robots.archive !== undefined) {
            directives.push(robots.archive ? "all" : "noarchive");
        }
        if (robots.snippet !== undefined) {
            directives.push(robots.snippet ? "all" : "nosnippet");
        }
        if (robots.translate !== undefined) {
            directives.push(robots.translate ? "all" : "notranslate");
        }
        if (robots.imageIndex !== undefined) {
            directives.push(robots.imageIndex ? "all" : "noimageindex");
        }
        if (robots.maxSnippet !== undefined) {
            directives.push(`max-snippet:${robots.maxSnippet}`);
        }
        if (robots.maxImagePreview !== undefined) {
            directives.push(`max-image-preview:${robots.maxImagePreview}`);
        }
        if (robots.maxVideoPreview !== undefined) {
            directives.push(`max-video-preview:${robots.maxVideoPreview}`);
        }
        if (robots.unavailableAfter !== undefined) {
            directives.push(`unavailable_after:${robots.unavailableAfter}`);
        }
        content = directives.join(", ");
    }
    setMetaTag("name", "robots", content);
};
// ============================================================================
// Hreflang Management
// ============================================================================
const setHreflangTags = (hreflang) => {
    if (typeof document === "undefined")
        return;
    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    // Add new hreflang tags
    hreflang.forEach((entry) => {
        setLinkTag({
            rel: "alternate",
            hreflang: entry.lang,
            href: entry.url,
        });
    });
};
// ============================================================================
// Favicon Management
// ============================================================================
const setFavicon = (href) => {
    if (typeof document === "undefined")
        return;
    setLinkTag({ rel: "icon", href, type: "image/x-icon" });
};
const setAppleTouchIcon = (href) => {
    if (typeof document === "undefined")
        return;
    setLinkTag({ rel: "apple-touch-icon", href, sizes: "180x180" });
};
const setMaskIcon = (href, color) => {
    if (typeof document === "undefined")
        return;
    setLinkTag({ rel: "mask-icon", href, ...(color && { color }) });
};
// ============================================================================
// Theme Color
// ============================================================================
const setThemeColor = (color) => {
    if (typeof document === "undefined")
        return;
    setMetaTag("name", "theme-color", color);
};
// ============================================================================
// Viewport
// ============================================================================
const setViewport = (content) => {
    if (typeof document === "undefined")
        return;
    setMetaTag("name", "viewport", content);
};
// ============================================================================
// Performance Hints
// ============================================================================
const setPreloadHints = (preloads) => {
    if (typeof document === "undefined")
        return;
    // Remove existing preload hints for same resources
    preloads.forEach((preload) => {
        const existing = document.querySelector(`link[rel="preload"][href="${preload.href}"]`);
        if (existing)
            existing.remove();
    });
    // Add preload hints
    preloads.forEach((preload) => {
        const attrs = {
            rel: "preload",
            href: preload.href,
            as: preload.as,
        };
        if (preload.type)
            attrs.type = preload.type;
        if (preload.crossOrigin)
            attrs.crossorigin = preload.crossOrigin;
        if (preload.integrity)
            attrs.integrity = preload.integrity;
        setLinkTag(attrs);
    });
};
const setPreconnectHints = (origins) => {
    if (typeof document === "undefined")
        return;
    origins.forEach((origin) => {
        const attrs = {
            rel: "preconnect",
            href: origin.href,
        };
        if (origin.crossOrigin)
            attrs.crossorigin = origin.crossOrigin;
        setLinkTag(attrs);
    });
};
const setDnsPrefetchHints = (domains) => {
    if (typeof document === "undefined")
        return;
    domains.forEach((domain) => {
        setLinkTag({
            rel: "dns-prefetch",
            href: domain.href,
        });
    });
};
// ============================================================================
// Open Graph (Enhanced)
// ============================================================================
const setOpenGraph = (openGraph) => {
    if (!openGraph)
        return;
    const setOG = (property, content) => {
        if (content)
            setMetaTag("property", `og:${property}`, content);
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
                if (img.secureUrl)
                    setOG(`image:secure_url${suffix}`, img.secureUrl);
                if (img.type)
                    setOG(`image:type${suffix}`, img.type);
                if (img.width)
                    setOG(`image:width${suffix}`, String(img.width));
                if (img.height)
                    setOG(`image:height${suffix}`, String(img.height));
                if (img.alt)
                    setOG(`image:alt${suffix}`, img.alt);
            });
        }
        else {
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
// ============================================================================
// Twitter Card (Enhanced)
// ============================================================================
const setTwitterCard = (twitter, openGraphImage) => {
    if (!twitter)
        return;
    const setTW = (name, content) => {
        if (content)
            setMetaTag("name", `twitter:${name}`, content);
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
// ============================================================================
// Main SEO Update Function
// ============================================================================
export const updateSEO = (options) => {
    if (typeof document === "undefined")
        return;
    // Title with template support
    if (options.title) {
        const title = options.titleTemplate
            ? options.titleTemplate.replace("%s", options.title)
            : options.title;
        document.title = title;
    }
    // Language
    if (options.lang) {
        document.documentElement.lang = options.lang;
    }
    // Description
    if (options.description) {
        setMetaTag("name", "description", options.description);
    }
    // Canonical
    if (options.canonical) {
        setLinkTag({ rel: "canonical", href: options.canonical });
    }
    // Robots
    if (options.robots !== undefined) {
        // Handle both RobotsMeta and RobotsDirective[] types
        if (Array.isArray(options.robots)) {
            // Convert directive array to RobotsMeta object
            const robotsMeta = {};
            options.robots.forEach((directive) => {
                switch (directive) {
                    case "index":
                        robotsMeta.index = true;
                        break;
                    case "noindex":
                        robotsMeta.index = false;
                        break;
                    case "follow":
                        robotsMeta.follow = true;
                        break;
                    case "nofollow":
                        robotsMeta.follow = false;
                        break;
                    case "noarchive":
                        robotsMeta.archive = false;
                        break;
                    case "nosnippet":
                        robotsMeta.snippet = false;
                        break;
                    case "notranslate":
                        robotsMeta.translate = false;
                        break;
                    case "noimageindex":
                        robotsMeta.imageIndex = false;
                        break;
                }
            });
            setRobotsMeta(robotsMeta);
        }
        else {
            setRobotsMeta(options.robots);
        }
    }
    // Viewport
    if (options.viewport) {
        setViewport(options.viewport);
    }
    // Theme Color
    if (options.themeColor) {
        setThemeColor(options.themeColor);
    }
    // Favicon
    if (options.favicon) {
        setFavicon(options.favicon);
    }
    if (options.appleTouchIcon) {
        setAppleTouchIcon(options.appleTouchIcon);
    }
    if (options.maskIcon) {
        setMaskIcon(options.maskIcon);
    }
    // Hreflang
    if (options.hreflang && options.hreflang.length > 0) {
        setHreflangTags(options.hreflang);
    }
    // Performance Hints
    if (options.preload && options.preload.length > 0) {
        setPreloadHints(options.preload);
    }
    if (options.preconnect && options.preconnect.length > 0) {
        setPreconnectHints(options.preconnect);
    }
    if (options.dnsPrefetch && options.dnsPrefetch.length > 0) {
        setDnsPrefetchHints(options.dnsPrefetch);
    }
    // Custom Meta Tags
    if (options.meta && Array.isArray(options.meta)) {
        options.meta.forEach((m) => {
            if (m.name)
                setMetaTag("name", m.name, m.content);
            if (m.property)
                setMetaTag("property", m.property, m.content);
            if (m.httpEquiv)
                setMetaTag("httpEquiv", m.httpEquiv, m.content);
            if (m.charset)
                setMetaTag("charset", m.charset);
        });
    }
    // Custom Link Tags
    if (options.link && Array.isArray(options.link)) {
        options.link.forEach((link) => {
            const attrs = { rel: link.rel, href: link.href };
            if (link.type)
                attrs.type = link.type;
            if (link.sizes)
                attrs.sizes = link.sizes;
            if (link.media)
                attrs.media = link.media;
            if (link.crossOrigin)
                attrs.crossorigin = link.crossOrigin;
            if (link.as)
                attrs.as = link.as;
            setLinkTag(attrs);
        });
    }
    // Open Graph
    setOpenGraph(options.openGraph);
    // Twitter Card
    setTwitterCard(options.twitter, options.openGraph);
    // Additional Meta Tags (backward compatibility)
    if (options.additionalMetaTags && Array.isArray(options.additionalMetaTags)) {
        options.additionalMetaTags.forEach((m) => {
            if (m.name)
                setMetaTag("name", m.name, m.content);
            if (m.property)
                setMetaTag("property", m.property, m.content);
        });
    }
    // Additional Link Tags (backward compatibility)
    if (options.additionalLinkTags && Array.isArray(options.additionalLinkTags)) {
        options.additionalLinkTags.forEach((link) => {
            const attrs = { rel: link.rel, href: link.href };
            if (link.type)
                attrs.type = link.type;
            if (link.sizes)
                attrs.sizes = link.sizes;
            if (link.media)
                attrs.media = link.media;
            if (link.crossOrigin)
                attrs.crossorigin = link.crossOrigin;
            if (link.as)
                attrs.as = link.as;
            setLinkTag(attrs);
        });
    }
};
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Remove all SEO meta tags added by this library
 */
export const clearSEO = () => {
    if (typeof document === "undefined")
        return;
    // Remove all meta tags with data-seo attribute
    document.querySelectorAll('meta[data-seo="true"]').forEach((el) => el.remove());
    // Remove all link tags with data-seo attribute
    document.querySelectorAll('link[data-seo="true"]').forEach((el) => el.remove());
    // Reset title
    document.title = "";
};
/**
 * Get current SEO state from DOM
 */
export const getCurrentSEOState = () => {
    if (typeof document === "undefined")
        return null;
    const metaTags = [];
    const linkTags = [];
    // Get all meta tags
    document.querySelectorAll("meta").forEach((meta) => {
        const name = meta.getAttribute("name");
        const property = meta.getAttribute("property");
        const content = meta.getAttribute("content");
        if (content) {
            if (name) {
                metaTags.push({ name, content });
            }
            else if (property) {
                metaTags.push({ property, content });
            }
        }
    });
    // Get all link tags
    document.querySelectorAll("link").forEach((link) => {
        const rel = link.getAttribute("rel");
        const href = link.getAttribute("href");
        const type = link.getAttribute("type");
        const sizes = link.getAttribute("sizes");
        if (rel && href) {
            linkTags.push({
                rel,
                href,
                ...(type && { type }),
                ...(sizes && { sizes }),
            });
        }
    });
    return {
        title: document.title,
        lang: document.documentElement.lang,
        metaTags,
        linkTags,
    };
};
