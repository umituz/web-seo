
import type { SEOptions } from "../types/index.js";

export interface DOMContext {
  setMeta: (name: string, content: string | undefined) => void;
  setLink: (attrs: Record<string, string>) => void;
}

export interface HTMLContext {
  meta: string[];
  link: string[];
  jsonLd: string[];
}

export interface Strategy {
  readonly id: string;
  applies(options: SEOptions): boolean;
  applyDOM(options: SEOptions, ctx: DOMContext): void;
  applyHTML(options: SEOptions, ctx: HTMLContext): void;
}
