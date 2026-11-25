/**
 * Wendoro UI Brand Customization, Contrast Modes, and Scoped Theme Helpers
 * Allows multi-tenant SaaS, agencies, and portals to apply scoped brand tokens
 * while preserving Wendoro's default identity (Yellow/Red/Black/Warm White).
 */

export type ThemeContrastMode = 'standard' | 'high';

export interface BrandThemeOverrides {
  background?: string;
  foreground?: string;
  surface?: string;
  surfaceElevated?: string;
  primary?: string;
  primaryHover?: string;
  primaryActive?: string;
  primaryForeground?: string;
  primarySubtle?: string;
  primarySubtleForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  destructiveForeground?: string;
  border?: string;
  input?: string;
  ring?: string;
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
}

const OVERRIDE_VAR_MAP: Record<keyof BrandThemeOverrides, string> = {
  background: '--wdr-background',
  foreground: '--wdr-foreground',
  surface: '--wdr-surface',
  surfaceElevated: '--wdr-surface-elevated',
  primary: '--wdr-primary',
  primaryHover: '--wdr-primary-hover',
  primaryActive: '--wdr-primary-active',
  primaryForeground: '--wdr-primary-foreground',
  primarySubtle: '--wdr-primary-subtle',
  primarySubtleForeground: '--wdr-primary-subtle-foreground',
  secondary: '--wdr-secondary',
  secondaryForeground: '--wdr-secondary-foreground',
  accent: '--wdr-accent',
  accentForeground: '--wdr-accent-foreground',
  destructive: '--wdr-destructive',
  destructiveForeground: '--wdr-destructive-foreground',
  border: '--wdr-border',
  input: '--wdr-input',
  ring: '--wdr-ring',
  radiusSm: '--wdr-radius-sm',
  radiusMd: '--wdr-radius-md',
  radiusLg: '--wdr-radius-lg',
  chart1: '--wdr-chart-1',
  chart2: '--wdr-chart-2',
  chart3: '--wdr-chart-3',
  chart4: '--wdr-chart-4',
};

export function createThemeCssVariables(
  overrides: BrandThemeOverrides = {}
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(overrides)) {
    const cssVar = OVERRIDE_VAR_MAP[key as keyof BrandThemeOverrides];
    if (cssVar && typeof value === 'string' && value.trim()) {
      vars[cssVar] = value.trim();
    }
  }
  return vars;
}

export const touchTargetTokens = {
  minimum: '44px',
  comfortable: '48px',
  compactDesktop: '32px',
  bottomNavHeight: '64px',
  stickyActionBarHeight: '64px',
} as const;

export const highContrastTokens = {
  borderWidth: '2px',
  focusOutlineWidth: '3px',
  lightForeground: '#000000',
  lightBackground: '#FFFFFF',
  darkForeground: '#FFFFFF',
  darkBackground: '#000000',
} as const;

export type TouchTargetTokenKey = keyof typeof touchTargetTokens;
