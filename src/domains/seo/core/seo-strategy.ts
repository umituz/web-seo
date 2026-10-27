/**
 * SEO rendering strategies.
 *
 * A strategy encapsulates one piece of SEO output (title, robots, OG tags,
 * hreflang, etc.). The same strategy is consumed by:
 *   - `dom/dom-mutator.ts`        – applies the change to the live DOM
 *   - `ssr/renderer.ts`           – serializes the change to an HTML string
 *
 * This is the Strategy pattern: a list of small, focused objects, each
 * responsible for one concern, dispatched by a single orchestrator. It
 * eliminates the historical bug where SSR and the DOM output diverged
 * (e.g. SSR dropped OG image width/height/type).
 */

import type { SEOptions } from "../types/index.js";

/** Output for the DOM: a side-effect applied to `document.head`. */
export interface DOMContext {
  /** Apply or update a `<meta>` tag. `undefined` content is a no-op. */
  setMeta: (name: string, content: string | undefined) => void;
  /** Apply or update a `<link>` tag. */
  setLink: (attrs: Record<string, string>) => void;
}

/** Output for SSR: a builder that collects tags as HTML strings. */
export interface HTMLContext {
  meta: string[];
  link: string[];
  jsonLd: string[];
}

export interface Strategy {
  /** Stable key, useful for debugging and tests. */
  readonly id: string;
  /** Returns true when the strategy has work to do for these options. */
  applies(options: SEOptions): boolean;
  /** Apply to the live DOM. */
  applyDOM(options: SEOptions, ctx: DOMContext): void;
  /** Append HTML strings to the SSR context. */
  applyHTML(options: SEOptions, ctx: HTMLContext): void;
}
