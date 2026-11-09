import { describe, expect, it } from 'vitest';
import { saasSEOOptions } from './presets.js';

describe('saasSEOOptions', () => {
  it('builds the fleet sitemap/robots/prerender shape from site url', () => {
    const options = saasSEOOptions('https://demo.test.dev');
    expect(options.siteUrl).toBe('https://demo.test.dev');
    expect(options.routes).toEqual(['/']);
    expect(options.sitemap).toEqual({ filename: 'sitemap.xml' });
    expect(options.robotsTxt).toEqual({
      filename: 'robots.txt',
      allow: '/',
      disallow: ['/api/', '/auth/'],
      sitemap: 'https://demo.test.dev/sitemap.xml',
    });
    expect(options.prerender?.routes).toEqual({ '/': {} });
  });

  it('carries landing routes, brand fallback meta, and custom disallow', () => {
    const options = saasSEOOptions('https://demo.test.dev', {
      landing: [{ url: '/pricing', priority: 0.8 }, '/about'],
      brand: 'Demo',
      image: 'https://demo.test.dev/favicon.svg',
      disallow: ['/api/', '/auth/', '/admin/'],
      prerender: { '/': { title: 'Demo — home' } },
    });
    expect(options.routes).toEqual(['/', { url: '/pricing', priority: 0.8 }, '/about']);
    expect(options.robotsTxt?.disallow).toEqual(['/api/', '/auth/', '/admin/']);
    expect(options.prerender?.fallbackMeta).toEqual({
      og: { siteName: 'Demo', image: 'https://demo.test.dev/favicon.svg' },
      twitter: { card: 'summary_large_image', image: 'https://demo.test.dev/favicon.svg' },
    });
    expect(options.prerender?.routes).toEqual({ '/': { title: 'Demo — home' } });
  });

  it('omits fallback meta entirely when neither brand nor image is given', () => {
    const options = saasSEOOptions('https://demo.test.dev', { prerender: {} });
    expect(options.prerender?.fallbackMeta).toEqual({});
  });

  it('derives sitemap routes from the prerender map when landing is absent', () => {
    const options = saasSEOOptions('https://demo.test.dev', {
      prerender: {
        '/': { title: 'Home' },
        '/features': { title: 'Features' },
        '/about': { title: 'About' },
      },
    });
    expect(options.routes).toEqual(['/', '/features', '/about']);
  });

  it('prefers explicit landing routes over the prerender map', () => {
    const options = saasSEOOptions('https://demo.test.dev', {
      landing: ['/pricing'],
      prerender: { '/': {}, '/features': {} },
    });
    expect(options.routes).toEqual(['/', '/pricing']);
  });
});
