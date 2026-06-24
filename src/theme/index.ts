import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { type, fonts } from './typography';

/**
 * Single import surface for the design system.
 *   import { theme } from '@/theme';
 *   import { colors, spacing } from '@/theme';
 */
export const theme = {
  colors,
  spacing,
  radius,
  type,
  fonts,
} as const;

/** Soft, premium elevation presets (kept subtle per design direction). */
export const shadow = {
  soft: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
} as const;

export { colors, spacing, radius, type, fonts };
export type { TypePresetName } from './typography';
export type { ColorToken } from './colors';
