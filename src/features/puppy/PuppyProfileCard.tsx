import { StyleSheet, View } from 'react-native';
import { AppCard, AppText, ProgressBar, PuppyAvatar } from '@/components';
import type { Puppy } from '@/types';
import { ageInWeeks, LAST_WEEK, yearProgress } from '@/lib/week';
import { colors, spacing } from '@/theme';

interface PuppyProfileCardProps {
  puppy: Puppy;
  /** Current journey week (clamped 8–52). */
  week: number;
}

/** Hero identity card: photo, name, breed, age and journey progress. */
export function PuppyProfileCard({ puppy, week }: PuppyProfileCardProps) {
  const weeks = ageInWeeks(puppy.dateOfBirth);
  return (
    <AppCard padding="md">
      <View style={styles.row}>
        <PuppyAvatar uri={puppy.photoUri} size={76} />
        <View style={styles.identity}>
          <AppText variant="heading">
            {puppy.name} är {weeks} veckor
          </AppText>
          <AppText variant="body" color={colors.textMuted}>
            {puppy.breedName}
          </AppText>
        </View>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressLabels}>
          <AppText variant="overline" color={colors.accent}>
            NUVARANDE VECKA
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            Vecka {week} av {LAST_WEEK}
          </AppText>
        </View>
        <ProgressBar progress={yearProgress(week)} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  identity: { flexShrink: 1, gap: 2 },
  progressBlock: { marginTop: spacing.xl, gap: spacing.sm },
  progressLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
