import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppCard, AppText } from '@/components';
import type { GrowthLog } from '@/types';
import { colors, spacing } from '@/theme';

interface GrowthSummaryCardProps {
  growth: GrowthLog | null;
}

function formatWeight(kg: number | null | undefined): string {
  if (kg == null) return 'Ej angett';
  return `${kg.toString().replace('.', ',')} kg`;
}

function formatHeight(cm: number | null | undefined): string {
  if (cm == null) return 'Ej angett';
  return `${cm} cm`;
}

/** Latest weight & withers height, presented as two calm serif stats. */
export function GrowthSummaryCard({ growth }: GrowthSummaryCardProps) {
  return (
    <AppCard padding="md">
      <View style={styles.row}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.stat}>
          <AppText variant="overline" color={colors.textMuted}>
            VIKT
          </AppText>
          <AppText variant="stat" color={colors.primary}>
            {formatWeight(growth?.weightKg)}
          </AppText>
        </Animated.View>

        <View style={styles.divider} />

        <Animated.View entering={FadeIn.delay(100).duration(500)} style={styles.stat}>
          <AppText variant="overline" color={colors.textMuted}>
            MANKHÖJD
          </AppText>
          <AppText variant="stat" color={colors.primary}>
            {formatHeight(growth?.withersHeightCm)}
          </AppText>
        </Animated.View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, gap: spacing.xs, alignItems: 'flex-start' },
  divider: {
    width: StyleSheet.hairlineWidth * 2,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
});
