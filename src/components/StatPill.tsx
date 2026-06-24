import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import type { IoniconName } from './IconCircle';
import { colors, radius, spacing } from '@/theme';

interface StatPillProps {
  /** Small label above the value, e.g. "Vikt". */
  label: string;
  /** The value, e.g. "7,4 kg". */
  value: string;
  /** Optional leading line icon. */
  icon?: IoniconName;
  style?: ViewStyle;
  /** Visual tone. */
  tone?: 'default' | 'sage';
}

/** Compact stat chip for weight, withers height, age etc. */
export function StatPill({ label, value, icon, style, tone = 'default' }: StatPillProps) {
  const bg = tone === 'sage' ? colors.sage : colors.background;
  return (
    <View style={[styles.pill, { backgroundColor: bg }, style]}>
      {icon ? <Ionicons name={icon} size={18} color={colors.primary} /> : null}
      <View style={styles.textWrap}>
        <AppText variant="overline" color={colors.textMuted}>
          {label.toUpperCase()}
        </AppText>
        <AppText variant="bodyStrong" color={colors.text}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  textWrap: { gap: 2 },
});
