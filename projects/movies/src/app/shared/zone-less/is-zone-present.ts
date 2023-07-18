/**
 * @description
 * returns true if zone.js polyfills are imported, false otherwise
 */
export function isZonePresent(): boolean {
  return !!(window as unknown as { Zone: unknown }).Zone;
}
