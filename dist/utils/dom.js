const setMetaTag = (attrName, attrValue, content) => {
    if (typeof document === "undefined")
        return;
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
};
export const updateSEO = (options) => {
    if (typeof document === "undefined")
        return;
    // Title
    if (options.title) {
        document.title = options.title;
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
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "canonical");
            document.head.appendChild(link);
        }
        link.setAttribute("href", options.canonical);
    }
    // Custom Meta
    if (options.meta && Array.isArray(options.meta)) {
        options.meta.forEach(m => {
            if (m.name)
                setMetaTag("name", m.name, m.content);
            if (m.property)
                setMetaTag("property", m.property, m.content);
        });
    }
    // Open Graph
    if (options.openGraph) {
        if (options.openGraph.title)
            setMetaTag("property", "og:title", options.openGraph.title);
        if (options.openGraph.description)
            setMetaTag("property", "og:description", options.openGraph.description);
        if (options.openGraph.url)
            setMetaTag("property", "og:url", options.openGraph.url);
        if (options.openGraph.type)
            setMetaTag("property", "og:type", options.openGraph.type);
        if (options.openGraph.image)
            setMetaTag("property", "og:image", options.openGraph.image);
    }
    // Twitter
    if (options.twitter) {
        if (options.twitter.cardType)
            setMetaTag("name", "twitter:card", options.twitter.cardType);
        if (options.twitter.site)
            setMetaTag("name", "twitter:site", options.twitter.site);
        if (options.twitter.handle)
            setMetaTag("name", "twitter:creator", options.twitter.handle);
        if (options.description)
            setMetaTag("name", "twitter:description", options.description);
        if (options.title)
            setMetaTag("name", "twitter:title", options.title);
        if (options.openGraph?.image)
            setMetaTag("name", "twitter:image", options.openGraph.image);
    }
};
