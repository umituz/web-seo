# @umituz/web-seo

> Comprehensive SEO solution for React Vite applications with Domain-Driven Design architecture

## Features

### ✅ Core SEO
- 📝 Dynamic meta tag management
- 🌐 Open Graph support
- 🐦 Twitter Card support
- 🔗 Canonical URL management
- 🌍 hreflang support for international SEO
- 🤖 Robots meta control (noindex, nofollow, etc.)
- 🎨 Theme color and favicon management
- 📱 Viewport configuration

### 📊 Structured Data (JSON-LD)
- 📰 Article/News/Blog schema
- 🛒 Product schema
- 🏢 Organization schema
- 🏪 Local Business schema
- 🍞 Breadcrumb schema
- ❓ FAQ schema
- 🌐 WebSite schema
- 👤 Person schema
- 🎥 Video schema

### ⚡ Performance Optimization
- ⚡ Preload hints for critical resources
- 🔗 Preconnect to external origins
- 🔍 DNS prefetch for performance
- 🎯 Resource priority management

### 🛠️ Build-time SEO (Vite Plugin)
- 🗺️ Automatic sitemap.xml generation
- 🤖 Automatic robots.txt generation
- 🔍 Route discovery
- 📊 SEO audit at build time

### 🖥️ SSR Support
- 📄 Server-side rendering utilities
- 🔄 Hydration support
- 📦 Serialization/deserialization
- 🎯 Helmet-like API compatibility

### ✅ Validation & Dev Tools
- ✔️ URL validation
- 📏 Content length checking
- 🖼️ Image dimension validation
- 🔍 Schema validation
- 📊 SEO audit functionality
- 💡 Development warnings

## Installation

```bash
npm install @umituz/web-seo
# or
yarn add @umituz/web-seo
# or
pnpm add @umituz/web-seo
```

## Quick Start

### Basic Usage

```tsx
import { SEO } from "@umituz/web-seo";

function App() {
  return (
    <>
      <SEO
        title="My Awesome Website"
        description="A comprehensive description of my website"
        canonical="https://example.com"
        openGraph={{
          type: "website",
          url: "https://example.com",
          title: "My Awesome Website",
          description: "A comprehensive description of my website",
          image: "https://example.com/og-image.jpg",
        }}
        twitter={{
          cardType: "summary_large_image",
          site: "@yourhandle",
        }}
      />
      <YourAppContent />
    </>
  );
}
```

### Using the Hook

```tsx
import { useSEO } from "@umituz/web-seo";

function BlogPost({ post }) {
  useSEO({
    title: post.title,
    description: post.excerpt,
    canonical: `https://example.com/blog/${post.slug}`,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      image: post.coverImage,
      article: {
        publishedTime: post.publishedAt,
        author: post.author.name,
        section: post.category,
      },
    },
  });

  return <article>{/* Your post content */}</article>;
}
```

### Structured Data (JSON-LD)

```tsx
import { JsonLd, generateArticleSchema } from "@umituz/web-seo";

function ArticlePage({ article }) {
  const schema = generateArticleSchema({
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishedAt,
    authorName: article.author.name,
    publisherName: "Your Publisher",
    publisherLogo: "https://example.com/logo.png",
    url: `https://example.com/articles/${article.slug}`,
  });

  return (
    <>
      <SEO title={article.title} description={article.excerpt} />
      <JsonLd data={schema} />
      <article>{/* Your article content */}</article>
    </>
  );
}
```

### International SEO (hreflang)

```tsx
import { SEO } from "@umituz/web-seo";

function LocalizedPage() {
  return (
    <SEO
      title="My Page"
      hreflang={[
        { lang: "en", url: "https://example.com/en/page" },
        { lang: "tr", url: "https://example.com/tr/page" },
        { lang: "de", url: "https://example.com/de/page" },
        { lang: "x-default", url: "https://example.com/en/page" },
      ]}
    />
  );
}
```

### Performance Hints

```tsx
import { SEO } from "@umituz/web-seo";

function PerformanceOptimizedPage() {
  return (
    <SEO
      title="My Page"
      preload={[
        { href: "/fonts/main.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
        { href: "/images/hero.jpg", as: "image" },
      ]}
      preconnect={[
        { href: "https://cdn.example.com", crossOrigin: "anonymous" },
      ]}
      dnsPrefetch={[
        { href: "https://analytics.example.com" },
      ]}
    />
  );
}
```

### Vite Plugin Setup

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { viteSEOPlugin } from "@umituz/web-seo";

export default defineConfig({
  plugins: [
    viteSEOPlugin({
      siteUrl: "https://example.com",
      discoverRoutes: true,
      sitemap: {
        changefreq: "weekly",
        priority: 0.8,
      },
      robotsTxt: {
        disallow: ["/api", "/admin"],
      },
    }),
  ],
});
```

### SSR Usage

```typescript
import { renderSEO, generateHead } from "@umituz/web-seo";

// On server
const seoOptions = {
  title: "My Page",
  description: "My description",
  // ... other options
};

// Generate HTML head
const headHTML = generateHead(seoOptions);

// Or just the SEO tags
const seoHTML = renderSEO(seoOptions).toHTML();

// Hydrate on client
import { hydrateSEO } from "@umituz/web-seo";
hydrateSEO(JSON.stringify(seoOptions));
```

### Validation

```tsx
import { validateSEO, auditSEO } from "@umituz/web-seo";

function MyPage() {
  const seoOptions = {
    title: "My Page",
    description: "My description",
    // ... other options
  };

  // Validate in development
  if (import.meta.env.DEV) {
    auditSEO(seoOptions);
  }

  return <SEO {...seoOptions} />;
}
```

## API Reference

### Components

#### `<SEO />`
Main SEO component for managing meta tags and SEO elements.

**Props:** `SEOptions` (see types below)

#### `<JsonLd />`
Component for injecting JSON-LD structured data.

**Props:**
- `data`: `JsonLdTypes | JsonLdTypes[]` - Schema.org data
- `id?`: `string` - Unique identifier
- `strategy?`: `"afterInteractive" | "beforeInteractive" | "idle"` - Injection strategy

### Hooks

#### `useSEO(options: SEOptions)`
Hook for programmatically managing SEO.

#### `useJsonLd(data: JsonLdTypes | JsonLdTypes[], options?)`
Hook for managing JSON-LD structured data.

### Schema Generators

- `generateArticleSchema(input)` - Article/News/Blog schema
- `generateProductSchema(input)` - Product schema
- `generateOrganizationSchema(input)` - Organization schema
- `generateLocalBusinessSchema(input)` - Local business schema
- `generateBreadcrumbSchema(items)` - Breadcrumb schema
- `generateFAQSchema(faqs)` - FAQ schema
- `generateWebSiteSchema(input)` - Website schema
- `generatePersonSchema(input)` - Person schema
- `generateVideoSchema(input)` - Video schema

### Validators

- `validateSEO(options)` - Comprehensive SEO validation
- `auditSEO(options)` - SEO audit with console output
- `isValidUrl(url)` - URL validation
- `validateTitleLength(title)` - Title length check
- `validateDescriptionLength(description)` - Description length check
- `validateOpenGraphImage(image, width, height, size)` - OG image validation

### SSR Functions

- `renderSEO(options)` - Render SEO to HTML strings
- `generateHead(options)` - Generate complete HTML head
- `extractSEOData(options)` - Extract data for hydration
- `hydrateSEO(data)` - Hydrate on client side

### Vite Plugin

#### `viteSEOPlugin(options)`
Vite plugin for build-time SEO optimization.

**Options:**
- `siteUrl`: `string` - Base URL of your site
- `routes?`: `string[]` - Routes to include in sitemap
- `discoverRoutes?`: `boolean` - Auto-discover routes
- `sitemap?`: `object` - Sitemap configuration
- `robotsTxt?`: `object` - robots.txt configuration

#### `quickSEOSetup`
Convenience presets:
- `quickSEOSetup.basic(siteUrl, routes?)`
- `quickSEOSetup.blog(siteUrl, routes?)`
- `quickSEOSetup.ecommerce(siteUrl, routes?)`

## Type Definitions

### SEOptions

```typescript
interface SEOptions {
  // Basic
  title?: string;
  titleTemplate?: string;
  description?: string;
  lang?: string;
  canonical?: string;

  // Robots
  robots?: RobotsMeta | RobotsDirective[];

  // Meta Tags
  meta?: MetaTag[];
  link?: LinkTag[];

  // Open Graph
  openGraph?: {
    type?: "website" | "article" | "product" | "profile" | "music" | "video" | "book";
    url?: string;
    title?: string;
    description?: string;
    image?: string | OpenGraphImage[];
    // ... more options
  };

  // Twitter Card
  twitter?: {
    cardType?: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    handle?: string;
    // ... more options
  };

  // Structured Data
  jsonLd?: JsonLdTypes[];

  // International SEO
  hreflang?: HreflangEntry[];

  // Performance Hints
  preload?: PreloadHint[];
  preconnect?: PreconnectOrigin[];
  dnsPrefetch?: DnsPrefetchDomain[];

  // Breadcrumb
  breadcrumbs?: BreadcrumbItem[];

  // Favicon
  favicon?: string;
  appleTouchIcon?: string;
  maskIcon?: string;
  themeColor?: string;

  // Viewport
  viewport?: string;
}
```

## Architecture

This package follows Domain-Driven Design (DDD) principles:

```
src/
└── domains/
    └── seo/
        ├── components/      # React components
        ├── hooks/          # React hooks
        ├── utils/          # Utility functions
        ├── core/           # Core functionality
        ├── types/          # TypeScript types
        ├── vite/           # Vite plugin
        └── ssr/            # SSR utilities
```

## Examples

See the `/examples` directory for complete examples:

- Basic website
- Blog with structured data
- E-commerce site
- Multi-language site
- SSR integration

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT © umituz

## Support

For issues and questions, please use the GitHub issue tracker.
