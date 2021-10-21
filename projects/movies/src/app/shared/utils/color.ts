/**
 * @description
 * Returns a color based off of the first character in the passed string.
 * If no string is passed it returns a random hex color
 */
export function stringColor(val?: string): string {
  // eslint-disable-next-line no-bitwise
  return '#' + ('00000' + (val ? val.charCodeAt(0) : Math.random() / 100 * (1 << 24) | 0).toString(16)).slice(-6);
}
