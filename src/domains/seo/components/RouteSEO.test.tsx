import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RouteSEO } from './RouteSEO.js';

const ROUTES = {
  '/': { title: 'Demo — vertical SaaS', description: 'Run your studio end to end.' },
  '/pricing': { title: 'Pricing — Demo' },
};

let container: HTMLElement | null = null;
let root: Root | null = null;

const nextFrame = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
};

const render = async (ui: React.ReactElement) => {
  act(() => {
    root?.render(ui);
  });
  await nextFrame();
  await nextFrame();
};

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  container?.remove();
  container = null;
  root = null;
  document.title = '';
  document.querySelectorAll('meta[name="robots"]').forEach((el) => el.remove());
});

const robotsContent = (): string =>
  document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';

describe('RouteSEO', () => {
  it('indexes a public route and applies its title and canonical', async () => {
    window.history.replaceState({}, '', '/');
    await render(<RouteSEO routes={ROUTES} siteUrl="https://demo.test.dev" />);
    expect(document.title).toBe('Demo — vertical SaaS');
    expect(robotsContent()).not.toMatch(/noindex/);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://demo.test.dev/');
  });

  it('noindexes any path outside the public map', async () => {
    window.history.replaceState({}, '', '/dashboard/cases');
    await render(<RouteSEO routes={ROUTES} siteUrl="https://demo.test.dev" fallback={{ title: 'Demo app' }} />);
    expect(document.title).toBe('Demo app');
    expect(robotsContent()).toMatch(/noindex/);
  });

  it('normalizes trailing slashes when matching routes', async () => {
    window.history.replaceState({}, '', '/pricing/');
    await render(<RouteSEO routes={ROUTES} siteUrl="https://demo.test.dev" />);
    expect(document.title).toBe('Pricing — Demo');
    expect(robotsContent()).not.toMatch(/noindex/);
  });
});
