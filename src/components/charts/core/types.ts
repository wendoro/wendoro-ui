import * as React from 'react';
import type { ChartMarkerKind, ChartPatternKind } from '../../../tokens/colors';

export type ChartFormatType =
  | 'integer'
  | 'decimal'
  | 'compact'
  | 'percent'
  | 'currency'
  | 'date'
  | 'duration'
  | 'custom';

export interface ChartFormatterConfig {
  type?: ChartFormatType;
  locale?: string;
  currency?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  durationUnit?: 'ms' | 's' | 'm' | 'h';
  dateStyle?: Intl.DateTimeFormatOptions;
  unitSuffix?: string;
  formatter?: (value: number | string | Date) => string;
}

export interface ChartSeriesConfig {
  key: string;
  label: string;
  color?: string;
  pattern?: ChartPatternKind;
  dashArray?: string;
  marker?: ChartMarkerKind;
  type?: 'bar' | 'line' | 'area';
  axis?: 'left' | 'right';
}

export interface ChartThreshold {
  value: number;
  label?: string;
  color?: string;
  axis?: 'y' | 'x';
}

export interface ChartAnnotation {
  id: string;
  xLabel?: string;
  xValue?: number;
  yValue: number;
  label: string;
  color?: string;
}

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type ChartDatum = Record<string, string | number | Date | null | undefined>;

export interface ChartTableColumn {
  key: string;
  label: string;
}

export interface ChartStateProps {
  loading?: boolean;
  error?: React.ReactNode | boolean;
  errorTitle?: string;
  onRetry?: () => void;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export interface BaseChartProps extends ChartStateProps {
  title?: string;
  subtitle?: string;
  description?: string;
  summary?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showTableToggle?: boolean;
  interactiveTooltip?: boolean;
  valueFormatter?: ChartFormatterConfig;
  secondaryValueFormatter?: ChartFormatterConfig;
  thresholds?: ChartThreshold[];
  annotations?: ChartAnnotation[];
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
}
