import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, spacing, shadow } from '@/theme';

type CardVariant = 'hero' | 'primary' | 'secondary' | 'info';

interface AppCardProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** Padding preset. */
  padding?: keyof typeof paddingMap;
  /**
   * Optional surface preset that sets background/border/elevation in one place:
   * - hero: deep forest panel
   * - primary: near-white elevated card
   * - secondary: soft sage surface
   * - info: low-emphasis card
   * Explicit background/elevated/bordered props still override. Omit for the
   * default near-white card (backward compatible).
   */
  variant?: CardVariant;
  /** Soft elevation. */
  elevated?: boolean;
  /** Card background color. */
  background?: string;
  /** Show the soft sand border. */
  bordered?: boolean;
}

const paddingMap = {
  none: 0,
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
} as const;

const VARIANTS: Record<
  CardVariant,
  { background: string; bordered: boolean; elevated: boolean }
> = {
  hero: { background: colors.primaryDeep, bordered: false, elevated: true },
  primary: { background: colors.card, bordered: true, elevated: true },
  secondary: { background: colors.surfaceSage, bordered: false, elevated: false },
  info: { background: colors.card, bordered: true, elevated: false },
};

/** Rounded premium card surface — the building block for most content. */
export function AppCard({
  children,
  style,
  padding = 'md',
  variant,
  elevated,
  background,
  bordered,
}: AppCardProps) {
  const v = variant ? VARIANTS[variant] : undefined;
  const bg = background ?? v?.background ?? colors.card;
  const isElevated = elevated ?? v?.elevated ?? true;
  const isBordered = bordered ?? v?.bordered ?? true;

  return (
    <View
      style={[
        styles.card,
        {
          padding: paddingMap[padding],
          backgroundColor: bg,
          borderWidth: isBordered ? StyleSheet.hairlineWidth * 2 : 0,
        },
        isElevated ? shadow.soft : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderColor: colors.border,
  },
});
