/**
 * Wendoro UI Spacing, Sizing, and Density Tokens
 * Consistent 4px base increment system.
 */

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

export type DensityMode = 'compact' | 'comfortable' | 'spacious';

export interface DensityScaleSpec {
  mode: DensityMode;
  controlHeight: string;
  inputHeight: string;
  tableRowHeight: string;
  cardPadding: string;
  cellPaddingX: string;
  cellPaddingY: string;
  sectionGap: string;
  gridGap: string;
}

export const densityScales: Record<DensityMode, DensityScaleSpec> = {
  compact: {
    mode: 'compact',
    controlHeight: '32px',
    inputHeight: '32px',
    tableRowHeight: '36px',
    cardPadding: '12px',
    cellPaddingX: '10px',
    cellPaddingY: '6px',
    sectionGap: '16px',
    gridGap: '12px',
  },
  comfortable: {
    mode: 'comfortable',
    controlHeight: '40px',
    inputHeight: '40px',
    tableRowHeight: '44px',
    cardPadding: '20px',
    cellPaddingX: '14px',
    cellPaddingY: '10px',
    sectionGap: '24px',
    gridGap: '20px',
  },
  spacious: {
    mode: 'spacious',
    controlHeight: '44px',
    inputHeight: '44px',
    tableRowHeight: '52px',
    cardPadding: '24px',
    cellPaddingX: '16px',
    cellPaddingY: '14px',
    sectionGap: '32px',
    gridGap: '24px',
  },
};

export const sizingTokens = {
  componentHeights: {
    xs: '28px',
    sm: '32px',
    md: '40px',
    lg: '44px',
    xl: '48px',
  },
  inputHeights: {
    sm: '32px',
    md: '40px',
    lg: '44px',
  },
  buttonSizes: {
    sm: { height: '32px', paddingX: '12px', fontSize: '0.8125rem' },
    md: { height: '40px', paddingX: '16px', fontSize: '0.875rem' },
    lg: { height: '44px', paddingX: '20px', fontSize: '0.9375rem' },
    iconSm: { height: '32px', width: '32px' },
    iconMd: { height: '40px', width: '40px' },
    iconLg: { height: '44px', width: '44px' },
  },
  iconSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
  contentWidths: {
    narrow: '640px',
    readable: '768px',
    default: '1120px',
    wide: '1320px',
    full: '1440px',
  },
  dashboardGutters: {
    mobile: '16px',
    tablet: '20px',
    desktop: '24px',
    wide: '32px',
  },
  gridGaps: {
    xs: '8px',
    sm: '12px',
    md: '20px',
    lg: '24px',
    xl: '32px',
  },
  sidebarWidths: {
    rail: '64px',
    collapsed: '64px',
    standard: '256px',
    expanded: '280px',
  },
  dialogWidths: {
    sm: '400px',
    md: '520px',
    lg: '680px',
    xl: '860px',
  },
} as const;

export type SpacingKey = keyof typeof spacing;
export type SizingCategoryKey = keyof typeof sizingTokens;
