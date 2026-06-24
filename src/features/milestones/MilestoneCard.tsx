import { StyleSheet, View } from 'react-native';
import { AppText, IconCircle } from '@/components';
import type { Milestone } from '@/types';
import { formatSwedishDate } from '@/lib/dates';
import { colors, spacing } from '@/theme';

interface MilestoneCardProps {
  milestone: Milestone;
}

/** Compact milestone row — a saved memory from the journey. */
export function MilestoneCard({ milestone }: MilestoneCardProps) {
  return (
    <View style={styles.row}>
      <IconCircle name="ribbon-outline" tone="forest" />
      <View style={styles.text}>
        <AppText variant="bodyStrong">{milestone.title}</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Vecka {milestone.weekNumber} · {formatSwedishDate(milestone.achievedAt)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { flexShrink: 1, gap: 2 },
});
