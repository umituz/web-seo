import { describe, expect, it } from "vitest";
import { injectRouteMeta } from "./html-rewriter.js";

const template = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Fallback</title>
  </head>
  <body><div id="root"></div></body>
</html>`;

describe("injectRouteMeta alternates", () => {
  it("hreflang kümesini ve og:locale yazar", () => {
    const out = injectRouteMeta(
      template,
      {
        title: "Start",
        lang: "tr",
        alternates: [
          { lang: "tr", href: "https://x.test/tr" },
          { lang: "en", href: "https://x.test/en" },
          { lang: "x-default", href: "https://x.test/en" },
        ],
        og: { locale: "tr_TR" },
      },
      "https://x.test",
      "/tr"
    );

    expect(out).toContain('<link rel="alternate" hreflang="tr" href="https://x.test/tr" />');
    expect(out).toContain('<link rel="alternate" hreflang="en" href="https://x.test/en" />');
    expect(out).toContain('<link rel="alternate" hreflang="x-default" href="https://x.test/en" />');
    expect(out).toContain('<meta property="og:locale" content="tr_TR" />');
    expect(out).toContain('<html lang="tr">');
    expect(out).toContain('<link rel="canonical" href="https://x.test/tr" />');
  });

  it("alternates yoksa link eklemez", () => {
    const out = injectRouteMeta(template, { title: "A" }, "https://x.test", "/a");
    expect(out).not.toContain('hreflang=');
    expect(out).not.toContain('og:locale');
  });

  it("mevcut hreflang linklerini değiştirir (idempotent)", () => {
    const first = injectRouteMeta(
      template,
      { title: "A", alternates: [{ lang: "de", href: "https://x.test/de" }] },
      "https://x.test",
      "/de"
    );
    const second = injectRouteMeta(
      first,
      { title: "A", alternates: [{ lang: "fr", href: "https://x.test/fr" }] },
      "https://x.test",
      "/fr"
    );
    expect(second).toContain('hreflang="fr"');
    expect(second.match(/hreflang="de"/g)).toBeNull();
  });
});
