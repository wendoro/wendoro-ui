import type { ChartFormatterConfig } from './types';

export function formatChartValue(
  raw: number | string | Date | null | undefined,
  config?: ChartFormatterConfig
): string {
  if (raw === null || raw === undefined) return '—';

  if (config?.formatter) {
    return config.formatter(raw);
  }

  const locale = config?.locale ?? 'en-US';
  const type = config?.type ?? 'decimal';

  if (type === 'date') {
    const dt = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(dt.getTime())) return String(raw);
    return new Intl.DateTimeFormat(
      locale,
      config?.dateStyle ?? { month: 'short', day: 'numeric', year: 'numeric' }
    ).format(dt);
  }

  const num = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(num)) return String(raw);

  if (type === 'duration') {
    const unit = config?.durationUnit ?? 's';
    const ms =
      unit === 'h'
        ? num * 3_600_000
        : unit === 'm'
          ? num * 60_000
          : unit === 's'
            ? num * 1_000
            : num;

    if (ms < 1_000) return `${Math.round(ms)}ms`;
    const totalSec = Math.round(ms / 1_000);
    if (totalSec < 60) return `${totalSec}s`;
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`;
  }

  if (type === 'currency') {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: config?.currency ?? 'USD',
      maximumFractionDigits: config?.maximumFractionDigits ?? 0,
      minimumFractionDigits: config?.minimumFractionDigits,
    }).format(num);
    return config?.unitSuffix ? `${formatted}${config.unitSuffix}` : formatted;
  }

  if (type === 'percent') {
    const ratio = Math.abs(num) > 1 ? num / 100 : num;
    const formatted = new Intl.NumberFormat(locale, {
      style: 'percent',
      maximumFractionDigits: config?.maximumFractionDigits ?? 1,
      minimumFractionDigits: config?.minimumFractionDigits,
    }).format(ratio);
    return config?.unitSuffix ? `${formatted}${config.unitSuffix}` : formatted;
  }

  if (type === 'compact') {
    const formatted = new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: config?.maximumFractionDigits ?? 1,
    }).format(num);
    return config?.unitSuffix ? `${formatted}${config.unitSuffix}` : formatted;
  }

  if (type === 'integer') {
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(Math.round(num));
    return config?.unitSuffix ? `${formatted}${config.unitSuffix}` : formatted;
  }

  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: config?.maximumFractionDigits ?? 2,
    minimumFractionDigits: config?.minimumFractionDigits,
  }).format(num);
  return config?.unitSuffix ? `${formatted}${config.unitSuffix}` : formatted;
}
