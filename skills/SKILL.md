# @umituz/web-seo Skill

Comprehensive SEO solution for React Vite applications with structured data, performance hints, and build-time optimization.

## Triggers

Setup and install @umituz/web-seo when:
- "Setup SEO" or "SEO kurulumu"
- "Install SEO package" or "SEO paketi kur"
- "Initialize SEO" or "SEO başlat"
- "Add meta tags" or "Meta etiketleri ekle"
- "Open Graph" or "Twitter Cards"
- "Structured data" or "JSON-LD" or "Schema.org"
- "Sitemap generation" or "robots.txt"
- "Vite SEO plugin" or "SEO optimization"
- "Hreflang" or "International SEO"
- "Performance hints" or "Preload resources"

## Parameters

### `interactive` (boolean, default: true)
Enable interactive prompts for configuration options.

### `mode` ('basic' | 'blog' | 'ecommerce' | 'multilingual' | 'full', default: 'basic')
Installation mode that determines which features to configure:
- `basic`: Core meta tags, Open Graph, Twitter Cards
- `blog`: Article schema, breadcrumbs, social sharing
- `ecommerce`: Product schema, price markup, rating system
- `multilingual`: Hreflang tags, language-specific SEO
- `full`: All features enabled

### `viteConfig` (boolean, default: true)
Automatically configure Vite plugin for sitemap and robots.txt generation.

### `ssrSupport` (boolean, default: false)
Enable SSR utilities and configuration.

### `siteUrl` (string, optional)
Site base URL (e.g., "https://example.com"). If not provided, will prompt during setup.

## Installation

```bash
npm install @umituz/web-seo
```

### Install Dependencies

This package has the following peer dependencies:
- `react`: >=16.8.0
- `react-dom`: >=16.8.0
- `vite`: >=2.0.0 (optional)

## Configuration

### Vite Plugin Setup

If `viteConfig` is enabled, automatically add the plugin to `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSEOPlugin } from "@umituz/web-seo/vite";

export default defineConfig({
  plugins: [
    react(),
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

### Root Layout Setup

For non-SSR applications, wrap your app with SEO configuration:

```tsx
// src/App.tsx
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

### SSR Setup

If `ssrSupport` is enabled:

```typescript
// server.tsx (or server entry point)
import { renderSEO, generateHead } from "@umituz/web-seo";

const seoOptions = {
  title: "My Page",
  description: "My description",
  // ... other options
};

// Generate HTML head
const headHTML = generateHead(seoOptions);
```

```tsx
// client.tsx (or client entry point)
import { hydrateSEO } from "@umituz/web-seo";

// Hydrate on client
hydrateSEO(JSON.stringify(seoOptions));
```

## Examples by Mode

### Basic Mode

```tsx
import { SEO } from "@umituz/web-seo";

function HomePage() {
  return (
    <SEO
      title="Home | My Website"
      description="Welcome to my website"
      canonical="https://example.com"
    />
  );
}
```

### Blog Mode

```tsx
import { SEO, JsonLd, generateArticleSchema } from "@umituz/web-seo";

function BlogPostPage({ post }) {
  const schema = generateArticleSchema({
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    authorName: post.author.name,
    publisherName: "Your Publisher",
    publisherLogo: "https://example.com/logo.png",
    url: `https://example.com/blog/${post.slug}`,
  });

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`https://example.com/blog/${post.slug}`}
        openGraph={{
          type: "article",
          title: post.title,
          description: post.excerpt,
          image: post.coverImage,
          article: {
            publishedTime: post.publishedAt,
            author: post.author.name,
            section: post.category,
          },
        }}
        breadcrumbs={[
          { name: "Home", url: "https://example.com" },
          { name: "Blog", url: "https://example.com/blog" },
          { name: post.title, url: `https://example.com/blog/${post.slug}` },
        ]}
      />
      <JsonLd data={schema} />
      <article>{/* Your post content */}</article>
    </>
  );
}
```

### E-commerce Mode

```tsx
import { SEO, JsonLd, generateProductSchema } from "@umituz/web-seo";

function ProductPage({ product }) {
  const schema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.images,
    brand: product.brand,
    sku: product.sku,
    offers: {
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock ? "InStock" : "OutOfStock",
      url: `https://example.com/products/${product.slug}`,
    },
    aggregateRating: product.rating ? {
      ratingValue: product.rating.average,
      reviewCount: product.rating.count,
    } : undefined,
  });

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        canonical={`https://example.com/products/${product.slug}`}
        openGraph={{
          type: "product",
          title: product.name,
          description: product.description,
          image: product.images[0],
          product: {
            price: product.price,
            currency: "USD",
            availability: product.inStock ? "InStock" : "OutOfStock",
          },
        }}
      />
      <JsonLd data={schema} />
      <div>{/* Your product content */}</div>
    </>
  );
}
```

### Multilingual Mode

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

## Validation

After installation, validate your SEO setup:

```tsx
import { validateSEO, auditSEO } from "@umituz/web-seo";

function MyPage() {
  const seoOptions = {
    title: "My Page",
    description: "My description",
  };

  // Validate in development
  if (import.meta.env.DEV) {
    auditSEO(seoOptions);
  }

  return <SEO {...seoOptions} />;
}
```

## Build Verification

After installation, run the following to verify:

```bash
# Type check
npm run typecheck

# Build
npm run build

# Check for generated files
ls -la dist/sitemap.xml
ls -la dist/robots.txt
```

## Cleanup

To remove the SEO package:

1. Uninstall the package:
   ```bash
   npm uninstall @umituz/web-seo
   ```

2. Remove Vite plugin configuration from `vite.config.ts`

3. Remove SEO components and imports from your application

4. Delete any example files created during setup

## Troubleshooting

### Type Errors
- Ensure `react` and `react-dom` are installed as peer dependencies
- Check TypeScript version compatibility

### Vite Plugin Issues
- Verify `vite` version is >=2.0.0
- Check that `siteUrl` is a valid HTTPS URL

### Build Errors
- Run `npm run typecheck` to identify type issues
- Check console for SEO validation warnings

## Additional Resources

- [Package README](./README.md)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
