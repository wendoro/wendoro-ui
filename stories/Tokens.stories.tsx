import type { Meta, StoryObj } from '@storybook/react';
import { brandColors, radius, spacing, typographyScale } from '../src/tokens';

const meta: Meta = {
  title: 'Wendoro UI/Design Tokens',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Centralized brand palette, semantic CSS variables, typography scale, spacing (4px increments), and radius tokens. Blue, purple, indigo, and teal are excluded.',
      },
    },
  },
};

export default meta;

export const PaletteAndTypography: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-base font-semibold">Brand Colors</h3>
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
        <h3 className="mb-3 text-base font-semibold">Typography Scale</h3>
        <div className="divide-y divide-border rounded-[var(--wdr-radius-md)] border border-border bg-surface">
          {Object.entries(typographyScale).map(([role, spec]) => (
            <div key={role} className="flex items-center justify-between gap-4 px-4 py-3">
              <span
                style={{
                  fontSize: spec.fontSize,
                  lineHeight: spec.lineHeight,
                  fontWeight: spec.fontWeight,
                }}
              >
                Business, connected.
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {role} · {spec.fontSize}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-base font-semibold">Spacing Scale (4px)</h3>
          <div className="space-y-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4">
            {([1, 2, 3, 4, 6, 8, 12] as const).map((k) => (
              <div key={k} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-mono text-muted-foreground">{spacing[k]}</span>
                <div className="h-2.5 rounded-xs bg-primary" style={{ width: spacing[k] }} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-base font-semibold">Radius Scale</h3>
          <div className="grid grid-cols-3 gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4">
            {Object.entries(radius).map(([k, v]) => (
              <div
                key={k}
                className="border border-border bg-muted/40 p-2 text-center text-xs"
                style={{ borderRadius: v }}
              >
                <div className="font-medium">{k}</div>
                <div className="font-mono text-[11px] text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
