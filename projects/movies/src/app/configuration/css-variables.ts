export function setProp(prop: string, val: string, fallback?: string): void {
  document.documentElement.style.setProperty('--' + prop, val || fallback || '');
}
