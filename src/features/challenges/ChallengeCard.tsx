import { StyleSheet, View } from 'react-native';
import { AppText, IconCircle } from '@/components';
import type { Challenge } from '@/types';
import { formatSwedishDate } from '@/lib/dates';
import { colors, spacing } from '@/theme';

interface ChallengeCardProps {
  challenge: Challenge;
}

/** Compact challenge row — something the owner is working through this week. */
export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <View style={styles.row}>
      <IconCircle name="paw-outline" tone="sand" />
      <View style={styles.text}>
        <AppText variant="bodyStrong">{challenge.title}</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Vecka {challenge.weekNumber} · {formatSwedishDate(challenge.loggedAt)}
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
