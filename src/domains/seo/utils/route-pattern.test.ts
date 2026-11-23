import { describe, expect, it } from 'vitest';
import { isRoutePattern, matchRoute, normalizeRoutePath } from './route-pattern.js';

describe('isRoutePattern', () => {
  it('detects param segments and leaves concrete paths alone', () => {
    expect(isRoutePattern('/u/:slug')).toBe(true);
    expect(isRoutePattern('/stories/:category/:slug')).toBe(true);
    expect(isRoutePattern('/u/:slug/')).toBe(true);
    expect(isRoutePattern('/u/some-user')).toBe(false);
    expect(isRoutePattern('/pricing')).toBe(false);
    expect(isRoutePattern('/')).toBe(false);
  });
});

describe('normalizeRoutePath', () => {
  it('strips trailing slashes and keeps the root', () => {
    expect(normalizeRoutePath('/u/ada/')).toBe('/u/ada');
    expect(normalizeRoutePath('///')).toBe('/');
    expect(normalizeRoutePath('/pricing')).toBe('/pricing');
  });
});

describe('matchRoute', () => {
  const routes = {
    '/': { title: 'home' },
    '/pricing': { title: 'pricing' },
    '/u/:slug': { title: 'profile' },
    '/u/settings/:tab': { title: 'settings tab' },
    '/stories/:category/:slug': { title: 'story' },
  };

  it('returns exact matches with no params', () => {
    expect(matchRoute(routes, '/pricing')).toEqual({ key: '/pricing', meta: { title: 'pricing' }, params: {} });
  });

  it('matches a single param pattern and captures it', () => {
    expect(matchRoute(routes, '/u/ada')).toEqual({ key: '/u/:slug', meta: { title: 'profile' }, params: { slug: 'ada' } });
  });

  it('captures multiple params in order', () => {
    expect(matchRoute(routes, '/stories/scifi/dune')).toEqual({
      key: '/stories/:category/:slug',
      meta: { title: 'story' },
      params: { category: 'scifi', slug: 'dune' },
    });
  });

  it('decodes percent-encoded segments', () => {
    expect(matchRoute(routes, '/u/ada%20l')?.params).toEqual({ slug: 'ada l' });
  });

  it('prefers the pattern with more static segments', () => {
    expect(matchRoute(routes, '/u/settings/privacy')?.key).toBe('/u/settings/:tab');
  });

  it('normalizes trailing slashes before matching', () => {
    expect(matchRoute(routes, '/u/ada/')?.key).toBe('/u/:slug');
  });

  it('returns null when nothing matches', () => {
    expect(matchRoute(routes, '/u/ada/extra')).toBeNull();
    expect(matchRoute(routes, '/private')).toBeNull();
  });
});
