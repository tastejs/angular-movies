export function parseTitle(title: string) {
  return title?.replace(/[-_]/, ' ');
}
