import { brandColors, radius, spacing, typographyScale } from '@/tokens';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const swatches = [
  { name: 'Primary Yellow', hex: brandColors.primaryYellow, role: 'Signature CTA & active accent', onColor: '#111111' },
  { name: 'Primary Red', hex: brandColors.primaryRed, role: 'Destructive actions & critical alerts', onColor: '#FFFFFF' },
  { name: 'Deep Black', hex: brandColors.deepBlack, role: 'Light foreground & dark canvas', onColor: '#FAFAF7' },
  { name: 'Charcoal', hex: brandColors.charcoal, role: 'Elevated dark surfaces & accent', onColor: '#FAFAF7' },
  { name: 'Warm White', hex: brandColors.warmWhite, role: 'Light canvas background', onColor: '#111111' },
  { name: 'White', hex: brandColors.white, role: 'Light card & input surface', onColor: '#111111' },
  { name: 'Border Gray', hex: brandColors.borderGray, role: 'Hairline structural dividers', onColor: '#111111' },
  { name: 'Muted Gray', hex: brandColors.mutedGray, role: 'Secondary & metadata copy', onColor: '#FFFFFF' },
];

const semanticTokens = [
  { token: '--wdr-background', label: 'Background', cls: 'bg-background text-foreground' },
  { token: '--wdr-surface', label: 'Surface', cls: 'bg-surface text-foreground' },
  { token: '--wdr-surface-elevated', label: 'Elevated', cls: 'bg-surface-elevated text-foreground' },
  { token: '--wdr-primary', label: 'Primary', cls: 'bg-primary text-primary-foreground' },
  { token: '--wdr-secondary', label: 'Secondary', cls: 'bg-secondary text-secondary-foreground' },
  { token: '--wdr-destructive', label: 'Destructive', cls: 'bg-destructive text-destructive-foreground' },
  { token: '--wdr-muted', label: 'Muted', cls: 'bg-muted text-muted-foreground' },
  { token: '--wdr-success-subtle', label: 'Success', cls: 'bg-success-subtle text-success-subtle-foreground' },
];

export function FoundationsSection() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Brand Palette</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Yellow leads primary actions, Red signals destructive intent, and Black/White establish structural clarity. Blue, purple, indigo, and teal are excluded.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {swatches.map((swatch) => (
            <div
              key={swatch.name}
              className="overflow-hidden rounded-[var(--wdr-radius-lg)] border border-border bg-surface"
            >
              <div
                className="flex h-20 items-end justify-between p-3"
                style={{ backgroundColor: swatch.hex, color: swatch.onColor }}
              >
                <span className="font-mono text-xs font-semibold">{swatch.hex}</span>
              </div>
              <div className="p-3.5">
                <div className="text-sm font-semibold text-foreground">{swatch.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{swatch.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Semantic Theme Tokens</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All components consume semantic CSS variables that adapt dynamically across Light and Dark modes.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {semanticTokens.map((item) => (
            <div
              key={item.token}
              className={`rounded-[var(--wdr-radius-md)] border border-border p-3.5 ${item.cls}`}
            >
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="mt-1 font-mono text-[11px] opacity-80">{item.token}</div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Typography Scale</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Inter for UI & headings with JetBrains Mono for tabular numbers, identifiers, and tokens.
          </p>
        </div>

        <Card>
          <CardContent className="divide-y divide-border p-0">
            {(Object.entries(typographyScale) as Array<[string, (typeof typographyScale)[keyof typeof typographyScale]]>).map(
              ([role, spec]) => (
                <div key={role} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div
                      style={{
                        fontSize: spec.fontSize,
                        lineHeight: spec.lineHeight,
                        letterSpacing: spec.letterSpacing,
                        fontWeight: spec.fontWeight,
                      }}
                      className="truncate text-foreground"
                    >
                      Business, connected.
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-muted-foreground tabular-nums">
                    <span className="font-semibold text-foreground capitalize">{role}</span>
                    <span>{spec.fontSize}</span>
                    <span>w{spec.fontWeight}</span>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spacing Scale (4px base)</CardTitle>
            <CardDescription>Consistent rhythm across layouts and dense data grids.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {([1, 2, 3, 4, 6, 8, 12, 16] as const).map((step) => (
              <div key={step} className="flex items-center gap-4 text-xs">
                <span className="w-16 font-mono tabular-nums text-muted-foreground">
                  space-{step}
                </span>
                <span className="w-12 font-mono tabular-nums text-foreground">{spacing[step]}</span>
                <div className="h-3 rounded-xs bg-primary" style={{ width: spacing[step] }} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Radius & Elevation</CardTitle>
            <CardDescription>Structural geometry from sharp tables to pill avatars.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            {(Object.entries(radius) as Array<[string, string]>).map(([key, val]) => (
              <div
                key={key}
                className="flex flex-col items-center justify-center border border-border bg-muted/40 p-3 text-center"
                style={{ borderRadius: val }}
              >
                <span className="text-xs font-medium text-foreground">{key}</span>
                <span className="mt-0.5 font-mono text-[11px] text-muted-foreground">{val}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
