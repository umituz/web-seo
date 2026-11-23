export interface RouteMatch<Meta> {
  key: string;
  meta: Meta;
  params: Record<string, string>;
}

const PARAM_SEGMENT = /^:[A-Za-z0-9_]+$/;

const segmentsOf = (value: string): string[] => value.split("/").filter((segment) => segment !== "");

export const isRoutePattern = (key: string): boolean => segmentsOf(key).some((segment) => PARAM_SEGMENT.test(segment));

export const normalizeRoutePath = (path: string): string => {
  const stripped = path.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
};

const staticSegmentCount = (key: string): number => segmentsOf(key).filter((segment) => !PARAM_SEGMENT.test(segment)).length;

const matchPattern = (key: string, path: string): Record<string, string> | null => {
  const keySegments = segmentsOf(key);
  const pathSegments = segmentsOf(path);
  if (keySegments.length !== pathSegments.length) return null;
  const params: Record<string, string> = {};
  for (let index = 0; index < keySegments.length; index += 1) {
    const keySegment = keySegments[index]!;
    const pathSegment = pathSegments[index]!;
    if (PARAM_SEGMENT.test(keySegment)) {
      params[keySegment.slice(1)] = decodeURIComponent(pathSegment);
    } else if (keySegment !== pathSegment) {
      return null;
    }
  }
  return params;
};

export const matchRoute = <Meta>(routes: Record<string, Meta>, path: string): RouteMatch<Meta> | null => {
  const normalizedPath = normalizeRoutePath(path);
  const exact = routes[normalizedPath];
  if (exact) return { key: normalizedPath, meta: exact, params: {} };
  const patternKeys = Object.keys(routes)
    .filter((key) => isRoutePattern(key))
    .sort((a, b) => staticSegmentCount(b) - staticSegmentCount(a));
  for (const key of patternKeys) {
    const params = matchPattern(normalizeRoutePath(key), normalizedPath);
    if (params) return { key, meta: routes[key]!, params };
  }
  return null;
};
