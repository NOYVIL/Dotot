const stripLeadingSlash = (value: string) => value.replace(/^\/+/, '');

export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${stripLeadingSlash(path)}`;
}

export const GRID_URLS = Array.from(
  { length: 6 },
  (_, index) => assetUrl(`grids/grid${index + 1}.svg`),
);

export const DEFAULT_GRID_URL = GRID_URLS[0];
export const LOGO_URL = assetUrl('logo2.svg');

export function normalizeStoredGrid(value: string | null): string {
  if (!value) return DEFAULT_GRID_URL;

  const match = value.match(/grids\/(grid[1-6])\.(?:png|svg)/i);
  if (!match) return DEFAULT_GRID_URL;

  return assetUrl(`grids/${match[1].toLowerCase()}.svg`);
}
