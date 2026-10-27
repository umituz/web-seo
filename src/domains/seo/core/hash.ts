/**
 * cyrb53 content hash with WeakMap memoization.
 *
 * Produces a stable, URL-safe id from any JSON-LD payload. Used by both
 * the JsonLd component and the useJsonLd hook to give each schema instance
 * a deterministic script-tag id, so the same payload re-uses the same <script>
 * node and the DOM stays clean.
 */

const hashCache = new WeakMap<object, string>();

const cyrb53 = (str: string): string => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};

export const generateDataId = (data: object): string => {
  if (hashCache.has(data)) {
    return hashCache.get(data)!;
  }

  const id = `jsonld-${cyrb53(JSON.stringify(data))}`;
  hashCache.set(data, id);
  return id;
};
