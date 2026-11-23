/**
 * Combines class names cleanly, filtering out falsy values.
 */
export function cn(...inputs: Array<string | number | boolean | null | undefined>): string {
  return inputs
    .filter((value): value is string | number => typeof value === 'string' || typeof value === 'number')
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' ');
}
