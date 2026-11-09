
import { memo, useMemo } from "react";
import { useSEO } from "../hooks/index.js";
import type { SEOptions } from "../types/index.js";
import type { RouteMeta } from "../vite/types.js";

export interface RouteSEOProps {
  routes: Record<string, RouteMeta>;
  siteUrl?: string;
  fallback?: RouteMeta;
}

const normalizePath = (path: string): string => {
  const stripped = path.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
};

const toOpenGraph = (
  meta: RouteMeta,
  path: string,
  siteUrl?: string,
): SEOptions["openGraph"] => {
  const og = meta.og;
  if (!og) return undefined;
  return {
    title: og.title ?? meta.title,
    description: og.description ?? meta.description,
    image: og.image,
    url: og.url ?? (siteUrl ? `${siteUrl}${path}` : undefined),
    siteName: og.siteName,
    ...(og.type ? { type: og.type as NonNullable<SEOptions["openGraph"]>["type"] } : {}),
  };
};

const toTwitter = (meta: RouteMeta): SEOptions["twitter"] => {
  const twitter = meta.twitter;
  if (!twitter) return undefined;
  return {
    ...(twitter.card ? { cardType: twitter.card as NonNullable<SEOptions["twitter"]>["cardType"] } : {}),
    site: twitter.site,
    handle: twitter.creator,
    title: twitter.title ?? meta.title,
    description: twitter.description ?? meta.description,
    image: twitter.image,
  };
};

const RouteSEOComponent = ({ routes, siteUrl, fallback }: RouteSEOProps) => {
  const path = typeof window === "undefined" ? "/" : normalizePath(window.location.pathname);
  const meta = routes[path];

  const options = useMemo<SEOptions>(() => {
    if (meta) {
      return {
        title: meta.title,
        description: meta.description,
        lang: meta.lang,
        canonical: meta.canonical ?? (siteUrl ? `${siteUrl}${path}` : undefined),
        robots: { index: true, follow: true },
        openGraph: toOpenGraph(meta, path, siteUrl),
        twitter: toTwitter(meta),
      };
    }
    return {
      title: fallback?.title,
      description: fallback?.description,
      robots: { index: false, follow: false },
    };
  }, [meta, siteUrl, path, fallback]);

  useSEO(options);
  return null;
};

export const RouteSEO = memo(RouteSEOComponent);
