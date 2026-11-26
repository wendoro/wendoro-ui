import * as React from 'react';
import { Pause, Play, Sun, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

export type SliderSize = 'sm' | 'md' | 'lg';
export type SliderOrientation = 'horizontal' | 'vertical';

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  label?: React.ReactNode;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  size?: SliderSize;
  orientation?: SliderOrientation;
  marks?: SliderMark[];
  verticalHeight?: number;
}

const trackHeights: Record<SliderSize, string> = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-2.5',
};

const trackWidthsVertical: Record<SliderSize, string> = {
  sm: 'w-1.5',
  md: 'w-2',
  lg: 'w-2.5',
};

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      defaultValue = 50,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      label,
      showValue = true,
      formatValue = (v) => String(v),
      size = 'md',
      orientation = 'horizontal',
      marks,
      verticalHeight = 160,
      disabled = false,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const sliderId = useStableId(id, 'wdr-slider');
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const clampedValue = Math.min(max, Math.max(min, currentValue));
    const percentage = max === min ? 0 : ((clampedValue - min) / (max - min)) * 100;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    };

    if (orientation === 'vertical') {
      return (
        <div
          className={cn(
            'inline-flex flex-col items-center gap-2',
            disabled && 'opacity-50',
            className
          )}
        >
          {showValue && (
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {formatValue(clampedValue)}
            </span>
          )}
          <div
            className="relative flex items-center justify-center px-3"
            style={{ height: `${verticalHeight}px` }}
          >
            <div
              aria-hidden="true"
              className={cn(
                'relative h-full overflow-hidden rounded-full bg-muted',
                trackWidthsVertical[size]
              )}
            >
              <div
                className="absolute inset-x-0 bottom-0 bg-primary transition-[height] duration-75"
                style={{ height: `${percentage}%` }}
              />
            </div>
            <input
              ref={ref}
              id={sliderId}
              type="range"
              min={min}
              max={max}
              step={step}
              value={clampedValue}
              aria-orientation="vertical"
              aria-valuetext={formatValue(clampedValue)}
              disabled={disabled}
              onChange={handleChange}
              style={{
                width: `${verticalHeight}px`,
                transform: 'rotate(-90deg)',
              }}
              className="peer absolute h-8 cursor-pointer opacity-0 disabled:cursor-not-allowed"
              {...props}
            />
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-foreground bg-primary shadow-xs',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2'
              )}
              style={{ bottom: `${percentage}%` }}
            />
          </div>
          {label && (
            <label htmlFor={sliderId} className="text-xs font-medium text-foreground text-center">
              {label}
            </label>
          )}
        </div>
      );
    }

    return (
      <div className={cn('w-full space-y-2', disabled && 'opacity-50', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between gap-2 text-sm">
            {label && (
              <label htmlFor={sliderId} className="font-medium text-foreground">
                {label}
              </label>
            )}
            {showValue && (
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {formatValue(clampedValue)}
              </span>
            )}
          </div>
        )}
        <div className="relative flex items-center py-2">
          <div
            aria-hidden="true"
            className={cn(
              'relative w-full overflow-hidden rounded-full bg-muted',
              trackHeights[size]
            )}
          >
            <div
              className="h-full bg-primary transition-[width] duration-75"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <input
            ref={ref}
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={clampedValue}
            aria-valuetext={formatValue(clampedValue)}
            disabled={disabled}
            onChange={handleChange}
            className={cn(
              'peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed'
            )}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-primary shadow-xs transition-transform duration-100',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background'
            )}
            style={{ left: `${percentage}%` }}
          />
        </div>
        {marks && marks.length > 0 && (
          <div className="relative flex items-center justify-between pt-0.5 text-[11px] text-muted-foreground tabular-nums">
            {marks.map((mark) => (
              <button
                key={mark.value}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!isControlled) setInternalValue(mark.value);
                  onValueChange?.(mark.value);
                }}
                className="rounded px-1 py-0.5 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {mark.label ?? mark.value}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

/* -------------------------------------------------------------------------- */
/* RangeSlider (Dual-Thumb Accessible Range Control)                          */
/* -------------------------------------------------------------------------- */

export interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  minGap?: number;
  onValueChange?: (value: [number, number]) => void;
  label?: React.ReactNode;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

export function RangeSlider({
  value,
  defaultValue = [20, 80],
  min = 0,
  max = 100,
  step = 1,
  minGap = 1,
  onValueChange,
  label,
  formatValue = (v) => String(v),
  disabled = false,
  className,
}: RangeSliderProps) {
  const minId = useStableId(undefined, 'wdr-range-min');
  const maxId = useStableId(undefined, 'wdr-range-max');
  const [internal, setInternal] = React.useState<[number, number]>(defaultValue);
  const [focusedThumb, setFocusedThumb] = React.useState<'min' | 'max' | null>(null);
  const [activeThumb, setActiveThumb] = React.useState<'min' | 'max'>('max');
  const trackRef = React.useRef<HTMLDivElement>(null);
  const current = value ?? internal;

  const low = Math.max(min, Math.min(current[0], current[1] - minGap));
  const high = Math.min(max, Math.max(current[1], low + minGap));
  const span = Math.max(1, max - min);
  const lowPct = ((low - min) / span) * 100;
  const highPct = ((high - min) / span) * 100;

  const updateRange = (nextLow: number, nextHigh: number) => {
    const next: [number, number] = [nextLow, nextHigh];
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const pointerPct = ratio * 100;
    const distLow = Math.abs(pointerPct - lowPct);
    const distHigh = Math.abs(pointerPct - highPct);
    setActiveThumb(distLow <= distHigh ? 'min' : 'max');
  };

  return (
    <div className={cn('w-full space-y-2', disabled && 'opacity-50', className)}>
      <div className="flex items-center justify-between gap-2 text-sm">
        {label && <span className="font-medium text-foreground">{label}</span>}
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {formatValue(low)} – {formatValue(high)}
        </span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
        className="relative flex h-7 items-center"
      >
        <div aria-hidden="true" className="relative h-2 w-full rounded-full bg-muted">
          <div
            className="absolute top-0 bottom-0 rounded-full bg-primary"
            style={{ left: `${lowPct}%`, width: `${Math.max(0, highPct - lowPct)}%` }}
          />
        </div>

        <input
          id={minId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          disabled={disabled}
          aria-label={typeof label === 'string' ? `${label} minimum` : 'Minimum value'}
          aria-valuetext={formatValue(low)}
          onFocus={() => {
            setFocusedThumb('min');
            setActiveThumb('min');
          }}
          onBlur={() => setFocusedThumb((prev) => (prev === 'min' ? null : prev))}
          onChange={(e) => {
            const candidate = Math.min(Number(e.target.value), high - minGap);
            updateRange(candidate, high);
          }}
          className={cn(
            'pointer-events-auto absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0',
            activeThumb === 'min' ? 'z-20' : 'z-10'
          )}
        />

        <input
          id={maxId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          disabled={disabled}
          aria-label={typeof label === 'string' ? `${label} maximum` : 'Maximum value'}
          aria-valuetext={formatValue(high)}
          onFocus={() => {
            setFocusedThumb('max');
            setActiveThumb('max');
          }}
          onBlur={() => setFocusedThumb((prev) => (prev === 'max' ? null : prev))}
          onChange={(e) => {
            const candidate = Math.max(Number(e.target.value), low + minGap);
            updateRange(low, candidate);
          }}
          className={cn(
            'pointer-events-auto absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0',
            activeThumb === 'max' ? 'z-20' : 'z-10'
          )}
        />

        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-1/2 z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-primary shadow-xs transition-shadow',
            focusedThumb === 'min' && 'ring-2 ring-ring ring-offset-2 ring-offset-background'
          )}
          style={{ left: `${lowPct}%` }}
        />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-1/2 z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-surface shadow-xs transition-shadow',
            focusedThumb === 'max' && 'ring-2 ring-ring ring-offset-2 ring-offset-background'
          )}
          style={{ left: `${highPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground tabular-nums">
        <label htmlFor={minId}>Min: {formatValue(low)}</label>
        <label htmlFor={maxId}>Max: {formatValue(high)}</label>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TimelineScrubber                                                           */
/* -------------------------------------------------------------------------- */

export interface TimelineChapter {
  id: string;
  time: number;
  label: string;
}

export interface TimelineScrubberProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  playing?: boolean;
  onTogglePlay?: () => void;
  chapters?: TimelineChapter[];
  label?: string;
  className?: string;
}

function formatSeconds(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export function TimelineScrubber({
  currentTime,
  duration,
  onSeek,
  playing = false,
  onTogglePlay,
  chapters,
  label = 'Timeline scrubber',
  className,
}: TimelineScrubberProps) {
  const safeDuration = Math.max(1, duration);
  const clamped = Math.max(0, Math.min(safeDuration, currentTime));

  return (
    <div className={cn('w-full space-y-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3', className)}>
      <div className="flex items-center gap-3">
        {onTogglePlay && (
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={playing ? 'Pause playback' : 'Play playback'}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)] bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
        <div className="min-w-0 flex-1">
          <Slider
            aria-label={label}
            min={0}
            max={safeDuration}
            step={1}
            value={clamped}
            onValueChange={onSeek}
            showValue={false}
            size="sm"
          />
        </div>
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {formatSeconds(clamped)} / {formatSeconds(safeDuration)}
        </span>
      </div>

      {chapters && chapters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chapters.map((chap) => (
            <button
              key={chap.id}
              type="button"
              onClick={() => onSeek(chap.time)}
              className="rounded border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {chap.label} ({formatSeconds(chap.time)})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* LevelControlSlider (Volume / Brightness / Zoom Control)                    */
/* -------------------------------------------------------------------------- */

export interface LevelControlSliderProps {
  kind?: 'volume' | 'brightness';
  value: number;
  onValueChange: (val: number) => void;
  muted?: boolean;
  onToggleMute?: () => void;
  label?: string;
  className?: string;
}

export function LevelControlSlider({
  kind = 'volume',
  value,
  onValueChange,
  muted = false,
  onToggleMute,
  label,
  className,
}: LevelControlSliderProps) {
  const effectiveLabel = label ?? (kind === 'volume' ? 'Audio volume' : 'Display brightness');
  const displayValue = muted ? 0 : value;

  return (
    <div className={cn('flex items-center gap-3 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3 py-2', className)}>
      <button
        type="button"
        onClick={() => {
          if (onToggleMute) onToggleMute();
          else onValueChange(displayValue === 0 ? 75 : 0);
        }}
        aria-label={kind === 'volume' ? (displayValue === 0 ? 'Unmute volume' : 'Mute volume') : 'Toggle brightness'}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)] text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {kind === 'volume' ? (
          displayValue === 0 ? (
            <VolumeX className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          )
        ) : (
          <Sun className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      <Slider
        aria-label={effectiveLabel}
        min={0}
        max={100}
        value={displayValue}
        onValueChange={onValueChange}
        formatValue={(v) => `${v}%`}
        size="sm"
        className="flex-1"
      />
    </div>
  );
}
