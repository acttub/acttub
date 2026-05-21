export const BASE_PATH = "/community";

export function apiUrl(path: string): string {
  return `${BASE_PATH}${path}`;
}
