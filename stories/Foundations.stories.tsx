import type { Meta, StoryObj } from '@storybook/react';
import {
  brandColors,
  breakpoints,
  chartPaletteValues,
  densityScales,
  elevationTokens,
  motionDurations,
  motionEasings,
  radius,
  spacing,
  typographyScale,
} from '../src/tokens';
import { ThemeProvider } from '../src/hooks/use-theme';
import { Button } from '../src/components/ui/button';
import { StatusBadge } from '../src/components/business/status-badge';

const meta: Meta = {
  title: 'Wendoro UI/Design Foundations',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Brand palette, semantic CSS variables, chart color system, typography, spacing/density, elevation, motion, breakpoints, and scoped light/dark themes.',
      },
    },
  },
};

export default meta;

export const ColorsAndSemanticTokens: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-base font-semibold">Core Brand Palette</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(brandColors).map(([key, hex]) => (
            <div key={key} className="overflow-hidden rounded-[var(--wdr-radius-md)] border border-border bg-surface">
              <div className="h-14" style={{ backgroundColor: hex }} />
              <div className="p-2.5 text-xs">
                <div className="font-semibold text-foreground">{key}</div>
                <div className="font-mono text-muted-foreground">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold">Categorical Chart Palette (Light Resolved)</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {chartPaletteValues.light.map((hex, index) => (
            <div key={hex} className="overflow-hidden rounded-[var(--wdr-radius-md)] border border-border bg-surface">
              <div className="h-10" style={{ backgroundColor: hex }} />
              <div className="p-2 text-xs">
                <div className="font-medium">Series {index + 1}</div>
                <div className="font-mono text-muted-foreground">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <div className="divide-y divide-border rounded-[var(--wdr-radius-md)] border border-border bg-surface">
      {Object.entries(typographyScale).map(([role, spec]) => (
        <div key={role} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
          <span
            style={{
              fontSize: spec.fontSize,
              lineHeight: spec.lineHeight,
              letterSpacing: spec.letterSpacing,
              fontWeight: spec.fontWeight,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Business, connected. 12,480
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {role} · {spec.fontSize} / {spec.lineHeight} · w{spec.fontWeight}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const SpacingDensityElevationMotionBreakpoints: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4">
          <h3 className="mb-3 text-base font-semibold">Density Modes</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Object.entries(densityScales).map(([mode, cfg]) => (
              <div key={mode} className="rounded-[var(--wdr-radius-sm)] border border-border bg-muted/30 p-3 text-xs">
                <div className="font-semibold capitalize">{mode}</div>
                <div className="mt-1 text-muted-foreground">Control: {cfg.controlHeight}</div>
                <div className="text-muted-foreground">Row: {cfg.tableRowHeight}</div>
                <div className="text-muted-foreground">Gap: {cfg.gridGap}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4">
          <h3 className="mb-3 text-base font-semibold">Elevation & Radius</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(elevationTokens).slice(0, 6).map(([level, cssVal]) => (
              <div
                key={level}
                className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3 text-center text-xs"
                style={{ boxShadow: cssVal.includes('shadow') ? cssVal : undefined }}
              >
                <div className="truncate font-medium">{level}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {Object.entries(radius).map(([k, v]) => (
              <span key={k} className="rounded border border-border px-2 py-1 font-mono">
                {k}: {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4 text-xs">
          <h3 className="mb-3 text-base font-semibold">Motion & Reduced Motion</h3>
          <div className="space-y-1.5">
            {Object.entries(motionDurations).map(([name, val]) => (
              <div key={name} className="flex justify-between font-mono">
                <span>duration.{name}</span>
                <span>{val}</span>
              </div>
            ))}
            {Object.entries(motionEasings).map(([name, val]) => (
              <div key={name} className="flex justify-between gap-4 font-mono">
                <span>easing.{name}</span>
                <span className="truncate text-muted-foreground">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4 text-xs">
          <h3 className="mb-3 text-base font-semibold">Responsive Breakpoints</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(breakpoints).map(([name, px]) => (
              <div key={name} className="rounded border border-border bg-muted/30 p-2 font-mono">
                <div className="font-semibold">{name}</div>
                <div className="text-muted-foreground">{px}px</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4">
        <h3 className="mb-2 text-base font-semibold">Spacing Scale (4px grid)</h3>
        {([1, 2, 3, 4, 6, 8, 12] as const).map((k) => (
          <div key={k} className="flex items-center gap-3 text-xs">
            <span className="w-12 font-mono text-muted-foreground">{spacing[k]}</span>
            <div className="h-2.5 rounded-xs bg-primary" style={{ width: spacing[k] }} />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Themes: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <ThemeProvider scoped forcedTheme="light" disableStorage>
        <div className="rounded-[var(--wdr-radius-lg)] border border-border bg-background p-5 text-foreground">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Scoped Light Theme</span>
            <StatusBadge status="active" label="Light" />
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Warm White canvas (#FAFAF7) with Deep Black text (#111111) and Primary Yellow accents (#FACC15).
          </p>
          <Button variant="primary" size="sm">Primary Action</Button>
        </div>
      </ThemeProvider>

      <ThemeProvider scoped forcedTheme="dark" disableStorage>
        <div className="rounded-[var(--wdr-radius-lg)] border border-border bg-background p-5 text-foreground">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Scoped Dark Theme</span>
            <StatusBadge status="completed" label="Dark" />
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Deep Black canvas (#111111) with Charcoal cards (#242424) and accessible contrast tokens.
          </p>
          <Button variant="primary" size="sm">Primary Action</Button>
        </div>
      </ThemeProvider>
    </div>
  ),
};
