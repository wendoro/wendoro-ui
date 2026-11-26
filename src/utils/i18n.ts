/**
 * Internationalization, locale-aware formatting, timezone presentation, and RTL helpers.
 * Uses native Intl APIs cleanly with zero runtime dependencies.
 */

const RTL_LANG_CODES = new Set([
  'ar',
  'arc',
  'dv',
  'fa',
  'ha',
  'he',
  'khw',
  'ks',
  'ku',
  'ps',
  'sd',
  'ug',
  'ur',
  'yi',
]);

export type TextDirection = 'ltr' | 'rtl';

export function isRtlLocale(locale?: string): boolean {
  if (!locale || typeof locale !== 'string') return false;
  const primary = locale.trim().toLowerCase().split(/[-_]/)[0];
  return RTL_LANG_CODES.has(primary);
}

export function getLocaleDirection(locale?: string): TextDirection {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}

export function formatLocaleDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
  locale = 'en-US'
): string {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  try {
    return new Intl.DateTimeFormat(locale, options).format(parsed);
  } catch {
    return parsed.toISOString().slice(0, 10);
  }
}

export function formatZonedTime(
  date: Date | number | string,
  timeZone = 'UTC',
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }
): string {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  try {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(parsed);
  } catch {
    return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(parsed);
  }
}

export function formatLocaleNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = 'en-US'
): string {
  if (!Number.isFinite(value)) return '—';
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return String(value);
  }
}

export function formatLocaleCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US',
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
): string {
  if (!Number.isFinite(value)) return '—';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...options,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit = 'minute',
  locale = 'en-US'
): string {
  if (!Number.isFinite(value)) return '';
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat === 'function') {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit);
    }
  } catch {
    // Fallback below
  }
  const abs = Math.abs(value);
  return value < 0 ? `${abs} ${unit} ago` : `in ${abs} ${unit}`;
}
