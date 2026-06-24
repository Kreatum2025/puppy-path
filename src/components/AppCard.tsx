import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, spacing, shadow } from '@/theme';

interface AppCardProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** Padding preset. */
  padding?: keyof typeof paddingMap;
  /** Soft elevation (default true). */
  elevated?: boolean;
  /** Card background color (defaults to warm beige card). */
  background?: string;
  /** Show the soft sand border (default true). */
  bordered?: boolean;
}

const paddingMap = {
  none: 0,
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
} as const;

/** Rounded premium card surface — the building block for most content. */
export function AppCard({
  children,
  style,
  padding = 'md',
  elevated = true,
  background = colors.card,
  bordered = true,
}: AppCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          padding: paddingMap[padding],
          backgroundColor: background,
          borderWidth: bordered ? StyleSheet.hairlineWidth * 2 : 0,
        },
        elevated ? shadow.soft : null,
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
