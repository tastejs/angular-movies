export function isNoopZone(z: any): boolean {
  return z.constructor.name === 'NoopNgZone';
}
