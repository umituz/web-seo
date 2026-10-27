/**
 * Schema generator base (Template Method).
 *
 * Each generator runs the same flow:
 *   1. Validate required fields (warn in non-strict, throw in strict).
 *   2. Build the schema body.
 *   3. Return the assembled JSON-LD object.
 *
 * `buildSchema` wraps that flow so individual generators can focus on
 * the schema body that actually differs between types.
 */

import { SCHEMA_CONTEXT } from "../../core/constants.js";
import type { SchemaGeneratorOptions } from "../../types/schema.js";

type RequiredField = string | number | boolean | object | null | undefined;

const isMissing = (value: RequiredField): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

export const validateRequired = (
  value: RequiredField,
  fieldName: string,
  strict = false
): void => {
  if (isMissing(value)) {
    const message = `[SEO] Schema validation: Required field "${fieldName}" is missing or empty`;
    if (strict) throw new Error(message);
    console.warn(message);
  }
};

export interface BuildContext<T> {
  options: Required<SchemaGeneratorOptions>;
  required(field: RequiredField, name: string): void;
  set(input: Partial<T>): void;
}

export const createBuilder = <TInput, TOutput>(
  build: (input: TInput, ctx: BuildContext<TOutput>) => void
) => (input: TInput, options?: SchemaGeneratorOptions): TOutput => {
  const opts: Required<SchemaGeneratorOptions> = { strict: false, validate: true, ...options };
  const body: Record<string, unknown> = {};
  const ctx: BuildContext<TOutput> = {
    options: opts,
    required(value, name) {
      if (!opts.validate) return;
      validateRequired(value, name, opts.strict);
    },
    set(partial) {
      Object.assign(body, partial);
    },
  };
  build(input, ctx);
  return body as TOutput;
};

export const withContext = <T extends string>(type: T): { "@context": string; "@type": T } => ({
  "@context": SCHEMA_CONTEXT,
  "@type": type,
});
