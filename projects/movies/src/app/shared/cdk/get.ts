/**
 * Safely plucks a property value from an object
 * `obj && prop in obj ? obj[prop] : fallback`
 */
export function pluck<T extends Record<string, unknown>, K extends keyof T>(
  o: T,
  p: K,
  f?: T[K]
): T[K] {
  return o && p in o ? o[p] : (f as T[K]);
}
